import { status } from "patronum/status";
import { combine, createEvent, sample } from "effector";
import { getKycStatusFx } from "@store/kyc/kyc";
import { getMessagesFx } from "@store/displayableMessages";
import { every } from "patronum";
import { loadShowcaseFx } from "@store/showcase";
import { referralTokenFx } from "@store/partner";
import { countryFetchReceived, getCountriesListFx } from "@store/countries";
import { getAccountsFx } from "@store/accounts";
import { fetchIssuedCardsFx } from "@store/issuedCards";
import { loadTariffsFx } from "@store/tariffs";
import { bannersFetchReceived, getBannersFx } from "./banners";

export const layoutMounted = createEvent();
export const layoutUnMounted = createEvent();

const $kycLoaded = status({ effect: getKycStatusFx }).reset(layoutUnMounted);

const $messagesLoaded = status({ effect: getMessagesFx }).reset(
  layoutUnMounted
);

const $showcasesLoaded = status({ effect: loadShowcaseFx }).reset(
  layoutUnMounted
);

const $referralUrlLoaded = status({ effect: referralTokenFx }).reset(
  layoutUnMounted
);

const $countriesLoaded = status({ effect: getCountriesListFx }).reset(
  layoutUnMounted
);

const $bannersLoaded = status({ effect: getBannersFx }).reset(layoutUnMounted);

const $accountsLoaded = status({ effect: getAccountsFx }).reset(
  layoutUnMounted
);

const $issuedCardsLoaded = status({ effect: fetchIssuedCardsFx }).reset(
  layoutUnMounted
);

const $tariffsLoaded = status({ effect: loadTariffsFx }).reset(layoutUnMounted);

const $loaded = every({
  predicate: (value) => value === "done" || value === "fail",
  stores: [
    $kycLoaded,
    $messagesLoaded,
    $showcasesLoaded,
    $referralUrlLoaded,
    $countriesLoaded,
    $bannersLoaded,
    $accountsLoaded,
    $issuedCardsLoaded,
    $tariffsLoaded,
  ],
});

sample({
  clock: layoutMounted,
  source: $loaded,
  filter: (loaded) => loaded === false,
  target: [
    getKycStatusFx,
    getMessagesFx,
    loadShowcaseFx,
    referralTokenFx,
    fetchIssuedCardsFx,
    getAccountsFx,
    loadTariffsFx,
    countryFetchReceived,
    bannersFetchReceived,
  ],
});

export const $layoutStatus = combine({
  loaded: $loaded,
});
