import { createEvent, createStore, Effect } from "effector";
import { ResponseWithData, SortDescriptor } from "@models/PagedRequest";

export type GridState<T> = {
  pageIndex: number;
  pageSize: number;
  data: T[];
  total: number;
  isLoading: boolean;
  listSort: SortDescriptor[];
};

const defaultStore = {
  pageIndex: 1,
  pageSize: 1000,
  data: [],
  total: 0,
  isLoading: false,
  listSort: [],
};

export type HandlerProps = {
  pageIndex: number;
  pageSize: number;
  filter?: any;
  listSort?: SortDescriptor[];
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const factoryDataGrid = <T>(
  handler: Effect<HandlerProps, ResponseWithData<T[]>, Error>
) => {
  const $resetDataGridStore = createEvent();
  const $sortChanged = createEvent<SortDescriptor[]>();
  const $paginationChanged = createEvent<{
    pageIndex: number;
    pageSize: number;
  }>();

  const $data = createStore<GridState<T>>(defaultStore)
    .on($paginationChanged, (state, { pageIndex, pageSize }) => ({
      ...state,
      pageIndex,
      pageSize,
    }))
    .on($sortChanged, (state, sort) => ({
      ...state,
      listSort: sort,
    }))
    .on(handler.pending, (prev, state) => ({ ...prev, isLoading: state }))
    .on(handler.doneData, (prev, state) => {
      return {
        ...prev,
        isLoading: false,
        data: state.data ?? [],
        total: state?.total ?? 0,
      };
    })
    .on($resetDataGridStore, () => defaultStore)
    .reset($resetDataGridStore);
  return {
    $data,
    $resetDataGridStore,
    $paginationChanged,
    $sortChanged,
  };
};
