import {
  combine,
  createEvent,
  createStore,
  createEffect,
  sample,
} from "effector";
import { getKycStatusFx, getPersonalFx } from "@store/kyc/kyc";
import { KycStages } from "@enums/kyc";
import KycV2Service from "@services/KycV2Service";

const newPhoneReceived = createEvent<string>();
const setCode = createEvent<string>();
const resetAndReload = createEvent();
const setStep = createEvent<number>();
const resetError = createEvent();
const nextStepRequested = createEvent<{
  countryId: string;
  newValue: string;
}>();

const changePhoneFx = createEffect(
  (props: {
    countryId: string;
    newValue: string;
    code: string;
    step: number;
  }) => {
    return KycV2Service.changePhone(props);
  }
);

const $loading = createStore<boolean>(false)
  .on(changePhoneFx.pending, (_, e) => e)
  .reset(resetAndReload);

const $code = createStore<string>("")
  .on(setCode, (_, payload) => payload)
  .reset(changePhoneFx.doneData)
  .reset(resetAndReload);

const $step = createStore<number>(1)
  .on(setStep, (_, e) => e)
  .reset(resetAndReload);

const $originalPhone = createStore<string | null>(null).on(
  getPersonalFx.doneData,
  (_, payload) => payload.data.phone
);

const $status = createStore<number>(0).on(
  getKycStatusFx.doneData,
  (_, payload) => {
    const data = payload.data.stages.find((f) => f.stage == KycStages.Phone.id);
    return data?.status ?? 0;
  }
);

const $error = createStore<string | null>(null)
  .on(changePhoneFx.failData, (_, p: any) => p)
  .on(resetError, () => null)
  .reset([changePhoneFx.doneData, resetAndReload]);

const $phoneKyc = combine({
  originalPhone: $originalPhone,
  code: $code,
  phoneStatus: $status,
  error: $error,
  step: $step,
  loading: $loading,
});

sample({
  clock: changePhoneFx.doneData,
  source: { step: $step },
  fn: ({ step }) => step + 1,
  target: setStep,
});

sample({
  clock: changePhoneFx.doneData,
  source: { step: $step },
  filter: ({ step }) => step > 3,
  target: resetAndReload,
});

sample({ clock: resetAndReload, target: getPersonalFx });

sample({
  clock: nextStepRequested,
  source: { step: $step, code: $code },
  fn: ({ step, code }, { countryId, newValue }) => ({
    countryId,
    newValue,
    step,
    code: code ?? "",
  }),
  target: changePhoneFx,
});

export {
  $phoneKyc,
  newPhoneReceived,
  setCode,
  nextStepRequested,
  resetAndReload,
  resetError,
};
