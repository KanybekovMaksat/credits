import {
  createEffect,
  createStore,
  combine,
  createEvent,
  sample,
} from "effector";
import { pending, reset } from "patronum";
import ShowcasesService, { ShowcaseItem } from "@services/ShowcasesService";
import { ShowcaseTypes } from "@enums/showcaseTypes";
import { $translation } from "./translation";

export const loadShowcaseFx = createEffect((locale: string) =>
  ShowcasesService.list(locale)
);

const $data = createStore<ShowcaseItem[]>([])
  .on(loadShowcaseFx.doneData, (_, payload) => payload.data)
  .on(loadShowcaseFx.fail, () => []);

const $isLoading = pending({ effects: [loadShowcaseFx] });

const $crypto = combine($data, (data) =>
  data.filter((f) => f.showcaseType === ShowcaseTypes.Crypto)
);
const $bank = combine($data, (data) =>
  data.filter((f) => f.showcaseType === ShowcaseTypes.Bank)
);
const $fiat = combine($data, (data) =>
  data.filter((f) => f.showcaseType === ShowcaseTypes.Fiat)
);
const $cards = combine($data, (data) =>
  data.filter((f) => f.showcaseType === ShowcaseTypes.Cards)
);
const $brokerage = combine($data, (data) =>
  data.filter((f) => f.showcaseType === ShowcaseTypes.Brokerage)
);

const $deposits = combine($data, (data) =>
  data.filter((f) => f.showcaseType === ShowcaseTypes.Deposit)
);

export const resetShowcases = reset({
  target: [$data],
});

export const fetchShowCases = createEvent();

sample({
  clock: fetchShowCases,
  source: { translation: $translation },
  fn: ({ translation }) => translation.currentLanguage,
  target: loadShowcaseFx,
});

export const $showcase = combine({
  crypto: $crypto,
  bank: $bank,
  fiat: $fiat,
  cardProducts: $cards,
  brokerage: $brokerage,
  deposits: $deposits,
  isLoading: $isLoading,
});
