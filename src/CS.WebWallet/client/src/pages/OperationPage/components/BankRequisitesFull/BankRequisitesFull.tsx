import React from "react";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { $data, setFormValid, setRespondent } from "../../OperationPage.store";
import { TransferRespondent } from "@services/TransferService";

const defaultState = {
  beneficiaryIban: "",
  beneficiarySwift: "",
  purpose: "",
  countryId: "",
  firstName: "",
  lastName: "",
};

const TransferRequesites: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { respondent, loading } = useStore($data);
  const style = { marginTop: "10px", resize: "vertical", maxHeight: "50px" } as any;

  return (
    <>
      <input
        className="cs_input"
        style={style}
        type="text"
        disabled={loading}
        placeholder={`${t("IBAN")}*`}
        defaultValue={respondent?.beneficiaryIban}
        {...register("beneficiaryIban", {
          required: "error.iban.required",
          maxLength: {
            value: 35,
            message: "error.iban.length",
          },
          pattern: {
            value: /^[a-zA-Z0-9]{15,34}$/i,
            message: "error.iban.invalid",
          },
        })}
      />
      {errors.beneficiaryIban?.message && (
        <div className="error_div">
          {t(errors.beneficiaryIban.message.toString())}
        </div>
      )}
      <input
        className="cs_input"
        style={style}
        type="text"
        disabled={loading}
        placeholder={t("Swift")}
        defaultValue={respondent?.beneficiarySwift}
        {...register("beneficiarySwift", {
          required: "error.swift.required",
          maxLength: {
            value: 50,
            message: "error.swift.length",
          },
          pattern: {
            value: /^[a-zA-Z0-9\s\-\`\']{2,50}$/i,
            message: "error.swift.invalid",
          },
        })}
      />
      {errors.beneficiarySwift?.message && (
        <div className="error_div">
          {t(errors.beneficiarySwift.message.toString())}
        </div>
      )}
      <div className="name-surname">
        <input
          className="cs_input"
          style={style}
          type="text"
          disabled={loading}
          placeholder={`${t("First Name")}*`}
          defaultValue={respondent?.firstName}
          {...register("firstName", {
            required: "error.firstname.required",
            maxLength: {
              value: 35,
              message: "error.firstname.length",
            },
            pattern: {
              value: /^[a-zA-Z\s\-\`\']{2,35}$/i,
              message: "error.firstname.length",
            },
          })}
        />
        {errors.firstName?.message && (
          <div className="error_div">
            {t(errors.firstName.message.toString())}
          </div>
        )}
      </div>

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
            value: /^[a-zA-Z0-9 \,\-\.\/]{2,105}$/i,
            message: "error.purpose.invalid",
          },
        })}
      />
      {errors.purpose?.message && (
        <div className="error_div">{t(errors.purpose.message.toString())}</div>
      )}
    </>
  );
};

const BankRequisitesFull: React.FC = () => {
  const methods = useForm<TransferRespondent>({
    defaultValues: defaultState,
    mode: "all",
  });
  const {
    trigger,
    getValues,
    formState: { isValid },
  } = methods;

  React.useEffect(() => {
    trigger(Object.getOwnPropertyNames(defaultState) as any);
    setFormValid(isValid);
    const values = getValues();
    setRespondent({
      ...values,
      ...{ countryId: values.beneficiaryIban?.slice(0, 2).toUpperCase() },
    });
  }, [isValid]);

  return (
    <FormProvider {...methods}>
      <form style={{ paddingBottom: "10px" }}>
        <TransferRequesites />
      </form>
    </FormProvider>
  );
};

export default BankRequisitesFull;
