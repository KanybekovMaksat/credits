import React, { FC } from "react";
import "./edit-settings-modal.scss";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import {
  $phoneKyc,
  nextStepRequested,
  setCode,
  resetError,
} from "@store/kyc/phone";
import SelectCountryPhoneCode from "@components/SelectCountryPhoneCode";
import CodeInput from "@compv2/Inputs/CodeInput";
import { BlueFilledButton } from "@compv2/Buttons";

const EditPhone: FC = () => {
  const { error, code, step, loading } = useStore($phoneKyc);
  const methods = useForm();
  const { handleSubmit, register, getValues } = methods;
  const { t } = useTranslation();

  const next = async () => {
    const values = getValues();
    nextStepRequested({
      countryId: values.country.id,
      newValue: "+" + values.country["phoneCodes"][0] + values.phone,
    });
  };

  return (
    <div className="edit_settings_modal">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(next)}>
          <span className="modal-title">{t("change_phone_title")}</span>
          <div className="description" style={{ paddingTop: "10px" }}>
            {t("change_phone_notification")}
          </div>
          <div className="new_number">{t("change_phone_new_number")}</div>
          <div className="phone-area">
            <SelectCountryPhoneCode />
            <input
              type="number"
              className="simple-input"
              onKeyPress={(event: any) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
                resetError();
              }}
              {...register("phone")}
            />
          </div>
          {step > 1 && (
            <div style={{ marginBottom: "10px" }}>
              <div className="description">{t(`change_phone_send_email_step${step}`)}</div>
              <div className="new_number">{t(`change_phone_code_email_step${step}`)}</div>
              <CodeInput value={code} onChange={(e) => setCode(e)} />
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

export default EditPhone;
