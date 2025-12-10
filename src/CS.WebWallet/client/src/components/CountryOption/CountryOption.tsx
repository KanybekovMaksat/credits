import React from "react";
import "./styles.scss";
import { useFormContext } from "react-hook-form";
import { CountryRow } from "@services/ReferenceService";

interface CountryProps {
  country: CountryRow;
  setIsOpened: (active: boolean) => void;
}

const CountryOption: React.FC<CountryProps> = ({ country, setIsOpened }) => {
  const { setValue } = useFormContext();

  const onClick = () => {
    setValue("country", country);
    setIsOpened(false);
  };

  return (
    <button
      type="button"
      className="country-option"
      data-cy={`country_option_${country.id}`}
      onClick={onClick}
    >
      <img
        src={`flags/${country.id.toLowerCase()}.svg`}
        alt="country"
        width="55px"
        height="28px"
      />
      <div className="country-name">
        <span className="english">{country.name}</span>
        <span className="native">{country.nativeName}</span>
      </div>
      <input
        type="text"
        value={`+ ${country.phoneCodes[0]}`}
        className="phone-code"
        disabled
      />
    </button>
  );
};

export default CountryOption;
