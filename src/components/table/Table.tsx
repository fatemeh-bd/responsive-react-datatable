import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { CgClose, CgSearch } from "react-icons/cg";
import { postMethod } from "./requirements/callApi";
import { numberWithCommas } from "./requirements/utils";
import Pagination from "./Pagination";
import PageSizeSelect from "./PageSizeSelect";
import ResponsiveTable, { OrderType } from "./ResponsiveTable";
import { useIsMobile } from "./requirements/useIsMobile";
import { BiFilterAlt, BiTrash } from "react-icons/bi";
import Modal from "./requirements/Modal";
import MainButton from "./requirements/MainButton";
import Checkbox from "./requirements/CheckBox";
import Input from "./requirements/Input";
import { ColumnType, TableProps } from "./requirements/types";
import mockData from "./mockData.json";
import { getTableCss } from "./tableCss";
import {
  FZTableThemeConfigType,
  FZTableThemeProvider,
} from "./contexts/FZTableThemeContext";

type UpdateOptions = { replace?: boolean };

export const rowRenderer = (
  fn: (cell?: any, row?: any, index?: number) => React.ReactNode
) => {
  return (cell?: any, row?: any, index?: number) => fn(cell, row, index);
};

const getSearchParams = () => {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
};

const updateSearchParams = (params: URLSearchParams, replace = false) => {
  if (typeof window === "undefined") return;

  const qs = params.toString();
  const newUrl = qs
    ? `${window.location.pathname}?${qs}`
    : window.location.pathname;
  if (replace) {
    window.history.replaceState(null, "", newUrl);
  } else {
    window.history.pushState(null, "", newUrl);
  }
};

export const defaultSize = 10;

export interface AutoPageSizeConfig {
  enabled?: boolean;
  containerSelector?: string;
  subtractSelectors?: string[];
  optionalSelectorsForExtraBuffer?: string[];
  rowHeight?: number;
  baseBufferRows?: number;
  extraBufferRows?: number;
}

const defaultAutoConfig: AutoPageSizeConfig = {
  enabled: true,
  containerSelector: "#content-wrapper",
  subtractSelectors: [
    "#filters",
    "#topFilter",
    "#tabPage",
    "#paging",
    "#userCards",
    "#title",
  ],
  optionalSelectorsForExtraBuffer: [
    "#tabPage",
    "#topFilter",
    "#userCards",
    "#title",
  ],
  rowHeight: 51.15,
  baseBufferRows: 2,
  extraBufferRows: 1,
};

interface ExtendedTableProps extends TableProps {
  isTestMode?: boolean;
  themeConfig?: FZTableThemeConfigType;
  autoPageSizeConfig?: AutoPageSizeConfig;
}

