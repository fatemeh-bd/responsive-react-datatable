import React, { useCallback, useMemo } from "react";
import {
  ColorTheme,
  ColumnType,
  Selectable,
  TableProps,
  TextsConfig,
} from "./types";
import { useIsMobile } from "./useIsMobile";
import MobileTable from "./MobileTable";
import DesktopTable from "./DesktopTable";
import { rowRenderer } from "./helper";
import Checkbox from "./CheckBox";
import mock from "./mockData.json";
import Pagination from "./Pagination";
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
  } = props;
  const selectableProps = isSelectable ? (props as Selectable) : undefined;
  // default configs
  const defaultColorTheme: ColorTheme = {
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
  };

  const theme: ColorTheme = { ...defaultColorTheme, ...colorTheme };
  const mergedTexts = { ...defaultTexts[lang], ...textsConfig };
  const dir = lang === "fa" ? "rtl" : "ltr";
  // hooks
  const isMobile = useIsMobile(startMobileSize);
  // functions
  const handleCheckboxChange = useCallback(
    (row: any) => {
      if (!selectableProps) return;

      const { selectedIds, selectedKey, onSelectChange } = selectableProps;
      const id = row?.[selectedKey];
      if (!id) return;

      if (selectedIds?.includes(id)) {
        onSelectChange?.(selectedIds.filter((i) => i !== id));
      } else {
        onSelectChange?.([...(selectedIds || []), id]);
      }
    },
    [selectableProps]
  );
  const columnsWithRow = useMemo<ColumnType[]>(() => {
    return [
      ...(isSelectable
        ? [
            {
              data: "selectableTable",
              title: "",
              render: rowRenderer((_cell, _row) => {
                return (
                  selectableProps && (
                    <Checkbox
                      className="mx-auto justify-center"
                      primaryColor={theme.primaryColor}
                      checked={selectableProps.selectedIds?.includes(
                        _row?.[selectableProps.selectedKey]
                      )}
                      value={_row?.[selectableProps.selectedKey]}
                      onChange={() => handleCheckboxChange(_row)}
                    />
                  )
                );
              }),
              orderable: false,
              width: 30,
              searchable: false,
            },
          ]
        : []),
      {
        data: "id",
        title: mergedTexts.row,
        render: rowRenderer((_cell, _row, index?: number) => index! + 1),
        orderable: true,
        width: 70,
        searchable: false,
        dontShowTitleInMobile: true,
      },
      ...columns,
    ];
  }, [columns, selectableProps, isMobile, handleCheckboxChange]);

  return (
    <div dir={dir}>
      {isMobile ? (
        <MobileTable
          columns={columnsWithRow}
          isLoading={false}
          rows={mock.data}
          pageSize={10}
          theme={theme}
          textsConfig={mergedTexts}
        />
      ) : (
        <>
          <DesktopTable
            columns={columnsWithRow}
            isLoading={false}
            rows={mock.data}
            pageSize={10}
            theme={theme}
            textsConfig={mergedTexts}
            onAllSelect={() => {
              if (!selectableProps?.onSelectChange) return;

              const allIds =
                mock.data?.map(
                  (i) => i[selectableProps.selectedKey as keyof typeof i]
                ) || [];
              const isAllSelected =
                selectableProps.selectedIds?.length === allIds.length;

              selectableProps.onSelectChange(isAllSelected ? [] : allIds);
            }}
          />

          <Pagination
            dir={dir}
            startMobileSize={startMobileSize}
            totalItems={mock.recordsFiltered}
            queryName={pageQueryName}
            pageSize={12}
            theme={theme}
            textsConfig={mergedTexts}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(Table);
