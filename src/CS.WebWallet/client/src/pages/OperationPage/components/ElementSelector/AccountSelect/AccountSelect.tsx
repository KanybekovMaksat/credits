import React, { useState } from "react";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import Dropdown from "@components/Icons/ArrowIcon/ArrowIcon";
import "./styles.scss";
import useClickOutside from "../../../../../hooks/useClickOutside";
import AccountOption, { getContent } from "../AccountOption/AccountOption";
import { OptionsGroup, SelectorOption } from "../../../types";
import { $accounts } from "@store/accounts";

interface AccountSelectProps {
  data: OptionsGroup[];
  onChange: (opt: SelectorOption) => void;
  currentOption: SelectorOption | undefined | null;
  disabled?: boolean;
}

const AccountSelect: React.FC<AccountSelectProps> = (
  props: AccountSelectProps
) => {
  const { data, onChange, currentOption, disabled } = props;
  const { t } = useTranslation();
  const [isOpened, setIsOpened] = useState(false);
  const { all } = useStore($accounts);

  const myRef = useClickOutside(() => {
    setIsOpened(false);
  });

  const clickHandler = (bool: boolean) => (event: any) => {
    event.preventDefault();
    setIsOpened(bool);
  };

  const inputHandler = (opt: SelectorOption) => (event: any) => {
    event.preventDefault();
    setIsOpened(!isOpened);
    onChange(opt);
  };

  const selected = () => {
    if (!currentOption) return <></>;
    const currentAccount = all.find(
      (e) => e.accountId === currentOption?.accountId
    );

    return getContent(t, currentOption, currentAccount);
  };

  return (
    <div ref={myRef} className="account-selector-container">
      <button
        type="button"
        className="account-selector"
        onClick={clickHandler(!isOpened)}
        disabled={disabled}
      >
        <div className="account-option-item selected">{selected()}</div>
        <Dropdown isOpened={isOpened} />
      </button>
      {isOpened && (
        <div className="account-options">
          {(data ?? []).map((e, i) => (
            <div className="options-group" key={`group_${i}`}>
              <div className="group-header">{t(e.name ?? "")}</div>
              <ul>
                {e.options.map((opt, i) => {
                  return (
                    <li key={`${opt.accountId}_${opt.type}_${i}`}>
                      <AccountOption option={opt} inputHandler={inputHandler} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountSelect;