const Table: React.FC<ExtendedTableProps> = ({
  columns = [],
  endpoint,
  baseUrl = "BASE_URL",
  customBody = [],
  pageSize = defaultSize,
  height,
  noSearch = false,
  tableName = "table",
  deafaultSortBy = "id",
  onFetch,
  saveSearch = false,
  searchPlaceholder = "جستجو کنید ...",
  sortType = "desc",
  actionButtonsLeft,
  filters,
  topFilter,
  topFilterContainerClassName = "sm:mb-4 flex items-center flex-wrap md:gap-2 gap-3 [&>div]:md:w-[200px] [&>div]:w-full",
  filterContainerClassName = "flex flex-wrap md:gap-2 gap-3 [&>div]:md:w-[200px] [&>div]:w-full",
  isSelectable = false,
  selectedIds,
  onSelectChange,
  selectedKey = "id",
  removeFilterKey,
  hasColumnOrder,
  isTestMode = false,
  themeConfig,
  autoPageSizeConfig: customAutoPageSizeConfig,
}) => {
  const autoConfig = { ...defaultAutoConfig, ...customAutoPageSizeConfig };

  const {
    enabled: autoEnabled,
    containerSelector,
    subtractSelectors,
    optionalSelectorsForExtraBuffer,
    rowHeight = defaultAutoConfig.rowHeight,
    baseBufferRows,
    extraBufferRows,
  } = autoConfig;

  const searchParams = getSearchParams();

  const setSearchParams = useCallback(
    (
      updater: (prev: URLSearchParams) => URLSearchParams,
      options?: UpdateOptions
    ) => {
      const newParams = updater(getSearchParams());
      updateSearchParams(newParams, options?.replace);
    },
    []
  );

  const pageSizeInitial = Number(searchParams?.get("pageSize")) || pageSize;
  const isMobile = useIsMobile();

  const [dynamicPageSize, setDynamicPageSize] = useState(
    isMobile ? pageSizeInitial : 0
  );
  const [tableHeightPageSize, setTableHeightPageSize] = useState(
    isMobile ? pageSizeInitial : 0
  );
  const pageNum = searchParams?.get("page") || 1;
  const [searchValue, setSearchValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [pageSizeState, setPageSizeState] = useState(pageSizeInitial);
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
  const [order, setOrder] = useState<any>([
    {
      column: hasColumnOrder ? 8 : 0,
      dir: sortType,
      name: deafaultSortBy,
    },
  ]);

  const [tableRows, setTableRows] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // columnsWithRow memo
  const columnsWithRow = useMemo<ColumnType[]>(() => {
    return [
      {
        data: "id",
        title: "ردیف",
        render: rowRenderer((_cell, _row, index?: number) => {
          return (
            <span className="flex items-center gap-1 flex-wrap justify-center">
              {isSelectable && (
                <Checkbox
                  checked={selectedIds?.includes(_row?.[selectedKey])}
                  value={_row?.[selectedKey]}
                  onChange={() => handleCheckboxChange(_row)}
                />
              )}
              {!isMobile &&
                (Number(pageNum) - 1) * dynamicPageSize + (index! + 1)}
            </span>
          );
        }),
        orderable: true,
        width: isSelectable ? 75 : 70,
        searchable: false,
        dontShowTitleInMobile: true,
      },
      ...columns,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columns,
    isSelectable,
    selectedIds,
    selectedKey,
    isMobile,
    pageNum,
    dynamicPageSize,
    endpoint,
  ]);

  // checkbox handler depends on selectedIds etc
  const handleCheckboxChange = useCallback(
    (row: any) => {
      const id = row?.[selectedKey];
      if (!id) return;

      if (selectedIds?.includes(id)) {
        onSelectChange?.(selectedIds.filter((i) => i !== id));
      } else {
        onSelectChange?.([...(selectedIds || []), id]);
      }
    },
    [selectedIds, onSelectChange, selectedKey]
  );

  const handleOrderChange = useCallback((newOrder: OrderType) => {
    setOrder(newOrder ? [newOrder] : []);
  }, []);

  const refreshableCustomBody = Array.isArray(customBody)
    ? customBody.filter((item) => !item.noRefresh)
    : [];
  const payloadCustomBody = customBody || [];

  // fetchTableData
  const fetchTableData = useCallback(async () => {
    try {
      setIsFetching(true);
      setError(null);

      if (isTestMode) {
        const filteredData = mockData.data.filter((row) =>
          debouncedSearch
            ? Object.values(row).some((value) =>
                String(value)
                  .toLowerCase()
                  .includes(debouncedSearch.toLowerCase())
              )
            : true
        );

        const start = (Number(pageNum) - 1) * pageSizeState;
        const end = start + pageSizeState;
        const paginatedData = filteredData.slice(start, end);

        const response = {
          data: paginatedData,
          recordsFiltered: filteredData.length,
          recordsTotal: mockData.data.length,
        };

        onFetch?.(response);
        setTableRows(response);
        return;
      }

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
        draw: Number(pageNum),
        columns: makeCurrentCols,
        order: order || [],
        start: (Number(pageNum) - 1) * pageSizeState,
        length: pageSizeState,
        search: { value: debouncedSearch || "", regex: false, fixed: [] },
      };

      payloadCustomBody.forEach((item) => {
        const { noRefresh, isFilter, ...rest } = item;
        Object.assign(payload, rest);
      });

      if (openFilter) {
        setOpenFilter(false);
      }

      const response = await postMethod(
        endpoint,
        payload,
        undefined,
        undefined,
        baseUrl
      );
      onFetch?.(response);
      setTableRows(response);
    } catch (error: any) {
      setError(error?.message || "خطا در دریافت داده‌ها");
      // keep console.error for developer debugging
      console.error("API Error:", error);
    } finally {
      setIsFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageNum,
    debouncedSearch,
    order,
    pageSizeState,
    endpoint,
    baseUrl,
    isTestMode,
    JSON.stringify(refreshableCustomBody),
  ]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue]);

  // save/load search in session storage
  useEffect(() => {
    if (saveSearch && tableName) {
      const key = `search_${tableName}`;
      const savedData = sessionStorage.getItem(key);
      if (savedData) {
        const { value } = JSON.parse(savedData);
        setSearchValue(value);
        setDebouncedSearch(value);
      }
    }
  }, [saveSearch, tableName]);

  useEffect(() => {
    if (saveSearch && tableName) {
      const key = `search_${tableName}`;
      sessionStorage.setItem(key, JSON.stringify({ value: searchValue }));
    }
  }, [searchValue, saveSearch, tableName]);

  // active filter count
  const activeFilterCount = Array.isArray(customBody)
    ? customBody.reduce((count, item) => {
        if (!item.isFilter) return count;
        const { noRefresh, isFilter, ...rest } = item;
        const hasValue = Object.values(rest).some(
          (val) => val !== null && val !== undefined && val !== ""
        );
        return hasValue ? count + 1 : count;
      }, 0)
    : 0;

  // auto page size calculation (useLayoutEffect)
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
          setTableHeightPageSize(newSize); // for height calc
          if (!dynamicPageSize) {
            setDynamicPageSize(
              Number(getSearchParams()?.get("pageSize")) || newSize
            );
            setPageSizeState(
              Number(getSearchParams()?.get("pageSize")) || newSize
            );
          }
        }
      };

      calcSize();
      const observer = new MutationObserver(calcSize);
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, isMobile, JSON.stringify(autoConfig)]);

  // sync dynamic page size effect: when user changes page size via control, update pageSizeState
  useEffect(() => {
    if (dynamicPageSize && dynamicPageSize !== pageSizeState) {
      setPageSizeState(dynamicPageSize);
    }
  }, [dynamicPageSize, pageSizeState]);

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">خطا: {error}</p>
        <button
          onClick={fetchTableData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <FZTableThemeProvider config={themeConfig}>
      <style>{getTableCss(themeConfig)}</style>
      <div>
        {!isMobile && topFilter && (
          <div className={topFilterContainerClassName} id="topFilter">
            {topFilter}
          </div>
        )}
        <div
          id="filters"
          className={`flex items-start gap-2 justify-between mb-2 max-md:items-center flex-wrap-reverse`}
        >
          <div
            className={`flex md:items-start items-center md:gap-2 gap-3 w-fit md:flex-wrap-reverse max-md:w-full`}
          >
            {!noSearch && (
              <div className="max-md:w-full">
                <Input
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    if (getSearchParams()?.get("page")) {
                      setSearchParams(
                        (prev) => {
                          const newParams = new URLSearchParams(prev);
                          newParams.delete("page");
                          return newParams;
                        },
                        { replace: true }
                      );
                    }
                  }}
                  placeholder={searchPlaceholder}
                  icon={
                    searchValue ? (
                      <CgClose
                        onClick={() => setSearchValue("")}
                        className="size-5 text-error font-bold scale-150 cursor-pointer border-gray-300 border-r pr-1"
                      />
                    ) : (
                      <CgSearch className="size-5 scale-150 opacity-70 border-r border-gray-300 pr-1" />
                    )
                  }
                  className="md:!w-[320px] !w-full [&>div]:!gap-1 [&>div]:!flex-row-reverse"
                  inputClassName="placeholder:!text-[10.5pt] max-sm:placeholder:!text-[9pt]"
                />
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
                <BiFilterAlt />
              </button>
            )}
            {!isMobile && filters && (
              <div className={filterContainerClassName}>{filters}</div>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap max-sm:w-full justify-between">
            {actionButtonsLeft && actionButtonsLeft}
            {!isMobile && (
              <PageSizeSelect
                initialPageSize={tableHeightPageSize}
                pageSize={pageSizeInitial}
                onPageSizeChange={(newSize) => {
                  setDynamicPageSize(newSize);
                  // update URL params
                  setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set("pageSize", String(newSize));
                    return newParams;
                  });
                }}
              />
            )}
          </div>
        </div>

        <ResponsiveTable
          columns={columnsWithRow}
          isLoading={isFetching}
          rows={tableRows?.data || []}
          pageSize={dynamicPageSize || pageSizeState || pageSize}
          maxHeight={
            height
              ? height
              : `calc(${
                  (tableHeightPageSize || pageSizeState || pageSize) *
                  (rowHeight || 51.15)
                }px)`
          }
          onOrderChange={handleOrderChange}
        />

        <div
          className="max-md:flex items-start justify-between gap-4 flex-wrap w-full"
          id="paging"
        >
          <div className="flex items-center max-sm:justify-center justify-between gap-2 md:mt-2 flex-wrap-reverse">
            <Pagination
              totalItems={tableRows?.recordsFiltered || 0}
              pageSize={dynamicPageSize || pageSizeState || pageSize}
            />
            {tableRows?.recordsFiltered > 0 && !isMobile && (
              <p className="sm:mr-auto w-fit font-medium">
                نمایش{" "}
                {(Number(pageNum) - 1) *
                  (dynamicPageSize || pageSizeState || pageSize) +
                  1}{" "}
                تا{" "}
                {Math.min(
                  Number(pageNum) *
                    (dynamicPageSize || pageSizeState || pageSize),
                  tableRows?.recordsFiltered
                )}{" "}
                از {numberWithCommas(tableRows?.recordsFiltered)} رکورد
              </p>
            )}
          </div>
          {isMobile && tableRows?.data?.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap justify-center md:mt-4">
              <PageSizeSelect
                initialPageSize={tableHeightPageSize}
                pageSize={pageSizeInitial}
                onPageSizeChange={(newSize) => {
                  setDynamicPageSize(newSize);
                }}
              />
            </div>
          )}
        </div>

        <Modal
          size="lg"
          title="فیلتر ها"
          isOpen={openFilter}
          onClose={() => setOpenFilter(false)}
        >
          <div className={filterContainerClassName}>
            {filters}
            {topFilter}
          </div>
          <div className="flex items-center gap-2 mt-8">
            <MainButton onClick={() => setOpenFilter(false)} full>
              بستن
            </MainButton>
            <MainButton
              full
              theme="error"
              outline
              Icon={BiTrash}
              onClick={() => {
                // remove all params
                setSearchParams(() => {
                  const newParams = getSearchParams();
                  Array.from(newParams.keys()).forEach((key) =>
                    newParams.delete(key)
                  );
                  return newParams;
                });

                if (removeFilterKey) {
                  sessionStorage.removeItem(removeFilterKey);
                }

                location.reload();
              }}
            >
              حذف فیلتر ها
            </MainButton>
          </div>
        </Modal>
      </div>
    </FZTableThemeProvider>
  );
};

export default React.memo(Table);
