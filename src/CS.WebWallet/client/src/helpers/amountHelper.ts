import BigNumber from "bignumber.js";
// import { HistoryRow, HistoryTypes } from "@services/HistoryService";

export const normalizeNumber = (value?: string | number) => {
  if (value === undefined) return;
  if (Number(value) === 0) return "0.00";

  if (typeof value === "string") {
    if (!value.includes(".")) {
      return value;
    }

    let index;
    for (let i = value.length - 1; i >= 0; i--) {
      if (value[i] === "0") {
        continue;
      }

      if (+value[i] > 0) {
        index = i + 1;
        break;
      }

      if (value[i] === ".") {
        index = i + 3;
        break;
      }
    }
    return index && value.substring(0, index);
  } else {
    return new BigNumber(value).toString(10);
  }
};

export const getPrecision = (e: number) => {
  const s = e + "",
    d = s.indexOf(".") + 1;

  return !d ? 0 : s.length - d;
};

export const toNum = (e: string | number): number => {
  if (!e) return 0;
  return Number(e.toString().replace(" ", ""));
};
