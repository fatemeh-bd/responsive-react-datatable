"use client";
import "./tableStyle.css";
import React, { useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { QueryClient, QueryClientContext, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ColumnType, InternalModeProps, OrderType, Selectable, TableProps } from "./types";
import { useIsMobile } from "./hooks/useIsMobile";
import { useQueryParams } from "./hooks/useQueryParams";
import { defaultAutoConfig, defaultColorTheme, defaultSize, defaultTexts } from "./tableConfigs";
import { localRows, positiveInteger, requestConfig } from "./data";
import DesktopTable from "./DesktopTable";
import MobileTable from "./MobileTable";
import Pagination from "./tools/Pagination";
import PageSizeSelect from "./tools/PageSizeSelect";
import SearchBox from "./tools/SearchBox";
import Modal from "./tools/Modal";
import { SelectableCheckbox } from "./tools/SelectableCheckbox";
import { FilterIcon, TrashIcon } from "./icons";

// Keep credentials out of query keys/devtools. Identity is private to its client.
const credentialScopes = new WeakMap<QueryClient, Map<string, number>>();
function credentialScope(client: QueryClient, headers: unknown) {
  let scopes = credentialScopes.get(client);
  if (!scopes) { scopes = new Map(); credentialScopes.set(client, scopes); }
  const key = JSON.stringify(headers || {});
  if (!scopes.has(key)) scopes.set(key, scopes.size + 1);
  return scopes.get(key);
}
const emptyRows: any[] = [];
function Table(props: TableProps) {
  const { columns, mode, lang = "en", pageQueryName = "page", pageSizeQueryName = "pageSize",
    pageSize = defaultSize, tableName, isSelectable, noSearch, filters, topFilter,
    onPageChange, onPageSizeChange, onSearch, onSortChange } = props;
  const instanceId = useId();
  const root = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const footer = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(props.startMobileSize);
  const { getParams, setParams } = useQueryParams();
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState("");
  const searchValue = useRef("");
  const searchCallback = useRef(onSearch);
  useEffect(() => { searchCallback.current = onSearch; }, [onSearch]);
  const searchKey = props.saveSearch && tableName ? `search_${tableName}` : null;
  useEffect(() => {
    let saved = "";
    try { if (searchKey) saved = JSON.parse(sessionStorage.getItem(searchKey) || "null")?.value || ""; } catch { /* storage is optional */ }
    const restored = typeof saved === "string" ? saved : "";
    setSearch(restored);
    if (restored !== searchValue.current) searchCallback.current?.(restored);
    searchValue.current = restored;
  }, [searchKey]);
  const config = mode === "internal" ? props.internalApiConfig : undefined;
  const defaultOrder: OrderType = config?.defaultSortBy ? {
    column: props.columnNumber ?? 0, dir: config.sortType ?? "desc", name: config.defaultSortBy,
  } : null;
  const [order, setOrder] = useState<OrderType>(defaultOrder);
  useEffect(() => {
    setOrder(config?.defaultSortBy ? { column: props.columnNumber ?? 0, dir: config.sortType ?? "desc", name: config.defaultSortBy } : null);
  }, [mode, config?.defaultSortBy, config?.sortType, props.columnNumber]);
  const theme = useMemo(() => ({ ...defaultColorTheme, ...props.colorTheme }), [props.colorTheme]);
  const texts = useMemo(() => ({ ...defaultTexts[lang], ...props.textsConfig }), [lang, props.textsConfig]);
  const dir = lang === "fa" ? "rtl" : "ltr";
  const [autoSize, setAutoSize] = useState<number | null>(null);
  const auto = useMemo(() => ({ ...defaultAutoConfig, ...props.autoPageSizeConfig }), [props.autoPageSizeConfig]);
  const preferredSize = positiveInteger(pageSize, defaultSize);
  const size = positiveInteger(getParams(pageSizeQueryName), auto.enabled && !isMobile ? autoSize ?? preferredSize : preferredSize);
  const requestedPage = positiveInteger(getParams(pageQueryName), 1);

  useEffect(() => {
    if (!auto.enabled || isMobile) return;
    const query = (selector?: string) => {
      try { return selector ? document.querySelector<HTMLElement>(selector) : null; } catch { return null; }
    };
    const container = query(auto.containerSelector) || root.current?.parentElement;
    const calculate = () => {
      if (!container || container.clientHeight <= 0) return;
      const internal = [header.current, footer.current, top.current];
      const additional = (auto.subtractSelectors || []).map(selector => {
        // Historical IDs are now local to each table, not global duplicate IDs.
        if (selector === "#table-header-actions") return header.current;
        if (selector === "#topFilter") return top.current;
        if (selector === "#paging") return footer.current;
        return query(selector);
      });
      const elements = new Set([...internal, ...additional]);
      const subtract = Array.from(elements).reduce((sum, el) => sum + (el?.clientHeight || 0), 0);
      const optional = (auto.optionalSelectorsForExtraBuffer || []).some(selector => {
        const el = selector === "#topFilter" ? top.current : selector === "#paging" ? footer.current : query(selector);
        return !!el && el.clientHeight > 0;
      });
      const rowHeight = Number.isFinite(auto.rowHeight) && auto.rowHeight! > 0 ? auto.rowHeight! : 51.15;
      const buffer = Math.max(0, auto.baseBufferRows ?? 2) + (optional ? Math.max(0, auto.extraBufferRows ?? 1) : 0);
      setAutoSize(Math.max(1, Math.floor((container.clientHeight - subtract) / rowHeight) - buffer));
    };
    calculate();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(calculate);
    if (container) observer?.observe(container);
    [header.current, footer.current, top.current].forEach(el => { if (el) observer?.observe(el); });
    window.addEventListener("resize", calculate);
    return () => { observer?.disconnect(); window.removeEventListener("resize", calculate); };
  }, [auto, isMobile]);

  const staticRows = mode === "static" ? props.staticRows || emptyRows : emptyRows;
  const processed = useMemo(() => localRows(staticRows, columns, search, order), [staticRows, columns, search, order]);
  const preliminaryTotal = mode === "static" ? processed.length : mode === "external" ? Math.max(0, props.totalItems || 0) : 0;
  const preliminaryPage = mode === "static" ? Math.min(requestedPage, Math.max(1, Math.ceil(preliminaryTotal / size))) : requestedPage;
  const requestColumns = useMemo(() => [{ data: "id", title: texts.row || "", searchable: false, orderable: true }, ...columns]
    .filter(col => col.data !== null).map(col => ({ data: col.data, name: col.data, searchable: !!col.searchable,
      orderable: !!col.orderable, search: { value: "", regex: false, fixed: [] } })), [columns, texts.row]);
  const refreshBody = JSON.stringify((config?.customBody || []).filter(item => !item.noRefresh));
  const previousBody = useRef<string | null>(null);
  const previousMode = useRef(mode);
  const bodyChanged = mode === "internal" && previousMode.current === mode && previousBody.current !== null && previousBody.current !== refreshBody;
  useEffect(() => {
    if (bodyChanged) setParams({ [pageQueryName]: "1" });
    previousMode.current = mode;
    previousBody.current = mode === "internal" ? refreshBody : null;
  }, [mode, refreshBody, bodyChanged, setParams, pageQueryName]);
  const pageForRequest = bodyChanged ? 1 : preliminaryPage;
  const sharedClient = useContext(QueryClientContext);
  const [privateClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));
  const client = sharedClient || privateClient;
  const callbacks = useRef({ config, notify: props.notify });
  useEffect(() => { callbacks.current = { config, notify: props.notify }; });
  const query = useQuery({
    enabled: ready && mode === "internal" && !!config,
    queryKey: ["responsive-react-datatable", tableName || instanceId, config?.baseUrl, config?.endpoint,
      config?.method || "POST", config?.payload, requestColumns, credentialScope(client, config?.headers),
      pageForRequest, size, search, order, refreshBody],
    refetchOnWindowFocus: false,
    throwOnError: false,
    queryFn: async ({ signal }) => {
      const current = config as InternalModeProps["internalApiConfig"];
      const payload: Record<string, any> = { draw: pageForRequest, columns: requestColumns, order: order ? [order] : [],
        start: (pageForRequest - 1) * size, length: size, search: { value: search, regex: false, fixed: [] } };
      for (const { noRefresh: _noRefresh, isFilter: _isFilter, ...rest } of current.customBody || []) Object.assign(payload, rest);
      const response = await axios({ ...requestConfig(current, payload), signal });
      if (!response.data || typeof response.data !== "object") throw new Error("Invalid table response: expected an object");
      if (response.data.data != null && !Array.isArray(response.data.data)) throw new Error("Invalid table response: data must be an array");
      return response.data;
    },
  }, client);
  const lastSuccess = useRef<unknown>(null);
  useEffect(() => {
    if (mode !== "internal" || !query.data || query.data === lastSuccess.current) return;
    lastSuccess.current = query.data;
    callbacks.current.config?.onFetch?.(query.data);
    if (query.data.data === null) callbacks.current.notify?.(query.data.message || "null data", "warning");
    setOpenFilter(false);
  }, [mode, query.data]);
  useEffect(() => {
    if (mode === "internal" && query.error) callbacks.current.notify?.(query.error.message, "error");
  }, [mode, query.error]);
  const total = mode === "internal" ? Math.max(0, Number(query.data?.recordsFiltered) || 0) : preliminaryTotal;
  const page = total > 0 || mode === "static" ? Math.min(requestedPage, Math.max(1, Math.ceil(total / size))) : requestedPage;
  const previousPage = useRef(1);
  const pageCallback = useRef(onPageChange);
  useEffect(() => { pageCallback.current = onPageChange; }, [onPageChange]);
  useEffect(() => {
    if (previousPage.current !== page) { previousPage.current = page; pageCallback.current?.(page); }
    if (page !== requestedPage) setParams({ [pageQueryName]: String(page) });
  }, [page, requestedPage, pageQueryName, setParams]);
  const changePage = useCallback((next: number) => setParams({ [pageQueryName]: String(positiveInteger(next, 1)) }), [pageQueryName, setParams]);
  const changeSearch = (next: string) => {
    searchValue.current = next;
    setSearch(next); changePage(1); onSearch?.(next);
    try { if (searchKey) sessionStorage.setItem(searchKey, JSON.stringify({ value: next })); } catch { /* optional */ }
  };
  const changeSize = (next: number) => {
    setParams({ [pageSizeQueryName]: String(positiveInteger(next, preferredSize)), [pageQueryName]: "1" });
    onPageSizeChange?.(positiveInteger(next, preferredSize));
  };
  const changeOrder = (next: OrderType) => {
    const index = next ? requestColumns.findIndex(col => col.data === next.name) : -1;
    const mapped = next ? { ...next, column: index } : null;
    setOrder(mapped); changePage(1); onSortChange?.(mapped);
  };
  const rows = mode === "static" ? processed.slice((page - 1) * size, page * size) :
    mode === "external" ? props.externalRows || emptyRows : query.data?.data || emptyRows;
  const selectable = isSelectable ? props as Selectable : undefined;
  const selectedKey = selectable?.selectedKey || "id";
  // Static: all filtered rows; server modes: loaded page. Preserve other pages' IDs.
  const selectableRows = mode === "static" ? processed : rows;
  const selectableIds: Array<string | number> = Array.from(new Set(selectableRows.map((row: any) => row[selectedKey])
    .filter((id: unknown) => typeof id === "string" || typeof id === "number"))) as Array<string | number>;
  const selectedIds = selectable?.selectedIds || [];
  const allSelected = selectableIds.length > 0 && selectableIds.every(id => selectedIds.includes(id));
  const someSelected = selectableIds.some(id => selectedIds.includes(id));
  const selectAll = () => selectable?.onSelectChange?.(allSelected ? selectedIds.filter(id => !selectableIds.includes(id)) : Array.from(new Set([...selectedIds, ...selectableIds])));
  const displayColumns: ColumnType[] = [
    ...(selectable ? [{ data: "selectableTable", title: "", width: 50, orderable: false, searchable: false,
      render: (_cell: unknown, row?: any) => <SelectableCheckbox row={row} selectableProps={selectable} theme={theme} /> }] : []),
    { data: "id", title: texts.row || "", render: (_cell, _row, index = 0) => (page - 1) * size + index + 1,
      orderable: true, width: 70, searchable: false }, ...columns,
  ];
  const loading = props.isLoading || (mode === "internal" && (!ready || query.isFetching || bodyChanged));
  const activeFilterCount = (config?.customBody || []).filter(item => item.isFilter && Object.entries(item)
    .some(([key, value]) => key !== "isFilter" && key !== "noRefresh" && value != null && value !== "")).length;
  const pageSelect = <PageSizeSelect pageSize={size} initialPageSize={autoSize ?? preferredSize} theme={theme} textsConfig={texts} onPageSizeChange={changeSize} />;
  return <div ref={root} className="rrdt table-container" dir={dir} aria-busy={!!loading}>
    {!isMobile && topFilter && <div ref={top} className={`top-filter-container ${props.topFilterContainerClassName || ""}`}>{topFilter}</div>}
    <div ref={header} className="table-header-actions">
      <div className="search-container-table">
        {!noSearch && <SearchBox value={search} onSearch={changeSearch} theme={theme} mergedTexts={texts} dir={dir} />}
        {!isMobile && filters && <div className={`${props.filterContainerClassName || ""} filter-container-className`}>{filters}</div>}
      </div>
      {isMobile && (filters || topFilter) && <button type="button" onClick={() => setOpenFilter(true)} style={{ minHeight: 43, background: "#427bd225", color: "#427bd2" }} className="mobile-filter-button">
        {activeFilterCount > 0 && <span className="mobile-filter-badge">{activeFilterCount}</span>}{texts.filterText}<FilterIcon />
      </button>}
      <div className="actionButtons">{props.actionButtons}{!isMobile && !props.noPageSize && pageSelect}</div>
    </div>
    {isMobile ? <MobileTable columns={displayColumns} rows={rows} isLoading={!!loading} theme={theme} textsConfig={texts} listMode={props.listMode} rowKey={props.rowKey || selectedKey} /> :
      <DesktopTable columns={displayColumns} rows={rows} isLoading={!!loading} theme={theme} textsConfig={texts}
        pageSize={size} maxHeight={props.height || `${(size + 1) * (auto.rowHeight || 51.15)}px`} rowHeight={`${auto.rowHeight || 51.15}px`}
        rowClassName={props.rowClassName} rowKey={props.rowKey || selectedKey} order={order}
        onOrderChange={changeOrder} isAllSelected={allSelected} isIndeterminate={someSelected && !allSelected} onAllSelect={selectAll} />}
    <div ref={footer} className="table-footer">
      {total > 0 && <Pagination dir={dir} startMobileSize={props.startMobileSize} totalItems={total} pageSize={size}
        queryName={pageQueryName} theme={theme} textsConfig={texts} currentPage={page} onChangePage={changePage} />}
      {isMobile && !props.noPageSize && pageSelect}
    </div>
    <Modal size="lg" title={texts.filterText} isOpen={openFilter} onClose={() => setOpenFilter(false)} className="filter-modal" theme={theme}>
      <div className="filter-modal-content space-items">{filters}{topFilter}</div>
      <div className="filter-modal-actions">
        <button type="button" onClick={() => setOpenFilter(false)} className="filter-modal-close-button">{texts.close}</button>
        <button type="button" className="filter-modal-clear-button" onClick={() => {
          changeSearch("");
          try { if (props.removeFilterKey) sessionStorage.removeItem(props.removeFilterKey); if (searchKey) sessionStorage.removeItem(searchKey); } catch { /* optional */ }
          props.onClearFilters?.(); setOpenFilter(false);
        }}>{texts.removeFilterText}<TrashIcon /></button>
      </div>
    </Modal>
  </div>;
}
export default React.memo(Table);
