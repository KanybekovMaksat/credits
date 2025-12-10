import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";

import CardsService, { AddCardRequest, Card } from "@services/CardsService";
import { effectWithResponse } from "@store/utils/effectwrapper";
import { pending, reset } from "patronum";
import { siteChanged } from "@store/navigation.store";

const getCardListFx = createEffect(() => {
  return CardsService.list();
});

export const removeCardFx = createEffect((id: string | null) => {
  return CardsService.removeCard(id);
});

export const addNewCardFx = effectWithResponse(
  createEffect((props: AddCardRequest) => {
    return CardsService.addCard(props);
  })
);

const verifyCardFx = createEffect((props: { cardId: string; cvv: string }) => {
  const successUrl =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port +
    "/cards";
  return CardsService.verify({
    cardId: props.cardId,
    securityCode: props.cvv,
    successUrl,
    failureUrl: successUrl,
  });
});

export const cardModalShown = createEvent();
export const cardModalHidden = createEvent();
export const deleteCardIdUpdated = createEvent<string | null>();
export const deleteCardConfirmed = createEvent();

export const cardStatusModalShown = createEvent<string>();
export const cardStatusModalHidden = createEvent();

export const cvcVerifyReceived = createEvent<string>();
export const verifyCardApproved = createEvent();

const $cvcVerify = createStore<string | null>(null);
$cvcVerify.on(cvcVerifyReceived, (_, payload) => payload);

const $cardList = createStore<Card[]>([]);
const $cardModal = createStore<boolean>(false);
const $cardStatusModal = createStore<string | null>(null);
$cardStatusModal.on(cardStatusModalShown, (_, payload) => payload);
$cardStatusModal.on(cardStatusModalHidden, () => null);

const $deleteCardId = createStore<string | null>(null);

$deleteCardId.on(deleteCardIdUpdated, (_, payload) => payload);
$deleteCardId.on(cardModalHidden, () => null);
$deleteCardId.on(removeCardFx.failData, () => {
  return null;
});
$deleteCardId.on(removeCardFx.doneData, () => null);

$cardModal.on(cardModalShown, () => true);
$cardModal.on(cardModalHidden, () => false);
const $cardsLoaded = createStore<boolean>(false);

$cardList.on(getCardListFx.doneData, (_, state) => state.data);

sample({
  clock: addNewCardFx.doneData,
  target: [getCardListFx, cardModalHidden],
});

sample({
  clock: deleteCardConfirmed,
  source: $deleteCardId,
  fn: (cardId) => cardId,
  target: removeCardFx,
});

sample({ clock: removeCardFx.finally, target: [getCardListFx] });

sample({
  clock: verifyCardFx.doneData,
  filter: (data) => data.data.url === null,
  target: [getCardListFx, cardStatusModalHidden],
});

sample({
  clock: verifyCardFx.doneData,
  filter: (data) => data.data.url !== null,
  fn: (data) => {
    return data.data.url ?? "";
  },
  target: [siteChanged],
});

const $isSavingCard = pending({ effects: [addNewCardFx] });
$cardsLoaded.on(getCardListFx.doneData, () => true);

const $cards = combine({
  cardList: $cardList,
  cardsLoaded: $cardsLoaded,
  cardStatusModal: $cardStatusModal,
  deleteCardId: $deleteCardId,
  isSavingCard: $isSavingCard,
  cardModal: $cardModal,
  deleteId: $deleteCardId,
});

const $isVerifying = pending({ effects: [verifyCardFx] });

sample({
  clock: verifyCardApproved,
  source: { $cardStatusModal, $cvcVerify },
  filter: ({ $cardStatusModal, $cvcVerify }) => {
    return $cvcVerify !== null && $cardStatusModal !== null;
  },
  fn: ({ $cardStatusModal, $cvcVerify }) => {
    return {
      cardId: $cardStatusModal ?? "",
      cvv: $cvcVerify ?? "",
    };
  },
  target: verifyCardFx,
});

export const resetCards = reset({
  target: [$cardList, $cardStatusModal, $cardModal],
});

const $verifyCard = combine({
  cardList: $cardList,
  cardStatusModal: $cardStatusModal,
  cvc: $cvcVerify,
  isVerifying: $isVerifying,
});

export { $cards, $verifyCard, getCardListFx };
