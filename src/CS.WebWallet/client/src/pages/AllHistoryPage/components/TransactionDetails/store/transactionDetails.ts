import { createEffect, createEvent, createStore } from "effector";
import HistoryService, { HistoryRow } from "@services/HistoryService";

interface TransactionDetailsStore {
  data?: HistoryRow;
  transactionId?: string;
  isLoading: boolean;
}

const defaultStore = {
  isLoading: false,
};

export const getTransactionDetailsFx = createEffect(
  async (props: { transactionId: string }) => {
    const res = await HistoryService.getTransactionDetails(props);
    return res.data;
  }
);

export const $resetTransactionDetailsStore = createEvent();

export const $transactionDetails = createStore<TransactionDetailsStore>(
  defaultStore
)
  .on(getTransactionDetailsFx.pending, (prev, state) => ({
    ...prev,
    isLoading: !state,
  }))
  .on(getTransactionDetailsFx.doneData, (prev, state) => {
    return {
      ...prev,
      isLoading: true,
      data: state,
    };
  })
  .on($resetTransactionDetailsStore, () => defaultStore)
  .reset($resetTransactionDetailsStore);
