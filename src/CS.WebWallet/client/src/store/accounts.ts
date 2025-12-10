import AccountsService, { AccountRow } from "@services/AccountsService";
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { pending, reset } from "patronum";
import { AccountType } from "@enums/accountType";
import { $issuedCards } from "./issuedCards";
import { IssuedCard } from "@services/CardsService";

const setAccounts = createEvent<AccountRow[]>();
const reloadAccounts = createEvent<string[]>();
const getAccountsSilent = createEvent();

const getAccountsFx = createEffect(() => {
  return AccountsService.accounts({ pageIndex: 1, pageSize: 1000 });
});

const getAccountsSilentFx = createEffect(() => {
  return AccountsService.accounts({ pageIndex: 1, pageSize: 1000 });
});

const getCertainAccountsFx = createEffect((ids: string[]) => {
  return AccountsService.accounts({
    pageIndex: 1,
    pageSize: 1000,
    filter: { ids: ids },
  });
});

const allAccounts = createStore<AccountRow[]>([])
  .on(setAccounts, (_, payload) => payload)
  .on(getCertainAccountsFx.doneData, (e, p) => {
    if (!e || e.length === 0) return p.data ?? [];
    if (!p.data || p.data.length === 0) return e;
    p.data.forEach((a) => {
      const account = e.find((i) => i.accountId === a.accountId);
      if (!account) return;
      account.amount = a.amount;
      account.currencyAmount = a.currencyAmount;
    });
    return e;
  });

const fiatAccounts = combine(allAccounts, (allAccount) =>
  allAccount.filter((f) => f.type === AccountType.Finance.id)
);

const prepaidAccounts = combine(allAccounts, (allAccount) =>
  allAccount.filter((f) => f.type === AccountType.FinancePrepaid.id)
);

const sharesAccounts = combine(allAccounts, (allAccount) =>
  allAccount.filter((f) => f.type === AccountType.Shares.id)
);

const cryptoAccounts = combine(allAccounts, (allAccount) =>
  allAccount.filter((f) => f.type === AccountType.Crypto.id)
);

const $isLoading = pending({ effects: [getAccountsFx] });

const resetAccounts = reset({
  target: [allAccounts],
});

const $accounts = combine({
  isLoading: $isLoading,
  all: allAccounts,
  fiat: fiatAccounts,
  prepaid: prepaidAccounts,
  crypto: cryptoAccounts,
  shares: sharesAccounts,
});

sample({ clock: getAccountsSilent, target: getAccountsSilentFx });
sample({ clock: reloadAccounts, target: getCertainAccountsFx });

sample({
  clock: getAccountsFx.doneData,
  source: { cards: $issuedCards },
  fn: ({ cards }, accounts) => {
    if (!cards || cards.length === 0) return accounts.data;
    return cards.reduce((result: AccountRow[], current: IssuedCard) => {
      const acc = result.find((e) => e.accountId === current.internalAccountId);
      if (acc?.type === 50) {
        acc.icon = "/v2/card-types/mastercard.svg";
        acc.text = current.pan;
      }

      return result;
    }, accounts.data);
  },
  target: setAccounts,
});

export {
  $accounts,
  allAccounts,
  reloadAccounts,
  resetAccounts,
  getAccountsSilent,
  getAccountsFx,
};
