import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { Cookies } from "react-cookie";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import SelectCountry from "@components/SelectCountryPhoneCode";
import { Auth } from "@services/IdentityService";
import SmsVerification from "./SmsVerification";
import BlueFilledButton from "@compv2/Buttons/BlueFilledButton";
import Checkbox from "@compv2/Inputs/Checkbox";

import "./login.scss";
import "swiper/scss";
import "swiper/scss/pagination";
import "swiper/scss/navigation";
import { Autoplay, Pagination } from "swiper";

import slide1 from "/images/slides/slide_1.png";
import slide2 from "/images/slides/slide_2.png";
import slide3 from "/images/slides/slide_3.png";
import slide4 from "/images/slides/slide_4.png";

import { $login, getMe, loginRequested } from "@store/auth";
import { $countries, countryFetchReceived } from "@store/countries";

export interface LoginProps {
  phone: string;
  countryId: string;
  appKey: string;
}

const Login: React.FC = (): JSX.Element => {
  const { loading, step, me, error } = useStore($login);
  const { countries, isLoading: countriesLoading } = useStore($countries);
  const [agg, setAgg] = useState<boolean>(false);
  const [method, setMethod] = useState<number>(1);

  useEffect(() => {
    if (!countries || countries.length === 0) countryFetchReceived();
  }, [countries]);

  const methods = useForm();
  const { t } = useTranslation();
  const { handleSubmit, watch, register, setValue } = methods;

  useEffect(() => {
    if (method === 1) setValue("email", null);
    if (method === 2) setValue("phone", null);
  }, [method]);

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

  const makeLogin = (values: any) => {
    const cookies = new Cookies();
    const request: Auth = {
      appKey: import.meta.env.VITE_APP_KEY,
      termsAccepted: agg,
      referral: cookies.get("referral") ?? undefined,
      referralParams: cookies.get("refparams"),
      email: values.email,
    };

    if (values.phone) {
      request.phone = `${values.country.phoneCodes[0]}${values.phone}`;
      request.countryId = values.country.id;
      request.email = undefined;
    }

    loginRequested(request);
  };

  const country = watch("country");
  const phone = watch("phone");
  const email = watch("email");
  const loginDisabled = step >= 1;

  return (
    <div className="login">
      <div className="slides">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
        >
          <SwiperSlide>
            <div className="cs-slide">
              <div className="slide-image">
                <img src={slide1} />
              </div>
              <div className="slide-description">{t("slide_1")}</div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="cs-slide">
              <div className="slide-image">
                <img src={slide2} />
              </div>
              <div className="slide-description">{t("slide_2")}</div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="cs-slide">
              <div className="slide-image">
                <img src={slide3} />
              </div>
              <div className="slide-description">{t("slide_3")}</div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="cs-slide">
              <div className="slide-image">
                <img src={slide4} />
              </div>
              <div className="slide-description">{t("slide_4")}</div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="login-form">
        <h1 style={{ textAlign: "center", paddingBottom: "10px" }}>
          {t("Welcome to Cedits wallet!")}
        </h1>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(makeLogin)} className="phone-form">
            {step !== 1 && (
              <>
                <div className="login-tabs">
                  <div className="login-tab">
                    <input
                      id="methodPhone"
                      name="loginMethod"
                      type="radio"
                      checked={method === 1}
                      onChange={() => setMethod(1)}
                    />
                    <label htmlFor="methodPhone">{t("login.phone")}</label>
                  </div>
                  <div className="login-tab">
                    <input
                      id="methodMail"
                      name="loginMethod"
                      type="radio"
                      checked={method === 2}
                      onChange={() => setMethod(2)}
                    />
                    <label htmlFor="methodMail">{t("login.email")}</label>
                  </div>
                </div>
              </>
            )}

            {method === 1 && (
              <>
                <div className="phone-area">
                  <SelectCountry disabled={loginDisabled} />
                  <input
                    type="number"
                    placeholder={t("login.phone.placeholder")}
                    className="simple-input"
                    disabled={loginDisabled}
                    onKeyPress={(event: any) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    {...register("phone")}
                  />
                </div>
              </>
            )}
            {method === 2 && (
              <>
                <div className="phone-area">
                  <input
                    type="text"
                    placeholder={t("login.email.placeholder")}
                    className="simple-input"
                    style={{ marginLeft: 0 }}
                    disabled={loginDisabled}
                    {...register("email")}
                  />
                </div>
              </>
            )}
            <div className="agree-area">
              <Checkbox value={agg} onChange={(e) => setAgg(e)}>
                {termsText}
              </Checkbox>
            </div>
            {!loginDisabled && (
              <BlueFilledButton
                type="submit"
                disabled={
                  ((phone?.length < 3 || country?.isBlocked) && !email) || !agg
                }
                text={t("Continue")}
                isLoading={loading || countriesLoading}
              />
            )}

            <div className="field_validation_error">{error}</div>

            {country?.isBlocked && (
              <div className="field_validation_error">
                {t("Country Blocked", [country?.name])}
              </div>
            )}
          </form>
        </FormProvider>
        {step === 1 && <SmsVerification method={method} />}
      </div>
    </div>
  );
};

export default Login;
