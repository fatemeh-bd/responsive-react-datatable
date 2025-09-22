import React$1 from 'react';

interface ColorTheme {
    borderColor?: string;
    headerBg?: string;
    headerText?: string;
    rowBorder?: string;
    rowBg?: string;
    cellText?: string;
    primaryColor?: string;
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
interface BaseTableProps {
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
interface Selectable extends BaseTableProps {
    isSelectable: true;
    selectedIds: Array<string | number>;
    selectedKey: string;
    onSelectChange?: (value: any) => void;
}
type TableProps = NonSelectable | Selectable;

declare const _default: React$1.NamedExoticComponent<TableProps>;

export { _default as default };
