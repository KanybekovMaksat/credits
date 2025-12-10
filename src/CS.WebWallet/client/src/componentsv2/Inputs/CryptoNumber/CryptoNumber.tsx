import React from "react";

export interface CryptoNumberProps {
  onChange: (value: string | number) => void;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  precision: number;
  value?: number | string;
  max?: number;
  min?: number;
}

const CryptoNumber: React.FC<CryptoNumberProps> = (
  props: CryptoNumberProps
) => {
  const { placeholder, value, onChange, max, min, error } = props;

  return (
    <input
      type="number"
      className={`cs_input cs_number ${error ? "error" : ""}`}
      placeholder={placeholder}
      onChange={(e) => {
        const val = Number(e.target.value);
        if (Number.isNaN(val)) {
          e.preventDefault();
          return;
        }
        if (min && val < min) {
          e.preventDefault();
          onChange(min);
          return;
        }
        if (max && val > max) {
          e.preventDefault();
          onChange(max);
          return;
        }
        onChange(val);
      }}
      disabled={props.disabled}
      value={value}
    />
  );
};

export default CryptoNumber;
