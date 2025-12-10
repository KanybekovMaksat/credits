import { combine, createEvent, createStore } from "effector";
import { getKycStatusFx } from "@store/kyc/kyc";

export const customTokenReceived = createEvent<string>();
const $customToken = createStore<string | null>(null);
$customToken.on(customTokenReceived, (_, payload) => payload);

const $token = createStore<string | null>(null);

$token.on(getKycStatusFx.doneData, (_, payload) => {
  const stage = payload.data.stages.find(
    (f) => f.kycToken !== undefined && f.kycToken !== null
  );
  return stage?.kycToken;
});

export const $sumsub = combine({
  token: $token,
  customToken: $customToken,
});
