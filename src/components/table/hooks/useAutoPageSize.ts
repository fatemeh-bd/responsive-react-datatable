import { useEffect, useState, type RefObject } from "react";
import type { AutoPageSizeConfig } from "../types";

/** Measure only after mount, keeping the first render safe for SSR/hydration. */
export function useAutoPageSize(root: RefObject<HTMLDivElement>, config: AutoPageSizeConfig, mobile: boolean) {
  const [size, setSize] = useState<number | null>(null);
  useEffect(() => {
    const element = root.current;
    if (!config.enabled || mobile || !element) return;
    const query = (selector?: string) => {
      try { return selector ? document.querySelector<HTMLElement>(selector) : null; } catch { return null; }
    };
    const local = (selector: string) => element.querySelector<HTMLElement>(`:scope > ${selector}`);
    const find = (selector: string) => selector === "#topFilter" ? local(".top-filter-container") :
      selector === "#paging" ? local(".table-footer") : selector === "#table-header-actions" ? local(".table-header-actions") : query(selector);
    const container = query(config.containerSelector);
    let frame: number | undefined;
    let measuredRowHeight = 0;
    const observed = new Set<Element>();
    const observe = (target: Element | null) => {
      if (target && !observed.has(target)) { observed.add(target); observer?.observe(target); }
    };
    const calculate = () => {
      frame = undefined;
      const body = local(".desktop-table-container > .desktop-table-body-container");
      if (!body || !element.getClientRects().length) return;
      const viewportBottom = window.visualViewport ? window.visualViewport.offsetTop + window.visualViewport.height : window.innerHeight;
      const bounds = container?.getBoundingClientRect();
      const bottom = bounds && bounds.height > 0 ? Math.min(viewportBottom, bounds.bottom - (container!.offsetHeight - container!.clientHeight)) : viewportBottom;
      const bodyRect = body.getBoundingClientRect();
      const footer = local(".table-footer");
      const height = (el: HTMLElement | null) => el?.getBoundingClientRect().height || 0;
      const outerHeight = (el: HTMLElement | null) => {
        if (!el) return 0;
        const css = getComputedStyle(el);
        return height(el) + (parseFloat(css.marginTop) || 0) + (parseFloat(css.marginBottom) || 0);
      };
      const extras = Array.from(new Set((config.subtractSelectors || []).map(find)))
        .filter((el): el is HTMLElement => !!el && !element.contains(el) && !el.contains(element));
      // Count only outermost external regions, avoiding nested selector double subtraction.
      const subtract = extras.filter(el => !extras.some(other => other !== el && other.contains(el)))
        .reduce((sum, el) => sum + outerHeight(el), 0);
      const rows = body.querySelectorAll<HTMLElement>(":scope > table > tbody > .desktop-table-data-row");
      rows.forEach(row => { measuredRowHeight = Math.max(measuredRowHeight, height(row)); observe(row); });
      const explicitHeight = config.rowHeight && Number.isFinite(config.rowHeight) && config.rowHeight > 0 ? config.rowHeight : 0;
      const rowHeight = explicitHeight || measuredRowHeight || 51.15;
      const head = body.querySelector<HTMLElement>(":scope > table > .desktop-table-head");
      const css = getComputedStyle(element);
      const chrome = outerHeight(footer) + (parseFloat(css.paddingBottom) || 0) + (parseFloat(css.borderBottomWidth) || 0) + 2;
      let available = bottom - bodyRect.top - chrome - subtract;
      const maxHeight = parseFloat(getComputedStyle(body).maxHeight);
      if (Number.isFinite(maxHeight)) available = Math.min(available, maxHeight);
      const details = Array.from(body.querySelectorAll<HTMLElement>(":scope > table > tbody > .table-details-row")).reduce((sum, row) => sum + height(row), 0);
      const optional = (config.optionalSelectorsForExtraBuffer || []).some(selector => height(find(selector)) > 0);
      const buffer = Math.max(0, config.baseBufferRows || 0) + (optional ? Math.max(0, config.extraBufferRows || 0) : 0);
      const next = Math.max(1, Math.floor((available - height(head) - details) / rowHeight) - buffer);
      if (Number.isFinite(next)) setSize(previous => previous === next ? previous : next);
      [element, body, head, footer, local(".table-header-actions"), local(".top-filter-container"), container, ...extras].forEach(observe);
      for (const target of Array.from(observed)) if (!target.isConnected) { observer?.unobserve(target); observed.delete(target); }
    };
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(calculate); };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    const mutations = new MutationObserver(schedule);
    mutations.observe(element, { childList: true, subtree: true, characterData: true });
    observe(element); observe(container);
    calculate();
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer?.disconnect(); mutations.disconnect();
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
    };
  }, [root, config, mobile]);
  return size;
}
