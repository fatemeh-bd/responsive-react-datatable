export type SvgType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface Options {
  label: string;
  onClick?: () => void;
  Icon?: SvgType;
  hidden?: boolean;
  permissionIdTab?: string;
  href?: string;
}
export interface ActionDropDownProps {
  options: Options[];
  button?: React.ReactNode | (() => React.ReactNode);
  lastItem?: boolean;
  text?: string;
}
export interface DropDownMenuProps {
  button: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
