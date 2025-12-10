import React from "react";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { Collapse, Form, Input } from "antd";
import { CaretRightOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { $data, setFormValid, setRespondent } from "../../OperationPage.store";
import { TransferRespondent } from "@services/TransferService";
import "./styles.scss";

const defaultState = {
  beneficiaryIban: "",
  beneficiarySwift: "",
  purpose: "",
  countryId: "",
  firstName: "",
  lastName: "",
};

const TransferRequesitesSwift: React.FC = () => {
  const { t } = useTranslation();
  const [intActive, setIntActive] = React.useState<boolean>(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { respondent, loading } = useStore($data);
  const style = {
    marginTop: "10px",
    resize: "vertical",
    maxHeight: "50px",
  } as any;

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
      <div className="name-surname">
        <input
          className="cs_input"
          style={style}
          type="text"
          disabled={loading}
          placeholder={`${t("Name")}*`}
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
        <textarea
          className="cs_input"
          style={style}
          wrap={"soft"}
          disabled={loading}
          placeholder={`${t("Address")}*`}
          defaultValue={respondent?.beneficiaryAddress}
          {...register("beneficiaryAddress", {
            required: "error.beneficiaryAddress.required",
            maxLength: {
              value: 105,
              message: "error.beneficiaryAddress.length",
            },
            pattern: {
              value: /^[a-zA-Z0-9 \,\-\.\/]{2,105}$/i,
              message: "error.beneficiaryAddress.invalid",
            },
          })}
        />
        {errors.beneficiaryAddress?.message && (
          <div className="error_div">
            {t(errors.beneficiaryAddress.message.toString())}
          </div>
        )}
      </div>
      <br />

      <div className="txt-bold-16">{t("operation.swift.beneficiary-bank")}</div>
      <input
        className="cs_input"
        style={style}
        type="text"
        disabled={loading}
        placeholder={t("Bank name")}
        defaultValue={respondent?.beneficiaryBankName}
        {...register("beneficiaryBankName", {
          required: "error.beneficiaryBankName.required",
          maxLength: {
            value: 255,
            message: "error.beneficiaryBankName.length",
          },
          pattern: {
            value: /^[a-zA-Z0-9 \,\-\.\/]{2,255}$/i,
            message: "error.beneficiaryBankName.invalid",
          },
        })}
      />
      {errors.beneficiaryBankName?.message && (
        <div className="error_div">
          {t(errors.beneficiaryBankName.message.toString())}
        </div>
      )}
      <textarea
        className="cs_input"
        style={style}
        wrap={"soft"}
        disabled={loading}
        placeholder={t("Bank address")}
        defaultValue={respondent?.beneficiaryBankAddress}
        {...register("beneficiaryBankAddress", {
          maxLength: {
            value: 105,
            message: "error.beneficiaryBankAddress.length",
          },
          pattern: {
            value: /^[a-zA-Z0-9 \,\-\.\/]{2,105}$/i,
            message: "error.beneficiaryBankAddress.invalid",
          },
          required: "error.beneficiaryBankAddress.required",
        })}
      />
      {errors.beneficiaryBankAddress?.message && (
        <div className="error_div">
          {t(errors.beneficiaryBankAddress.message.toString())}
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
      <br />
      <br />

      <div className="txt-bold-16">{t("operation.swift.payment-purpose")}</div>
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
      <textarea
        className="cs_input"
        disabled={loading}
        wrap={"soft"}
        style={style}
        placeholder={`${t("Purpose additional")}`}
        defaultValue={respondent?.purposeAdditional}
        {...register("purposeAdditional", {
          maxLength: {
            value: 105,
            message: "error.purposeAdditional.length",
          },
          pattern: {
            value: /^[a-zA-Z0-9 \,\-\.\/]{2,105}$/i,
            message: "error.purposeAdditional.invalid",
          },
        })}
      />
      {errors.purposeAdditional?.message && (
        <div className="error_div">
          {t(errors.purposeAdditional.message.toString())}
        </div>
      )}

      <Collapse
        bordered={false}
        style={{ backgroundColor: "transparent" }}
        expandIcon={({ isActive }) => {
          setIntActive(isActive ?? false);
          return <></>;
        }}
        expandIconPosition="end"
        items={[
          {
            key: "main",
            label: (
              <span className="txt-bold-16">
                {t("operation.swift.intermediary")}{" "}
                <CaretRightOutlined
                  width={10}
                  height={10}
                  rotate={intActive ? 90 : 0}
                />
              </span>
            ),
            children: (
              <>
                <input
                  className="cs_input"
                  disabled={loading}
                  type="text"
                  style={style}
                  placeholder={`${t("Intermediary bank name")}*`}
                  defaultValue={respondent?.intermediaryBankName}
                  {...register("intermediaryBankName", {
                    pattern: {
                      value: /^[a-zA-Z0-9 \,\-\.\/]{0,255}$/i,
                      message: "error.intermediaryBankName.invalid",
                    },
                    maxLength: {
                      value: 255,
                      message: "error.intermediaryBankName.length",
                    },
                  })}
                />
                {errors.intermediaryBankName?.message && (
                  <div className="error_div">
                    {t(errors.intermediaryBankName.message.toString())}
                  </div>
                )}
                <textarea
                  className="cs_input"
                  disabled={loading}
                  wrap={"soft"}
                  style={style}
                  placeholder={`${t("Intermediary bank address")}*`}
                  defaultValue={respondent?.intermediaryBankAddress}
                  {...register("intermediaryBankAddress", {
                    maxLength: {
                      value: 105,
                      message: "error.intermediaryBankAddress.length",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9 \,\-\.\/]{0,105}$/i,
                      message: "error.intermediaryBankAddress.invalid",
                    },
                  })}
                />
                {errors.intermediaryBankAddress?.message && (
                  <div className="error_div">
                    {t(errors.intermediaryBankAddress.message.toString())}
                  </div>
                )}
              </>
            ),
          },
        ]}
      />
    </>
  );
};

const BankRequisitesFullSwift: React.FC = () => {
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
        <TransferRequesitesSwift />
      </form>
    </FormProvider>
  );
};

export default BankRequisitesFullSwift;
