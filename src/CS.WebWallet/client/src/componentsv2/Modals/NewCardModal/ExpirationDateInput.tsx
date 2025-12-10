import React, { useEffect, useRef } from "react";
import { IMask } from "react-imask";
import { InputProps } from "./CardNumberInput";

const ExpirationDateInput: React.FC<InputProps> = (props: InputProps) => {
  const myRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (myRef.current !== null) {
      IMask(myRef.current, {
        mask: "MM{/}YY",
        blocks: {
          YY: {
            mask: IMask.MaskedRange,
            from: 22,
            to: 99,
          },
          MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
          },
        },
      });
    }
  }, [myRef]);
  return (
    <input
      placeholder="YY/MM"
      ref={myRef}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

export default ExpirationDateInput;
