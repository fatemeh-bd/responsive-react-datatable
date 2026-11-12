import { AutoPageSizeConfig, ColorTheme, TextsConfig } from "./types";

export const defaultSize = 10;

export const defaultTexts: {
  en: TextsConfig;
  fa: TextsConfig;
} = {
  en: {
    row: "Row",
    noDataText: "No data available",
    errorText: "Unable to load data",
    retryText: "Try again",
    columnsText: "Columns", exportText: "Export", exportScopeText: "Rows to export",
    exportFilteredText: "All filtered rows", exportPageText: "Current page", exportSelectedText: "Selected rows",
    exportVisibleText: "Visible columns only", exportingText: "Preparing your file…",
    exportErrorText: "The file could not be created. Please try again.",
    exportLoadedText: "Only loaded rows are available. Selected rows on other pages are not included.",
    expandRowText: "Expand row", collapseRowText: "Collapse row", rowDetailsText: "Row details",
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
    errorText: "دریافت اطلاعات ناموفق بود",
    retryText: "تلاش دوباره",
    columnsText: "ستون‌ها", exportText: "خروجی", exportScopeText: "ردیف‌های خروجی",
    exportFilteredText: "همهٔ ردیف‌های فیلترشده", exportPageText: "صفحهٔ فعلی", exportSelectedText: "ردیف‌های انتخاب‌شده",
    exportVisibleText: "فقط ستون‌های قابل نمایش", exportingText: "در حال آماده‌سازی فایل…",
    exportErrorText: "ساخت فایل ناموفق بود. دوباره تلاش کنید.",
    exportLoadedText: "فقط داده‌های بارگذاری‌شده در دسترس‌اند؛ انتخاب‌های صفحات دیگر در خروجی نیستند.",
    expandRowText: "نمایش جزئیات ردیف", collapseRowText: "بستن جزئیات ردیف", rowDetailsText: "جزئیات ردیف",
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

export const lightColorTheme: ColorTheme = {
  borderColor: "#e7e7e7",
  headerBackgroundColor: "#f9f9f9",
  headerTextColor: "#171717",
  backgroundColor: "#fff",
  cellTextColor: "#525252",
  primaryColor: "#262626",
};
export const darkColorTheme: ColorTheme = {
  borderColor: "#545454", headerBackgroundColor: "#272727", backgroundColor: "#121212",
  headerTextColor: "#ffffff", cellTextColor: "#f5f5f5", primaryColor: "#d4d4d4",
};
export const defaultColorTheme = lightColorTheme;

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
