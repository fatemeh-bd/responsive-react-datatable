import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

export interface InputStyle {
  textAlign: "right";
  backgroundColor: string;
  borderRadius: string;
  outline: string;
  display: string;
  width: string;
  padding: string;
  border: string;
  fontSize: string;
  lineHeight: string;
  opacity?: string;
}

export const ColorType = {
  SECONDARY: "secondary",
  BLACK: "black",
  PRIMARY: "primary",
  ERROR: "error",
  SUCCESS: "success",
  BLUE: "blue",
} as const;
export type ColorTypeInterface = (typeof ColorType)[keyof typeof ColorType];

export type SvgType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface Box_cell_type {
  children: React.ReactNode;
  tooltip?: string;
  className?: string;
  lineClamp?: string;
  visible?: boolean;
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

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  border?: boolean;
  className?: string;
  inputClassName?: string;
  icon?: React.ReactNode;
  label?: string;
  errorText?: string;
  readOnlyMode?: boolean;
  subLabel?: string | React.ReactNode;
  showPriceInWords?: string;
};

export interface LabelPropsType {
  text: string;
  children?: ReactNode;
  htmlFor?: string;
  className?: string;
  icon?: ReactNode;
}

export interface TableProps {
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

export interface CustomBody {
  noRefresh?: boolean;
  isFilter?: boolean;
  [key: string]: string | number | boolean | null | undefined | Object;
}

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "disabled" | "type"
> & {
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
  outline?: boolean;
  theme?: ColorTypeInterface;
  Icon?: SvgType;
  size?: "lg";
  full?: boolean;
  disabled?: boolean;
  permissionIdTab?: string | number;
  type?: "button" | "submit" | "reset";
};

export interface ModalProps {
  title: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  childrenClass?: string;

  overflowY?:
    | "overflow-y-auto"
    | "overflow-y-hidden"
    | "overflow-y-visible"
    | "overflow-y-scroll"
    | "overflow-y-clip";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "fit";
}
