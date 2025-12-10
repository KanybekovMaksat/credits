export type OptionType =
  | "account"
  | "wallet"
  | "walletRequisites"
  | "appCard"
  | "requisites"
  | "fullRequisites"
  | "fullRequisitesSwift";

export enum Direction {
  None = 0,
  TopUpCrypto = 1,
  TopUpPrepaid = 2,
  TopUpRequisites = 3,
  WithdrawCrypto = 4,
  WithdrawPrepaid = 5,
  WithdrawRequisites = 6,
  Exchange = 7,
  Swift = 8,
}

export type SelectorOption = {
  accountId?: string;
  type: OptionType;
};

export type OptionsGroup = {
  name?: string;
  options: SelectorOption[];
};

export type groups = {
  from: OptionsGroup[];
  to: OptionsGroup[];
  direction?: Direction;
};
