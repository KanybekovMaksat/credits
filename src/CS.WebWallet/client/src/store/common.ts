import { createEvent, sample } from "effector";
import { resetKyc } from "@store/kyc/kyc";
import { layoutUnMounted } from "@store/protectedLayout.store";
import { resetAccounts } from "@store/accounts";
import { resetCards } from "@store/card";
import { resetPartner } from "@store/partner";
import { resetShowcases } from "@store/showcase";
import { resetTopUp } from "@store/topup";
import { resetTransfer } from "@store/transfer";
import { resetWithdraw } from "@store/withdrawToCard";
import { resetTariffs } from "@store/tariffs";

// reset
export const resetAllStores = createEvent();

sample({
  clock: resetAllStores,
  target: [
    layoutUnMounted,
    resetKyc,
    resetAccounts,
    resetCards,
    resetPartner,
    resetShowcases,
    resetTariffs,
    resetTopUp,
    resetTransfer,
    resetWithdraw,
  ],
});
