import React from "react";
import { useTranslation } from "react-i18next";
import "./sumsubSuccess.scss";
import { useParams } from "react-router-dom";

const SumSubSuccessPage = () => {
  const { self } = useParams<string>();
  const { t } = useTranslation();

  return (
    <div className="subsum-finished">
      <div>
        <h1>{t("sumsub_finished")}</h1>
        <h4>{t("sumsub_finished_description")}</h4>
        <h4>
          <div>{t("sumsub_please_return")}</div>
        </h4>
        <a
          href={self ? "/accounts" : "https://app.credits.com/ss"}
          className="deeplink"
        >
          {t("sumsub_button_return")}
        </a>
      </div>
    </div>
  );
};

export default SumSubSuccessPage;
