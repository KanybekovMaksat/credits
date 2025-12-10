import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import TransferService, {
  RequisitesResponse,
  TransferCheckRequest,
  TransferCheckResponse,
  TransferRespondent,
  TransferSubmitRequest,
  TransferSubmitResponse,
} from "@services/TransferService";
import { Direction, OptionType, SelectorOption, groups } from "./types";
import { $accounts, reloadAccounts } from "@store/accounts";
import { $issuedCards } from "@store/issuedCards";
import { siteChanged, pageChanged } from "@store/navigation.store";
import { AccountRow, OperationDetails } from "@services/AccountsService";
import { toNum } from "@helpers/amountHelper";

const getRequirementType = (req: number): OptionType => {
  let result: OptionType = "walletRequisites";
  switch (req) {
    case 1:
      result = "wallet";
      break;
    case 2:
      result = "appCard";
      break;
    case 3:
      result = "requisites";
      break;
    case 4:
      result = "fullRequisites";
      break;
    case 5:
      result = "fullRequisitesSwift";
      break;
    default:
      result = "account";
      break;
  }
  return result;
};

const getGroups = (
  details: OperationDetails[],
  accounts: AccountRow[],
  from: boolean
) => {
  const accs: SelectorOption[] = details
    .filter((e) => (from ? !!e.to : !!e.from))
    .map((e) => ({ type: "account", accountId: from ? e.to : e.from }));

  const ops: SelectorOption[] = details
    .filter((e) => (from ? !e.to : !e.from) && e.requirement > 0)
    .map((e) => ({ type: getRequirementType(e.requirement) }));

  return {
    other: { name: "options.other", options: ops },
    crypto: {
      name: "options.crypto",
      options: accs.filter((a) =>
        accounts.find((e) => e.accountId === a.accountId && e.type === 10)
      ),
    },
    bank: {
      name: "options.bank",
      options: accs.filter((a) =>
        accounts.find(
          (e) => e.accountId === a.accountId && (e.type === 20 || e.type === 50)
        )
      ),
    },
    prepaid: {
      name: "options.fiat",
      options: accs.filter((a) =>
        accounts.find((e) => e.accountId === a.accountId && e.type === 30)
      ),
    },
  };
};

const operationCheck = createEvent();
const operationSubmit = createEvent();
const resetError = createEvent();
const resetOperation = createEvent();
const setFormValid = createEvent<boolean>();
const setContinue = createEvent<boolean>();
const resendOtp = createEvent<string>();

const initOptions = createEvent<{
  fromId?: string;
  toId?: string;
  direction?: Direction;
}>();
const setOptions = createEvent<groups>();
const setFromOption = createEvent<SelectorOption>();
const setToOption = createEvent<SelectorOption>();
const setDirection = createEvent<Direction>();

const getRequisites = createEvent<string>();
const setRespondent = createEvent<TransferRespondent>({});
const setFromAmount = createEvent<number | string>();
const setToAmount = createEvent<number | string>();
const setCode = createEvent<string>();
const setCvc = createEvent<string>();
const setUsesBonus = createEvent<boolean>();

const checkFx = createEffect((request: TransferCheckRequest) =>
  TransferService.check(request)
);

const submitFx = createEffect((request: TransferSubmitRequest) =>
  TransferService.submit(request)
);

const getRequisitesFx = createEffect((accountId: string) =>
  TransferService.getRequisites(accountId)
);

const resendOtpFx = createEffect((documentId: string) =>
  TransferService.resendOtp({ documentId })
);

const $loading = createStore<boolean>(false)
  .on(checkFx.pending, (_, e) => e)
  .on(submitFx.pending, (_, e) => e)
  .on(getRequisitesFx.pending, (_, e) => e)
  .reset(resetOperation);

const $formValid = createStore<boolean>(true)
  .on(setFormValid, (_, e) => e)
  .reset(resetOperation);

const $continue = createStore<boolean>(false)
  .on(checkFx.fail, () => false)
  .on(checkFx.doneData, (_, p) => p.success && p.data?.allowed)
  .on(submitFx.doneData, (_, p) => p.data?.status === 10)
  .on(submitFx.fail, () => false)
  .on(setContinue, (_, e) => e)
  .reset([resetOperation]);

const $options = createStore<groups>({
  from: [],
  to: [],
  direction: Direction.None,
})
  .on(setOptions, (_, p) => p)
  .reset(resetOperation);

const $from = createStore<SelectorOption>({ type: "account" })
  .on(setFromOption, (_, p) => p)
  .reset(resetOperation);

const $to = createStore<SelectorOption>({ type: "account" })
  .on(setToOption, (_, p) => p)
  .reset(resetOperation);

const $respondent = createStore<TransferRespondent>({})
  .on(setRespondent, (_, e) => e)
  .reset(resetOperation);

