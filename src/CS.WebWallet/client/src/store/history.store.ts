import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import HistoryService, {
  HistoryFilter,
  HistoryRow,
} from "@services/HistoryService";
import { accountIdReceived } from "@pages/AccountDetailsPage/accountDetailsPage.store";

export type HistoryRequest = {
  pageIndex: number;
  pageSize: number;
  filter?: HistoryFilter;
};

const getHistory = createEvent<HistoryRequest>();
const setCurrent = createEvent<HistoryRow | null>();
const setDetailsModal = createEvent<boolean>();

const getHistoryFx = createEffect((props: HistoryRequest) =>
  HistoryService.getHistory(props)
);

sample({ clock: getHistory, target: getHistoryFx });
sample({
  clock: accountIdReceived,
  fn: (accountId) => ({
    pageIndex: 1,
    pageSize: 100,
    filter: { accountId },
  }),
  target: getHistory,
});

const $history = createStore<HistoryRow[]>([])
  .on(getHistoryFx.doneData, (_, e) => e.data)
  .reset(getHistory);

const $loading = createStore<boolean>(false)
  .on(getHistoryFx.pending, (_, e) => e)
  .reset(getHistory);

const $current = createStore<HistoryRow | null>(null)
  .on(setCurrent, (_, e) => e)
  .reset(getHistory);

const $detailsOpen = createStore<boolean>(false)
  .on(setDetailsModal, (_, e) => e)
  .reset(getHistory);

const $historyData = combine({
  loading: $loading,
  history: $history,
  current: $current,
  detailsOpen: $detailsOpen,
});

export { $historyData, getHistory, setCurrent, setDetailsModal };
