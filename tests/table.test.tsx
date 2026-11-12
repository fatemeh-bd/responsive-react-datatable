import React, { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import Table, { ActionDropDown, type ColumnType } from "react-responsive-datatable-kit";
import { localRows, positiveInteger, requestConfig } from "../src/components/table/data";
vi.mock("axios", () => ({ default: vi.fn() }));
beforeEach(() => { vi.mocked(axios).mockReset(); });
const rows = [{ id: 0, name: "Zoe" }, { id: 1, name: "Amy" }, { id: 2, name: "Bob" }];
const columns: ColumnType[] = [{ data: "name", title: "Name", orderable: true, searchable: true }];
const props = { mode: "static" as const, staticRows: rows, columns, pageSize: 2 };
const dataNames = () => Array.from(document.querySelectorAll("tbody tr")).map(row => row.textContent);

describe("local data and validation", () => {
  it("filters, sorts and clears sort without mutating source rows", () => {
    expect(localRows(rows, columns, "o", { column: 1, name: "name", dir: "asc" }).map(row => row.name)).toEqual(["Bob", "Zoe"]);
    expect(localRows(rows, columns, "", null)).toEqual(rows);
    expect(rows[0].name).toBe("Zoe");
    for (const value of [-1, 0, 1.5, Infinity, "bad", null]) expect(positiveInteger(value, 10)).toBe(10);
  });
  it("uses relative and absolute endpoints and GET params", () => {
    expect(requestConfig({ endpoint: "/api", method: "GET" }, { length: 2 })).toMatchObject({ url: "/api", params: { length: 2 } });
    expect(requestConfig({ endpoint: "/api", baseUrl: "https://example.com/" }, {})).toMatchObject({ url: "https://example.com/api", data: {} });
    expect(requestConfig({ endpoint: "https://other.test/api", baseUrl: "https://example.com" }, {})).toHaveProperty("url", "https://other.test/api");
  });
});
describe("existing table interactions", () => {
  it("sorts with noSearch, clears sorting and allows dynamic columns in StrictMode", () => {
    const view = render(<StrictMode><Table {...props} noSearch /></StrictMode>);
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(dataNames()[0]).toContain("Zoe");
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(dataNames()[0]).toContain("Amy");
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(dataNames()[0]).toContain("Zoe");
    view.rerender(<StrictMode><Table {...props} columns={[...columns, { data: "id", title: "ID" }]} noSearch /></StrictMode>);
    expect(screen.getByRole("columnheader", { name: "ID" })).toBeTruthy();
  });
  it("debounces exactly once and resets the external page callback", async () => {
    const onSearch = vi.fn(), onPageChange = vi.fn();
    window.history.replaceState({ host: "kept" }, "", "/?page=2&host=yes#route");
    render(<Table mode="external" columns={columns} externalRows={rows} totalItems={20} pageSize={2} onSearch={onSearch} onPageChange={onPageChange} />);
    await waitFor(() => expect(onPageChange).toHaveBeenCalledWith(2));
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Amy" } });
    await waitFor(() => expect(onSearch).toHaveBeenCalledExactlyOnceWith("Amy"));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    expect(window.location.hash).toBe("#route");
    expect(window.location.search).toContain("host=yes");
    expect(window.history.state).toEqual({ host: "kept" });
  });
  it("selects ID zero and preserves off-page selection when selecting all", () => {
    const selected = vi.fn();
    const view = render(<Table {...props} isSelectable selectedIds={[99]} onSelectChange={selected} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select row 0" }));
    expect(selected).toHaveBeenLastCalledWith([99, 0]);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(selected).toHaveBeenLastCalledWith([99, 0, 1, 2]);
    view.rerender(<Table {...props} isSelectable selectedIds={[99, 0, 1, 2]} onSelectChange={selected} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(selected).toHaveBeenLastCalledWith([99]);
  });
  it("does not submit a surrounding form and respects pageSize prop changes", () => {
    const submit = vi.fn(event => event.preventDefault());
    const view = render(<form onSubmit={submit}><Table {...props} /></form>);
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(submit).not.toHaveBeenCalled();
    view.rerender(<form onSubmit={submit}><Table {...props} pageSize={1} /></form>);
    expect(document.querySelectorAll("tbody tr")).toHaveLength(1);
  });
  it("coordinates separate tables through custom URL keys without clearing each other", async () => {
    render(<><Table {...props} tableName="a" pageQueryName="a" pageSizeQueryName="as" /><Table {...props} tableName="b" pageQueryName="b" pageSizeQueryName="bs" /></>);
    const tables = document.querySelectorAll(".table-container");
    fireEvent.click(within(tables[0] as HTMLElement).getByRole("button", { name: "Next page" }));
    await waitFor(() => expect(window.location.search).toContain("a=2"));
    expect(tables[0].textContent).toContain("Bob");
    expect(tables[1].querySelector("tbody")?.textContent).toContain("Zoe");
  });
  it("notifies the host once when URL page size changes, including a restored deep link", async () => {
    window.history.replaceState({ host: true }, "", "/?pageSize=20&host=yes#details");
    const onPageSizeChange = vi.fn();
    render(<StrictMode><Table mode="external" columns={columns} externalRows={rows} totalItems={100}
      onPageSizeChange={onPageSizeChange} /></StrictMode>);
    await waitFor(() => expect(onPageSizeChange).toHaveBeenCalledExactlyOnceWith(20));
    act(() => window.history.pushState({ host: true }, "", "/?pageSize=50&host=yes#details"));
    expect(onPageSizeChange).toHaveBeenLastCalledWith(50);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "100" } });
    expect(onPageSizeChange.mock.calls.map(([size]) => size)).toEqual([20, 50, 100]);
    expect(window.history.state).toEqual({ host: true });
    expect(window.location.hash).toBe("#details");
    expect(window.location.search).toContain("host=yes");
  });
  it("applies custom row classes in mobile lists and swipe cards", () => {
    Object.defineProperty(window, "innerWidth", { value: 375, writable: true });
    const rowClassName = (row: any) => row.id === 0 ? "highlight-person" : undefined;
    const view = render(<Table {...props} listMode rowClassName={rowClassName} />);
    expect(document.querySelector(".mobile-table-card.highlight-person")?.textContent).toContain("Zoe");
    view.rerender(<Table {...props} rowClassName={rowClassName} />);
    expect(document.querySelector(".mobile-table-card.highlight-person")?.textContent).toContain("Zoe");
  });
  it("observes host history changes and browser back/forward events", async () => {
    render(<Table {...props} />);
    act(() => window.history.pushState({ host: true }, "", "/?page=2#host"));
    expect(document.querySelector("tbody")?.textContent).toContain("Bob");
    act(() => { window.history.replaceState({ host: true }, "", "/?page=1#host"); window.dispatchEvent(new PopStateEvent("popstate")); });
    expect(document.querySelector("tbody")?.textContent).toContain("Zoe");
  });
});
describe("requests and SSR", () => {
  it("renders/hydrates static content and closed dropdown without browser-only render access", async () => {
    const container = document.createElement("div"); document.body.append(container);
    container.innerHTML = renderToString(<Table {...props} saveSearch tableName="ssr" />);
    const errors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => { root = hydrateRoot(container, <Table {...props} saveSearch tableName="ssr" />, { onRecoverableError: error => errors.push(error) }); });
    expect(errors).toEqual([]);
    await act(async () => root!.unmount()); container.remove();
    expect(renderToString(<ActionDropDown options={[]} />)).toContain("Actions");
  });
  it("works without a provider and preserves an internal deep link", async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: rows.slice(0, 1), recordsFiltered: 20 } });
    window.history.replaceState(null, "", "/?page=3");
    render(<Table mode="internal" columns={columns} internalApiConfig={{ endpoint: "/api", method: "GET" }} pageSize={2} />);
    await screen.findByText("Zoe");
    expect(axios).toHaveBeenCalledWith(expect.objectContaining({ url: "/api", params: expect.objectContaining({ start: 4, length: 2 }), signal: expect.any(AbortSignal) }));
    expect(window.location.search).toContain("page=3");
  });
  it("maps the initial sort field to its request column unless an explicit index is supplied", async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: rows, recordsFiltered: 3 } });
    const config = { endpoint: "/sorted", defaultSortBy: "name", sortType: "asc" as const };
    const view = render(<Table mode="internal" columns={[{ data: null, title: "Actions" }, ...columns]} internalApiConfig={config} />);
    await screen.findByText("Zoe");
    expect(axios).toHaveBeenLastCalledWith(expect.objectContaining({ data: expect.objectContaining({
      order: [{ column: 1, name: "name", dir: "asc" }],
    }) }));
    view.rerender(<Table mode="internal" columns={columns} internalApiConfig={config} columnNumber={0} />);
    await waitFor(() => expect(axios).toHaveBeenLastCalledWith(expect.objectContaining({ data: expect.objectContaining({
      order: [{ column: 0, name: "name", dir: "asc" }],
    }) })));
  });
  it("shows a request error without notify and lets the user retry", async () => {
    vi.mocked(axios).mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce({ data: { data: rows, recordsFiltered: 3 } });
    render(<Table mode="internal" columns={columns} internalApiConfig={{ endpoint: "/retry" }} />);
    expect((await screen.findByRole("alert")).textContent).toContain("Unable to load data");
    expect(screen.queryByText("No data available")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    await screen.findByText("Zoe");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(axios).toHaveBeenCalledTimes(2);
  });
  it("renders fresh cache on remount without invoking queryFn", async () => {
    vi.mocked(axios).mockClear().mockResolvedValue({ data: { data: rows, recordsFiltered: 3 } });
    const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } });
    const element = <QueryClientProvider client={client}><Table mode="internal" tableName="cache" columns={columns} internalApiConfig={{ endpoint: "/cached" }} /></QueryClientProvider>;
    const first = render(element); await screen.findByText("Zoe"); first.unmount();
    const calls = vi.mocked(axios).mock.calls.length;
    render(element); await screen.findByText("Zoe");
    expect(axios).toHaveBeenCalledTimes(calls);
  });
  it("does not let an obsolete request overwrite the latest response", async () => {
    let resolveOld: (value: any) => void = () => {};
    vi.mocked(axios).mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; })).mockResolvedValueOnce({ data: { data: [{ id: 5, name: "Latest" }], recordsFiltered: 1 } });
    const view = render(<Table mode="internal" columns={columns} internalApiConfig={{ endpoint: "/old" }} />);
    await waitFor(() => expect(axios).toHaveBeenCalled());
    view.rerender(<Table mode="internal" columns={columns} internalApiConfig={{ endpoint: "/new" }} />);
    await screen.findByText("Latest");
    await act(async () => resolveOld({ data: { data: rows, recordsFiltered: 3 } }));
    expect(screen.queryByText("Zoe")).toBeNull();
  });
  it("can switch mode without changing hook order", async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: rows, recordsFiltered: 3 } });
    const view = render(<Table {...props} />);
    view.rerender(<Table mode="internal" columns={columns} internalApiConfig={{ endpoint: "/api" }} />);
    await screen.findByText("Bob");
    view.rerender(<Table {...props} />);
    expect(screen.getByText("Zoe")).toBeTruthy();
  });
  it("keeps credentials out of cache keys and separates endpoints", async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: rows, recordsFiltered: 3 } });
    const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } });
    render(<QueryClientProvider client={client}>
      <Table mode="internal" tableName="same" columns={columns} internalApiConfig={{ endpoint: "/one", headers: { Authorization: "Bearer secret-value" } }} />
      <Table mode="internal" tableName="same" columns={columns} internalApiConfig={{ endpoint: "/two" }} />
    </QueryClientProvider>);
    await waitFor(() => expect(axios).toHaveBeenCalledTimes(2));
    expect(JSON.stringify(client.getQueryCache().getAll().map(query => query.queryKey))).not.toContain("secret-value");
  });
  it("reports rejected requests without treating undefined as a successful result", async () => {
    vi.mocked(axios).mockRejectedValue(new Error("Server unavailable"));
    const notify = vi.fn();
    render(<Table mode="internal" columns={columns} notify={notify} internalApiConfig={{ endpoint: "/failed" }} />);
    await waitFor(() => expect(notify).toHaveBeenCalledWith("Server unavailable", "error"));
    expect(document.querySelector('[aria-busy="false"]')).toBeTruthy();
  });
  it("refetches changed filters on page one and does not refetch noRefresh fields", async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: rows, recordsFiltered: 3 } });
    window.history.replaceState(null, "", "/?page=1");
    const config = { endpoint: "/filtered", customBody: [{ active: true }] };
    const view = render(<Table mode="internal" columns={columns} internalApiConfig={config} />);
    await screen.findByText("Zoe");
    const initial = vi.mocked(axios).mock.calls.length;
    view.rerender(<Table mode="internal" columns={columns} internalApiConfig={{ ...config, customBody: [{ active: false }] }} />);
    await waitFor(() => expect(axios).toHaveBeenCalledTimes(initial + 1));
    await screen.findByText("Zoe");
    view.rerender(<Table mode="internal" columns={columns} internalApiConfig={{ ...config, customBody: [{ active: false }, { local: 1, noRefresh: true }] }} />);
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 30)); });
    expect(axios).toHaveBeenCalledTimes(initial + 1);
  });
  it("restores saved search and informs an external host exactly once", async () => {
    sessionStorage.setItem("search_saved", JSON.stringify({ value: "Amy" }));
    const search = vi.fn();
    render(<StrictMode><Table mode="external" columns={columns} externalRows={rows} totalItems={3} tableName="saved" saveSearch onSearch={search} /></StrictMode>);
    await waitFor(() => expect(search).toHaveBeenCalledExactlyOnceWith("Amy"));
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("Amy");
  });
  it("handles blocked persistence and a missing auto-size container", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    render(<Table {...props} saveSearch tableName="storage" autoPageSizeConfig={{ enabled: true, containerSelector: "#missing" }} />);
    expect(screen.getByText("Zoe")).toBeTruthy();
    expect(document.querySelectorAll("tbody tr")).toHaveLength(2);
  });
  it("hydrates a mobile view and supports dynamic mobile columns", async () => {
    Object.defineProperty(window, "innerWidth", { value: 375, writable: true });
    const container = document.createElement("div"); document.body.append(container);
    container.innerHTML = renderToString(<Table {...props} listMode />);
    const errors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => { root = hydrateRoot(container, <Table {...props} listMode />, { onRecoverableError: error => errors.push(error) }); });
    expect(errors).toEqual([]);
    expect(container.querySelector(".mobile-table-list-container")).toBeTruthy();
    await act(async () => root!.render(<Table {...props} listMode columns={[...columns, { data: "id", title: "ID" }]} />));
    expect(container.querySelectorAll(".mobile-table-card")).toHaveLength(2);
    await act(async () => root!.unmount()); container.remove();
  });
  it("provides keyboard dropdown actions and Escape closes the menu", () => {
    const action = vi.fn();
    render(<ActionDropDown options={[{ label: "Edit", onClick: action }]} />);
    const button = screen.getByRole("button", { name: "Actions" });
    fireEvent.keyDown(button, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBe(document.activeElement);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menuitem")).toBeNull();
    expect(button).toBe(document.activeElement);
    fireEvent.click(button); fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(action).toHaveBeenCalledOnce();
  });
  it("focuses mobile filter dialogs and clears host filters without dropping unrelated URL state", () => {
    Object.defineProperty(window, "innerWidth", { value: 375, writable: true });
    window.history.replaceState({ host: 1 }, "", "/?page=2&status=active#details");
    const clear = vi.fn();
    render(<Table {...props} filters={<input aria-label="Status" />} onClearFilters={clear} />);
    const trigger = screen.getByRole("button", { name: "filter" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close dialog" })).toBe(document.activeElement);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(trigger); fireEvent.click(screen.getByRole("button", { name: "delete filters" }));
    expect(clear).toHaveBeenCalledOnce();
    expect(window.location.hash).toBe("#details");
    expect(window.location.search).toContain("status=active");
    expect(window.history.state).toEqual({ host: 1 });
  });
});
