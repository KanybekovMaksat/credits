import { Banner, ReferenceService } from "@services/ReferenceService";
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { pending } from "patronum";

export const bannersFetchReceived = createEvent();

export const getBannersFx = createEffect(() => ReferenceService.getBanners());

const $bannersList = createStore<Banner[]>([]).on(
  getBannersFx.doneData,
  (_, payload) => payload.data ?? []
);

const $isLoading = pending({ effects: [getBannersFx] });

sample({
  clock: bannersFetchReceived,
  source: $bannersList,
  filter: (bannersList) => bannersList.length === 0,
  target: getBannersFx,
});

export const $banners = combine({
  banners: $bannersList,
  isLoading: $isLoading,
});
