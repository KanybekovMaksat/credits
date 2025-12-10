import { combine, createEvent, createStore, sample } from "effector";
import { createEffect } from "effector";
import IdentityService, { Auth, Me, Totp } from "@services/IdentityService";
import { siteChanged } from "@store/navigation.store";

const setMe = createEvent<Me>();
const getMe = createEvent();
const loginRequested = createEvent<Auth>();
const loginCodeConfirm = createEvent<Totp>();
const resendCode = createEvent();
const logoutRequested = createEvent();
const resetLogin = createEvent();

const loginFx = createEffect((props: Auth) => IdentityService.login(props));
const confirmFx = createEffect((props: Totp) => IdentityService.totp(props));
const logoutFx = createEffect(() => IdentityService.logout());
const getMeFx = createEffect(() => IdentityService.me());

const $loading = createStore<boolean>(false)
  .on(loginFx.pending, (_, p) => p)
  .on(confirmFx.pending, (_, p) => p)
  .on(logoutFx.pending, (_, p) => p);

const $currentStep = createStore<number>(0)
  .on(loginFx.doneData, (_, p) => (p.success ? 1 : 0))
  .on(confirmFx.doneData, (_, p) => (p.success ? 2 : 1))
  .on(logoutFx.doneData, () => 0)
  .reset([loginRequested, resetLogin]);

const $me = createStore<Me | null>(null)
  .on(setMe, (_, p) => p)
  .on(getMeFx.doneData, (_, p) => {
    return p?.success === true ? p.data : null;
  })
  .reset([logoutRequested, loginRequested, loginCodeConfirm, resetLogin]);

const $authData = createStore<Auth>({} as Auth)
  .on(loginRequested, (_, e) => e)
  .reset(resetLogin);

const $loginError = createStore<string | null>(null)
  .on(loginFx.failData, (_, p) => p as any)
  .reset([loginRequested, loginFx.doneData]);

sample({
  clock: logoutFx.doneData,
  fn: () => "",
  target: siteChanged,
});

sample({ clock: loginRequested, target: loginFx });
sample({ clock: loginCodeConfirm, target: confirmFx });
sample({ clock: logoutRequested, target: logoutFx });
sample({ clock: getMe, target: getMeFx });
sample({
  clock: resendCode,
  source: { auth: $authData },
  filter: ({ auth }) => !!auth,
  fn: ({ auth }) => auth,
  target: loginFx,
});

const $login = combine({
  loading: $loading,
  step: $currentStep,
  me: $me,
  error: $loginError,
});

export {
  $login,
  setMe,
  getMe,
  loginRequested,
  loginCodeConfirm,
  logoutRequested,
  resendCode,
  resetLogin,
};
