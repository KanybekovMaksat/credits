import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { Cookies } from "react-cookie";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { Auth } from "@services/IdentityService";
import SmsVerification from "./SmsVerification";
import BlueFilledButton from "@compv2/Buttons/BlueFilledButton";
import Checkbox from "@compv2/Inputs/Checkbox";

import "./login.scss";

import { $login, getMe, loginRequested } from "@store/auth";

export interface LoginProps {
  phone: string;
  countryId: string;
  appKey: string;
}

const Login: React.FC = (): JSX.Element => {
  const { loading, step, me, error } = useStore($login);
  const [agg, setAgg] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<"personal" | "business">(
    "personal"
  );
  const [emailError, setEmailError] = useState<string>("");

  const methods = useForm();
  const { t } = useTranslation();
  const { handleSubmit, watch, register } = methods;

  const email = watch("email");

  const termsText = useMemo(() => {
    const title = t("login_agreement");
    const terms = t("terms_conditions");

    const privacy = t("privacy_policy");
    return (
      <>
        {title}
        &nbsp;
        <Link
          to="https://credits.com/legal.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          {terms}
        </Link>
        &nbsp;
        <Link
          to="https://credits.com/privacy-policy.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          {privacy}
        </Link>
      </>
    );
  }, [t]);

  useEffect(() => {
    if (!me) getMe();
  }, [me, step]);

  if (me) return <Navigate to={"/accounts"} />;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("invalid email address");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("invalid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const makeLogin = (values: any) => {
    if (!validateEmail(values.email)) {
      return;
    }

    const cookies = new Cookies();
    const request: Auth = {
      appKey: import.meta.env.VITE_APP_KEY,
      termsAccepted: agg,
      referral: cookies.get("referral") ?? undefined,
      referralParams: cookies.get("refparams"),
      email: values.email,
    };

    loginRequested(request);
  };

  const loginDisabled = step >= 1;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && emailError) {
      validateEmail(value);
    }
  };

  const BuildingIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 18H18V20H2V18Z" fill="currentColor" />
      <path
        d="M2 0H18V18H2V0ZM4 2V16H8V2H4ZM10 2V16H16V2H10Z"
        fill="currentColor"
      />
    </svg>
  );

  const GoogleIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  const AppleIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
        fill="#000000"
      />
    </svg>
  );

  const FacebookIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill="#1877F2"
      />
    </svg>
  );

  return (
    <div className="login">
      {step !== 1 && (
        <div className="account-type-tabs">
          <button
            type="button"
            className={`account-tab ${
              accountType === "personal" ? "active" : ""
            }`}
            onClick={() => setAccountType("personal")}
          >
            <BuildingIcon />
            <span>For Personal</span>
          </button>
          <button
            type="button"
            className={`account-tab ${
              accountType === "business" ? "active" : ""
            }`}
            onClick={() => setAccountType("business")}
          >
            <BuildingIcon />
            <span>For Business</span>
          </button>
        </div>
      )}
      <div className="login-form">
        {step !== 1 && <h1 className="signup-title">Sign up</h1>}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(makeLogin)} className="signup-form">
            {step !== 1 && (
              <>
                <div className="email-input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter email address"
                    className={`email-input ${emailError ? "error" : ""}`}
                    disabled={loginDisabled}
                    {...register("email", {
                      onChange: handleEmailChange,
                      onBlur: (e) => {
                        if (e.target.value) {
                          validateEmail(e.target.value);
                        }
                      },
                    })}
                  />
                  {emailError && (
                    <div className="email-error">{emailError}</div>
                  )}
                </div>

                <div className="agree-area">
                  <Checkbox value={agg} onChange={(e) => setAgg(e)}>
                    {termsText}
                  </Checkbox>
                </div>

                {!loginDisabled && (
                  <>
                    <BlueFilledButton
                      style={{fontSize: "14px"}}
                      type="submit"
                      disabled={!email || !agg || !!emailError}
                      text={t("Continue")}
                      isLoading={loading}
                    />

                    <button
                      type="button"
                      className="login-link-button"
                      onClick={() => {
                        // Navigate to login if needed
                      }}
                    >
                      Already registered? Log in
                    </button>
                  </>
                )}

                <div className="divider">
                  <span>or continue with</span>
                </div>

                <div className="social-login">
                  <button type="button" className="social-button">
                    <GoogleIcon />
                  </button>
                  <button type="button" className="social-button">
                    <AppleIcon />
                  </button>
                  <button type="button" className="social-button">
                    <FacebookIcon />
                  </button>
                </div>
              </>
            )}

            <div className="field_validation_error">{error}</div>
          </form>
        </FormProvider>
        {step === 1 && <SmsVerification method={2} />}
      </div>
      <div className="app-download">
        <a
          href="https://apps.apple.com/ru/credits/id1502902555"
          target="_blank"
          rel="noopener noreferrer"
          className="app-store-button"
        >
          <img
            src="/images/app-store/apple-get.svg"
            alt="Download on the App Store"
          />
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.credits.Wallet"
          target="_blank"
          rel="noopener noreferrer"
          className="google-play-button"
        >
          <img
            src="/images/app-store/google-get.svg"
            alt="GET IT ON Google Play"
          />
        </a>
      </div>
    </div>
  );
};

export default Login;
