import { AutoPageSizeConfig, ColorTheme, TextsConfig } from "./types";

export const defaultSize = 10;

export const defaultTexts: {
  en: TextsConfig;
  fa: TextsConfig;
} = {
  en: {
    row: "Row",
    noDataText: "No data available",
    firstPaging: "First",
    lastPaging: "Last",
    showing: (from: number, to: number, total: string) =>
      `Showing ${from} to ${to} of ${total} records`,
    searchPlaceholder: "search ...",
    pageSize: "page Size",
    filterText: "filter",
    removeFilterText: "delete filters",
    close: "close",
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
    filterText: "فیلتر",
    removeFilterText: "حذف فیلتر ها",
    close: "بستن",
  },
};

export const defaultColorTheme: ColorTheme = {
  borderColor: "#e7e7e7",
  headerBackgroundColor: "#f9f9f9",
  headerTextColor: "#333333",
  backgroundColor: "#fff",
  cellTextColor: "#7a7a7a",
  primaryColor: "#ffd61f",
};

export const defaultAutoConfig: AutoPageSizeConfig = {
  enabled: false,
  containerSelector: "#content-wrapper",
  subtractSelectors: [
    // "#table-header-actions",
    // "#paging",
    // "#topFilter",
  ],
  // @ts-ignore
  optionalSelectorsForExtraBuffer: ["#topFilter"],
  rowHeight: 51.15,
  baseBufferRows: 2,
  extraBufferRows: 1,
};
