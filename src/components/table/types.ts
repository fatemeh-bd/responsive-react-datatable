import { ReactNode, type CSSProperties } from "react";

export interface PaginationProps {
  totalItems: number;
  pageSize: number;
  queryName?: string;
}
export type OrderType = {
  column: number;
  dir: "asc" | "desc";
  name: string;
} | null;
export interface ColorTheme {
  borderColor?: string;
  headerBackgroundColor?: string;
  backgroundColor?: string;
  headerTextColor?: string;
  cellTextColor?: string;
  primaryColor?: string;
  primaryTextColor?: string;
}
export type TableTheme = "light" | "dark" | `#${string}`;

export interface DesktopTableProps {
  columns: ColumnType[];
  rows: Record<string, any>[];
  pageSize: number;
  maxHeight?: string;
  isLoading?: boolean;
  colorTheme?: ColorTheme;
}

export interface ColumnType {
  /** Stable ID for visibility controls; defaults to data or column-{index}. */
  id?: string;
  hidden?: boolean;
  hideable?: boolean;
  exportable?: boolean;
  exportValue?: (row: any) => ExportCellValue;
  data: string | null;
  title: string;
  render?: (
    cell?: unknown,
    row?: Record<string, any>,
    index?: number
  ) => React.ReactNode;
  width?: number;
  orderable?: boolean;
  searchable?: boolean;
  dontShowTitleInMobile?: boolean;
  dontShowDataInMobile?: boolean;
}
export interface TextsConfig {
  row?: string;
  noDataText?: string;
  errorText?: string;
  retryText?: string;
  columnsText?: string;
  exportText?: string;
  exportScopeText?: string;
  exportFilteredText?: string;
  exportPageText?: string;
  exportSelectedText?: string;
  exportVisibleText?: string;
  exportingText?: string;
  exportErrorText?: string;
  exportLoadedText?: string;
  expandRowText?: string;
  collapseRowText?: string;
  rowDetailsText?: string;
  searchPlaceholder?: string;
  firstPaging?: string;
  lastPaging?: string;
  filterText?: string;
  showing?: (from: number, to: number, total: string) => string;
  pageSize?: string;
  removeFilterText?: string;
  close?: string;
}
export type TableMode = "static" | "external" | "internal";
export type RowId = string | number;
export type ExportFormat = "csv" | "xlsx" | "pdf";
export type ExportScope = "filtered" | "page" | "selected";
export type ExportCellValue = string | number | boolean | Date | null | undefined;
export interface ExportContext {
  scope: ExportScope;
  search: string;
  order: OrderType;
  page: number;
  pageSize: number;
  selectedIds: RowId[];
}
export interface ExportConfig {
  formats?: ExportFormat[];
  fileName?: string;
  scope?: ExportScope;
  includeHiddenColumns?: boolean;
  /** Fetch all required rows in server modes; called only when exporting. */
  getRows?: (context: ExportContext) => any[] | Promise<any[]>;
  onError?: (error: Error) => void;
}
export interface ExpandableRowsConfig {
  render: (row: any, index: number) => ReactNode;
  canExpand?: (row: any) => boolean;
  expandedRowIds?: RowId[];
  defaultExpandedRowIds?: RowId[];
  onExpandedChange?: (ids: RowId[]) => void;
}

export interface CustomBody {
  noRefresh?: boolean;
  isFilter?: boolean;
  [key: string]: string | number | boolean | null | undefined | Object;
}
export interface InternalModeProps {
  internalApiConfig: {
    endpoint: string;
    baseUrl?: string;
    payload?: any;
    customBody?: CustomBody[];
    defaultSortBy?: string;
    sortType?: "asc" | "desc";
    saveSearch?: boolean;
    onFetch?: (data: any) => void;
    method?: "POST" | "GET";
    headers?: Record<string, string>;
  };
}

export interface StaticModeProps {
  staticRows: any[];
  totalItems?: number;
}
export interface AutoPageSizeConfig {
  enabled?: boolean;
  containerSelector?: string;
  subtractSelectors?: string[];
  optionalSelectorsForExtraBuffer?: string[];
  rowHeight?: number;
  baseBufferRows?: number;
  extraBufferRows?: number;
}
export interface BaseTableProps {
  mode: TableMode;
  startMobileSize?: number;
  columns: ColumnType[];
  colorTheme?: ColorTheme;
  theme?: TableTheme;
  className?: string;
  style?: CSSProperties;
  textsConfig?: TextsConfig;
  lang?: "en" | "fa";
  pageQueryName?: string;
  pageSizeQueryName?: string;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (order: OrderType) => void;
  onSearch?: (value: string) => void;
  onPageSizeChange?: (order: number) => void;
  height?: string;
  columnNumber?: number;
  noSearch?: boolean;
  saveSearch?: boolean;
  notify?: (text: string, type: "error" | "success" | "warning") => void;
  isLoading?: boolean;
  autoPageSizeConfig?: AutoPageSizeConfig;
  listMode?: boolean;
  tableName?: string;
  filters?: ReactNode;
  topFilter?: ReactNode;
  filterContainerClassName?: string;
  topFilterContainerClassName?: string;
  removeFilterKey?: string;
  onClearFilters?: () => void;
  actionButtons?: ReactNode;
  noPageSize?: boolean;
  rowClassName?: (row: any) => string | undefined | void;
  rowKey?: string | ((row: any) => string | number);
  columnVisibility?: boolean;
  hiddenColumnIds?: string[];
  defaultHiddenColumnIds?: string[];
  onHiddenColumnsChange?: (ids: string[]) => void;
  exportConfig?: boolean | ExportConfig;
  expandableRows?: ExpandableRowsConfig;
}

export interface Selectable extends BaseTableProps {
  isSelectable: boolean;
  selectedIds: Array<string | number>;
  selectedKey?: string;
  onSelectChange?: (value: any) => void;
}

// حالت internal
export interface InternalTableProps extends BaseTableProps, InternalModeProps {
  mode: "internal";
}

// حالت static
export interface StaticTableProps extends BaseTableProps, StaticModeProps {
  mode: "static";
}

// حالت external (بدون پراپس اضافی)
export interface ExternalTableProps extends BaseTableProps {
  mode: "external";
  externalRows: any[];
  totalItems: number;
  isLoading?: boolean;
}

// union نهایی با قابلیت انتخابی بودن ردیف‌ها
export type TableProps =
  | (InternalTableProps & { isSelectable?: false })
  | (InternalTableProps & Selectable)
  | (StaticTableProps & { isSelectable?: false })
  | (StaticTableProps & Selectable)
  | (ExternalTableProps & { isSelectable?: false })
  | (ExternalTableProps & Selectable);
