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
import { pageChanged } from "@store/navigation.store";
import { reset } from "patronum";
import { editEmailCanceled } from "../../pages/SettingsPage/settings.store";

// fx for first time approve email
const setEmailFx = createEffect((props: { stageId: number; email: string }) => {
  return KycV2Service.setEmail(props);
});

const setEmailCodeFx = createEffect(
  (props: { stageId: number; code: string }) => {
    return KycV2Service.confirmContact(props);
  }
);

// Fx for changing email
const sendChangeCodeFx = createEffect((props: { newValue: string }) => {
  return KycV2Service.changeEmailStepOne(props);
});

const changeCodePhoneFx = createEffect((props: { code: string }) => {
  return KycV2Service.changeEmailStepTwo(props);
});

const approveCodeEmailFx = createEffect((props: { code: string }) => {
  return KycV2Service.changeEmailStepThree(props);
});

export const newEmailReceivedEv = createEvent<string>();

export const firstCodeEv = createEvent<string>();
export const sendFirstCodeEv = createEvent();
export const confirmFirstCodeEv = createEvent();

export const secondCodeEv = createEvent<string>();
export const confirmSecondCodeEv = createEvent();

const $currentEmail = createStore<string | null>(null);
$currentEmail.on(getPersonalFx.doneData, (_, payload) => payload.data.mail);

const $smsSent = createStore<boolean>(false);
$smsSent.on(setEmailFx.doneData, () => true);
$smsSent.on(sendChangeCodeFx.doneData, () => true);

const $firstSmsApproved = createStore<boolean>(false);
$firstSmsApproved.on(changeCodePhoneFx.doneData, () => true);

const $code = createStore<string | null>(null);
$code.on(firstCodeEv, (_, payload) => payload);

const $secondCode = createStore<string | null>(null);
$secondCode.on(secondCodeEv, (_, payload) => payload);

const $mail = createStore<string | null>(null);
$mail.on(getPersonalFx.doneData, (_, payload) => payload.data.mail);
$mail.on(newEmailReceivedEv, (_, payload) => payload);

const $stageId = createStore<number>(0);
$stageId.on(getKycStatusFx.doneData, (_, payload) => {
  const data = payload.data.stages.find((f) => f.stage == KycStages.Email.id);
  return data?.id;
});
$stageId.on(getKycStatusSilentFx.doneData, (_, payload) => {
  const data = payload.data.stages.find((f) => f.stage == KycStages.Email.id);
  return data?.id;
});

const $status = createStore<number>(0);
$status.on(getKycStatusFx.doneData, (_, payload) => {
  const data = payload.data.stages.find((f) => f.stage == KycStages.Email.id);
  return data?.status ?? 0;
});

$status.on(getKycStatusSilentFx.doneData, (_, payload) => {
  const data = payload.data.stages.find((f) => f.stage == KycStages.Email.id);
  return data?.status ?? 0;
});

const $error = createStore<string | null>(null);
$error.on(setEmailFx.failData, (_, payload: any) => {
  return payload;
});
$error.on(setEmailFx.doneData, () => {
  return null;
});
$error.on(sendChangeCodeFx.failData, (_, payload: any) => {
  return payload;
});
$error.on(sendChangeCodeFx.doneData, () => {
  return null;
});

// case when we first time set email
sample({
  clock: sendFirstCodeEv,
  source: { mail: $mail, status: $status, stageId: $stageId },
  filter: ({ status }) =>
    status === KycStatuses.Created.id || status === KycStatuses.OnReview.id,
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

// case for changing email
sample({
  clock: sendFirstCodeEv,
  source: { mail: $mail, status: $status },
  filter: ({ status }) => status === KycStatuses.Approved.id,
  fn: ({ mail }) => {
    return { newValue: mail ?? "" };
  },
  target: sendChangeCodeFx,
});

sample({
  clock: confirmFirstCodeEv,
  source: {
    code: $code,
    stageId: $stageId,
    smsSent: $smsSent,
    status: $status,
  },
  filter: ({ status, smsSent }) =>
    status === KycStatuses.Approved.id && smsSent,
  fn: ({ code, stageId }) => {
    return { code: code ?? "", stageId: stageId ?? 0 };
  },
  target: changeCodePhoneFx,
});

sample({
  clock: confirmSecondCodeEv,
  source: {
    code: $secondCode,
    stageId: $stageId,
  },
  fn: ({ code, stageId }) => {
    return { code: code ?? "", stageId: stageId ?? 0 };
  },
  target: approveCodeEmailFx,
});

export const resetEmailChanges = reset({
  target: [$mail, $smsSent, $error, $firstSmsApproved],
});

sample({
  clock: approveCodeEmailFx.doneData,
  fn: () => {
    return "/settings";
  },
  target: [pageChanged, resetEmailChanges, editEmailCanceled],
});

sample({ clock: approveCodeEmailFx.doneData, target: getPersonalFx });

export const $emailKyc = combine({
  currentEmail: $currentEmail,
  mail: $mail,
  smsSent: $smsSent,
  error: $error,
  status: $status,
  firstSmsApproved: $firstSmsApproved,
});
