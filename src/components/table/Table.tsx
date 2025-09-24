import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ColorTheme,
  ColumnType,
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
import { CloseIcon, SearchIcon } from "./icons";
import axios from "axios";
const defaultTexts = {
  en: {
    row: "Row",
    noDataText: "No data available",
    firstPaging: "First",
    lastPaging: "Last",
    showing: (from: number, to: number, total: string) =>
      `Showing ${from} to ${to} of ${total} records`,
    searchPlaceholder: "search ...",
  },
  fa: {
    row: "ردیف",
    noDataText: "اطلاعاتی برای نمایش وجود ندارد",
    firstPaging: "اولین",
    lastPaging: "آخرین",
    showing: (from: number, to: number, total: string) =>
      `نمایش ${from} تا ${to} از ${total} رکورد`,
    searchPlaceholder: "جستجو کنید...",
  },
};

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
    pageSize = 8,
    mode,
    hasColumnOrder,
    noSearch,
    saveSearch,
    notify,
  } = props;
  const selectableProps = isSelectable ? (props as Selectable) : undefined;

  const theme: ColorTheme = useMemo(
    () => ({
      borderColor: "#e7e7e7",
      headerBg: "#f9f9f9",
      headerText: "#333333",
      rowBorder: "#e7e7e7",
      rowBg: "#fff",
      cellText: "#333333",
      primaryColor: "#ffd61f",
      paginationBg: "#fff",
      paginationBorderColor: "#d9d9d9",
      paginationActiveColor: "#ffd61f",
      paginationTextColor: "#333333",
      paginationDisabledBackgroundColor: "#f9f9f9",
      searchBoxBorderColor: "#d9d9d9",
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

  // hooks
  const isMobile = useIsMobile(startMobileSize);
  const { updateParams, getParams, removeParams } = useQueryParams();
  // states
  const [currentPage, setCurrentPage] = useState(
    () => Number(getParams(pageQueryName)) || 1
  );
  const [tableRows, setTableRows] = useState<any[]>(
    mode === "static" ? (props as StaticModeProps).staticRows || [] : []
  );
  const [totalItems, setTotalItems] = useState<number>(
    mode === "static" ? (props as StaticModeProps).totalItems || 0 : 0
  );
  const [order, setOrder] = useState<any>([
    {
      column: hasColumnOrder ? 8 : 0,
      dir: mode === "internal" ? props?.internalApiConfig?.sortType : "desc",
      name:
        mode === "internal" ? props?.internalApiConfig?.defaultSortBy : "id",
    },
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  // functions
  const onChangePage = (page: number) => {
    updateParams(pageQueryName, page.toString());
    setCurrentPage(page);
  };
  const handleOrderChange = useCallback((newOrder: OrderType) => {
    setOrder(newOrder ? [newOrder] : []);
  }, []);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return tableRows.slice(start, end);
  }, [tableRows, currentPage, pageSize]);

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
            (Number(currentPage) - 1) * pageSize + (index! + 1)
        ),
        orderable: true,
        width: 70,
        searchable: false,
        dontShowTitleInMobile: true,
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue]);
  useEffect(() => {
    if (
      mode === "internal" &&
      saveSearch &&
      props.internalApiConfig?.tableName
    ) {
      const key = `search_${props.internalApiConfig.tableName}`;
      const savedData = sessionStorage.getItem(key);
      if (savedData) {
        const { value } = JSON.parse(savedData);
        setSearchValue(value);
        setDebouncedSearch(value);
      }
    }
  }, [mode, saveSearch, props]);

  useEffect(() => {
    if (
      mode === "internal" &&
      saveSearch &&
      props?.internalApiConfig?.tableName
    ) {
      const key = `search_${props?.internalApiConfig?.tableName}`;
      sessionStorage.setItem(key, JSON.stringify({ value: searchValue }));
    }
  }, [searchValue, saveSearch, props?.mode]);
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

  // internal api call
  if (mode === "internal") {
    const refreshableCustomBody = Array.isArray(
      props?.internalApiConfig?.customBody
    )
      ? props?.internalApiConfig?.customBody.filter((item) => !item.noRefresh)
      : [];
    const { isFetching } = useQuery({
      enabled: Boolean(pageSize && mode === "internal"),
      queryKey: [
        props?.internalApiConfig?.tableName,
        currentPage,
        debouncedSearch,
        order,
        pageSize,
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
            start: (currentPage - 1) * pageSize,
            length: pageSize,
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
  return (
    <div dir={dir}>
      <div
        className={`mb-2 flex md:items-start items-center md:gap-2 gap-3 w-fit md:flex-wrap-reverse max-md:w-full`}
      >
        {!noSearch && (
          <div className="max-md:w-full">
            <div
              className={`flex flex-col gap-1 md:!w-[320px] !w-full [&>div]:!gap-1 [&>div]:!flex-row-reverse`}
            >
              <div
                style={{ borderColor: theme?.searchBoxBorderColor }}
                className={`my-0 flex items-center justify-between  gap-3 text-right text-base bg-white rounded-lg placeholder:text-sm !outline-none w-full p-2 border focus:border-primary disabled:opacity-70`}
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
                    className={`size-6 font-bold scale-125 cursor-pointer ${
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
                    className={`size-6 scale-125 opacity-70 ${
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
                  className={`w-full border-none bg-transparent !outline-none placeholder:!text-[10.5pt] max-sm:placeholder:!text-[9pt]`}
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
      </div>
      {isMobile ? (
        <MobileTable
          columns={columnsWithRow}
          isLoading={false}
          rows={mode === "internal" ? tableRows : paginatedRows}
          pageSize={pageSize}
          theme={theme}
          textsConfig={mergedTexts}
        />
      ) : (
        <>
          <DesktopTable
            columns={columnsWithRow}
            isLoading={false}
            rows={mode === "internal" ? tableRows : paginatedRows}
            pageSize={pageSize}
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
            pageSize={pageSize}
            theme={theme}
            textsConfig={mergedTexts}
            onChangePage={onChangePage}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(Table);
