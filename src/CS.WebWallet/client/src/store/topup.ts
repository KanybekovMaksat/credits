import {
  combine,
  createEvent,
  createStore,
  createEffect,
  sample,
} from "effector";
import { debounce } from "patronum/debounce";
import AccountsService, { AccountRow } from "@services/AccountsService";
import { pending, reset } from "patronum";
import { effectWithResponse } from "@store/utils/effectwrapper";
import TransferService, {
  TransferCheckRequest,
  TransferCheckResponse,
} from "@services/TransferService";
const topupMounted = createEvent();
const topupUnmounted = createEvent();

const $amount = createStore<string>("");
const $fee = createStore<string | null>(null);
const $account = createStore<AccountRow | null>(null);
const $accounts = createStore<AccountRow[]>([]);
const $error = createStore<string | null>(null);
const $isLoading = createStore<boolean>(false);
const $rate = createStore<TransferCheckResponse | null>(null);
const $cardId = createStore<string | null>(null);
const $documentId = createStore<string | null>(null);

const $step = createStore<1 | 2>(1);
const stepUpdated = createEvent<1 | 2>();
$step.on(stepUpdated, (_, payload) => payload);

export const topUpAccountsFx = createEffect(async () => {
  return AccountsService.accounts({ pageIndex: 1, pageSize: 1000 });
});

export const topUpPaymentFx = createEffect((props: TransferCheckRequest) => {
  return TransferService.check(props);
});
$documentId
  .on(topUpPaymentFx.doneData, (_, payload) => payload.data.documentId)
  .on(topUpPaymentFx.failData, () => null);
$error.on(topUpPaymentFx.failData, (_, payload: any) => {
  return payload.message || payload;
});

$error.on(topUpPaymentFx.doneData, () => {
  return null;
});

$rate.on(topUpPaymentFx.doneData, (_, payload) => payload.data);
$rate.on(topUpPaymentFx.failData, () => null);

const $firstStepMounted = createStore<boolean>(false);

const cardIdUpdated = createEvent<string>();
$firstStepMounted.on(topupMounted, () => true);

$cardId.on(cardIdUpdated, (_, payload) => payload);

const accountChanged = createEvent<AccountRow>();
$account.on(accountChanged, (_, payload) => {
  return payload;
});

const amountChanged = createEvent<string>();
const amountChangedDebounced = debounce({
  source: amountChanged,
  timeout: 1500,
});

$amount.on(amountChanged, (_, payload) => payload);

const $disableContinue = combine(
  $account,
  $amount,
  $error,
  $rate,
  $cardId,
  (account, amount, error, rate, cardId) => {
    return !(
      error === null &&
      amount !== "" &&
      rate !== null &&
      account !== null &&
      !!cardId
    );
  }
);

$accounts.on(topUpAccountsFx.doneData, (_, payload) => {
  return payload.data.filter((f) => !f.isCrypto);
});

$isLoading.on(topUpAccountsFx.pending, (_, payload) => payload);
$isLoading.on(topUpPaymentFx.pending, (_, payload) => payload);

sample({
  clock: amountChangedDebounced,
  source: [$account, $cardId],
  filter: (src, amount) => {
    const [, cardId] = src;
    return amount !== "" && !!cardId;
  },
  fn: (src, amount): TransferCheckRequest => {
    const [account, cardId] = src;
    return {
      amountTo: amount,
      accountToId: (account as AccountRow)?.accountId || "",
      amountFrom: amount,
      respondent: {
        cardId: cardId?.toString(),
      },
    };
  },
  target: topUpPaymentFx,
});

sample({
  clock: cardIdUpdated,
  source: [$account, $amount],
  filter: (src, cardId) => {
    const [account, amount] = src;
    return amount !== "" && !!account && !!cardId;
  },
  fn: (src, cardId): TransferCheckRequest => {
    const [account, amount] = src;
    return {
      amountTo: amount?.toString(),
      accountToId: (account as AccountRow)?.accountId || "",
      amountFrom: amount?.toString() ?? "0",
      respondent: {
        cardId: cardId?.toString(),
      },
    };
  },
  target: topUpPaymentFx,
});

