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
  headerBg?: string;
  headerText?: string;
  rowBorder?: string;
  rowBg?: string;
  cellText?: string;
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
  row: string;
  noDataText: string;
}
export interface BaseTableProps {
  startMobileSize?: number;
  columns: ColumnType[];
  onOrderChange?: (value: any) => void;
  colorTheme?: ColorTheme;
  lang?: "en" | "fa";
  textsConfig?: TextsConfig;
}

interface NonSelectable extends BaseTableProps {
  isSelectable?: false;
}

export interface Selectable extends BaseTableProps {
  isSelectable: true;
  selectedIds: Array<string | number>;
  selectedKey: string;
  onSelectChange?: (value: any) => void;
}

export type TableProps = NonSelectable | Selectable;
