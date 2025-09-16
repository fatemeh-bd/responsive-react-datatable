import { forwardRef } from "react";
import { InputProps } from "./types";
import Label from "./Label";
import { useFZTableColors } from "../contexts/FZTableThemeContext";

// import { convertPriceToWords, removeCommas } from "../../utils/helper";

export const inputClass =
  "text-right text-base bg-white rounded-lg placeholder:text-sm !outline-none block w-full p-2.5 border border-secondary-500 focus:border-primary disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-secondary-200";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      icon,
      label,
      border = true,
      errorText,
      readOnlyMode,
      inputClassName,
      subLabel,
      showPriceInWords,
      ...rest
    },
    ref
  ) => {
    const colors = useFZTableColors();
    const classList = `${inputClass} ${
      border === false ? "!border-none" : ""
    } ${readOnlyMode ? "!bg-secondary-200 opacity-80" : ""} bg-transparent`;

    return icon ? (
      <div className={`flex flex-col gap-1 ${className || ""}`}>
        <Label text={label || ""}>
          {typeof subLabel === "string" ? `(${subLabel})` : subLabel}
        </Label>
        <div
          className={`my-0 flex items-center justify-between  gap-3 ${classList}`}
        >
          {icon}
          <input
            {...rest}
            ref={ref}
            className={`w-full border-none bg-transparent !outline-none ${
              inputClassName || ""
            }`}
          />
        </div>
        {errorText && <p>{errorText}</p>}
        {showPriceInWords && (
          <p className="mt-1 text-blue-500">{showPriceInWords}</p>
        )}
      </div>
    ) : label ? (
      <div className={`flex flex-col gap-1 ${className || ""}`}>
        <Label text={label}>
          {typeof subLabel === "string" ? `(${subLabel})` : subLabel}
        </Label>

        <input
          className={`${classList} ${inputClassName || ""}`}
          {...rest}
          ref={ref}
        />
        {errorText && <p>{errorText}</p>}
        {showPriceInWords && (
          <p className="mt-1 text-blue-500">{showPriceInWords}</p>
        )}
      </div>
    ) : (
      <div className={`${className || ""}`}>
        <input
          className={`${classList} ${inputClassName || ""}`}
          {...rest}
          ref={ref}
        />
        {errorText && <p>{errorText}</p>}
        {showPriceInWords && (
          <p className="mt-1 text-blue-500">{showPriceInWords}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
