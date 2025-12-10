import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import {
  getKycStatusFx,
  getKycStatusSilentFx,
  getPersonalFx,
} from "@store/kyc/kyc";
import { KycStages, KycStatuses } from "@enums/kyc";
import KycV2Service from "@services/KycV2Service";
import { setEmailCanceled } from "@pages/SettingsPage/settings.store";
import { resetEmailChanges } from "@store/kyc/email";
import { pageChanged } from "@store/navigation.store";
import { getAccountsSilent } from "@store/accounts";

// fx for first time approve email
const setEmailFx = createEffect((props: { stageId: number; email: string }) => {
  return KycV2Service.setEmail(props);
});

const setEmailCodeFx = createEffect(
  (props: { stageId: number; code: string }) => {
    return KycV2Service.confirmContact(props);
  }
);

const newEmailReceivedEv = createEvent<string | null>();

const firstCodeEv = createEvent<string>();
const sendFirstCodeEv = createEvent(); // wether change or not
const confirmFirstCodeEv = createEvent();

const $code = createStore<string | null>(null).on(
  firstCodeEv,
  (_, payload) => payload
);

const $smsSent = createStore<boolean>(false).on(
  setEmailFx.doneData,
  () => true
);

const $stageId = createStore<number>(0).on(
  getKycStatusFx.doneData,
  (_, payload) => {
    const data = payload.data.stages.find(
      (f) => f.stage === KycStages.Email.id
    );
    return data?.id;
  }
);

const $status = createStore<number>(0).on(
  getKycStatusFx.doneData,
  (_, payload) => {
    const data = payload.data.stages.find(
      (f) => f.stage === KycStages.Email.id
    );
    return data?.status ?? 0;
  }
);

const $mail = createStore<string | null>(null)
  .on(getPersonalFx.doneData, (_, payload) => payload.data.mail)
  .on(newEmailReceivedEv, (_, payload) => payload);

const $error = createStore<string | null>(null)
  .on(setEmailFx.failData, (_, payload: any) => payload)
  .on(setEmailCodeFx.failData, (_, payload: any) => payload)
  .reset(setEmailFx.doneData);

const $emailKyc = combine({
  mail: $mail,
  smsSent: $smsSent,
  error: $error,
});

sample({
  clock: [sendFirstCodeEv, confirmFirstCodeEv],
  target: getAccountsSilent,
});

sample({
  clock: sendFirstCodeEv,
  source: { mail: $mail, status: $status, stageId: $stageId },
  filter: ({ status }) => {
    const check =
      status === KycStatuses.Created.id || status === KycStatuses.OnReview.id;
    return check;
  },
  fn: ({ mail, stageId }) => {
    return { email: mail ?? "", stageId: stageId };
  },
  target: setEmailFx,
});

sample({
  clock: confirmFirstCodeEv,
  source: {
    code: $code,
    stageId: $stageId,
    smsSent: $smsSent,
    status: $status,
  },
  filter: ({ status, smsSent }) => {
    return (
      (status === KycStatuses.Created.id ||
        status === KycStatuses.OnReview.id) &&
      smsSent
    );
  },
  fn: ({ code, stageId }) => {
    return { code: code ?? "", stageId: stageId };
  },
  target: setEmailCodeFx,
});

sample({
  clock: setEmailCodeFx.doneData,
  fn: () => "/accounts",
  target: [pageChanged, resetEmailChanges, setEmailCanceled],
});

sample({ clock: setEmailCodeFx.doneData, target: getKycStatusSilentFx });
sample({
  clock: setEmailFx.doneData,
  target: [getPersonalFx, getKycStatusSilentFx],
});

export {
  $emailKyc,
  confirmFirstCodeEv,
  firstCodeEv,
  newEmailReceivedEv,
  sendFirstCodeEv,
};
