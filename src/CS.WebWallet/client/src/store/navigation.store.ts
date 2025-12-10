import { createEffect, createEvent, createStore, sample } from "effector";
import { NavigateFunction } from "react-router-dom";

export const siteChanged = createEvent<string>();
export const openNewTab = createEvent<string>();
export const pageChanged = createEvent<string>();
export const navigationReceived = createEvent<NavigateFunction>();
export const $navigation = createStore<NavigateFunction | null>(null);
$navigation.on(navigationReceived, (_, payload) => payload);

const pageChangedFx = createEffect(
  (props: { navigator: NavigateFunction | null; url: string }) => {
    props.navigator?.(props.url);
  }
);

sample({
  clock: pageChanged,
  source: { navigator: $navigation },
  fn: ({ navigator }, url) => {
    return { navigator, url };
  },
  target: pageChangedFx,
});

const siteChangedFx = createEffect((props: { url: string }) => {
  window.location.assign(props.url);
});

sample({
  clock: siteChanged,
  fn: (url) => ({ url }),
  target: siteChangedFx,
});

const linkInNewTabFx = createEffect((props: { url: string }) => {
  window.open(props.url, "_blank");
});

sample({
  clock: openNewTab,
  fn: (url) => {
    return { url };
  },
  target: linkInNewTabFx,
});
