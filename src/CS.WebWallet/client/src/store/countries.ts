import { CountryRow, ReferenceService } from "@services/ReferenceService";
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { pending } from "patronum";

export const countryFetchReceived = createEvent();

export const getCountriesListFx = createEffect(() =>
  ReferenceService.countries()
);

const $countryList = createStore<CountryRow[]>([]);
$countryList.on(getCountriesListFx.doneData, (_, payload) => payload.data);

const $isLoading = pending({ effects: [getCountriesListFx] });

sample({
  clock: countryFetchReceived,
  source: $countryList,
  filter: (countryList) => countryList.length === 0,
  target: getCountriesListFx,
});

export const $countries = combine({
  countries: $countryList,
  isLoading: $isLoading,
});