sample({
  clock: accountChanged,
  source: [$amount, $cardId],
  filter: (src) => {
    const [amount, cardId] = src;
    return amount !== "" && !!cardId;
  },
  fn: (src, account): TransferCheckRequest => {
    const [amount, cardId] = src;
    return {
      amountTo: amount ?? "",
      accountToId: (account as AccountRow)?.accountId || "",
      amountFrom: amount ?? "",
      respondent: {
        cardId: cardId?.toString(),
      },
    };
  },
  target: topUpPaymentFx,
});

sample({
  clock: topupMounted,
  target: topUpAccountsFx,
});

sample({
  clock: $accounts,
  filter: (accounts) => accounts.length > 0,
  fn(accounts) {
    return accounts[0];
  },
  target: $account,
});

const $terms = createStore<boolean>(true);

// --- confirm section ---- ///
const $cvcModal = createStore<boolean>(false);
const $cvc = createStore<string | null>(null);

export const confirmStarted = createEvent();
export const confirmFinished = createEvent();
export const confirmAborted = createEvent();
export const cvcUpdated = createEvent<string>();
$cvcModal.on(confirmStarted, () => true);
$cvcModal.on(confirmAborted, () => false);

$cvc.on(confirmAborted, () => null);
$cvc.on(cvcUpdated, (_, payload) => payload);

export const finishTopUpFx = effectWithResponse(
  createEffect(
    async (props: {
      documentId: string | null;
      cardId: string | null;
      cvc: string | null;
    }) => {
      return TransferService.submit({
        documentId: props.documentId,
        confirmed: true,
        securityCode: props.cvc,
      });
    }
  )
);

sample({
  clock: confirmFinished,
  source: [$documentId, $cardId, $cvc],
  fn: (src) => {
    const [documentId, cardId, cvc] = src;
    return {
      documentId,
      cardId,
      cvc,
    };
  },
  target: finishTopUpFx,
});

const $submitTopupDisabled = combine(
  $documentId,
  $cardId,
  (documentId, cardId) => {
    return documentId === null || cardId === null;
  }
);

const $cvcConfirmDisabled = combine($cvc, (cvc: string | null) => {
  return cvc === null || cvc.length < 3;
});

const redirectEffect = createEffect((newUrl: any) => {
  window.location.href = newUrl;
});

sample({
  clock: finishTopUpFx.doneData,
  source: $account,
  fn: (src, clk) => {
    if (clk.data.redirectUrl) {
      return clk.data.redirectUrl;
    }
    return `/accounts/${src?.accountId}`;
  },
  target: redirectEffect,
});

const $isConfirmProcessing = pending({ effects: [finishTopUpFx] });
const $topup = combine({
  amount: $amount,
  fee: $fee,
  account: $account,
  accounts: $accounts,
  error: $error,
  isLoading: $isLoading,
  disableContinue: $disableContinue,
  step: $step,
  rate: $rate,
  cardId: $cardId,
  terms: $terms,
  cvc: $cvc,
  cvcModal: $cvcModal,
  isConfirmProcessing: $isConfirmProcessing,
  submitTopupDisabled: $submitTopupDisabled,
  cvcConfirmDisabled: $cvcConfirmDisabled,
});

export const resetTopUp = reset({
  target: [
    $amount,
    $fee,
    $account,
    $accounts,
    $error,
    $step,
    $rate,
    $cardId,
    $terms,
    $cvc,
    $cvcModal,
  ],
});

export {
  $topup,
  accountChanged,
  amountChanged,
  topupMounted,
  topupUnmounted,
  stepUpdated,
  cardIdUpdated,
};
