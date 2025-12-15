import React, { FC, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { IMask } from "react-imask";
import { BlueFilledButton } from "@compv2/Buttons";
import { InputProps } from "@compv2/Modals/NewCardModal/CardNumberInput";
import BackArrowIcon from "@components/Icons/BackArrowIcon";
import {
  $login,
  $authData,
  loginCodeConfirm,
  resendCode,
  resetLogin,
} from "@store/auth";

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
      placeholder="Enter code"
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
  const authData = useStore($authData);
  const { t } = useTranslation();

  if (me) return <Navigate to={"/accounts"} />;

  const [timer, setTimer] = useState(30);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (timer > 0) {
      const timeout = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [timer]);

  const email = authData?.email || "email address@email.com";

  const handleResend = () => {
    setTimer(30);
    resendCode();
  };

  return (
    <div className="email-verification">
      <button
        type="button"
        className="back-button"
        onClick={() => resetLogin()}
      >
        <BackArrowIcon />
        <span>Back</span>
      </button>

      <h1 className="verification-title">Enter the code from email</h1>

      <p className="verification-subtitle">
        We sent an mail to the email {email}
      </p>

      <div className="code-input-wrapper">
        <SmsCodeInput
          onChange={(e) => {
            setCode(e);
            if (e !== undefined && e.length === 6) {
              loginCodeConfirm({ code: e });
            }
          }}
        />
      </div>

      <BlueFilledButton
        type="button"
        onClick={() => loginCodeConfirm({ code })}
        text={t("Confirm")}
        isLoading={loading}
        disabled={!code || code.length !== 6}
        style={{fontSize: "16px"}}
      />

      {timer > 0 ? (
        <>
          <button
            type="button"
            className="send-again-link"
            disabled
            style={{ opacity: 0.5, cursor: "not-allowed" }}
          >
            Send again
          </button>
          <p className="timer-text">Re-request code later {timer} sec</p>
        </>
      ) : (
        <button
          type="button"
          className="send-again-link"
          onClick={handleResend}
        >
          Send again
        </button>
      )}
    </div>
  );
};

export default SmsVerification;
