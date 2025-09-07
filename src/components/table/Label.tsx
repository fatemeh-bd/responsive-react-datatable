import { LabelPropsType } from "./types";

const Label: React.FC<LabelPropsType> = ({
  text,
  htmlFor,
  children,
  className,
  icon,
}) => {
  return text ? (
    <label
      htmlFor={htmlFor}
      className={`flex items-center gap-2 font-medium text-gray-700 inputLabel ${className}`}
    >
      {icon && <span className="w-5 h-5 text-gray-500">{icon}</span>}
      <span className="text-secondary-800 text-nowrap text-sm max-md:text-xs">
        {text}
      </span>
      {children && <span className="text-sm text-gray-500">{children}</span>}
    </label>
  ) : null;
};

export default Label;
