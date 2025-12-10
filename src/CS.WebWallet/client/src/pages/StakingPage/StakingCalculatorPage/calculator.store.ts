import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { debounce } from "patronum/debounce";
import DepositsService, {
  CreateDepositRequest,
  CtorParamsRequest,
  CtorRequest,
  CtorResponse,
  Deposit,
} from "@services/DepositsService";
import { pageChanged } from "@store/navigation.store";
import { fetchShowCases } from "@store/showcase";

const setAgg = createEvent<boolean>();
const setUpdates = createEvent<CtorParamsRequest>();

const initCtor = createEvent<CtorRequest>();
const getCtor = createEvent<CtorRequest>();
const getCtorUpdates = createEvent<CtorParamsRequest>();
const getCtorUpdatesDebounced = debounce({
  source: getCtorUpdates,
  timeout: 1000,
});

const createRequest = createEvent();

// effects
const initCtorFx = createEffect((req: CtorRequest) =>
  DepositsService.getCtor(req)
);

const getCtorFx = createEffect((req: CtorRequest) =>
  DepositsService.getCtor(req)
);

const createRequestFx = createEffect((req: CreateDepositRequest) =>
  DepositsService.create(req)
);

// stores
const $currentCase = createStore<number>(0).on(
  getCtor,
  (_, e) => e.showcaseItemId
);
const $agreement = createStore<boolean>(true).on(setAgg, (_, e) => e);

const $loading = createStore<boolean>(false)
  .on(initCtorFx.pending, (_, e) => e)
  .on(getCtorFx.pending, (_, e) => e);

const $ctor = createStore<CtorResponse | null>(null)
  .on(initCtorFx.doneData, (_, e) => e.data)
  .on(getCtorFx.doneData, (_, e) => e.data);

const $deposit = createStore<Deposit | null>(null)
  .on(initCtorFx.doneData, (_, e) => e.data?.deposit ?? null)
  .on(getCtorFx.doneData, (_, e) => e.data?.deposit ?? null);

const $request = createStore<CtorParamsRequest | null>(null)
  .on(initCtorFx.doneData, (_, e) => ({
    allowReplenish: e.data.allowReplenish.value,
    allowWithdraw: e.data.allowWithdraw.value,
    interestOnDepositAccount: e.data.interestOnDepositAccount.value,
    currencyId: e.data.currencies[0].id,
    period: e.data.periods[0],
    amount: e.data.minAmount.amount,
  }))
  .on(getCtorFx.doneData, (s, e) => ({
    ...s,
    ...{
      allowReplenish: e.data.allowReplenish.value,
      allowWithdraw: e.data.allowWithdraw.value,
      interestOnDepositAccount: e.data.interestOnDepositAccount.value,
      currencyId: s?.currencyId ?? e.data.currencies[0].id,
      period: s?.period ?? e.data.periods[0],
      amount: s?.amount ?? e.data.minAmount.amount,
      isDefault: false,
    },
  }))
  .on(setUpdates, (s, e) => ({ ...s, ...e }))
  .reset(initCtor);

sample({ clock: initCtor, target: initCtorFx });
sample({ clock: getCtor, target: getCtorFx });
sample({
  clock: getCtorUpdatesDebounced,
  source: { caseId: $currentCase, ctor: $ctor },
  filter: ({ ctor }, req) => !!ctor && !!req,
  fn: ({ caseId }, req) => ({ showcaseItemId: caseId, updates: req }),
  target: getCtorFx,
});

sample({
  clock: setUpdates,
  source: { req: $request },
  fn: ({ req }) => req as any,
  target: getCtorUpdates,
});

sample({
  clock: createRequest,
  source: {
    deposit: $deposit,
    accepted: $agreement,
    req: $request,
    caseId: $currentCase,
  },
  filter: ({ accepted, req }) => accepted && !!req,
  fn: ({ deposit, accepted, req, caseId }) => {
    return {
      eulaAccepted: accepted,
      amount: req?.amount,
      comment: "",
      showCaseItemId: caseId,
      depositProgramRowId: deposit?.id,
    } as CreateDepositRequest;
  },
  target: createRequestFx,
});

sample({ clock: createRequestFx.done, target: fetchShowCases });

sample({
  clock: createRequestFx.done,
  fn: () => "/staking",
  target: pageChanged,
});

const $calculator = combine({
  loading: $loading,
  ctor: $ctor,
  deposit: $deposit,
  request: $request,
  agreement: $agreement,
  caseId: $currentCase,
});

export { $calculator, initCtor, setUpdates, createRequest, setAgg };
