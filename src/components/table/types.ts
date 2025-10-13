import { ReactNode } from "react";

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
}

export interface DesktopTableProps {
  columns: ColumnType[];
  rows: Record<string, any>[];
  pageSize: number;
  maxHeight?: string;
  isLoading?: boolean;
  colorTheme?: ColorTheme;
}

export interface ColumnType {
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
  totalItems: number;
}
export interface AutoPageSizeConfig {
  enabled?: boolean;
  containerSelector?: string;
  subtractSelectors?: string[];
  // optionalSelectorsForExtraBuffer?: string[];
  rowHeight?: number;
  baseBufferRows?: number;
  // extraBufferRows?: number;
}
export interface BaseTableProps {
  mode: TableMode;
  startMobileSize?: number;
  columns: ColumnType[];
  colorTheme?: ColorTheme;
  textsConfig?: TextsConfig;
  lang?: "en" | "fa";
  pageQueryName?: string;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (order: OrderType) => void;
  onSearch?: (value: string) => void;
  onPageSizeChange?: (order: number) => void;
  height?: string;
  hasColumnOrder?: boolean;
  noSearch?: boolean;
  saveSearch?: boolean;
  notify?: (text: string, type: "error" | "success" | "warning") => void;
  isLoading?: boolean;
  autoPageSizeConfig?: AutoPageSizeConfig;
  listMode?: boolean;
  tableName: string;
  filters?: ReactNode;
  topFilter?: ReactNode;
  filterContainerClassName?: string;
  topFilterContainerClassName?: string;
  removeFilterKey?: string;
  actionButtons?: ReactNode;
  noPageSize?: boolean;
}

export interface Selectable extends BaseTableProps {
  isSelectable: boolean;
  selectedIds: Array<string | number>;
  selectedKey: string;
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
