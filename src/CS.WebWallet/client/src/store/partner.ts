import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import ReferralService, { ReferralHistory } from "@services/ReferralService";
import moment from "moment/moment";
import { pending, reset } from "patronum";

export const historyNeedsReceived = createEvent();
export const referralPageUnmounted = createEvent();

export const fromReceived = createEvent<string>();
export const toReceived = createEvent<string>();
export const todayReceived = createEvent();
export const weekReceived = createEvent();
export const monthReceived = createEvent();
export const yearReceived = createEvent();

export const referralTokenFx = createEffect(async () =>
  ReferralService.token()
);
const referralHistoryFx = createEffect(
  async (props: { from: string; to: string }) =>
    ReferralService.history({
      filter: {
        from: props.from + "T00:00:01Z",
        to: props.to + "T23:59:59Z",
      },
    })
);

const $token = createStore<string | null>(null);
$token.on(referralTokenFx.doneData, (_, payload) => payload.data.token);

const $url = createStore<string | null>(null);
$url.on(referralTokenFx.doneData, (_, payload) => payload.data.referralUrl);

const $history = createStore<ReferralHistory[]>([]);
$history.on(referralHistoryFx.doneData, (_, payload) => payload.data);
const $from = createStore<string>("");
$from.on(fromReceived, (_, payload) => payload);

$from.on(todayReceived, () => moment().format("YYYY-MM-DD"));
$from.on(weekReceived, () => moment().add(-7, "days").format("YYYY-MM-DD"));
$from.on(monthReceived, () => moment().startOf("month").format("YYYY-MM-DD"));
$from.on(yearReceived, () => moment().startOf("year").format("YYYY-MM-DD"));

const $to = createStore<string>("");
$to.on(toReceived, (_, payload) => payload);

$to.on(todayReceived, () => moment().format("YYYY-MM-DD"));
$to.on(weekReceived, () => moment().format("YYYY-MM-DD"));
$to.on(monthReceived, () => moment().format("YYYY-MM-DD"));
$to.on(yearReceived, () => moment().format("YYYY-MM-DD"));

const fromTo = combine({
  from: $from,
  to: $to,
});
const referralHistoryAttachedFx = attach({
  effect: referralHistoryFx,
  source: fromTo,
  mapParams: (_, data) => {
    return data;
  },
});

sample({
  clock: historyNeedsReceived,
  target: [todayReceived],
});

sample({
  clock: fromTo,
  target: referralHistoryAttachedFx,
});

const $isLoading = pending({ effects: [referralHistoryFx] });

export const resetPartner = reset({
  target: [$url, $from, $to, $history],
});

export const $referral = combine({
  url: $url,
  from: $from,
  to: $to,
  history: $history,
  isLoading: $isLoading,
});
