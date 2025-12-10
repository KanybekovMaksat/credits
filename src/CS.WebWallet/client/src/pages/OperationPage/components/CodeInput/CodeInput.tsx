import React from "react";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import SecurityCodeInput from "@compv2/Modals/NewCardModal/SecurityCodeInput";
import { $data, resendOtp, setCode, setCvc } from "../../OperationPage.store";

import "./CodeInput.scss";

const CodeInput: React.FC = () => {
  const { t } = useTranslation();
  const { submit, check, fromOption, loading } = useStore($data);
  const [timer, setTimer] = React.useState(0);
  const submitCode = submit?.status === 10;

  const tmr = setTimeout(() => {
    if (timer > 0) {
      setTimer(timer - 1);
    }
  }, 1000);

  React.useEffect(() => {
    if (!submit?.otp || timer > 0) return;
    setTimer(submit.otp.resendAfter);
  }, [submit]);

  if (
    !submitCode &&
    (fromOption.type !== "appCard" || (fromOption.type === "appCard" && !check))
  )
    return <></>;

  return (
    <div className="operation-code-input">
      <p>
        {submitCode ? t("operation.confirm.otp") : t("operation.confirm.cvc")}
      </p>
      <div className="code-area">
        <SecurityCodeInput
          maskLength={submit ? 6 : 3}
          placeholder={
            submitCode
              ? t("modal.confirm.otp.placeholder")
              : t("modal.confirm.cvc.placeholder")
          }
          disabled={loading}
          onChange={(e) => (submitCode ? setCode(e) : setCvc(e))}
        />
      </div>
      {submitCode && timer === 0 && (
        <div
          className="re-send-action"
          onClick={() => resendOtp(submit.documentId)}
        >
          {t("otp.resend.action")}
        </div>
      )}
      {submitCode && timer > 0 && (
        <div className="re-send-hint">
          {t("otp.resend.title")} {timer} {t("otp.resend.seconds")}
        </div>
      )}
    </div>
  );
};

export default CodeInput;
