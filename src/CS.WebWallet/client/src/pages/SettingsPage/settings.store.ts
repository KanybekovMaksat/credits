import { combine, createEvent, createStore, sample } from "effector";
import { getKycStatusFx, getKycStatusSilentFx } from "@store/kyc/kyc";
import { KycStages, KycStatuses } from "@enums/kyc";
import { showModal } from "@store/modal";
import { ResponseWithData } from "@models/PagedRequest";
import { KycStatus } from "@services/KycV2Service";
import { resetAndReload } from "@store/kyc/phone";

export const editPhoneStarted = createEvent();
export const editPhoneCanceled = createEvent();

export const editEmailStarted = createEvent();
export const editEmailCanceled = createEvent();

export const setEmailStarted = createEvent();
export const setEmailCanceled = createEvent();

const $canChangePhone = createStore<boolean>(false);
const $canChangeEmail = createStore<boolean>(false);

const canChangeReduced = (_: any, payload: ResponseWithData<KycStatus>) => {
  const stage = payload.data.stages.find((f) => f.stage === KycStages.Email.id);
  return stage?.status === KycStatuses.Approved.id;
};
$canChangePhone.on(getKycStatusFx.doneData, canChangeReduced);
$canChangePhone.on(getKycStatusSilentFx.doneData, canChangeReduced);

const canChangeEmailReducer = (
  _: any,
  payload: ResponseWithData<KycStatus>
) => {
  const stage = payload.data.stages.find((f) => f.stage === KycStages.Phone.id);
  return stage?.status === KycStatuses.Approved.id;
};
$canChangeEmail.on(getKycStatusFx.doneData, canChangeEmailReducer);
$canChangeEmail.on(getKycStatusSilentFx.doneData, canChangeEmailReducer);

const $editPhoneVisible = createStore<boolean>(false)
  .on(editPhoneCanceled, () => false)
  .reset(resetAndReload);

const $editMailVisible = createStore<boolean>(false);
$editMailVisible.on(editEmailStarted, () => true);
$editMailVisible.on(editEmailCanceled, () => false);

const $setMailVisible = createStore<boolean>(false);
$setMailVisible.on(setEmailStarted, () => true);
$setMailVisible.on(setEmailCanceled, () => false);

sample({
  clock: editPhoneStarted,
  source: { canChange: $canChangePhone },
  filter: ({ canChange }) => canChange,
  fn: () => true,
  target: $editPhoneVisible,
});

sample({
  clock: editPhoneStarted,
  source: { canChange: $canChangePhone },
  filter: ({ canChange }) => canChange === false,
  fn: () => ({ title: "Not allowed", body: "Your email is not verified" }),
  target: showModal,
});

export const $settings = combine({
  editPhoneVisible: $editPhoneVisible,
  editEmailVisible: $editMailVisible,
  canChangeEmail: $canChangeEmail,
  canChangePhone: $canChangePhone,
  setMailVisible: $setMailVisible,
});
