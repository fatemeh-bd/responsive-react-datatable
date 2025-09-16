import React, { ReactNode } from 'react';

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
interface TableProps {
    columns: ColumnType[];
    endpoint: string;
    baseUrl?: string;
    customBody?: CustomBody[];
    pageSize?: number;
    height?: string;
    noSearch?: boolean;
    tableName?: string;
    deafaultSortBy?: string;
    onFetch?: (data: any) => void;
    saveSearch?: boolean;
    searchPlaceholder?: string;
    sortType?: "desc" | "asc";
    actionButtonsLeft?: ReactNode;
    filters?: ReactNode;
    topFilter?: ReactNode;
    title: string;
    filterContainerClassName?: string;
    topFilterContainerClassName?: string;
    isSelectable?: boolean;
    selectedIds?: any[];
    onSelectChange?: (value: any) => void;
    selectedKey?: string;
    removeFilterKey?: string;
    hasColumnOrder?: boolean;
}
interface CustomBody {
    noRefresh?: boolean;
    isFilter?: boolean;
    [key: string]: string | number | boolean | null | undefined | Object;
}

interface SecondaryColors {
    100: string;
    200: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}
interface FZTableThemeConfigType {
    blue: string;
    error: string;
    success: string;
    darkgreen: string;
    primary: string;
    white: string;
    background: string;
    secondary: SecondaryColors;
    black: string;
}

interface ExtendedTableProps extends TableProps {
    isTestMode?: boolean;
    themeConfig?: FZTableThemeConfigType;
}
declare const _default: React.NamedExoticComponent<ExtendedTableProps>;

export { _default as default };
