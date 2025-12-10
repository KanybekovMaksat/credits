import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import KycV2Service, {
  KycStage,
  KycStatus,
  PersonalInformation,
  UploadAvatar,
} from "@services/KycV2Service";
import { every, reset } from "patronum";
import { KycStages, KycStatuses } from "@enums/kyc";
import { ResponseWithData } from "@models/PagedRequest";

export const avatarAdded = createEvent<File | null>();
export const uploadAvatar = createEvent();

export const getKycStatusFx = createEffect(() => {
  return KycV2Service.status();
});

export const getKycStatusSilentFx = createEffect(() => {
  return KycV2Service.status();
});

export const getPersonalFx = createEffect(() => {
  return KycV2Service.personalInformation();
});

const uploadAvatarFx = createEffect((props: UploadAvatar) => {
  return KycV2Service.updateAvatar(props);
});

const $note = createStore<string | null>(null).on(
  getKycStatusFx.doneData,
  (_, payload) => payload.data.note
);

const $avatarFile = createStore<File | null>(null)
  .on(avatarAdded, (_, e) => e)
  .reset(uploadAvatarFx.done);

const $minimalStatus = createStore<number>(0);
$minimalStatus.on(getKycStatusFx.doneData, (_, payload) => {
  const stages = payload.data.stages.filter((f) => f.required);
  if (stages.find((e) => e.status === 5 || e.status == 3)) return 3;
  const result = stages.reduce((min, current) => {
    return current.status < min.status ? current : min;
  });
  return result.status;
});

const $name = createStore<string>("Unknown");
$name.on(getPersonalFx.doneData, (_, payload) => {
  let res = "";
  if (payload.data.firstName) {
    res += payload.data.firstName;
  }
  if (payload.data.lastName) {
    res += " " + payload.data.lastName;
  }
  if (res === "") {
    return _;
  }
  return res;
});

const $personalInfo = createStore<PersonalInformation | null>(null).on(
  getPersonalFx.doneData,
  (_, e) => e.data
);

const $phone = createStore<KycStage | null>(null)
  .on(getKycStatusSilentFx.doneData, (_, payload) =>
    payload.data.stages.find((f) => f.stage === KycStages.Phone.id)
  )
  .on(getKycStatusFx.doneData, (_, payload) =>
    payload.data.stages.find((f) => f.stage === KycStages.Phone.id)
  );

const $email = createStore<KycStage | null>(null)
  .on(getKycStatusSilentFx.doneData, (_, payload) =>
    payload.data.stages.find(
      (f) => f.stage === KycStages.Email.id && f.providerId === 1
    )
  )
  .on(getKycStatusFx.doneData, (_, payload) =>
    payload.data.stages.find(
      (f) => f.stage === KycStages.Email.id && f.providerId === 1
    )
  );

const $personal = createStore<KycStage | null>(null);

const personalReducer = (_: any, payload: ResponseWithData<KycStatus>) => {
  const allPersonal = payload.data.stages
    .filter((f) => f.stage == KycStages.Personal.id)
    .sort((a, b) => a.providerId - b.providerId);
  const rejected = allPersonal.find(
    (f) => f.status === KycStatuses.Rejected.id
  );
  if (rejected) {
    return rejected;
  }
  const created = allPersonal.find((f) => f.status === KycStatuses.Created.id);
  if (created) {
    return created;
  }

  return allPersonal[allPersonal.length - 1];
};

$personal.on(getKycStatusFx.doneData, personalReducer);
$personal.on(getKycStatusSilentFx.doneData, personalReducer);

const $documents = createStore<KycStage | null>(null);
const documentReducer = (_: any, payload: ResponseWithData<KycStatus>) => {
  const allDocuments = payload.data.stages
    .filter((f) => f.stage == KycStages.Documents.id)
    .sort((a, b) => a.providerId - b.providerId);
  const rejected = allDocuments.find(
    (f) => f.status === KycStatuses.Rejected.id
  );
  if (rejected) {
    return rejected;
  }
  const created = allDocuments.find((f) => f.status === KycStatuses.Created.id);
  if (created) {
    return created;
  }

  return allDocuments[allDocuments.length - 1];
};
$documents.on(getKycStatusFx.doneData, documentReducer);
$documents.on(getKycStatusSilentFx.doneData, documentReducer);

const $selfie = createStore<KycStage | null>(null);
const selfieReducer = (_: any, payload: ResponseWithData<KycStatus>) => {
  const allSelfie = payload.data.stages
    .filter((f) => f.stage == KycStages.Selfie.id)
    .sort((a, b) => a.providerId - b.providerId);

  const rejected = allSelfie.find((f) => f.status === KycStatuses.Rejected.id);
  if (rejected) {
    return rejected;
  }

  const created = allSelfie.find((f) => f.status === KycStatuses.Created.id);
  if (created) {
    return created;
  }

  return allSelfie[allSelfie.length - 1];
};
$selfie.on(getKycStatusFx.doneData, selfieReducer);
$selfie.on(getKycStatusSilentFx.doneData, selfieReducer);

const $poa = createStore<KycStage | null>(null);
$poa.on(getKycStatusFx.doneData, (_, payload) =>
  payload.data.stages.find((f) => f.stage == KycStages.PoA.id)
);
$poa.on(getKycStatusSilentFx.doneData, (_, payload) =>
  payload.data.stages.find((f) => f.stage == KycStages.PoA.id)
);

const $wizardNeeds = createStore<boolean>(false);
const wizardReducer = (_: any, payload: ResponseWithData<KycStatus>) => {
  const badStage = payload.data.stages
    .filter((f) => f.stage !== KycStages.Email.id)
    .find((f) => f.status === KycStatuses.Created.id);
  return badStage !== undefined;
};
$wizardNeeds.on(getKycStatusFx.doneData, wizardReducer);
$wizardNeeds.on(getKycStatusSilentFx.doneData, wizardReducer);

const $isLoaded = every({
  stores: [$phone, $email, $personal, $documents, $selfie, $poa],
  predicate: (stage: KycStage | null) => {
    return stage !== null;
  },
});

sample({ clock: getKycStatusFx.doneData, target: getPersonalFx });
sample({
  clock: uploadAvatar,
  source: { file: $avatarFile },
  fn: ({ file }) => ({ file: file as any }),
  target: uploadAvatarFx,
});

sample({ clock: uploadAvatarFx.done, target: getPersonalFx });

export const resetKyc = reset({
  target: [$phone, $email, $name, $personal, $documents, $selfie, $poa],
});

export const $kyc = combine({
  personal: $personal,
  documents: $documents,
  selfie: $selfie,
  note: $note,
  email: $email,
  phone: $phone,
  wizardNeeds: $wizardNeeds,
  isKycLoaded: $isLoaded,
  minimalStatus: $minimalStatus,
  name: $name,
  personalInfo: $personalInfo,
  avatarFile: $avatarFile,
});
