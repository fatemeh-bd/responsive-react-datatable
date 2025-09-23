import React$1 from 'react';

type OrderType = {
    column: number;
    dir: "asc" | "desc";
    name: string;
} | null;
interface ColorTheme {
    borderColor?: string;
    headerBg?: string;
    headerText?: string;
    rowBorder?: string;
    rowBg?: string;
    cellText?: string;
    primaryColor?: string;
    paginationBg?: string;
    paginationBorderColor?: string;
    paginationActiveColor?: string;
    paginationTextColor?: string;
    paginationDisabledBackgroundColor?: string;
}
interface ColumnType {
    data: string | null;
    title: string;
    render?: (cell?: unknown, row?: Record<string, any>, index?: number) => React.ReactNode;
    width?: number;
    orderable?: boolean;
    searchable?: boolean;
    dontShowTitleInMobile?: boolean;
    dontShowDataInMobile?: boolean;
}
interface TextsConfig {
    row: string;
    noDataText: string;
}
type TableMode = "static" | "external" | "internal";
interface InternalModeProps {
    endpoint: string;
    baseUrl?: string;
    customBody?: Record<string, any>[];
    tableName?: string;
    defaultSortBy?: string;
    sortType?: "asc" | "desc";
    saveSearch?: boolean;
    onFetch?: (data: any) => void;
}
interface StaticModeProps {
    staticRows: any[];
    totalItems: number;
}
interface BaseTableProps {
    mode: TableMode;
    startMobileSize?: number;
    columns: ColumnType[];
    onOrderChange?: (value: any) => void;
    colorTheme?: ColorTheme;
    textsConfig?: TextsConfig;
    lang?: "en" | "fa";
    pageQueryName?: string;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onSortChange?: (order: OrderType) => void;
}
interface Selectable extends BaseTableProps {
    isSelectable: true;
    selectedIds: Array<string | number>;
    selectedKey: string;
    onSelectChange?: (value: any) => void;
}
interface InternalTableProps extends BaseTableProps, InternalModeProps {
    mode: "internal";
}
interface StaticTableProps extends BaseTableProps, StaticModeProps {
    mode: "static";
}
interface ExternalTableProps extends BaseTableProps {
    mode: "external";
}
type TableProps = (InternalTableProps & {
    isSelectable?: false;
}) | (InternalTableProps & Selectable) | (StaticTableProps & {
    isSelectable?: false;
}) | (StaticTableProps & Selectable) | (ExternalTableProps & {
    isSelectable?: false;
}) | (ExternalTableProps & Selectable);

declare const _default: React$1.NamedExoticComponent<TableProps>;

export { _default as default };
