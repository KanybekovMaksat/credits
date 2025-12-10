import { Effect, sample } from "effector";
import { showModal } from "@store/modal";

export const effectWithResponse = (ef: Effect<any, any>) => {
  sample({
    clock: ef.failData,
    fn: (clk: any) => {
      return { body: clk, title: "Error" };
    },
    target: showModal,
  });

  // sample({
  //   clock: ef.doneData,
  //   filter: (clk) => clk.otp?.validFor !== null,
  //   target: otpPropertiesReceived,
  // });
  // ef.watch((e) => console.log("loge", e));

  return ef;
};
