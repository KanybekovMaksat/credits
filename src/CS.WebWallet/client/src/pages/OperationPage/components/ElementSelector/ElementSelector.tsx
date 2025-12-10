import React from "react";
import { useStore } from "effector-react";
import CryptoNumber from "@compv2/Inputs/CryptoNumber";
import { $accounts } from "@store/accounts";
import { OptionsGroup, SelectorOption } from "../../types";
import AccountSelect from "./AccountSelect";

export interface ElementSelectorProps {
  loading: boolean;
  source: boolean;
  item: SelectorOption;
  options: OptionsGroup[];
  value?: number | string;
  onElementChange: (item: SelectorOption) => void;
  onValueChange: (value: string | number | undefined) => void;
}

const ElementSelector: React.FC<ElementSelectorProps> = ({
  item,
  options,
  loading,
  source,
  value,
  onElementChange,
  onValueChange,
}) => {
  const { all } = useStore($accounts);

  const account = item.accountId
    ? all.find((e) => e.accountId === item.accountId)
    : null;

  return (
    <div className="account-amount">
      <AccountSelect
        data={options}
        onChange={onElementChange}
        currentOption={item}
        disabled={loading}
      />
      {source && (
        <CryptoNumber
          onChange={onValueChange}
          placeholder="0.00"
          precision={account?.fraction ?? 10}
          disabled={loading}
          value={value}
        />
      )}
    </div>
  );
};

export default ElementSelector;
