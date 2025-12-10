import React from "react";
import "./number.scss";

export interface NumberProps {
  onChange: (value: string) => void;
  value: string | null;
  disabled?: boolean;
  placeholder?: string;
}

const NumberCodes = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "ArrowLeft",
  "ArrowRight",
  ".",
  "Backspace",
];

const Number: React.FC<NumberProps> = (props: NumberProps) => {
  const { onChange, value, disabled, placeholder = "0.00" } = props;
  const [current, setValue] = React.useState(value);

  const onKeyDown = (e: any) => {
    if (((current + e.key).match(/\./g) || []).length > 1)
      return e.preventDefault();
    if (NumberCodes.indexOf(e.key) !== -1) {
      return true;
    }
    return e.preventDefault();
  };

  const onInputChange = (e: any) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <input
      disabled={disabled}
      defaultValue={value ?? undefined}
      className="cs_input cs_number"
      onKeyDown={(e) => onKeyDown(e)}
      onChange={onInputChange}
      placeholder={placeholder}
    />
  );
};

export default Number;
