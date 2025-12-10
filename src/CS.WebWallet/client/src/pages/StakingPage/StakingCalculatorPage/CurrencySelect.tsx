import React from "react";
import Dropdown from "@components/Icons/ArrowIcon/ArrowIcon";
import useClickOutside from "../../../hooks/useClickOutside";

export interface CurrencyItem {
  id: number;
  code: string;
  icon: string;
}

export interface CurrencySelectProps {
  currencies: CurrencyItem[];
  disabled?: boolean;
  onCurrencyChange?: (opt: CurrencyItem) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = (
  props: CurrencySelectProps
) => {
  const { currencies, disabled, onCurrencyChange } = props;
  const [isOpened, setIsOpened] = React.useState(false);
  const [currency, setCurrency] = React.useState<CurrencyItem | null>(
    currencies.length === 0 ? null : currencies[0]
  );

  React.useEffect(() => {
    if (!currency && currencies.length > 0) {
      setCurrency(currencies[0]);
      if (onCurrencyChange) onCurrencyChange(currencies[0]);
    }
  }, [currencies, currency]);

  const myRef = useClickOutside(() => {
    setIsOpened(false);
  });

  const clickHandler = (bool: boolean) => (event: any) => {
    event.preventDefault();
    setIsOpened(bool);
  };

  const inputHandler = (opt: CurrencyItem) => {
    setIsOpened(!isOpened);
    setCurrency(opt);
    if (onCurrencyChange) onCurrencyChange(opt);
  };

  const selected = () => {
    if (!currency) return <></>;
    return (
      <div className="selected-currency selected">
        <img src={currency.icon} />
        <div>{currency.code}</div>
      </div>
    );
  };

  return (
    <div ref={myRef} className="currency-selector-container">
      <button
        type="button"
        className={`currency-selector`}
        onClick={clickHandler(!isOpened)}
        disabled={disabled}
      >
        <div className="currency-option-item selected">{selected()}</div>
        <Dropdown isOpened={isOpened} />
      </button>
      {isOpened && (
        <ul className="currency-options">
          {(currencies ?? []).map((e, i) => (
            <li
              className="options-group"
              key={`group_${i}`}
              onClick={(ev) => {
                ev.preventDefault();
                inputHandler(e);
              }}
            >
              <img src={e.icon} />
              <div className="group-header">{e.code}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CurrencySelect;
