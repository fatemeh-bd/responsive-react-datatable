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
    },
    ref,
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
      <span className="checkbox-control"></span>
      <span className="checkbox-label">{label}</span>
    </label>
  ),
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
