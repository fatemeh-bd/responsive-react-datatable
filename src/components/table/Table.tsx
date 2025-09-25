import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  AutoPageSizeConfig,
  ColorTheme,
  ColumnType,
  ExternalTableProps,
  InternalTableProps,
  OrderType,
  Selectable,
  StaticModeProps,
  TableProps,
} from "./types";
import { useIsMobile } from "./useIsMobile";
import MobileTable from "./MobileTable";
import DesktopTable from "./DesktopTable";
import { rowRenderer } from "./helper";
import Pagination from "./Pagination";
import { useQueryParams } from "./useQueryParams";
import { SelectableCheckbox } from "./SelectableCheckbox";
import { useQuery } from "@tanstack/react-query";
import { CloseIcon, FilterIcon, SearchIcon, TrashIcon } from "./icons";
import axios from "axios";
import PageSizeSelect from "./PageSizeSelect";
import Modal from "./Modal";

const defaultTexts = {
  en: {
    row: "Row",
    noDataText: "No data available",
    firstPaging: "First",
    lastPaging: "Last",
    showing: (from: number, to: number, total: string) =>
      `Showing ${from} to ${to} of ${total} records`,
    searchPlaceholder: "search ...",
    pageSize: "page Size",
  },
  fa: {
    row: "ردیف",
    noDataText: "اطلاعاتی برای نمایش وجود ندارد",
    firstPaging: "اولین",
    lastPaging: "آخرین",
    showing: (from: number, to: number, total: string) =>
      `نمایش ${from} تا ${to} از ${total} رکورد`,
    searchPlaceholder: "جستجو کنید...",
    pageSize: "نمایش",
  },
};
export const defaultSize = 10;

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
    saveSearch = false,
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
    topFilterContainerClassName = "sm:mb-4 flex items-center flex-wrap md:gap-2 gap-3 [&>div]:md:w-[200px] [&>div]:w-full",
    filterContainerClassName = "flex flex-wrap md:gap-2 gap-3 [&>div]:md:w-[200px] [&>div]:w-full",
    removeFilterKey,
  } = props;
  const selectableProps = isSelectable ? (props as Selectable) : undefined;

  const theme: ColorTheme = useMemo(
    () => ({
      borderColor: "#e7e7e7",
      headerBg: "#f9f9f9",
      headerText: "#333333",
      rowBorder: "#e7e7e7",
      rowBg: "#fff",
      cellText: "#7a7a7a",
      primaryColor: "#ffd61f",
      paginationBg: "#fff",
      paginationBorderColor: "#d9d9d9",
      paginationActiveColor: "#ffd61f",
      paginationTextColor: "#333333",
      paginationDisabledBackgroundColor: "#f9f9f9",
      searchBoxBorderColor: "#d9d9d9",
      searchBoxBgColor: "#fff",
      searchBoxTextColor: "#fff",
      errorColor: "#f43f5e",
      ...colorTheme,
    }),
    [colorTheme]
  );

  const mergedTexts = useMemo(
    () => ({ ...defaultTexts[lang], ...textsConfig }),
    [lang, textsConfig]
  );
  const dir = lang === "fa" ? "rtl" : "ltr";

  const defaultAutoConfig: AutoPageSizeConfig = {
    enabled: false,
    containerSelector: "#content-wrapper",
    subtractSelectors: [
      // "#table-header-actions",
      // "#paging",
      // "#topFilter",
    ],
    optionalSelectorsForExtraBuffer: ["#topFilter"],
    rowHeight: 51.15,
    baseBufferRows: 2,
    extraBufferRows: 1,
  };
  const autoConfig = {
    ...defaultAutoConfig,
    ...customAutoPageSizeConfig,
    subtractSelectors: [
      "#table-header-actions",
      // "#paging",
      "#topFilter",
      ...((customAutoPageSizeConfig?.subtractSelectors as string[]) || []),
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

  // hooks
  const isMobile = useIsMobile(startMobileSize);
  const { updateParams, getParams, removeParams } = useQueryParams();
  // states
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    () => Number(getParams(pageQueryName)) || 1
  );
  const [tableRows, setTableRows] = useState<any[]>(
    mode === "static" ? (props as StaticModeProps).staticRows || [] : []
  );
  const [filteredRows, setFilteredRows] = useState<any[]>(tableRows);

  const [totalItems, setTotalItems] = useState<number>(
    mode === "static" ? (props as StaticModeProps).totalItems || 0 : 0
  );
  const pageSizeInitial = Number(getParams("pageSize")) || pageSize;

  const [dynamicPageSize, setDynamicPageSize] = useState(
    isMobile ? pageSizeInitial : autoEnabled ? 0 : pageSizeInitial
  );

  const [tableHeightPageSize, setTableHeightPageSize] = useState(
    isMobile ? pageSizeInitial : autoEnabled ? 0 : pageSize
  );

  const [order, setOrder] = useState<any>([
    {
      column: hasColumnOrder ? 8 : 0,
      dir: mode === "internal" ? props?.internalApiConfig?.sortType : "desc",
      name:
        mode === "internal" ? props?.internalApiConfig?.defaultSortBy : "id",
    },
  ]);
  const [searchValue, setSearchValue] = useState(() => {
    if (saveSearch && tableName) {
      const key = `search_${tableName}`;
      const savedData = sessionStorage.getItem(key);
      if (savedData) {
        try {
          return JSON.parse(savedData).value || "";
        } catch {
          return "";
        }
      }
    }
    return "";
  });

  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

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
    const start = (currentPage - 1) * dynamicPageSize;
    const end = start + dynamicPageSize;
    return filteredRows.slice(start, end);
  }, [filteredRows, currentPage, dynamicPageSize]);
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
        title: mergedTexts.row,
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
      if (!debouncedSearch) {
        setFilteredRows(tableRows);
        setTotalItems(tableRows.length);
      } else {
        const lowered = debouncedSearch.toLowerCase();
        const searched = tableRows.filter((row) =>
          columns.some((col) => {
            if (!col.data || col.searchable === false) return false;
            const val = row[col.data];
            return val?.toString().toLowerCase().includes(lowered);
          })
        );
        setFilteredRows(searched);
        setTotalItems(searched.length);
      }
    }
  }, [debouncedSearch, tableRows, columns, mode]);
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
  useLayoutEffect(() => {
    if (!isMobile && autoEnabled) {
      const calcSize = () => {
        let sumSubtract = 0;
        for (const sel of subtractSelectors || []) {
          sumSubtract += Number(document.querySelector(sel)?.clientHeight || 0);
        }
        const availableHeight =
          Number(
            document.querySelector(containerSelector || "")?.clientHeight || 0
          ) - sumSubtract;

        const rows = Math.floor(availableHeight / (rowHeight || 51.15));
        let buffer = baseBufferRows || 2;
        const hasOptional = (optionalSelectorsForExtraBuffer || []).some(
          (sel) => Number(document.querySelector(sel)?.clientHeight || 0) > 0
        );
        if (hasOptional) buffer += extraBufferRows || 1;

        const newSize = rows - buffer;
        if (newSize > 0) {
          setTableHeightPageSize(newSize);
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
  }, [isMobile, autoEnabled]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
      onSearch?.(searchValue);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue]);

  useEffect(() => {
    if (saveSearch && tableName) {
      const key = `search_${tableName}`;
      sessionStorage.setItem(key, JSON.stringify({ value: searchValue }));
    }
  }, [searchValue, saveSearch, tableName]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
      onSearch?.(searchValue);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue, onSearch]);
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
    const { isFetching } = useQuery({
      enabled: Boolean(dynamicPageSize && mode === "internal"),
      queryKey: [
        tableName,
        currentPage,
        debouncedSearch,
        order,
        dynamicPageSize,
        refreshableCustomBody,
      ],
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      queryFn: async () => {
        try {
          const payloadCustomBody = props?.internalApiConfig?.customBody || [];

          const makeCurrentCols = columnsWithRow
            ?.filter((i) => i.data !== null)
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
            search: { value: debouncedSearch || "", regex: false, fixed: [] },
          };

          payloadCustomBody.forEach((item) => {
            const { noRefresh, isFilter, ...rest } = item;
            Object.assign(payload, rest);
          });

          const endpoint = props?.internalApiConfig?.endpoint || "";
          const response = await axios({
            method: props?.internalApiConfig?.method || "POST",
            url: props?.internalApiConfig?.baseUrl + endpoint || "" + endpoint,
            data: payload || null,
            headers: props?.internalApiConfig?.headers,
          });

          props?.internalApiConfig?.onFetch?.(response?.data);
          setTableRows(response?.data?.data);
          setTotalItems(response?.data?.recordsFiltered);

          return response?.data;
        } catch (error: any) {
          notify(error?.message, "error");
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
        <div className={topFilterContainerClassName} id="topFilter">
          {topFilter}
        </div>
      )}
      <div
        id="table-header-actions"
        className={`table-header-actions mb-2 flex md:items-start justify-between w-full items-center md:gap-2 gap-3 md:flex-wrap-reverse max-md:w-full`}
      >
        {!noSearch && (
          <div className="table-search-container max-md:w-full">
            <div
              style={{ width: 320 }}
              className={`table-search-wrapper flex flex-col gap-1 [&>div]:!gap-1 [&>div]:!flex-row-reverse`}
            >
              <div
                style={{
                  borderColor: theme?.searchBoxBorderColor,
                  backgroundColor: theme?.searchBoxBgColor,
                  color: theme?.searchBoxTextColor,
                }}
                className={`table-search-input-container my-0 flex items-center justify-between gap-3 text-right text-base rounded-lg placeholder:text-sm !outline-none w-full p-2 border focus:border-primary disabled:opacity-70`}
              >
                {searchValue ? (
                  <CloseIcon
                    style={{
                      borderColor: theme?.searchBoxBorderColor,
                      color: searchValue
                        ? theme?.errorColor
                        : theme?.searchBoxBorderColor,
                    }}
                    onClick={() => setSearchValue("")}
                    className={`table-search-clear-icon size-6 font-bold scale-125 cursor-pointer ${
                      dir === "rtl"
                        ? "border-r pr-1 pl-0.5"
                        : "border-l pl-1 pr-0.5"
                    }`}
                  />
                ) : (
                  <SearchIcon
                    style={{
                      borderColor: theme?.searchBoxBorderColor,
                      color: theme?.searchBoxBorderColor,
                    }}
                    className={`table-search-icon size-6 scale-125 opacity-70 ${
                      dir === "rtl"
                        ? "border-r pr-1 pl-0.5"
                        : "border-l pl-1 pr-0.5"
                    }`}
                  />
                )}
                <input
                  type="text"
                  value={searchValue}
                  placeholder={mergedTexts?.searchPlaceholder}
                  className={`table-search-input w-full border-none bg-transparent !outline-none text-sm placeholder:!text-sm max-sm:placeholder:!text-xs`}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    if (currentPage) {
                      removeParams(pageQueryName);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {isMobile && (filters || topFilter) && (
          <button
            onClick={() => setOpenFilter(true)}
            className="relative mr-auto min-w-[70px] text-sm bg-blue/15 font-bold text-blue flex items-center gap-0.5 p-1 min-h-[43px] justify-center rounded-md"
          >
            {activeFilterCount > 0 && (
              <span className="absolute top-0 -right-2.5 bg-white text-xs border-2  border-blue/15 size-5 content-center rounded-full text-black">
                {activeFilterCount}
              </span>
            )}
            فیلتر
            <FilterIcon />
          </button>
        )}
        {!isMobile && filters && (
          <div className={filterContainerClassName}>{filters}</div>
        )}
        {!isMobile && (
          <PageSizeSelect
            text={mergedTexts?.pageSize}
            theme={theme}
            initialPageSize={tableHeightPageSize}
            pageSize={pageSizeInitial}
            onPageSizeChange={(newSize) => {
              setDynamicPageSize(newSize);
              onPageSizeChange?.(newSize);
            }}
          />
        )}
      </div>
      {isMobile ? (
        <MobileTable
          columns={columnsWithRow}
          isLoading={false}
          rows={
            mode === "internal"
              ? tableRows
              : mode === "external"
              ? tableRows
              : paginatedRows
          }
          pageSize={dynamicPageSize}
          theme={theme}
          textsConfig={mergedTexts}
          listMode={listMode}
        />
      ) : (
        <>
          <DesktopTable
            rowHeight={`${rowHeight}px` || "51.15px"}
            maxHeight={
              height
                ? height
                : `calc(${tableHeightPageSize * (rowHeight || 51.15)}px)`
            }
            columns={columnsWithRow}
            isLoading={isLoading}
            rows={
              mode === "internal"
                ? tableRows
                : mode === "external"
                ? tableRows
                : paginatedRows
            }
            pageSize={dynamicPageSize}
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

          <Pagination
            dir={dir}
            startMobileSize={startMobileSize}
            totalItems={totalItems}
            queryName={pageQueryName}
            pageSize={dynamicPageSize}
            theme={theme}
            textsConfig={mergedTexts}
            onChangePage={onChangePage}
          />
        </>
      )}

      <Modal
        size="lg"
        title="فیلتر ها"
        // childrenClass="!h-[80svh]"
        isOpen={openFilter}
        onClose={() => setOpenFilter(false)}
      >
        <div className={filterContainerClassName}>
          {filters}
          {topFilter}
        </div>
        <div className="flex items-center gap-2 mt-8">
          <button onClick={() => setOpenFilter(false)} className="w-full">
            بستن
          </button>
          <button
            onClick={() => {
              // پاک کردن تمام query ها
              window.history.replaceState({}, "", window.location.pathname);

              // اگه کل sessionStorage مرتبط با فیلترها رو هم می‌خوای پاک کنی
              if (removeFilterKey) {
                sessionStorage.removeItem(removeFilterKey);
              }

              // اگه searchValue هم ذخیره میشه، اونم خالی کن
              if (tableName) {
                sessionStorage.removeItem(`search_${tableName}`);
              }

              location.reload();
            }}
          >
            حذف فیلتر ها
            <TrashIcon />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(Table);
