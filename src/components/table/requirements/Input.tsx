import { forwardRef } from "react";
import { InputProps, InputStyle } from "./types";
import Label from "./Label";
import { useFZTableColors } from "../contexts/FZTableThemeContext";

export const inputBaseStyle = (colors: any): InputStyle => ({
  textAlign: "right",
  backgroundColor: colors.white || "#ffffff",
  borderRadius: "0.5rem",
  outline: "none",
  display: "block",
  width: "100%",
  padding: "0.625rem",
  border: `1px solid ${colors.secondary500}`,
  fontSize: "1rem",
  lineHeight: "1.5rem",
});

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

    const getInputStyle = () => {
      const baseStyle = inputBaseStyle(colors);

      if (border === false) {
        baseStyle.border = "none";
      }

      if (readOnlyMode) {
        baseStyle.backgroundColor = colors.secondary200 || "#e5e7eb";
        baseStyle.opacity = "0.8";
      }

      return baseStyle;
    };

    const containerStyle = {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.25rem",
    };

    const iconContainerStyle = {
      ...getInputStyle(),
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.75rem",
      margin: "0",
    };

    const inputStyle = {
      width: "100%",
      border: "none",
      backgroundColor: "transparent",
      outline: "none",
    };

    const priceWordsStyle = {
      marginTop: "0.25rem",
      color: colors.blue || "#3b82f6",
    };

    return icon ? (
      <div
        style={{ ...containerStyle, ...(className ? {} : {}) }}
        className={className}
      >
        <Label text={label || ""}>
          {typeof subLabel === "string" ? `(${subLabel})` : subLabel}
        </Label>
        <div style={iconContainerStyle}>
          {icon}
          <input
            {...rest}
            ref={ref}
            style={{ ...inputStyle, ...(inputClassName ? {} : {}) }}
            className={inputClassName}
          />
        </div>
        {errorText && <p>{errorText}</p>}
        {showPriceInWords && <p style={priceWordsStyle}>{showPriceInWords}</p>}
      </div>
    ) : label ? (
      <div
        style={{ ...containerStyle, ...(className ? {} : {}) }}
        className={className}
      >
        <Label text={label}>
          {typeof subLabel === "string" ? `(${subLabel})` : subLabel}
        </Label>

        <input
          style={getInputStyle()}
          className={inputClassName}
          {...rest}
          ref={ref}
        />
        {errorText && <p>{errorText}</p>}
        {showPriceInWords && <p style={priceWordsStyle}>{showPriceInWords}</p>}
      </div>
    ) : (
      <div className={className}>
        <input
          style={getInputStyle()}
          className={inputClassName}
          {...rest}
          ref={ref}
        />
        {errorText && <p>{errorText}</p>}
        {showPriceInWords && <p style={priceWordsStyle}>{showPriceInWords}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
