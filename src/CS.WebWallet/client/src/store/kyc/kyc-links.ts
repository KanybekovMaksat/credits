import { combine, createStore } from "effector";
import { getKycStatusFx } from "@store/kyc/kyc";
import { KycStages, KycStatuses, KycStatusInProgress } from "../../enums/kyc";
import { KycStage } from "@services/KycV2Service";

const getStageLink = (
  stage: { id: number; page: string },
  stages: KycStage[]
) => {
  const apiStage = stages.find(
    (f) =>
      f.stage == stage.id &&
      (f.status === KycStatuses.Created.id ||
        f.status === KycStatuses.Rejected.id)
  );
  if (apiStage === undefined) {
    return "#";
  }

  if (KycStatusInProgress.includes(apiStage.status)) {
    return "#";
  }
  if (apiStage?.providerId === 2) {
    return "/kyc/sumsub";
  }
  if (apiStage?.providerId === 1) {
    return stage.page;
  }
  return stage.page;
};

const $personal = createStore<string>(KycStages.Personal.page);
$personal.on(getKycStatusFx.doneData, (_, payload) => {
  return getStageLink(KycStages.Personal, payload.data.stages);
});

const $selfie = createStore<string>(KycStages.Selfie.page);
$selfie.on(getKycStatusFx.doneData, (_, payload) => {
  return getStageLink(KycStages.Selfie, payload.data.stages);
});

const $documents = createStore<string>(KycStages.Documents.page);
$documents.on(getKycStatusFx.doneData, (_, payload) => {
  return getStageLink(KycStages.Documents, payload.data.stages);
});

export const $kycLinks = combine({
  selfie: $selfie,
  personal: $personal,
  documents: $documents,
});
