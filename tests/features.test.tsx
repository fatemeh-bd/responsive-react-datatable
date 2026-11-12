import React, { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import Table, { type ColumnType } from "react-responsive-datatable-kit";

const columns: ColumnType[] = [
  { data: "name", title: "Name", hideable: false, orderable: true },
  { data: "email", title: "Email", hidden: true },
];
const rows = [{ id: 0, name: "Zoe", email: "zoe@example.com", notes: "Zoe details" }, { id: 1, name: "Amy", email: "amy@example.com", notes: "Amy details" }];
const props = { mode: "static" as const, columns, staticRows: rows, pageSize: 1 };
const readBlob = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsText(blob);
});
function downloads() {
  const blobs: Blob[] = [];
  Object.defineProperty(URL, "createObjectURL", { configurable: true, writable: true, value: vi.fn((blob: Blob) => { blobs.push(blob); return "blob:test"; }) });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, writable: true, value: vi.fn() });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  return blobs;
}

describe("column visibility and themes", () => {
  it("defaults to a light table and lets the host choose a dark base color", () => {
    const view = render(<Table {...props} />);
    expect((document.querySelector(".table-container") as HTMLElement).style.backgroundColor).toBe("rgb(255, 255, 255)");
    view.rerender(<Table {...props} theme="#121212" />);
    expect((document.querySelector(".table-container") as HTMLElement).style.backgroundColor).toBe("rgb(18, 18, 18)");
  });
  it("exposes one clear control and clears search immediately without a duplicate callback", async () => {
    const onSearch = vi.fn();
    render(<Table {...props} onSearch={onSearch} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Zoe" } });
    await waitFor(() => expect(onSearch).toHaveBeenCalledExactlyOnceWith("Zoe"));
    expect(screen.getAllByRole("button", { name: "Clear search", exact: true })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Clear search", exact: true }));
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
    expect(onSearch.mock.calls).toEqual([["Zoe"], [""]]);
    expect(screen.queryByRole("button", { name: "Clear search", exact: true })).toBeNull();
  });
  it("shows initially hidden columns through a keyboard-accessible chooser and locks fixed columns", () => {
    render(<Table {...props} columnVisibility />);
    expect(screen.queryByRole("columnheader", { name: "Email" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Columns" }));
    const dialog = screen.getByRole("dialog");
    expect((within(dialog).getByRole("checkbox", { name: "Name" }) as HTMLInputElement).disabled).toBe(true);
    fireEvent.click(within(dialog).getByRole("checkbox", { name: "Email" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("columnheader", { name: "Email" })).toBeTruthy();
    expect(screen.getByText("zoe@example.com")).toBeTruthy();
  });
  it("keeps controlled visibility owned by the host", () => {
    const onChange = vi.fn();
    const view = render(<Table {...props} columnVisibility hiddenColumnIds={["email"]} onHiddenColumnsChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Columns" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Email" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith([]);
    expect(screen.queryByRole("columnheader", { name: "Email" })).toBeNull();
    view.rerender(<Table {...props} columnVisibility hiddenColumnIds={[]} onHiddenColumnsChange={onChange} />);
    expect(screen.getByRole("columnheader", { name: "Email" })).toBeTruthy();
  });
  it("merges color overrides with the preset and preserves custom root classes/styles", () => {
    render(<Table {...props} theme="dark" colorTheme={{ primaryColor: "#ff00ff" }} className="custom-table" style={{ marginTop: 12 }} columnVisibility />);
    const root = document.querySelector(".rrdt.table-container.custom-table") as HTMLElement;
    expect(root.dataset.theme).toBe("dark"); expect(root.style.marginTop).toBe("12px");
    expect((document.querySelector(".desktop-table-data-row") as HTMLElement).style.backgroundColor).toBe("rgb(18, 18, 18)");
    fireEvent.click(screen.getByRole("button", { name: "Columns" }));
    expect(screen.getByRole("dialog").style.backgroundColor).toBe("rgb(18, 18, 18)");
  });
  it("uses a hex theme as the table surface and derives readable text and controls", () => {
    render(<Table {...props} theme="#000" />);
    const root = document.querySelector(".table-container") as HTMLElement;
    expect(root.style.backgroundColor).toBe("rgb(0, 0, 0)");
    expect(root.style.color).toBe("rgb(245, 245, 245)");
    expect((document.querySelector(".desktop-table-head") as HTMLElement).style.backgroundColor).toBe("rgb(23, 23, 23)");
    expect((document.querySelector(".desktop-table-data-row") as HTMLElement).style.backgroundColor).toBe("rgb(0, 0, 0)");
  });
});
describe("expandable row details", () => {
  it("uses the same column sizing and row height for loading and data", () => {
    const view = render(<Table {...props} isLoading />);
    expect(document.querySelectorAll("colgroup col")).toHaveLength(2); // Row number + Name; Email starts hidden.
    expect((document.querySelector(".desktop-table-skeleton-row") as HTMLElement).style.height).toBe("51.15px");
    const widths = Array.from(document.querySelectorAll("colgroup col")).map(column => (column as HTMLElement).style.width);
    view.rerender(<Table {...props} />);
    expect(Array.from(document.querySelectorAll("colgroup col")).map(column => (column as HTMLElement).style.width)).toEqual(widths);
  });
  it("keeps ID zero expanded across sorting and responsive layout changes", () => {
    const view = render(<Table {...props} pageSize={2} expandableRows={{ render: row => <p>{row.notes}</p> }} listMode />);
    fireEvent.click(screen.getAllByRole("button", { name: "Expand row" })[0]);
    expect(screen.getByRole("region", { name: "Row details" }).textContent).toBe("Zoe details");
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(document.querySelector("tbody tr")?.textContent).toContain("Amy");
    expect(screen.getByRole("region", { name: "Row details" }).textContent).toBe("Zoe details");
    act(() => { Object.defineProperty(window, "innerWidth", { value: 375, writable: true }); window.dispatchEvent(new Event("resize")); });
    expect(document.querySelector(".mobile-table-card .table-row-details")?.textContent).toBe("Zoe details");
    view.unmount();
  });
  it("supports controlled expansion and excludes rows without stable IDs or matching canExpand", () => {
    const changed = vi.fn();
    render(<Table {...props} pageSize={10} staticRows={[...rows, { name: "No ID" }]}
      expandableRows={{ render: row => <p>{row.notes}</p>, expandedRowIds: [], onExpandedChange: changed, canExpand: row => row.name !== "Amy" }} />);
    expect(screen.getAllByRole("button", { name: "Expand row" })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Expand row" }));
    expect(changed).toHaveBeenCalledExactlyOnceWith([0]);
    expect(screen.queryByRole("region", { name: "Row details" })).toBeNull();
  });
  it("hydrates default visibility, expanded details and a dark preset without markup mismatches", async () => {
    const element = <StrictMode><Table {...props} theme="dark" columnVisibility exportConfig
      expandableRows={{ defaultExpandedRowIds: [0], render: row => <p>{row.notes}</p> }} /></StrictMode>;
    const container = document.createElement("div"); document.body.appendChild(container);
    container.innerHTML = renderToString(element);
    const errors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => { root = hydrateRoot(container, element, { onRecoverableError: error => errors.push(error) }); });
    expect(errors).toEqual([]); expect(container.textContent).toContain("Zoe details");
    await act(async () => root!.unmount()); container.remove();
  });
});
describe("file export interactions", () => {
  it("exports all filtered static rows across pages and leaves hidden fields out", async () => {
    const blobs = downloads();
    render(<Table {...props} exportConfig />);
    fireEvent.click(screen.getByRole("button", { name: "Export" }));
    fireEvent.click(screen.getByRole("button", { name: "CSV", exact: true }));
    await waitFor(() => expect(blobs).toHaveLength(1));
    const text = await readBlob(blobs[0]);
    expect(text).toContain('"Zoe"'); expect(text).toContain('"Amy"'); expect(text).not.toContain("example.com");
  });
  it("exports selected available rows and reports loaded-page limits in server mode", async () => {
    const blobs = downloads();
    render(<Table mode="external" columns={columns} externalRows={[rows[0]]} totalItems={100} isSelectable selectedIds={[0, 99]} exportConfig />);
    fireEvent.click(screen.getByRole("button", { name: "Export" }));
    expect(screen.getByText(/Only loaded rows/)).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", { name: "Rows to export" }), { target: { value: "selected" } });
    fireEvent.click(screen.getByRole("button", { name: "CSV", exact: true }));
    await waitFor(() => expect(blobs).toHaveLength(1));
    expect(await readBlob(blobs[0])).toContain('"Zoe"');
  });
  it("recovers from a failed async export and supplies the current request context", async () => {
    const blobs = downloads();
    const getRows = vi.fn().mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce(rows);
    render(<Table mode="external" columns={columns} externalRows={[]} totalItems={100} exportConfig={{ getRows }} />);
    fireEvent.click(screen.getByRole("button", { name: "Export" }));
    fireEvent.click(screen.getByRole("button", { name: "CSV", exact: true }));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "CSV", exact: true }));
    await waitFor(() => expect(blobs).toHaveLength(1));
    expect(getRows).toHaveBeenLastCalledWith(expect.objectContaining({ scope: "filtered", page: 1, pageSize: 10, search: "", selectedIds: [] }));
    expect(await readBlob(blobs[0])).toContain('"Amy"');
  });
});
