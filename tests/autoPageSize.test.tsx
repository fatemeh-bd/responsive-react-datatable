import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Table from "react-responsive-datatable-kit";

const initialViewportHeight = window.innerHeight;
afterEach(() => {
  vi.unstubAllGlobals();
  window.innerHeight = initialViewportHeight;
});
it("fits the viewport, reacts to filter height and resize, and respects a smaller explicit container", async () => {
  let top = 200;
  let resize: () => void = () => {};
  const disconnected = vi.fn();
  vi.stubGlobal("ResizeObserver", class {
    constructor(callback: () => void) { resize = callback; }
    observe() {} unobserve() {} disconnect = disconnected;
  });
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue([{}] as unknown as DOMRectList);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    const y = this.classList.contains("desktop-table-body-container") ? top : 0;
    const height = this.id === "bounded" ? 500 : this.classList.contains("table-footer") ? 40 :
      this.matches(".desktop-table-head, .desktop-table-data-row") ? 50 : 0;
    return { top: y, bottom: y + height, height, left: 0, right: 1000, width: 1000, x: 0, y, toJSON() {} };
  });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800, writable: true });
  const rows = Array.from({ length: 100 }, (_, id) => ({ id }));
  const config = { enabled: true };
  const props = { mode: "static" as const, columns: [{ data: "id", title: "ID" }], staticRows: rows };
  const view = render(<Table {...props} autoPageSizeConfig={config} filters={<div>Filter</div>} />);
  const count = () => document.querySelectorAll(".desktop-table-data-row").length;
  await waitFor(() => expect(count()).toBe(10));
  top = 300;
  act(() => resize());
  await waitFor(() => expect(count()).toBe(8));
  window.innerHeight = 600;
  act(() => window.dispatchEvent(new Event("resize")));
  await waitFor(() => expect(count()).toBe(4));
  act(() => window.history.replaceState(null, "", "/?pageSize=7"));
  await waitFor(() => expect(count()).toBe(7));
  act(() => window.history.replaceState(null, "", "/"));
  await waitFor(() => expect(count()).toBe(4));
  view.rerender(<Table {...props} autoPageSizeConfig={{ enabled: true, rowHeight: 100 }} />);
  await waitFor(() => expect(count()).toBe(2));
  view.rerender(<div id="bounded"><Table {...props} autoPageSizeConfig={{ enabled: true, containerSelector: "#bounded" }} /></div>);
  await waitFor(() => expect(count()).toBe(2));
  window.innerHeight = 100;
  act(() => window.dispatchEvent(new Event("resize")));
  await waitFor(() => expect(count()).toBe(1));
  view.unmount();
  expect(disconnected).toHaveBeenCalled();
});
