import { combine, createEvent, createStore, sample } from "effector";
import { status } from "patronum/status";
import { createEffect } from "effector";
import { pending } from "patronum";

interface OtpProperties {
  data: any;
  cb: any;
}

const optFx = createEffect(async (props: OtpProperties) => {
  return props.cb({ ...props.data });
});

const otpPropertiesReceived = createEvent<OtpProperties>();
const otpModalHidden = createEvent<boolean>();
const codeChanged = createEvent<string>();
const confirmCode = createEvent();

const $currentCode = createStore<string | null>(null);
$currentCode.on(codeChanged, (_, payload) => payload);
$currentCode.on(otpModalHidden, () => null);

const $options = createStore<OtpProperties | null>(null);
$options.on(otpPropertiesReceived, (_, payload) => payload);
$options.on(otpModalHidden, () => null);

const $otpVisible = createStore<boolean>(false);
$otpVisible.on(otpPropertiesReceived, () => true);
$otpVisible.on(otpModalHidden, () => false);

const $optSent = status({ effect: optFx });
$optSent.reset(otpModalHidden);

sample({
  clock: optFx.doneData,
  filter: (clk) => {
    return clk.data.otp.validated === true;
  },
  target: otpModalHidden,
});

sample({
  clock: confirmCode,
  source: combine({ originalData: $options, code: $currentCode }),
  fn: (src) => {
    return {
      data: { ...src.originalData?.data, otp: src.code },
      cb: src.originalData?.cb,
    };
  },

  target: optFx,
});

const $isPending = pending({ effects: [optFx] });
const $otp = combine({
  visible: $otpVisible,
  sent: $optSent,
  loading: $isPending,
});

export {
  $otp,
  otpPropertiesReceived,
  otpModalHidden,
  codeChanged,
  confirmCode,
};
