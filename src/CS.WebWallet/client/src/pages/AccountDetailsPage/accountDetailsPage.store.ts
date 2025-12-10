import { combine, createEvent, createStore, sample } from "effector";
import { AccountRow } from "@services/AccountsService";
import { $accounts } from "@store/accounts";

const accountIdReceived = createEvent<string>();
const statementModalChanged = createEvent();
const topupModalChanged = createEvent();
const withdrawModalChanged = createEvent();
const detailsModalChanged = createEvent();

const $account = createStore<AccountRow | null>(null);

const $statementModal = createStore<boolean>(false);
$statementModal.on(statementModalChanged, (state) => !state);

const $withdrawModal = createStore<boolean>(false);
$withdrawModal.on(withdrawModalChanged, (state) => !state);

const $topupModal = createStore<boolean>(false);
$topupModal.on(topupModalChanged, (state) => !state);

const $detailsModal = createStore<boolean>(false);
$detailsModal.on(detailsModalChanged, (state) => !state);

sample({
  clock: accountIdReceived,
  source: $accounts,
  fn: (accounts, accountId) =>
    accounts.all.find((f) => f.accountId === accountId) ?? null,
  target: $account,
});

const $accountDetails = combine({
  account: $account,
  statementModal: $statementModal,
  topupModal: $topupModal,
  detailsModal: $detailsModal,
  withdrawModal: $withdrawModal,
});

export {
  $accountDetails,
  accountIdReceived,
  statementModalChanged,
  topupModalChanged,
  detailsModalChanged,
  withdrawModalChanged,
};
