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

type TableConfig = {
    borderColor?: string;
    borderRadius?: string;
    bgColor?: string;
    shadowClass?: string;
    textSecondaryColor?: string;
    textSecondaryLightColor?: string;
    textErrorColor?: string;
    headerTextColor?: string;
    headerBorderColor?: string;
    headerBgColor?: string;
    headerHoverClass?: string;
    rowBorderColor?: string;
    rowHoverBgColor?: string;
    skeletonBgColor?: string;
    noDataTextColor?: string;
    noDataBgColor?: string;
    sortIconActiveColor?: string;
    sortIconInactiveColor?: string;
    mobileCardBorderColor?: string;
    mobileCardBgColor?: string;
    mobileTitleColor?: string;
    mobileContentColor?: string;
    loaderBgColor?: string;
    loaderSrc?: string;
    loaderWidth?: string | number;
    loaderHeight?: string | number;
    loaderClassName?: string;
    loaderZIndex?: number;
};

interface ExtendedTableProps extends TableProps {
    isTestMode?: boolean;
    tableConfig?: TableConfig;
}
declare const _default: React.NamedExoticComponent<ExtendedTableProps>;

export { _default as default };
