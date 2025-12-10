import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import KycV2Service, { SetPhoneRequest } from "@services/KycV2Service";
import { $kyc, getKycStatusSilentFx, getPersonalFx } from "@store/kyc/kyc";
import { getAccountsSilent } from "@store/accounts";

const setCode = createEvent<string>();
const setPhoneRequested = createEvent<SetPhoneRequest>();
const confirmCode = createEvent();
const resetPhone = createEvent();
const resetError = createEvent();

const setPhoneFx = createEffect((req: SetPhoneRequest) =>
  KycV2Service.setPhone(req)
);

const confirmCodeFx = createEffect(
  (props: { stageId: number; code: string }) => {
    return KycV2Service.confirmContact(props);
  }
);

const $loading = createStore<boolean>(false)
  .on(setPhoneFx.pending, (_, e) => e)
  .on(confirmCodeFx.pending, (_, e) => e);

const $error = createStore<string | null>(null)
  .on(setPhoneFx.failData, (_, e) => e as any)
  .on(confirmCodeFx.failData, (_, e) => e as any)
  .reset([setPhoneFx.done, confirmCodeFx.done, resetError]);

const $code = createStore<string | null>(null).on(setCode, (_, e) => e);
const $step = createStore<number>(0)
  .on(setPhoneFx.done, () => 1)
  .on(confirmCodeFx.doneData, () => 2)
  .reset(resetPhone);

sample({ clock: setPhoneRequested, target: setPhoneFx });
sample({
  clock: confirmCode,
  source: { code: $code, stages: $kyc },
  fn: ({ code, stages }) =>
    ({ code: code, stageId: stages.phone?.id ?? 0 } as any),
  target: confirmCodeFx,
});

sample({
  clock: confirmCodeFx.done,
  target: [getPersonalFx, getKycStatusSilentFx, getAccountsSilent],
});

const $phonePage = combine({
  loading: $loading,
  error: $error,
  code: $code,
  step: $step,
});

export {
  $phonePage,
  setPhoneRequested,
  setCode,
  confirmCode,
  resetPhone,
  resetError,
};
