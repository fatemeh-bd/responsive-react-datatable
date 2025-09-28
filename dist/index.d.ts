import * as React$1 from 'react';
import React__default, { ReactNode } from 'react';

type OrderType = {
    column: number;
    dir: "asc" | "desc";
    name: string;
} | null;
interface ColorTheme {
    borderColor?: string;
    headerBackgroundColor?: string;
    rowBackgroundColor?: string;
    headerTextColor?: string;
    cellTextColor?: string;
    primaryColor?: string;
    paginationBackgroundColor?: string;
    paginationBorderColor?: string;
    searchBoxBgColor?: string;
    errorColor?: string;
    filterTextColor?: string;
    filterBackgroundColor?: string;
    modalBackgroundColor?: string;
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
    row?: string;
    noDataText?: string;
    searchPlaceholder?: string;
    firstPaging?: string;
    lastPaging?: string;
    filterText?: string;
    showing: (from: number, to: number, total: string) => string;
    pageSize?: string;
    removeFilterText?: string;
    close?: string;
}
type TableMode = "static" | "external" | "internal";
interface InternalModeProps {
    internalApiConfig: {
        endpoint: string;
        baseUrl?: string;
        payload?: any;
        customBody?: Record<string, any>[];
        defaultSortBy?: string;
        sortType?: "asc" | "desc";
        saveSearch?: boolean;
        onFetch?: (data: any) => void;
        method?: "POST" | "GET";
        headers?: Record<string, string>;
    };
}
interface StaticModeProps {
    staticRows: any[];
    totalItems: number;
}
interface AutoPageSizeConfig {
    enabled?: boolean;
    containerSelector?: string;
    subtractSelectors?: string[];
    optionalSelectorsForExtraBuffer?: string[];
    rowHeight?: number;
    baseBufferRows?: number;
    extraBufferRows?: number;
}
interface BaseTableProps {
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
    notify: (text: string, type: "error" | "success" | "warning") => void;
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
}
interface Selectable extends BaseTableProps {
    isSelectable: boolean;
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
    externalRows: any[];
    totalItems: number;
    isLoading?: boolean;
}
type TableProps = (InternalTableProps & {
    isSelectable?: false;
}) | (InternalTableProps & Selectable) | (StaticTableProps & {
    isSelectable?: false;
}) | (StaticTableProps & Selectable) | (ExternalTableProps & {
    isSelectable?: false;
}) | (ExternalTableProps & Selectable);

declare const _default: React__default.NamedExoticComponent<TableProps>;

declare const rowRenderer: (fn: (cell?: any, row?: any, index?: number) => React.ReactNode) => (cell?: any, row?: any, index?: number) => React$1.ReactNode;

export { _default as Table, _default as default, rowRenderer };
