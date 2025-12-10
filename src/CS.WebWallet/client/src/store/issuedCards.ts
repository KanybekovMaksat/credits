import {
  createEvent,
  createStore,
  sample,
  createEffect,
  combine,
} from "effector";
import CardsService, { IssuedCard } from "@services/CardsService";
import { pending } from "patronum";
import { openNewTab } from "@store/navigation.store";

const fetchIssuedCardsFx = createEffect(async () => {
  return CardsService.issuedCards();
});

const setNewPasswordFx = createEffect(
  async (props: { cardId: string; password: string }) => {
    return CardsService.setPassword(props.cardId, props.password);
  }
);

const cardRequisitesFx = createEffect((cardId: string) => {
  return CardsService.requsites(cardId);
});

const checkPasswordFx = createEffect((cardId: string) => {
  return CardsService.checkPassword(cardId);
});
const cardIdReceived = createEvent<string>();

const passwordModalOpen = createEvent();
const passwordModalClosed = createEvent();
const newPasswordReceived = createEvent<string>();
const newPasswordSubmit = createEvent();

const hideCard = createEvent();
const showCard = createEvent();

const $currentCardId = createStore<string | null>(null);
$currentCardId.on(cardIdReceived, (_, payload) => payload);

const $passwordModal = createStore<boolean>(false);

const $newPassword = createStore<string>("");
$newPassword.on(newPasswordReceived, (_, payload) => payload);
const $newPasswordErrors = createStore<string[]>([]);

const $currentCard = createStore<IssuedCard | null>(null);
$currentCard.on(cardRequisitesFx.doneData, (state, payload) => {
  if (payload.data.url !== null) {
    return state;
  }
  return {
    ...state,
    ...payload.data,
  };
});

const $issuedCards = createStore<IssuedCard[]>([]);
$issuedCards.on(fetchIssuedCardsFx.doneData, (_, payload) => payload.data);

sample({
  clock: hideCard,
  source: combine({ $issuedCards, $currentCardId }),
  fn: ({ $issuedCards, $currentCardId }) =>
    $issuedCards.find((f) => f.id === $currentCardId) ?? null,
  target: $currentCard,
});

sample({
  clock: cardIdReceived,
  source: $issuedCards,
  fn: (issuedCards, cardId) => issuedCards.find((f) => f.id === cardId) ?? null,
  target: $currentCard,
});

const $cardVisible = combine(
  $currentCard,
  (currentCard) => currentCard?.pin !== undefined
);
sample({
  clock: showCard,
  source: $currentCardId,
  fn: (currentCardId) => currentCardId ?? "",
  target: cardRequisitesFx,
});

sample({
  clock: cardRequisitesFx.doneData,
  filter: (e) => e.data.url !== null,
  fn: (e) => e.data.url,
  target: openNewTab,
});

sample({
  clock: $newPassword,
  fn: (newPassord) => {
    const res: string[] = [];
    if (newPassord.length < 8) {
      res.push("password_length_8");
    }
    if (newPassord.length > 30) {
      res.push("password_length_30");
    }

    const numberRegular = /\d+/;

    // check if have number
    const matchResult = newPassord.match(numberRegular);
    if (matchResult === null) {
      res.push("password_no_number");
    }

    // leave in string only letters
    const clearedString = newPassord.replace(/[^a-zA-Z]/g, "");

    // check for 1 letter in lowercase
    let haveLowercase = false;
    for (let i = 0; i < clearedString.length; i++) {
      if (clearedString[i].match(numberRegular) !== null) {
        continue;
      }
      if (clearedString[i] === clearedString[i].toLowerCase()) {
        haveLowercase = true;
        break;
      }
    }
    if (haveLowercase === false) {
      res.push("password_no_lowercase");
    }

    // check for 1 letter in uppercase
    let haveUppercase = false;
    for (let i = 0; i < clearedString.length; i++) {
      if (clearedString[i] === clearedString[i].toUpperCase()) {
        haveUppercase = true;
        break;
      }
    }
    if (haveUppercase === false) {
      res.push("password_no_uppercase");
    }

    // repeats 'aAaa" (more than 3 times)
    const repeatRegular = /([a-z])\1+/g;
    const repeatMatchResult = clearedString.toLowerCase().match(repeatRegular);
    if (repeatMatchResult !== null) {
      if (repeatMatchResult.find((f) => f.length >= 3)) {
        res.push("password_no_repeat");
      }
    }

    if (newPassord.indexOf(" ") !== -1) {
      res.push("password_no_whitespace");
    }

    const stringWithSpecial = newPassord.replace(/[a-zA-Z0-9]/g, "");
    const allowedCharacters = [
      "!",
      "#",
      "$",
      "(",
      ")",
      "*",
      "+",
      "-",
      ",",
      ".",
      ";",
      "@",
      "[",
      "]",
      "^",
      "_",
      "{",
      "}",
    ];
    for (let i = 0; i < stringWithSpecial.length; i++) {
      if (allowedCharacters.indexOf(stringWithSpecial[i]) === -1) {
        res.push("password_special_chars");
      }
    }

    return res;
  },
  target: $newPasswordErrors,
});

sample({
  clock: newPasswordSubmit,
  source: combine({ cardId: $currentCardId, password: $newPassword }),
  fn: (src) => ({ cardId: src.cardId ?? "", password: src.password }),
  target: setNewPasswordFx,
});

sample({
  clock: passwordModalOpen,
  source: combine({ cardId: $currentCardId }),
  fn: (src) => src.cardId ?? "",
  target: checkPasswordFx,
});

sample({
  clock: checkPasswordFx.doneData,
  filter: (clc) => clc.data?.url !== null,
  fn: (clc) => {
    if (clc.data?.url !== null) {
      return clc.data?.url ?? "";
    }
    return "";
  },
  target: openNewTab,
});

const $cardRequisitesLoading = pending({ effects: [cardRequisitesFx] });

const $cardLoading = combine(
  $cardRequisitesLoading,
  $currentCard,
  ($cardRequisitesLoading, $currentCard) => {
    return $cardRequisitesLoading || $currentCard?.id === undefined;
  }
);

const $card = combine({
  current: $currentCard,
  visible: $cardVisible,
  loading: $cardLoading,
  passwordModal: $passwordModal,
});

const $newPasswordFlow = combine({
  newPassword: $newPassword,
  passwordErrors: $newPasswordErrors,
});
export {
  $card,
  $issuedCards,
  fetchIssuedCardsFx,
  showCard,
  hideCard,
  cardIdReceived,
  passwordModalOpen,
  passwordModalClosed,
  newPasswordReceived,
  $newPasswordFlow,
  newPasswordSubmit,
};
