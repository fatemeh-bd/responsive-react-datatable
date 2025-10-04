import "./tableStyle.css";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  ColorTheme,
  ColumnType,
  ExternalTableProps,
  InternalTableProps,
  OrderType,
  Selectable,
  StaticModeProps,
  TableProps,
} from "./types";
import { useIsMobile } from "./hooks/useIsMobile";
import MobileTable from "./MobileTable";
import DesktopTable from "./DesktopTable";
import { rowRenderer } from "./helper";
import Pagination from "./tools/Pagination";
import { useQueryParams } from "./hooks/useQueryParams";
import { SelectableCheckbox } from "./tools/SelectableCheckbox";
import { useQuery } from "@tanstack/react-query";
import { FilterIcon, TrashIcon } from "./icons";
import axios from "axios";
import PageSizeSelect from "./tools/PageSizeSelect";
import Modal from "./tools/Modal";
import {
  defaultAutoConfig,
  defaultColorTheme,
  defaultSize,
  defaultTexts,
} from "./tableConfigs";
import SearchBox from "./tools/SearchBox";

const Table: React.FC<TableProps> = (props) => {
  // props
  const {
    startMobileSize,
    columns = [],
    isSelectable,
    colorTheme,
    textsConfig,
    lang = "en",
    pageQueryName = "page",
    pageSize = defaultSize,
    mode,
    hasColumnOrder,
    noSearch,
    notify,
    onPageChange,
    onSortChange,
    onSearch,
    isLoading,
    autoPageSizeConfig: customAutoPageSizeConfig,
    height,
    onPageSizeChange,
    listMode,
    tableName,
    filters,
    topFilter,
    topFilterContainerClassName = "flex items-center flex-wrap md:gap-2 gap-3 sm:[&>div]:w-full",
    filterContainerClassName = "flex flex-wrap md:gap-2 gap-3 sm:[&>div]:w-full",
    removeFilterKey,
    actionButtons,
  } = props;
  const selectableProps = isSelectable ? (props as Selectable) : undefined;
  const theme: ColorTheme = useMemo(
    () => ({
      ...defaultColorTheme,
      ...colorTheme,
    }),
    [colorTheme]
  );

  const mergedTexts = useMemo(
    () => ({ ...defaultTexts[lang], ...textsConfig }),
    [lang, textsConfig]
  );
  const dir = lang === "fa" ? "rtl" : "ltr";

  // const autoConfig = {
  //   ...defaultAutoConfig,
  //   ...customAutoPageSizeConfig,
  //   subtractSelectors: [
  //     "#table-header-actions",
  //     // "#paging",
  //     "#topFilter",
  //     ...((customAutoPageSizeConfig?.subtractSelectors as string[]) || []),
  //   ],
  //   optionalSelectorsForExtraBuffer: [
  //     "#paging",
  //     ...((customAutoPageSizeConfig?.optionalSelectorsForExtraBuffer as string[]) ||
  //       []),
  //   ],
  // };

  // const {
  //   enabled: autoEnabled,
  //   containerSelector,
  //   subtractSelectors,
  //   optionalSelectorsForExtraBuffer,
  //   rowHeight,
  //   baseBufferRows,
  //   extraBufferRows,
  // } = autoConfig;

  // hooks
  const isMobile = useIsMobile(startMobileSize);
  const { updateParams, getParams } = useQueryParams();
  // states
  const [tableLoading, setTableLoading] = useState(false);
  const pageSizeInitial = Number(getParams("pageSize")) || pageSize;
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    () => Number(getParams(pageQueryName)) || 1
  );
  const [searchText, setSearchText] = useState("");
  const [tableRows, setTableRows] = useState<any[]>(
    mode === "static" ? (props as StaticModeProps).staticRows || [] : []
  );
  const [filteredRows, setFilteredRows] = useState<any[]>(tableRows);
  const [totalItems, setTotalItems] = useState<number>(
    mode === "static" ? (props as StaticModeProps).totalItems || 0 : 0
  );
  // const [dynamicPageSize, setDynamicPageSize] = useState(pageSizeInitial);
  // const [tableHeightPageSize, setTableHeightPageSize] = useState(
  //   isMobile ? pageSizeInitial : autoEnabled ? 0 : pageSize
  // );
  // const autoConfig = { ...defaultAutoConfig, ...customAutoPageSizeConfig };
  const autoConfig = {
    ...defaultAutoConfig,
    ...customAutoPageSizeConfig,
    subtractSelectors: [
      "#table-header-actions",
      "#topFilter",
      "#paging",
      ...((customAutoPageSizeConfig?.subtractSelectors as string[]) || []),
    ],
    optionalSelectorsForExtraBuffer: [
      "#topFilter",
      // "#paging",
      ...((customAutoPageSizeConfig?.optionalSelectorsForExtraBuffer as string[]) ||
        []),
    ],
  };
  const {
    enabled: autoEnabled,
    containerSelector,
    subtractSelectors,
    optionalSelectorsForExtraBuffer,
    rowHeight,
    baseBufferRows,
    extraBufferRows,
  } = autoConfig;
  const [dynamicPageSize, setDynamicPageSize] = useState(
    isMobile ? pageSizeInitial : autoEnabled ? 0 : pageSizeInitial
  );
  const [tableHeightPageSize, setTableHeightPageSize] = useState(
    isMobile ? pageSizeInitial : autoEnabled ? 0 : pageSizeInitial
  );

  useLayoutEffect(() => {
    if (!isMobile && autoEnabled) {
      const calcSize = () => {
        let sumSubtract = 0;

        // ✅ جمع ارتفاع المنت‌های subtract
        for (const sel of subtractSelectors || []) {
          const el = document.querySelector(sel);
          if (el) {
            sumSubtract += Number(el.clientHeight || 0);
          }
        }

        // ✅ محاسبه ارتفاع قابل استفاده
        const containerEl = document.querySelector(containerSelector || "");
        const availableHeight = (containerEl?.clientHeight || 0) - sumSubtract;

        // تعداد ردیف‌ها بر اساس ارتفاع هر ردیف
        const rows = Math.floor(availableHeight / (rowHeight || 51.15));

        // ✅ اضافه کردن buffer
        let buffer = baseBufferRows || 2;

        // فقط وقتی المنت وجود داشت و height > 0 بود، extraBuffer رو اضافه کن
        const hasOptional = (optionalSelectorsForExtraBuffer || []).some(
          (sel) => {
            const el = document.querySelector(sel);
            return !!el && el.clientHeight > 0;
          }
        );

        if (hasOptional) buffer += extraBufferRows || 1;

        const newSize = rows - buffer;

        if (newSize > 0) {
          setTableHeightPageSize(newSize); // ارتفاع جدول
          if (!dynamicPageSize) {
            setDynamicPageSize(Number(getParams("pageSize")) || newSize);
          }
        }
      };

      calcSize();

      const observer = new MutationObserver(calcSize);
      observer.observe(document.body, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
  }, [autoConfig]);

  const [order, setOrder] = useState<any>([
    {
      column: hasColumnOrder ? 8 : 0,
      dir: mode === "internal" ? props?.internalApiConfig?.sortType : "desc",
      name:
        mode === "internal" ? props?.internalApiConfig?.defaultSortBy : "id",
    },
  ]);

  // functions
  const onChangePage = (page: number) => {
    updateParams(pageQueryName, page.toString());
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handleOrderChange = useCallback(
    (newOrder: OrderType) => {
      setOrder(newOrder ? [newOrder] : []);
      onSortChange?.(newOrder);
    },
    [mode, onSortChange]
  );

  const paginatedRows = useMemo(() => {
    const size = autoEnabled ? dynamicPageSize : pageSizeInitial;
    const start = (currentPage - 1) * size;
    const end = start + size;
    return filteredRows.slice(start, end);
  }, [filteredRows, currentPage, pageSizeInitial, dynamicPageSize]);

  const columnsWithRow: ColumnType[] = useMemo(() => {
    const selectableColumn: ColumnType[] = isSelectable
      ? [
          {
            data: "selectableTable",
            title: "",
            render: rowRenderer((_cell, _row) =>
              selectableProps ? (
                <SelectableCheckbox
                  row={_row}
                  selectableProps={selectableProps}
                  theme={theme}
                />
              ) : null
            ),
            orderable: false,
            width: 50,
            searchable: false,
          },
        ]
      : [];

    return [
      ...selectableColumn,
      {
        data: "id",
        title: mergedTexts.row || "",
        render: rowRenderer(
          (_cell, _row, index?: number) =>
            (Number(currentPage) - 1) * dynamicPageSize + (index! + 1)
        ),
        orderable: true,
        width: 70,
        searchable: false,
      },
      ...columns,
    ];
  }, [
    columns,
    isSelectable,
    selectableProps,
    theme,
    mergedTexts.row,
    currentPage,
  ]);

  // useEffects

  useEffect(() => {
    if (mode === "static") {
      const rows = (props as StaticModeProps).staticRows || [];
      setTableRows(rows);
      setFilteredRows(rows);
      setTotalItems((props as StaticModeProps).totalItems || rows.length);
    }
  }, [
    (props as StaticModeProps).staticRows,
    (props as StaticModeProps).totalItems,
  ]);

  useEffect(() => {
    const handler = () => {
      setCurrentPage(Number(getParams(pageQueryName)) || 1);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [getParams, pageQueryName]);

  useEffect(() => {
    if (mode === "static") {
      setTableRows((props as StaticModeProps).staticRows || []);
      setTotalItems((props as StaticModeProps).totalItems || 0);
    }
  }, [
    (props as StaticModeProps).staticRows,
    (props as StaticModeProps).totalItems,
  ]);

  // useLayoutEffect(() => {
  //   if (!isMobile && autoEnabled) {
  //     const calcSize = () => {
  //       let sumSubtract = 0;
  //       for (const sel of subtractSelectors || []) {
  //         sumSubtract += Number(document.querySelector(sel)?.clientHeight || 0);
  //       }
  //       const availableHeight =
  //         Number(
  //           document.querySelector(containerSelector || "")?.clientHeight || 0
  //         ) - sumSubtract;

  //       const rows = Math.floor(availableHeight / (rowHeight || 51.15));
  //       let buffer = baseBufferRows || 2;
  //       const hasOptional = (optionalSelectorsForExtraBuffer || []).some(
  //         (sel) => Number(document.querySelector(sel)?.clientHeight || 0) > 0
  //       );
  //       if (hasOptional) buffer += extraBufferRows || 1;

  //       const newSize = rows - buffer;
  //       if (newSize > 0) {
  //         setTableHeightPageSize(newSize);
  //         // if (!dynamicPageSize) {
  //         //   setDynamicPageSize(Number(getParams("pageSize")) || newSize);
  //         // }
  //       }
  //     };

  //     calcSize();
  //     const observer = new MutationObserver(calcSize);
  //     observer.observe(document.body, { childList: true, subtree: true });
  //     return () => observer.disconnect();
  //   }
  // }, [isMobile, autoEnabled]);

  useEffect(() => {
    if (mode === "static" && order?.length > 0) {
      const { name, dir } = order[0];

      if (!name) return;

      const sorted = [...(props as StaticModeProps).staticRows].sort((a, b) => {
        const aValue = a[name];
        const bValue = b[name];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "number" && typeof bValue === "number") {
          return dir === "asc" ? aValue - bValue : bValue - aValue;
        }

        return dir === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });

      setTableRows(sorted);
    }
  }, [order, mode, props]);
  // ✅ mode === "external"
  useEffect(() => {
    if (mode === "external") {
      setTableRows((props as ExternalTableProps).externalRows || []);
      setTotalItems((props as ExternalTableProps).totalItems || 0);
    }
  }, [
    mode,
    (props as ExternalTableProps).externalRows,
    (props as ExternalTableProps).totalItems,
  ]);

  // internal api call
  if (mode === "internal") {
    const refreshableCustomBody = Array.isArray(
      props?.internalApiConfig?.customBody
    )
      ? props?.internalApiConfig?.customBody.filter((item) => !item.noRefresh)
      : [];
    useQuery({
      enabled: Boolean(dynamicPageSize && mode === "internal"),
      queryKey: [
        tableName,
        currentPage,
        searchText,
        order,
        refreshableCustomBody,
        dynamicPageSize,
      ],
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      queryFn: async () => {
        try {
          setTableLoading(true);
          const payloadCustomBody = props?.internalApiConfig?.customBody || [];

          const makeCurrentCols = columnsWithRow
            ?.filter((i) => i.data !== null && i.data !== "selectableTable")
            ?.map((item) => ({
              data: item?.data,
              name: item?.data,
              searchable: item?.searchable,
              orderable: item?.orderable,
              search: { value: "", regex: false, fixed: [] },
            }));
          let payload: Record<string, any> = {
            draw: currentPage,
            columns: makeCurrentCols,
            order: order || [],
            start: (currentPage - 1) * dynamicPageSize,
            length: dynamicPageSize,
            search: { value: searchText || "", regex: false, fixed: [] },
          };

          payloadCustomBody.forEach((item) => {
            const { noRefresh, isFilter, ...rest } = item;
            Object.assign(payload, rest);
          });

          const endpoint = props?.internalApiConfig?.endpoint || "";
          const response = await axios({
            method: props?.internalApiConfig?.method || "POST",
            url: props?.internalApiConfig?.baseUrl + endpoint || "" + endpoint,
            data: props?.internalApiConfig?.payload || payload || null,
            headers: props?.internalApiConfig?.headers,
          });

          props?.internalApiConfig?.onFetch?.(response?.data);
          setTableRows(response?.data?.data);
          setTotalItems(response?.data?.recordsFiltered);
          setTableLoading(false);
          if (response?.data?.data === null) {
            notify(response?.data?.message || "null data", "warning");
          }
          return response?.data;
        } catch (error: any) {
          notify(error?.message, "error");
          setTableLoading(false);
        }
      },
    });
  }
  const internalConfig = (props as InternalTableProps).internalApiConfig;

  const activeFilterCount = Array.isArray(internalConfig?.customBody)
    ? internalConfig?.customBody?.reduce((count, item) => {
        if (!item.isFilter) return count;
        const { noRefresh, isFilter, ...rest } = item;
        const hasValue = Object.values(rest).some(
          (val) => val !== null && val !== undefined && val !== ""
        );
        return hasValue ? count + 1 : count;
      }, 0)
    : 0;

  return (
    <div className="table-container" dir={dir}>
      {!isMobile && topFilter && (
        <div
          className={`top-filter-container mb-4 ${topFilterContainerClassName}`}
          id="topFilter"
        >
          {topFilter}
        </div>
      )}

      <div
        id="table-header-actions"
        className={`table-header-actions flex items-end justify-between mb-2 gap-3 w-full`}
      >
        <div className="flex items-end flex-wrap-reverse gap-2 max-md:w-full">
          {!noSearch && (
            <SearchBox
              {...props}
              onSearch={(value) => {
                onSearch?.(value);
                setSearchText(value);
              }}
              onStaticNoSearch={() => {
                setFilteredRows(tableRows);
                setTotalItems(tableRows.length);
              }}
              onStaticSearching={(searched: any) => {
                setFilteredRows(searched);
                setTotalItems(searched.length);
              }}
              tableRows={tableRows}
              currentPage={currentPage}
              dir={dir}
              mergedTexts={mergedTexts}
              theme={theme}
            />
          )}
          {!isMobile && filters && (
            <div
              className={`${filterContainerClassName} filter-container-className`}
            >
              {filters}
            </div>
          )}
        </div>
        {isMobile && (filters || topFilter) && (
          <button
            onClick={() => setOpenFilter(true)}
            style={{
              minHeight: 43,
              background: "#427bd225",
              color: "#427bd2",
            }}
            className="mobile-filter-button relative mr-auto min-w-[70px] text-sm font-bold flex items-center gap-0.5 p-1 justify-center rounded-md"
          >
            {activeFilterCount > 0 && (
              <span
                style={{
                  right: "-10px",
                }}
                className="mobile-filter-badge absolute top-0 bg-white text-xs size-5 content-center rounded-full text-inherit"
              >
                {activeFilterCount}
              </span>
            )}
            {mergedTexts?.filterText}
            <FilterIcon />
          </button>
        )}

        {(actionButtons || !isMobile) && (
          <div className="flex items-center gap-3 flex-wrap max-md:w-full justify-between">
            {actionButtons && actionButtons}
            {!isMobile && (
              <PageSizeSelect
                pageQueryName={pageQueryName}
                textsConfig={mergedTexts}
                theme={theme}
                initialPageSize={tableHeightPageSize}
                pageSize={pageSizeInitial}
                onPageSizeChange={(newSize) => {
                  setDynamicPageSize(newSize);
                  setCurrentPage(1);
                  onPageSizeChange?.(newSize);
                }}
              />
            )}
            {/* {!isMobile && (
              <PageSizeSelect
                pageQueryName={pageQueryName}
                textsConfig={mergedTexts}
                theme={theme}
                // initialPageSize={tableHeightPageSize}
                pageSize={pageSizeInitial}
                onPageSizeChange={(newSize) => {
                  // setDynamicPageSize(newSize);
                  setCurrentPage(1);
                  onPageSizeChange?.(newSize);
                }}
              />
            )} */}
          </div>
        )}
      </div>
      {isMobile ? (
        <MobileTable
          columns={columnsWithRow}
          isLoading={isLoading || tableLoading}
          rows={
            mode === "internal"
              ? tableRows
              : mode === "external"
              ? tableRows
              : paginatedRows
          }
          theme={theme}
          textsConfig={mergedTexts}
          listMode={listMode}
        />
      ) : (
        <>
          <DesktopTable
            rowHeight={`${rowHeight}px` || "51.15px"}
            pageSize={dynamicPageSize}
            maxHeight={
              height
                ? height
                : `calc(${tableHeightPageSize * (rowHeight || 51.15)}px)`
            }
            columns={columnsWithRow}
            isLoading={isLoading || tableLoading}
            rows={
              mode === "internal"
                ? tableRows
                : mode === "external"
                ? tableRows
                : paginatedRows
            }
            // pageSize={pageSizeInitial}
            theme={theme}
            textsConfig={mergedTexts}
            onOrderChange={handleOrderChange}
            onAllSelect={() => {
              if (!selectableProps?.onSelectChange) return;

              const allIds =
                tableRows?.map(
                  (i) => i[selectableProps?.selectedKey as keyof typeof i]
                ) || [];
              const isAllSelected =
                selectableProps.selectedIds?.length === allIds.length;

              selectableProps.onSelectChange(isAllSelected ? [] : allIds);
            }}
          />
        </>
      )}
      <div className="flex items-center gap-2 justify-between">
        {totalItems ? (
          <Pagination
            dir={dir}
            startMobileSize={startMobileSize}
            totalItems={totalItems}
            queryName={pageQueryName}
            pageSize={dynamicPageSize}
            theme={theme}
            textsConfig={mergedTexts}
            currentPage={currentPage}
            onChangePage={onChangePage}
          />
        ) : null}
        {isMobile && (
          <PageSizeSelect
            pageQueryName={pageQueryName}
            textsConfig={mergedTexts}
            theme={theme}
            initialPageSize={tableHeightPageSize}
            pageSize={pageSizeInitial}
            onPageSizeChange={(newSize) => {
              setDynamicPageSize(newSize);
            }}
          />
        )}
      </div>
      <Modal
        size="lg"
        title={mergedTexts?.filterText}
        isOpen={openFilter}
        onClose={() => setOpenFilter(false)}
        className="filter-modal"
        theme={theme}
      >
        <div className="filter-modal-content space-y-2">
          {filters}
          {topFilter}
        </div>
        <div className="filter-modal-actions flex items-center gap-2 mt-8">
          <button
            onClick={() => setOpenFilter(false)}
            style={{ borderColor: theme?.primaryColor }}
            className="flex-1 filter-modal-close-button p-2 rounded-lg bg-transparent border"
          >
            {mergedTexts?.close}
          </button>
          <button
            onClick={() => {
              window.history.replaceState({}, "", window.location.pathname);
              if (removeFilterKey) {
                sessionStorage.removeItem(removeFilterKey);
              }
              if (tableName) {
                sessionStorage.removeItem(`search_${tableName}`);
              }
              location.reload();
            }}
            className="flex-1 p-2 rounded-lg bg-red-500 filter-modal-clear-button text-white flex items-center gap-2 justify-center"
          >
            {mergedTexts?.removeFilterText}
            <TrashIcon />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(Table);
