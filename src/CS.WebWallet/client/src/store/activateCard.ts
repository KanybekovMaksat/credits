import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import CardsService from "@services/CardsService";
import { pending, reset } from "patronum";
import { fetchIssuedCardsFx } from "@store/issuedCards";

const activateCardModalShow = createEvent<string>();
const activateCardModalHidden = createEvent();
const startActivation = createEvent();
const confirmCodeReceived = createEvent<string>();
const activationFinished = createEvent();

const activateFx = createEffect((cardId: string) => {
  return CardsService.activateIssued(cardId);
});

const confirmActivationFx = createEffect(
  (props: { key: string; code: string }) => {
    return CardsService.confirmActivation(props.key, props.code);
  }
);

const $error = createStore<string | null>(null);
$error.on(activateFx.failData, (_, payload: any) => payload);
$error.on(confirmActivationFx.failData, (_, payload: any) => payload);

const $step = createStore<0 | 1 | 2>(0);
$step.on(activateFx.doneData, (_, payload) => {
  if (!payload.data.requiresConfirmation) return 2;
  return 1;
});
$step.on(confirmActivationFx.doneData, () => 2);

const $currentCode = createStore<string | null>(null);
$currentCode.on(confirmCodeReceived, (_, payload) => payload);

const $currentCardId = createStore<string | null>(null);
$currentCardId.on(activateCardModalShow, (_, payload) => payload);
$currentCardId.on(activateCardModalHidden, () => null);

const $requestKey = createStore<string | null>(null);
$requestKey.on(activateFx.doneData, (_, payload) => payload.data.requestKey);

const $needsConfirmation = createStore<boolean | null>(null);
$needsConfirmation.on(
  activateFx.doneData,
  (_, payload) => payload.data.requiresConfirmation
);

const $modalShown = combine($currentCardId, ($currentCardId) => {
  return $currentCardId !== null;
});

const $startActivationPending = pending({ effects: [activateFx] });
const $confirmActivationPending = pending({ effects: [confirmActivationFx] });

sample({
  clock: startActivation,
  source: $currentCardId,
  fn: (currentCardId) => currentCardId ?? "",
  target: activateFx,
});

sample({
  clock: $currentCode,
  source: $requestKey,
  filter: (_, currentCode) => {
    return currentCode !== null && currentCode.length > 5;
  },
  fn: (requestKey, currentCode) => ({
    key: requestKey ?? "",
    code: currentCode ?? "",
  }),
  target: confirmActivationFx,
});

export const resetActivation = reset({
  target: [
    $error,
    $step,
    $currentCode,
    $currentCardId,
    $requestKey,
    $needsConfirmation,
  ],
});

sample({
  clock: activationFinished,
  target: [resetActivation, fetchIssuedCardsFx],
});

const $codeLength = combine($currentCode, (code) => code?.length ?? 0);

const $activateCard = combine({
  activateCardModalShown: $modalShown,
  step: $step,
  startActivationPending: $startActivationPending,
  confirmActivationPending: $confirmActivationPending,
  error: $error,
  codeLength: $codeLength,
});

export {
  activateCardModalShow,
  activateCardModalHidden,
  activationFinished,
  confirmCodeReceived,
  startActivation,
  $activateCard,
};
