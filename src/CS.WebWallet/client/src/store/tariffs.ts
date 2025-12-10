import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { pending, reset } from "patronum";
import TariffsService, { TariffResponse } from "@services/TariffsService";

const tariffRequested = createEvent<string>();

const activateFx = createEffect((tariffId: string) =>
  TariffsService.activate(tariffId)
);

const loadTariffsFx = createEffect(() => TariffsService.list());

const loadTariffsSilentFx = createEffect(() => TariffsService.list());

const $isLoading = pending({ effects: [loadTariffsFx, activateFx] });
const $data = createStore<TariffResponse[]>([])
  .on(loadTariffsFx.doneData, (_, payload) => payload.data ?? [])
  .on(loadTariffsSilentFx.doneData, (_, payload) => payload.data ?? [])
  .on(loadTariffsFx.fail, () => []);

const $error = createStore<string | null>(null).on(
  activateFx.failData,
  (_, e) => e.message
);

const $current = combine($data, (data) => data.find((f) => f.isCurrent));

const resetTariffs = reset({
  target: [$data],
});

const $tariffs = combine({
  all: $data,
  current: $current,
  error: $error,
  isLoading: $isLoading,
});

sample({ clock: tariffRequested, target: activateFx });
sample({ clock: activateFx.doneData, target: loadTariffsSilentFx });

export { $tariffs, tariffRequested, resetTariffs, loadTariffsFx };
