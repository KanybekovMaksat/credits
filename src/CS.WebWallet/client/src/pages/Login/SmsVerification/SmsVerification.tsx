import React, { FC, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { IMask } from "react-imask";
import { BlueFilledButton } from "@compv2/Buttons";
import { InputProps } from "@compv2/Modals/NewCardModal/CardNumberInput";
import { $login, loginCodeConfirm, resendCode, resetLogin } from "@store/auth";

import "./styles.scss";

const SmsCodeInput: React.FC<InputProps> = (props: InputProps) => {
  const myRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (myRef.current !== null) {
      IMask(myRef.current, {
        mask: "000 000",
      });
    }
  }, [myRef]);
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return (
    <input
      className="sms-code-login"
      placeholder={"Code"}
      ref={myRef}
      onPaste={(e) => {
        const value = e.clipboardData.getData("text").trim();

        let res = "";
        for (let i = 0; i < value.length; i += 1) {
          if (numbers.indexOf(value[i]) !== -1) {
            res += value[i];
          }
        }

        props.onChange(res);
        return res;
      }}
      onChange={(e) => props.onChange(e.target.value.replace(" ", ""))}
    />
  );
};

export interface SmsVerificationProps {
  method: number;
}

const SmsVerification: FC<SmsVerificationProps> = ({ method }) => {
  const { loading, me } = useStore($login);
  const { t } = useTranslation();

  if (me) return <Navigate to={"/accounts"} />;

  const [timer, setTimer] = useState(30);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      setTimer(0);
    }
  }, [timer]);

  return (
    <div className="sms-verification wait">
      <div className="sms-code-input">
        {method === 1 && (
          <span className="label">{t("Enter code from SMS")}</span>
        )}
        {method === 2 && (
          <span className="label">{t("Enter code from E-mail")}</span>
        )}
        <SmsCodeInput
          onChange={(e) => {
            setCode(e);
            if (e !== undefined && e.length === 6) {
              loginCodeConfirm({ code: e });
            }
          }}
        />
      </div>
      {timer > 0 ? (
        <>
          <BlueFilledButton
            type="button"
            onClick={() => loginCodeConfirm({ code })}
            text={t("send")}
            isLoading={loading}
          />
          <div className="seconds">
            {t("Resending the code in {{timer}} seconds", { timer: timer })}
          </div>
        </>
      ) : (
        <BlueFilledButton
          type="button"
          onClick={() => resendCode()}
          text={t("Send the CODE again")}
          isLoading={loading}
        />
      )}
      <button
        type="button"
        className="link-button"
        onClick={() => resetLogin()}
      >
        {method === 1 && t("Change the number")}
        {method === 2 && t("Change the E-mail")}
      </button>
    </div>
  );
};

export default SmsVerification;
