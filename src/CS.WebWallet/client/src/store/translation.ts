import {
  createStore,
  combine,
  createEffect,
  createEvent,
  sample,
} from "effector";
import TranslationService, { Language } from "@services/TranslationService";
import { bannersFetchReceived } from "./banners";
import { getAccountsSilent } from "./accounts";

const $languages = createStore<Language[] | null>(null);
const $currentLanguage = createStore<string>("en");

const languageChanged = createEvent<string>();

const loadTranslationsFx = createEffect(async () => {
  return TranslationService.getTranslations();
});

const setLanguageFx = createEffect((code: string) =>
  TranslationService.setLanguage(code)
);

$currentLanguage.on(languageChanged, (_, payload) => payload);
$languages.on(loadTranslationsFx.doneData, (_, payload) => payload.data);

sample({ clock: languageChanged, target: setLanguageFx });
sample({
  clock: languageChanged,
  target: [bannersFetchReceived, getAccountsSilent],
});

const $translation = combine({
  languages: $languages,
  currentLanguage: $currentLanguage,
});

export { $translation, loadTranslationsFx, languageChanged };
