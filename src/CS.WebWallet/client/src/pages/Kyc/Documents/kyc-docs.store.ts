import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import KycV2Service, { UploadDocument } from "@services/KycV2Service";
import { $kyc, getKycStatusFx } from "@store/kyc/kyc";
import { KycStages, KycStatuses } from "../../../enums/kyc";
import { pending } from "patronum";
import { effectWithResponse } from "@store/utils/effectwrapper";
import { pageChanged } from "@store/navigation.store";

const uploadDocumentFx = effectWithResponse(
  createEffect((props: UploadDocument) => {
    return KycV2Service.uploadDocument(props);
  })
);

export const typeChanged = createEvent<boolean>();
export const passportReceived = createEvent<any>();
export const leftSideReceived = createEvent<any>();
export const rightSideReceived = createEvent<any>();

export const finishStarted = createEvent();

const $stageId = createStore<number | null>(null);
$stageId.on(getKycStatusFx.doneData, (_, payload) => {
  const stage = payload.data.stages.find(
    (f) => f.stage === KycStages.Documents.id
  );
  return stage?.id;
});

const $isPassport = createStore<boolean>(true);
$isPassport.on(typeChanged, (_, payload) => payload);

const $passport = createStore<any>(null);
$passport.on(passportReceived, (_, payload) => payload);
$passport.on(typeChanged, () => null);
const $passportUrl = createStore<any>(null);
$passportUrl.on(passportReceived, (_, payload) => URL.createObjectURL(payload));
$passportUrl.on(typeChanged, () => null);

const $idLeftSide = createStore<any>(null);
$idLeftSide.on(leftSideReceived, (_, payload) => payload);
$idLeftSide.on(typeChanged, () => null);

const $idLeftSideUrl = createStore<any>(null);
$idLeftSideUrl.on(leftSideReceived, (_, payload) =>
  URL.createObjectURL(payload)
);
$idLeftSideUrl.on(typeChanged, () => null);

const $idRightSide = createStore<any>(null);
$idRightSide.on(rightSideReceived, (_, payload) => payload);
$idRightSide.on(typeChanged, () => null);

const $idRightSideUrl = createStore<any>(null);
$idRightSideUrl.on(rightSideReceived, (_, payload) =>
  URL.createObjectURL(payload)
);
$idRightSideUrl.on(typeChanged, () => null);

const $canContinue = combine(
  $isPassport,
  $passport,
  $idLeftSide,
  $idRightSide,
  ($isPassport, $passport, $idLeftSide, $idRightSide) => {
    if ($isPassport && $passport !== null) return true;
    return $idRightSide !== null && $idLeftSide !== null && !$isPassport;
  }
);

sample({
  clock: finishStarted,
  source: { isPassport: $isPassport, passport: $passport, stageId: $stageId },
  filter: ({ isPassport }) => {
    return isPassport;
  },
  fn: ({ passport, stageId }) => {
    return {
      stageId: stageId,
      front: passport,
      documentType: 1,
    };
  },
  target: uploadDocumentFx,
});

sample({
  clock: finishStarted,
  source: {
    isPassport: $isPassport,
    leftSide: $idLeftSide,
    rightSide: $idRightSide,
    stageId: $stageId,
  },
  filter: ({ isPassport }) => {
    return isPassport === false;
  },
  fn: ({ leftSide, rightSide, stageId }) => {
    return {
      stageId: stageId,
      front: leftSide,
      back: rightSide,
      documentType: 2,
    };
  },
  target: uploadDocumentFx,
});

sample({
  clock: uploadDocumentFx.doneData,
  source: $kyc,
  fn: ({ selfie }) => {
    if (selfie) {
      if (
        selfie.status !== KycStatuses.Approved.id &&
        selfie.status !== KycStatuses.OnReview.id &&
        selfie.providerId === 1
      ) {
        return "/selfie";
      } else {
        return "/kyc/sumsub";
      }
    }
    return "/kyc/sumsub";
  },
  target: pageChanged,
});

const $isPending = pending({ effects: [uploadDocumentFx] });

export const $docsUpload = combine({
  isPassport: $isPassport,
  isPending: $isPending,
  passport: $passportUrl,
  idLeftSide: $idLeftSideUrl,
  idRightSide: $idRightSideUrl,
  canContinue: $canContinue,
});
