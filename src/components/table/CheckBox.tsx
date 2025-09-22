import React, { forwardRef } from "react";
import "./checkboxStyle.css";

interface CheckboxProps {
  label?: string;
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
  ) => (
    <label className={`${className} checkbox`}>
      <input
        className="checkbox-input"
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        ref={ref}
        value={value}
        disabled={disabled}
        defaultChecked={defaultChecked}
      />
      <span
        style={{
          backgroundColor: checked ? primaryColor : "transparent",
          borderColor: checked ? primaryColor : "#d9d9d9",
        }}
        className={`checkbox-control w-[22px] h-[22px] min-w-[22px] min-h-[22px] rounded-md border transition-all
    `}
      ></span>
      <span className="checkbox-label">{label}</span>
    </label>
  )
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
