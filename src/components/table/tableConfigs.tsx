import { AutoPageSizeConfig } from "./types";

export const defaultSize = 10;

export const defaultTexts = {
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

export const defaultColorTheme = {
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
};

export const defaultAutoConfig: AutoPageSizeConfig = {
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
