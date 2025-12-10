import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import KycV2Service, { UploadDocument } from "@services/KycV2Service";
import { getKycStatusFx } from "@store/kyc/kyc";
import { KycStages } from "../../../enums/kyc";
import { pageChanged } from "@store/navigation.store";

const uploadSelfieFx = createEffect((props: UploadDocument) => {
  return KycV2Service.uploadDocument(props);
});

export const selfieFinishReceived = createEvent<any>();
export const selfieReceived = createEvent<any>();
export const selfieResetReceived = createEvent<any>();

const $stageId = createStore<number | null>(null);
$stageId.on(getKycStatusFx.doneData, (_, payload) => {
  const stage = payload.data.stages.find(
    (f) => f.stage === KycStages.Selfie.id
  );
  return stage?.id;
});

const $note = createStore<string | null>(null);
$note.on(getKycStatusFx.doneData, (_, payload) => {
  const stage = payload.data.stages.find(
    (f) => f.stage === KycStages.Selfie.id
  );
  return stage?.note;
});

const $sumsub = createStore<string | null>(null);
$sumsub.on(getKycStatusFx.doneData, (_, payload) => {
  const stage = payload.data.stages.find(
    (f) => f.stage === KycStages.Selfie.id
  );
  return stage?.kycToken;
});

const $selfie = createStore<any>(null);
$selfie.on(selfieReceived, (_, payload) => payload);
$selfie.on(selfieResetReceived, () => null);

const $canContinue = combine(
  $selfie,
  ($selfie) => $selfie !== null && $selfie !== undefined
);

sample({
  clock: selfieFinishReceived,
  source: { selfie: $selfie, stageId: $stageId },
  filter: ({ selfie }) => {
    return selfie !== null;
  },
  fn: ({ selfie, stageId }) => {
    return {
      stageId: stageId,
      frontBase64: selfie,
      documentType: 4,
    };
  },
  target: uploadSelfieFx,
});

// TODO : define where to go after
sample({
  clock: uploadSelfieFx.doneData,
  fn: () => "/kyc",
  target: pageChanged,
});

export const $selfieUpload = combine({
  selfieImage: $selfie,
  sumsub: $sumsub,
  note: $note,
  canContinue: $canContinue,
});
