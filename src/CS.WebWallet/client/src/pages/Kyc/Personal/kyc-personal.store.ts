import { effectWithResponse } from "@store/utils/effectwrapper";
import { attach, combine, createEffect, createStore, sample } from "effector";
import KycV2Service, {
  PersonalInformation,
  UpdatePersonalProps,
} from "@services/KycV2Service";
import { pending } from "patronum";
import { getKycStatusFx, getPersonalFx } from "@store/kyc/kyc";
import { KycStages, KycStatuses } from "@enums/kyc";
import { pageChanged } from "@store/navigation.store";
import { toDatePickerFormat } from "../../../helpers/datehelper";
import { $kycLinks } from "@store/kyc/kyc-links";

const uploadPersonalInformationNonAttachedFx = effectWithResponse(
  createEffect((props: UpdatePersonalProps) => {
    return KycV2Service.updatePersonalInformation(props);
  })
);

const $stageId = createStore<number | null>(null);
$stageId.on(getKycStatusFx.doneData, (_, payload) => {
  const stage = payload.data.stages.find(
    (f) => f.stage === KycStages.Personal.id
  );
  return stage?.id;
});

const $note = createStore<string | null>(null);
$note.on(getKycStatusFx.doneData, (_, payload) => {
  const stage = payload.data.stages.find(
    (f) => f.stage === KycStages.Personal.id
  );
  return stage?.note;
});

const $data = createStore<PersonalInformation | null>(null);
$data.on(getPersonalFx.doneData, (_, payload) => {
  let dateOfBirth = undefined;
  if (payload.data.dateOfBirth) {
    dateOfBirth = toDatePickerFormat(payload.data.dateOfBirth);
  }
  return {
    ...payload.data,
    dateOfBirth: dateOfBirth,
  };
});

const $isDisabled = createStore<boolean>(false);
$isDisabled.on(getKycStatusFx.doneData, (_, payload) => {
  const stage = payload.data.stages.find(
    (f) => f.stage === KycStages.Personal.id
  );
  return (
    stage?.status !== KycStatuses.Created.id &&
    stage?.status !== KycStatuses.Rejected.id
  );
});

export const uploadPersonalInformationFx = attach({
  effect: uploadPersonalInformationNonAttachedFx,
  source: $stageId,
  mapParams: (params: any, source) => {
    return { ...params, stageId: source };
  },
});

const $isPending = pending({ effects: [uploadPersonalInformationFx] });

sample({
  clock: uploadPersonalInformationFx.doneData,
  source: $kycLinks,
  fn: (e: { documents: string }) => e.documents,
  target: pageChanged,
});
sample({
  clock: uploadPersonalInformationFx.doneData,
  target: getKycStatusFx,
});
export const $personalPage = combine({
  data: $data,
  isPending: $isPending,
  isDisabled: $isDisabled,
  note: $note,
});
