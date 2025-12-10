import React, { useEffect, useRef } from "react";
import { IMask } from "react-imask";
import { InputProps } from "@compv2/Modals/NewCardModal/CardNumberInput";
import { useTranslation } from "react-i18next";

const CodeInput: React.FC<InputProps> = ({
  onChange,
  placeholder = "input_code",
  value,
}) => {
  const myRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (myRef.current !== null) {
      IMask(myRef.current, {
        mask: "000000",
      });
    }
  }, [myRef]);
  return (
    <input
      className="cs_input"
      placeholder={t(placeholder)}
      ref={myRef}
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  );
};

export default CodeInput;
