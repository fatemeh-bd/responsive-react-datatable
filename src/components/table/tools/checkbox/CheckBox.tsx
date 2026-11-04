import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "./checkboxStyle.css";

interface CheckboxProps {
  label?: string;
  ariaLabel?: string;
  indeterminate?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
  value?: string;
  disabled?: boolean;
  defaultChecked?: boolean;
  primaryColor?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      ariaLabel,
      indeterminate,
      checked,
      onChange,
      name,
      className,
      value,
      disabled = false,
      defaultChecked,
      primaryColor,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);
    useEffect(() => { if (inputRef.current) inputRef.current.indeterminate = !!indeterminate; }, [indeterminate]);
    return (
    <label className={`${className} checkbox checkbox-container`}>
      <input
        className="checkbox-input"
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        ref={inputRef}
        aria-label={ariaLabel || label || "Select row"}
        value={value}
        disabled={disabled}
        defaultChecked={defaultChecked}
      />
      <span
        style={{
          backgroundColor: checked ? primaryColor : "transparent",
          borderColor: checked ? primaryColor : "#b8b8b8",
          width: 22,
          height: 22,
        }}
        className={`checkbox-control checkbox-visual-control`}
      ></span>
      {label && (
        <span className="checkbox-label checkbox-text-label">{label}</span>
      )}
    </label>
  );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
