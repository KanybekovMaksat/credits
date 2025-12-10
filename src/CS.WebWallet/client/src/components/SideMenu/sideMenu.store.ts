import { combine, createEvent, createStore } from "effector";
import { $showcase } from "@store/showcase";
import { $accounts } from "@store/accounts";

export const menuChanged = createEvent();

const $open = createStore<boolean>(false);
$open.on(menuChanged, (state) => !state);
const $showWallet = combine($accounts, $showcase, (accounts, showcase) => {
  return (
    (accounts.fiat && accounts.fiat.length > 0) ||
    (showcase.fiat && showcase.fiat.length > 0) ||
    (showcase.bank && showcase.bank.length > 0) ||
    (showcase.cardProducts && showcase.cardProducts.length > 0) ||
    (showcase.brokerage && showcase.brokerage.length > 0)
  );
});

export const $sideMenu = combine({
  open: $open,
  showWallet: $showWallet,
});
