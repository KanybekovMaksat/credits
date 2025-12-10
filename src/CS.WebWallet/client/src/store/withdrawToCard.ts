import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import AccountsService, { AccountRow } from "@services/AccountsService";

import { debounce } from "patronum/debounce";
import { effectWithResponse } from "@store/utils/effectwrapper";
import { pending, reset } from "patronum";
import TransferService, {
  TransferCheckRequest,
  TransferConfirmedRequest,
} from "@services/TransferService";
import { otpPropertiesReceived } from "@store/otp";

export const withdrawToCardMounted = createEvent();
export const accountChanged = createEvent<AccountRow>();
export const amountChanged = createEvent<string>();
export const cardIdChanged = createEvent<string>();
export const stepChanged = createEvent<0 | 1>();
export const confirmFinished = createEvent();

const amountChangedDebounced = debounce({
  source: amountChanged,
  timeout: 1000,
});

const getWithdrawAccountsFx = createEffect(async () => {
  return await AccountsService.accounts({
    pageIndex: 1,
    pageSize: 1000,
  });
});

export const finishWithdrawFx = effectWithResponse(
  createEffect(async (props: TransferConfirmedRequest) => {
    return TransferService.submit({
      ...props,
      documentId: props.documentId,
      confirmed: true,
      cardId: props.cardId,
    });
  })
);

export const checkFx = createEffect(async (props: TransferCheckRequest) => {
  return TransferService.check(props);
});

const $step = createStore<0 | 1>(0);
const $accounts = createStore<AccountRow[]>([]);
const $amount = createStore<string | null>(null);
const $documentId = createStore<string | null>(null);
const $account = createStore<AccountRow | null>(null);
const $commission = createStore<string | null>(null);
const $error = createStore<string | null>(null);
const $cardId = createStore<string | null>(null);

$accounts.on(getWithdrawAccountsFx.doneData, (_, payload) =>
  payload.data.filter((f) => !f.isCrypto)
);
$documentId.on(checkFx.doneData, (_, payload) => payload.data.documentId);
$documentId.on(checkFx.failData, () => null);

$amount.on(amountChangedDebounced, (_, payload) => payload);
$commission.on(checkFx.doneData, (_, payload) => {
  return payload.data.fee.size + " " + payload.data.fee.ticker;
});
$commission.on(checkFx.failData, () => null);

$error.on(checkFx.failData, (_, payload: any) => payload);
$error.on(checkFx.doneData, () => null);
$cardId.on(cardIdChanged, (_, payload) => payload);
$account.on(accountChanged, (_, payload) => payload);

$step.on(stepChanged, (_, payload) => payload);

sample({
  clock: $accounts,
  filter: (accounts) => accounts.length > 0,
  fn(accounts) {
    return accounts[0];
  },
  target: $account,
});

sample({
  clock: combine({ amount: $amount, cardId: $cardId }),
  source: [$account, $documentId, $cardId],
  filter: (src, { amount }) => {
    const [account, , cardId] = src;

    return (
      amount !== "" &&
      amount !== null &&
      amount !== "0" &&
      amount !== "0.0" &&
      amount !== "0." &&
      !!account &&
      !!cardId
    );
  },
  fn: (src: any, { amount }) => {
    const [account, documentId, cardId] = src;
    const res: TransferCheckRequest = {
      amountFrom: amount ?? "",
      accountFromId: account?.accountId ?? "",
      respondent: { cardId },
    };
    if (documentId !== null) {
      res.documentId = documentId;
    }
    return res;
  },
  target: checkFx,
});

sample({
  clock: $account,
  source: [$amount, $documentId, $cardId],
  filter: (src) => {
    const [amount, , cardId] = src;
    return amount !== "" && amount !== null && !!cardId;
  },
  fn: (src, account) => {
    const [amount, documentId, cardId] = src;
    const res: TransferCheckRequest = {
      amountFrom: amount ?? "",
      accountFromId: account?.accountId ?? "",
      respondent: { cardId: cardId ?? "" },
    };
    if (documentId !== null) {
      res.documentId = documentId;
    }
    return res;
  },
  target: checkFx,
});

sample({
  clock: withdrawToCardMounted,
  target: [getWithdrawAccountsFx],
});

const $isWithdrawConfirmProcessing = pending({ effects: [finishWithdrawFx] });

const redirectEffect = createEffect((newUrl: any) => {
  window.location.href = newUrl;
});

sample({
  clock: finishWithdrawFx.doneData,
  source: $documentId,
  filter: (documentId, clk) => {
    return documentId !== null && clk.data?.otp?.validated === false;
  },
  fn: (documentId) => {
    return {
      data: {
        documentId,
        confirmed: true,
      },
      cb: finishWithdrawFx,
    };
  },
  target: otpPropertiesReceived,
});

sample({
  clock: finishWithdrawFx.doneData,
  source: $documentId,
  filter: (documentId, clk) => {
    return documentId !== null && clk.data?.otp?.validated === true;
  },
  fn: (src, clk) => {
    if (clk.data.redirectUrl) {
      return clk.data.redirectUrl;
    }
    return `/accounts/${src}`;
  },
  target: redirectEffect,
});

// sample({
//   clock: finishWithdrawFx.doneData,
//   source: $account,
//   fn: (src, clk) => {
//     if (clk.data.redirectUrl) {
//       return clk.data.redirectUrl;
//     }
//     return `/accounts/${src?.accountId}`;
//   },
//   target: redirectEffect,
// });

sample({
  clock: confirmFinished,
  source: [$documentId, $cardId],
  fn: (src) => {
    const [documentId, cardId] = src;
    return {
      documentId,
      cardId,
    };
  },
  target: finishWithdrawFx,
});

const $checked = createStore<boolean>(false);
$checked.on(checkFx.doneData, () => true);
$checked.on(checkFx.failData, () => false);

const $disableContinue = combine(
  $checked,
  $documentId,
  $cardId,
  (checked, documentId, cardId) => {
    return !checked || documentId === null || cardId === null;
  }
);

export const resetWithdraw = reset({
  target: [$amount, $accounts, $account, $cardId, $error, $step, $commission],
});

export const $withdrawToCard = combine({
  amount: $amount,
  accounts: $accounts,
  account: $account,
  cardId: $cardId,
  error: $error,
  step: $step,
  commission: $commission,
  disableContinue: $disableContinue,
  isWithdrawConfirmProcessing: $isWithdrawConfirmProcessing,
});
