import React, { useEffect, useMemo, useState } from "react";
import {
  ColorTheme,
  ColumnType,
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
const defaultTexts = {
  en: {
    row: "Row",
    noDataText: "No data available",
    firstPaging: "First",
    lastPaging: "Last",
    showing: (from: number, to: number, total: string) =>
      `Showing ${from} to ${to} of ${total} records`,
  },
  fa: {
    row: "ردیف",
    noDataText: "اطلاعاتی برای نمایش وجود ندارد",
    firstPaging: "اولین",
    lastPaging: "آخرین",
    showing: (from: number, to: number, total: string) =>
      `نمایش ${from} تا ${to} از ${total} رکورد`,
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
    pageSize = 20,
    mode,
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
  const { updateParams, getParams } = useQueryParams();
  // states
  const [currentPage, setCurrentPage] = useState(
    () => Number(getParams(pageQueryName)) || 1
  );
  const [tableRows, _setTableRows] = useState<any[]>(
    mode === "static" ? (props as StaticModeProps).staticRows || [] : []
  );
  const [totalItems, _setTotalItems] = useState<number>(
    mode === "static" ? (props as StaticModeProps).totalItems || 0 : 0
  );
  // functions
  const onChangePage = (page: number) => {
    updateParams(pageQueryName, page.toString());
    setCurrentPage(page);
  };

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
            width: 30,
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
  }, [columns, isSelectable, selectableProps, theme, mergedTexts.row]);
  // useEffects
  useEffect(() => {
    const handler = () => {
      setCurrentPage(Number(getParams(pageQueryName)) || 1);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [getParams, pageQueryName]);

  return (
    <div dir={dir}>
      {isMobile ? (
        <MobileTable
          columns={columnsWithRow}
          isLoading={false}
          rows={paginatedRows}
          pageSize={pageSize}
          theme={theme}
          textsConfig={mergedTexts}
        />
      ) : (
        <>
          <DesktopTable
            columns={columnsWithRow}
            isLoading={false}
            rows={paginatedRows}
            pageSize={pageSize}
            theme={theme}
            textsConfig={mergedTexts}
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
