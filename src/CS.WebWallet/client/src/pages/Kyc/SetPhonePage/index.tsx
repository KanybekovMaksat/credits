import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "effector-react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SelectCountryPhoneCode from "@components/SelectCountryPhoneCode";
import { BlueFilledButton } from "@compv2/Buttons";
import CodeInput from "@compv2/Inputs/CodeInput";
import { $kyc } from "@store/kyc/kyc";
import {
  $phonePage,
  confirmCode,
  resetError,
  setCode,
  setPhoneRequested,
} from "./phone.store";

import "./styles.scss";

const SetPhonePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { error, step, loading } = useStore($phonePage);
  const { phone } = useStore($kyc);
  const methods = useForm();
  const { handleSubmit, register, getValues } = methods;

  const next = () => {
    const values = getValues();
    if (step === 0)
      setPhoneRequested({
        stageId: phone?.id ?? 0,
        countryId: values.country.id,
        phone: "+" + values.country["phoneCodes"][0] + values.phone,
      });

    if (step === 1) confirmCode();
  };

  React.useEffect(() => {
    if (phone?.status === 2) navigate("/kyc/personal-information");
  }, [phone]);

  return (
    <div className="edit_settings_modal" style={{ width: "550px" }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(next)}>
          <span className="modal-title">{t("set_phone_title")}</span>
          <div className="description" style={{ paddingTop: "10px" }}>
            {t("set_phone_notification")}
          </div>
          <div className="new_number">{t("set_phone_new_number")}</div>
          <div className="phone-set-area">
            <SelectCountryPhoneCode />
            <input
              type="number"
              className="cs_input simple-input"
              onKeyPress={(event: any) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
                resetError();
              }}
              {...register("phone")}
            />
          </div>
          {step == 1 && (
            <div style={{ marginBottom: "10px" }}>
              <div className="description">{t("set_phone_send_sms")}</div>
              <div className="new_number">{t("set_phone_code_sms")}</div>
              <CodeInput onChange={(e) => setCode(e)} />
            </div>
          )}

          <div
            className="continue_button_wrapper"
            style={{ marginBottom: "10px" }}
          >
            <BlueFilledButton
              isLoading={loading}
              text={t("Continue")}
              type="submit"
            />
          </div>
        </form>
      </FormProvider>
      {error && (
        <div className="error_div" style={{ marginTop: "10px" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default SetPhonePage;
