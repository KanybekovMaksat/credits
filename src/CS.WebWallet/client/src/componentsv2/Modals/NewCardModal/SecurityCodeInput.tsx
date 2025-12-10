import React, { useEffect, useRef } from "react";
import { IMask } from "react-imask";
import { InputProps } from "./CardNumberInput";

export interface SecurityCodeInputProps extends InputProps {
  maskLength?: number;
  disabled: boolean;
}

const SecurityCodeInput: React.FC<SecurityCodeInputProps> = (
  props: SecurityCodeInputProps
) => {
  const { maskLength, placeholder, disabled } = props;
  const myRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (myRef.current !== null) {
      const mask = "0".repeat(
        !maskLength || maskLength <= 3 ? 3 : maskLength >= 20 ? 20 : maskLength
      );
      IMask(myRef.current, { mask: mask });
    }
  }, [myRef]);

  return (
    <input
      className="cs_input"
      type="password"
      placeholder={placeholder ?? "CVC"}
      ref={myRef}
      disabled={disabled}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

export default SecurityCodeInput;
