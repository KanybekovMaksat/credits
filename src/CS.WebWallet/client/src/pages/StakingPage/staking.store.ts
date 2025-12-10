import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import DepositsService, {
  DepositResponse,
  DepositsRequest,
} from "@services/DepositsService";
import { pageChanged } from "@store/navigation.store";

const getDeposits = createEvent<DepositsRequest>();
const setShowClosed = createEvent<boolean>();
const closeDeposit = createEvent<string>();

const getDepositsFx = createEffect((req: DepositsRequest) =>
  DepositsService.getDeposits(req)
);

const closeDepositFx = createEffect((id: string) =>
  DepositsService.closeDeposit(id)
);

const $loading = createStore<boolean>(false)
  .on(getDepositsFx.pending, (_, e) => e)
  .on(closeDepositFx.pending, (_, e) => e);

const $showClosed = createStore<boolean>(false).on(setShowClosed, (_, e) => e);

const $depositInfo = createStore<DepositResponse | null>(null)
  .on(getDepositsFx.doneData, (_, e) => e.data)
  .on(getDepositsFx.fail, () => null);

sample({ clock: getDeposits, target: getDepositsFx });
sample({ clock: closeDeposit, target: closeDepositFx });
sample({
  clock: [closeDepositFx.done],
  fn: () => ({ showClosed: true }),
  target: getDeposits,
});
sample({
  clock: closeDepositFx.done,
  fn: () => "/staking",
  target: pageChanged,
});

const $data = combine({
  loading: $loading,
  depositInfo: $depositInfo,
  showClosed: $showClosed,
});

export { $data, getDeposits, setShowClosed, closeDeposit };
