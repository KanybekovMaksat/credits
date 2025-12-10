import React from "react";
import "./checkbox.scss";

interface CheckboxProps {
  onChange: (val: boolean) => void;
  value: boolean;
  disabled?: boolean;
  children: any;
}
const Checkbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
  const { value, onChange, disabled, children } = props;
  return (
    <div className="cs_checkbox">
      <input
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={(e) => {
          if (onChange) onChange(e.target.checked);
        }}
      />
      <div>{children}</div>
    </div>
  );
};

export default Checkbox;