const $requisites = createStore<RequisitesResponse | null>(null)
  .on(getRequisitesFx.doneData, (_, e) => e.data)
  .reset(resetOperation);

const $fromAmount = createStore<number | string>("")
  .on(setFromAmount, (_, e) => e)
  .on(checkFx.doneData, (_, e) => e.data?.amountFrom.size)
  .on(resetOperation, () => "");

const $toAmount = createStore<number | string>("")
  .on(setToAmount, (_, e) => e)
  .on(checkFx.doneData, (_, e) => e.data?.amountTo.size)
  .reset(resetOperation);

const $usesBonus = createStore<boolean>(false)
  .on(setUsesBonus, (_, e) => e)
  .reset(resetOperation);

const $check = createStore<TransferCheckResponse | null>(null)
  .on(checkFx.doneData, (_, e) => e.data)
  .reset([
    resetOperation,
    setFromAmount,
    setToOption,
    setFromOption,
    setRespondent,
  ]);

const $error = createStore<string | null>(null)
  .on(checkFx.failData, (_, e: any) => e)
  .on(checkFx.doneData, (_, e) => (e.data.allowed ? null : e.message))
  .on(submitFx.failData, (_, e: any) => e)
  .reset([
    resetOperation,
    resetError,
    setToAmount,
    setFromAmount,
    setRespondent,
    setToOption,
    setFromOption,
  ]);

const $submit = createStore<TransferSubmitResponse | null>(null)
  .on(submitFx.doneData, (_, e) => e.data)
  .on(submitFx.failData, () => null)
  .on(
    resendOtpFx.doneData,
    (s, e) => ({ ...s, ...{ otp: e.data } } as TransferSubmitResponse)
  )
  .reset([setToAmount, setFromAmount]);

const $cvc = createStore<string | null>(null)
  .on(setCvc, (_, e) => e)
  .reset(resetOperation);

const $code = createStore<string | null>(null)
  .on(setCode, (_, e) => e)
  .reset(resetOperation);

const $data = combine({
  check: $check,
  submit: $submit,
  code: $code,
  cvc: $cvc,
  usesBonus: $usesBonus,
  error: $error,
  requisites: $requisites,
  respondent: $respondent,
  loading: $loading,
  canContinue: $continue,
  options: $options,
  fromOption: $from,
  toOption: $to,
  toAmount: $toAmount,
  fromAmount: $fromAmount,
});

sample({ clock: getRequisites, target: getRequisitesFx });
sample({ clock: setDirection, target: resetOperation });
sample({ clock: resendOtp, target: resendOtpFx });

sample({
  clock: initOptions,
  source: {
    accounts: $accounts,
    to: $to,
  },
  filter: ({ to }, { fromId, direction }) => {
    const one = direction === Direction.Exchange && !to?.accountId;
    const two = to.accountId === fromId;
    const three = !direction;
    return one || two || three;
  },
  fn: ({ accounts }, { fromId, toId, direction }) => {
    const result: groups = { from: [], to: [], direction };

    if (fromId) {
      const account = accounts.all.find((e) => e.accountId === fromId);
      if (!account) return result;
      const opt: SelectorOption = { type: "account", accountId: fromId };
      result.from.push({
        name: "",
        options: [opt],
      });

      if (direction === Direction.Exchange) {
        result.from[0].options = [
          ...result.from[0].options,
          ...accounts.all
            .filter(
              (e) =>
                e.operations.exchange &&
                e.operations.exchange.length > 0 &&
                toNum(e.amount) > 0 &&
                e.accountId !== fromId
            )
            .map(
              (e) =>
                ({ accountId: e.accountId, type: "account" } as SelectorOption)
            ),
        ];
      }

      const groups = getGroups(
        direction === Direction.Exchange
          ? account.operations.exchange
          : account.operations.transfer,
        accounts.all,
        true
      );

      if (groups.bank.options.length > 0) result.to.push(groups.bank);
      if (groups.prepaid.options.length > 0) result.to.push(groups.prepaid);
      if (groups.crypto.options.length > 0) result.to.push(groups.crypto);
      if (groups.other.options.length > 0) result.to.push(groups.other);

      return { ...result, ...{ direction } };
    }

    if (toId && direction !== Direction.Exchange) {
      const account = accounts.all.find((e) => e.accountId === toId);
      if (!account) {
        return result;
      }
      const opt: SelectorOption = { type: "account", accountId: toId };
      result.to.push({ name: "", options: [opt] });

      const groups = getGroups(account.operations.topUp, accounts.all, false);

      if (groups.bank.options.length > 0) result.from.push(groups.bank);
      if (groups.prepaid.options.length > 0) result.from.push(groups.prepaid);
      if (groups.crypto.options.length > 0) result.from.push(groups.crypto);
      if (groups.other.options.length > 0) result.from.push(groups.other);
    }

    return { ...result, ...{ direction } };
  },
  target: setOptions,
});

