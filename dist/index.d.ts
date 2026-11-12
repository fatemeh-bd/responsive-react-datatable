import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import React__default, { CSSProperties, ReactNode } from 'react';

interface PaginationProps {
    totalItems: number;
    pageSize: number;
    queryName?: string;
}
type OrderType = {
    column: number;
    dir: "asc" | "desc";
    name: string;
} | null;
interface ColorTheme {
    borderColor?: string;
    headerBackgroundColor?: string;
    backgroundColor?: string;
    headerTextColor?: string;
    cellTextColor?: string;
    primaryColor?: string;
    primaryTextColor?: string;
}
type TableTheme = "light" | "dark" | `#${string}`;
interface DesktopTableProps {
    columns: ColumnType[];
    rows: Record<string, any>[];
    pageSize: number;
    maxHeight?: string;
    isLoading?: boolean;
    colorTheme?: ColorTheme;
}
interface ColumnType {
    /** Stable ID for visibility controls; defaults to data or column-{index}. */
    id?: string;
    hidden?: boolean;
    hideable?: boolean;
    exportable?: boolean;
    exportValue?: (row: any) => ExportCellValue;
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
type TableMode = "static" | "external" | "internal";
type RowId = string | number;
type ExportFormat = "csv" | "xlsx" | "pdf";
type ExportScope = "filtered" | "page" | "selected";
type ExportCellValue = string | number | boolean | Date | null | undefined;
interface ExportContext {
    scope: ExportScope;
    search: string;
    order: OrderType;
    page: number;
    pageSize: number;
    selectedIds: RowId[];
}
interface ExportConfig {
    formats?: ExportFormat[];
    fileName?: string;
    scope?: ExportScope;
    includeHiddenColumns?: boolean;
    /** Fetch all required rows in server modes; called only when exporting. */
    getRows?: (context: ExportContext) => any[] | Promise<any[]>;
    onError?: (error: Error) => void;
}
interface ExpandableRowsConfig {
    render: (row: any, index: number) => ReactNode;
    canExpand?: (row: any) => boolean;
    expandedRowIds?: RowId[];
    defaultExpandedRowIds?: RowId[];
    onExpandedChange?: (ids: RowId[]) => void;
}
interface CustomBody {
    noRefresh?: boolean;
    isFilter?: boolean;
    [key: string]: string | number | boolean | null | undefined | Object;
}
interface InternalModeProps {
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
interface StaticModeProps {
    staticRows: any[];
    totalItems?: number;
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
interface Selectable extends BaseTableProps {
    isSelectable: boolean;
    selectedIds: Array<string | number>;
    selectedKey?: string;
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

declare function Table(props: TableProps): react_jsx_runtime.JSX.Element;
declare const _default: React__default.MemoExoticComponent<typeof Table>;

declare const rowRenderer: (fn: (cell?: any, row?: any, index?: number) => React.ReactNode) => (cell?: any, row?: any, index?: number) => React$1.ReactNode;

type SvgType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
interface Options {
    label: string;
    onClick?: () => void;
    Icon?: SvgType;
    hidden?: boolean;
    permissionIdTab?: string;
    href?: string;
}
interface ActionDropDownProps {
    options: Options[];
    button?: React.ReactNode | (() => React.ReactNode);
    lastItem?: boolean;
    text?: string;
}

declare function ActionDropDown({ options, button, lastItem, text, }: ActionDropDownProps): react_jsx_runtime.JSX.Element;

export { ActionDropDown, _default as Table, _default as default, rowRenderer };
export type { ActionDropDownProps, AutoPageSizeConfig, BaseTableProps, ColorTheme, ColumnType, CustomBody, DesktopTableProps, ExpandableRowsConfig, ExportCellValue, ExportConfig, ExportContext, ExportFormat, ExportScope, ExternalTableProps, InternalModeProps, InternalTableProps, OrderType, PaginationProps, RowId, Selectable, StaticModeProps, StaticTableProps, SvgType, TableMode, TableProps, TableTheme, TextsConfig };
