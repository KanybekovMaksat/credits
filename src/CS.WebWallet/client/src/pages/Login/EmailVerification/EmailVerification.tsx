import React, { FC, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { IMask } from "react-imask";
import BlueFilledButton from "@compv2/Buttons/BlueFilledButton";
import {
  $login,
  loginCodeConfirm,
  resendCode,
  resetLogin,
  $authData,
} from "@store/auth";

import "./styles.scss";

const CodeInput: React.FC<{
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ onChange, placeholder = "Enter code" }) => {
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
      className="code-input"
      placeholder={placeholder}
      ref={myRef}
      onPaste={(e) => {
        const value = e.clipboardData.getData("text").trim();
        let res = "";
        for (let i = 0; i < value.length; i += 1) {
          if (numbers.indexOf(value[i]) !== -1) {
            res += value[i];
          }
        }
        onChange(res);
      }}
      onChange={(e) => onChange(e.target.value.replace(" ", ""))}
    />
  );
};

const EmailVerification: FC = () => {
  const { loading, me, step } = useStore($login);
  const authData = useStore($authData);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [timer, setTimer] = useState(30);
  const [code, setCode] = useState("");

  const email = authData?.email || "";

  useEffect(() => {
    if (timer > 0) {
      const timeout = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [timer]);

  if (me) return <Navigate to={"/accounts"} />;

  if (step === 0 && !email) {
    return <Navigate to={"/login"} />;
  }

  const handleConfirm = () => {
    if (code.length === 6) {
      loginCodeConfirm({ code });
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      resendCode();
      setTimer(30);
    }
  };

  const handleBack = () => {
    resetLogin();
    navigate("/login");
  };

  return (
    <div className="email-verification-page">
      <div className="verification-container">
        <div className="verification-card">
          <button className="back-button" onClick={handleBack} type="button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back</span>
          </button>

          <h1 className="verification-title">Enter the code from email</h1>
          <p className="verification-subtitle">
            We sent an mail to the email {email}
          </p>

          <div className="code-input-wrapper">
            <CodeInput onChange={setCode} placeholder="Enter code" />
          </div>

          <BlueFilledButton
            type="button"
            onClick={handleConfirm}
            text="Confirm"
            isLoading={loading}
            disabled={code.length !== 6}
          />

          {timer > 0 ? (
            <div className="timer-text">Re-request code later {timer} sec</div>
          ) : (
            <button
              type="button"
              className="resend-button"
              onClick={handleResend}
            >
              Send again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
