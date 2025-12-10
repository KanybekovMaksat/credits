export const ObjTextByValue = (en: any, value: number | string | undefined) => {
  if (value === undefined) return "";
  const keys = Object.keys(en) as (keyof any)[];
  for (const key in keys) {
    if (en[keys[key]].id === value) {
      return en[keys[key]].i18n;
    }
  }
  return "NOT_FOUND";
};

export const KycPageByValue = (en: any, value: number | string | undefined) => {
  if (value === undefined) return "";
  const keys = Object.keys(en) as (keyof any)[];
  for (const key in keys) {
    if (en[keys[key]].id === value) {
      return en[keys[key]].page;
    }
  }
  return "NOT_FOUND";
};