sample({
  clock: setOptions,
  source: { from: $from },
  filter: ({ from }, opts) => {
    return (
      opts.direction === Direction.Exchange ||
      (!!from &&
        (!from.accountId ||
          !opts.from.find((g) =>
            g.options.find((e) => e.accountId === from.accountId)
          )))
    );
  },
  fn: (_, opts) => opts.from[0].options[0],
  target: setFromOption,
});

sample({
  clock: setOptions,
  source: { to: $to },
  filter: ({ to }, opts) => {
    return (
      !!to &&
      (!to.accountId ||
        !opts.to.find((g) =>
          g.options.find((e) => e.accountId === to.accountId)
        ))
    );
  },
  fn: (_, opts) => opts.to[0].options[0],
  target: setToOption,
});

sample({
  clock: setFromOption,
  source: { options: $options, to: $to },
  filter: ({ options, to }, from) => {
    const res =
      !!from &&
      to?.accountId === from?.accountId &&
      options?.direction === Direction.Exchange;

    return res;
  },
  fn: ({ options }, from) => {
    return { fromId: from?.accountId, direction: options.direction };
  },
  target: initOptions,
});

sample({
  clock: setFromAmount,
  source: { to: $toAmount, formValid: $formValid, check: $check },
  fn: ({ to, formValid, check }, from) => {
    return (
      (toNum(from) > 0 || toNum(to) > 0) &&
      formValid &&
      (!check || check.allowed)
    );
  },
  target: setContinue,
});

sample({
  clock: setToAmount,
  source: { from: $fromAmount, formValid: $formValid, check: $check },
  fn: ({ from, formValid, check }, to) => {
    return (
      (toNum(from) > 0 || toNum(to) > 0) &&
      formValid &&
      (!check || check.allowed)
    );
  },
  target: setContinue,
});

sample({
  clock: setFormValid,
  source: { to: $toAmount, from: $fromAmount, check: $check },
  fn: ({ to, from, check }, formValid) => {
    return (
      (toNum(from) > 0 || toNum(to) > 0) &&
      formValid &&
      (!check || check.allowed)
    );
  },
  target: setContinue,
});

sample({
  clock: operationCheck,
  source: {
    respondent: $respondent,
    amountFrom: $fromAmount,
    amountTo: $toAmount,
    from: $from,
    to: $to,
    usesBonus: $usesBonus,
  },
  fn: ({ respondent, amountFrom, from, amountTo, to, usesBonus }) => {
    const op: TransferCheckRequest = {
      accountFromId: from.accountId,
      accountToId: to.accountId,
      amountFrom: toNum(amountFrom),
      amountTo: toNum(amountTo),
      usesBonus,
      respondent,
    };

    return op;
  },
  target: checkFx,
});

sample({
  clock: operationSubmit,
  source: {
    check: $check,
    fromOpt: $from,
    cvc: $cvc,
    code: $code,
    submit: $submit,
  },
  filter: ({ fromOpt, cvc, code, submit }) => {
    const filter =
      (fromOpt.type === "appCard" && !cvc) ||
      (!code &&
        (submit?.requiresConfirmation || !(submit?.otp?.validated ?? true)));
    return !filter;
  },
  fn: ({ check, cvc, code }) => {
    const sub: TransferSubmitRequest = {
      confirmed: true,
      documentId: check?.documentId,
      securityCode: cvc,
      otp: code,
    };
    return sub;
  },
  target: submitFx,
});

sample({
  clock: submitFx.doneData,
  filter: (sub) => !!sub.data.confirmUrl,
  fn: (sub) => sub.data.confirmUrl,
  target: siteChanged,
});

sample({
  clock: submitFx.doneData,
  source: { from: $from, to: $to, cards: $issuedCards },
  filter: (_, sub) => sub.data.status !== 10,
  fn: ({ from, to, cards }) => {
    const card = cards.find(
      (e) => e.internalAccountId === (to.accountId ?? from.accountId)
    );
    return card
      ? `/cards/${card.id}`
      : `/accounts/${to.accountId ?? from.accountId}`;
  },
  target: pageChanged,
});

sample({
  clock: submitFx.doneData,
  source: { from: $from, to: $to },
  filter: (_, sub) => sub.data.status !== 10,
  fn: ({ from, to }) =>
    [from.accountId, to.accountId].filter((e) => !!e) as string[],
  target: reloadAccounts,
});

export {
  $data,
  operationCheck,
  operationSubmit,
  initOptions,
  setOptions,
  setFromOption,
  setToOption,
  getRequisites,
  setRespondent,
  resetOperation,
  setDirection,
  setFromAmount,
  setToAmount,
  setCode,
  setCvc,
  setUsesBonus,
  setFormValid,
  resendOtp,
};
