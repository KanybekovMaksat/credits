import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import { $data, setFormValid, setRespondent } from "../../OperationPage.store";
import { TransferRespondent } from "@services/TransferService";

const defaultState = {
  beneficiaryIban: "",
  firstName: "",
  lastName: "",
};

const BankRequisites: React.FC = () => {
  const { t } = useTranslation();
  const { respondent, loading } = useStore($data);
  const methods = useForm<TransferRespondent>({
    defaultValues: defaultState,
    mode: "all",
  });

  const {
    register,
    getValues,
    formState: { isValid, errors },
  } = methods;

  React.useEffect(() => {
    setFormValid(isValid);
    setRespondent(getValues());
  }, [isValid]);

  const style = {
    marginTop: "10px",
    resize: "vertical",
    maxHeight: "50px",
  } as any;
  console.log(errors.purpose);
  return (
    <FormProvider {...methods}>
      <form style={{ paddingBottom: "10px" }}>
        <input
          className="cs_input"
          style={style}
          disabled={loading}
          type="text"
          placeholder={`${t("Recepient")}*`}
          defaultValue={respondent?.firstName}
          {...register("firstName", {
            required: "error.firstname.required",
            maxLength: {
              value: 35,
              message: "error.firstname.length",
            },
            pattern: {
              value: /^[A-Z\s\-\`\']{2,35}$/i,
              message: "error.firstname.length",
            },
          })}
        />
        {errors.firstName?.message && (
          <div className="error_div">{t(errors.firstName.message)}</div>
        )}
        <textarea
          className="cs_input"
          style={style}
          wrap={"soft"}
          rows={2}
          disabled={loading}
          placeholder={`${t("Address")}*`}
          defaultValue={respondent?.beneficiaryAddress}
          {...register("beneficiaryAddress", {
            required: "error.beneficiaryAddress.required",
            maxLength: {
              value: 255,
              message: "error.beneficiaryAddress.length",
            },
            pattern: {
              value: /^[a-zA-Z0-9 \,\-\.\/]{2,105}$/i,
              message: "error.beneficiaryAddress.length",
            },
          })}
        />
        {errors.beneficiaryAddress?.message && (
          <div className="error_div">
            {t(errors.beneficiaryAddress.message)}
          </div>
        )}
        <input
          className="cs_input"
          style={style}
          disabled={loading}
          type="text"
          placeholder={`${t("IBAN")}*`}
          defaultValue={respondent?.beneficiaryIban}
          {...register("beneficiaryIban", {
            required: "error.iban.required",
            maxLength: {
              value: 34,
              message: "error.iban.length",
            },
            pattern: {
              value: /^[A-Z0-9]{15,34}$/i,
              message: "error.iban.length",
            },
          })}
        />
        {errors.beneficiaryIban?.message && (
          <div className="error_div">{t(errors.beneficiaryIban.message)}</div>
        )}
        <input
          className="cs_input"
          style={style}
          type="text"
          disabled={loading}
          placeholder={`${t("Swift/BIC")}*`}
          defaultValue={respondent?.beneficiarySwift}
          {...register("beneficiarySwift", {
            required: "error.swift.required",
            maxLength: {
              value: 50,
              message: "error.swift.length",
            },
            pattern: {
              value: /^[A-Z0-9\s\-\`\']{2,50}$/i,
              message: "error.swift.length",
            },
          })}
        />
        {errors.beneficiarySwift?.message && (
          <div className="error_div">{t(errors.beneficiarySwift?.message)}</div>
        )}
        <textarea
          className="cs_input"
          disabled={loading}
          wrap={"soft"}
          style={style}
          placeholder={`${t("Purpose")}*`}
          defaultValue={respondent?.purpose}
          {...register("purpose", {
            required: "error.purpose.required",
            maxLength: {
              value: 105,
              message: "error.purpose.length",
            },
            pattern: {
              value: /^[A-Z0-9\s\-\`\']{2,50}$/i,
              message: "error.purpose.length",
            },
          })}
        />

        {errors.purpose?.message && (
          <div className="error_div">{t(errors.purpose?.message)}</div>
        )}
      </form>
    </FormProvider>
  );
};

export default BankRequisites;
