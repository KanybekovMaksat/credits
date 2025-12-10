import { AccountRow } from "@services/AccountsService";
import React, { useEffect } from "react";
import "./styles.scss";
import InputWrapper from "@components/InputWrapper/InputWrapper";
import moment from "moment";
import { useForm, useWatch } from "react-hook-form";
import { BlueFilledButton } from "@compv2/Buttons";
import ReportService from "@services/ReportService";
import { useTranslation } from "react-i18next";

export interface StatementByPeriodProps {
  setModal: (value: boolean) => void;
  account: AccountRow | null;
}

const StatementByPeriod: React.FC<StatementByPeriodProps> = (
  props: StatementByPeriodProps
) => {
  const { handleSubmit, reset, control } = useForm();
  const { from, to } = useWatch({ control });
  const { t } = useTranslation();
  useEffect(() => {
    reset({
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
    });
  }, [reset]);

  const setToday = () => {
    reset({
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
    });
  };

  const setWeek = () => {
    reset({
      from: moment().add(-7, "days").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
    });
  };

  const setMonth = () => {
    reset({
      from: moment().startOf("month").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
    });
  };

  const setYear = () => {
    reset({
      from: moment().startOf("year").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
    });
  };

  const onSubmit = (values: any) => {
    const from = moment(values.from);
    const to = moment(values.to);

    ReportService.downloadReport({
      from: (from > to ? to : from)?.format("YYYY-MM-DD"),
      to: (from > to ? from : to)?.format("YYYY-MM-DD"),
      accountId: props.account?.accountId ?? "",
    }).then((res) => {
      const href = window.URL.createObjectURL(res);
      const link = document.createElement("a");
      link.href = href;

      const name = `credits_report_${values.from}-${values.to}.pdf`;

      link.setAttribute("download", name); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="statement-modal">
      <div className="fast-click">
        <a onClick={setToday}>{t("today")}</a>
        <a onClick={setWeek}>{t("week")}</a>
        <a onClick={setMonth}>{t("month")}</a>
        <a onClick={setYear}>{t("year")}</a>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="from-to-row">
          <InputWrapper
            control={control}
            name="from"
            label={`${t("from")}:`}
            rules={{ required: true }}
            value={from}
          >
            <input type="date" />
          </InputWrapper>
          <InputWrapper
            control={control}
            name="to"
            label={`${t("to")}:`}
            rules={{ required: true }}
            value={to}
          >
            <input type="date" />
          </InputWrapper>
        </div>
        <div className="statement-footer-button">
          <BlueFilledButton text={"Download"} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default StatementByPeriod;
