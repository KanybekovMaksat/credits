import moment from "moment";

export const localTime = (value?: string) => {
  if (!value) return "";
  return moment.utc(value).local().format("HH:mm");
};

export const formatLocalDateTime = (value: string | undefined): string => {
  if (!value) {
    return "";
  }

  return moment.utc(value).local().format("DD.MM.YYYY, HH:mm");
};

export const toDatePickerFormat = (value: string | undefined): string => {
  if (!value) {
    return "";
  }

  return moment.utc(value).format("yyyy-MM-DD");
};

export const dayMonth = (value?: string) =>
  !value ? "" : moment.utc(value).format("DD, MMM");

export const dayMonthYear = (value?: string) =>
  !value ? "" : moment.utc(value).format("DD, MMM YYYY");

export const localDayOfWeek = (value?: string) => {
  if (!value) return "";

  const day = moment.utc(value).local().day();

  switch (day) {
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thu";
    case 5:
      return "Fri";
    case 6:
      return "Sat";
    case 7:
      return "Sun";
    default:
      return "";
  }
};
