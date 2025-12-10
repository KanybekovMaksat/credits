import React, { useEffect, useMemo, useState } from "react";
import ArrowIcon from "@components/Icons/ArrowIcon";
import SearchCountry from "@components/SearchCountry";
import { useFormContext } from "react-hook-form";
import useClickOutside from "../../hooks/useClickOutside";
import "./styles.scss";
import { useStore } from "effector-react";
import { CountryRow } from "@services/ReferenceService";
import CountryOption from "@components/CountryOption";
import { $countries } from "@store/countries";

const SelectCountryPhoneCode: React.FC<any> = (props: any): JSX.Element => {
  const { watch, setValue } = useFormContext();
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const { countries } = useStore($countries);
  const country = watch("country");

  const sortedCountries = useMemo(() => {
    return countries.sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [countries]);

  useEffect(() => {
    if (countries.length > 0) {
      const countryEn = countries.find((f) => f.id === "GB");
      if (countryEn) {
        setValue("country", countryEn);
      }
    }
  }, [countries, setValue]);

  const searchedCountries = useMemo(() => {
    const searchText = search.toLowerCase();

    const searchArray = sortedCountries.map((el) => ({
      ...el,
      combinedName: `${el.name.toLowerCase()}_${el.nativeName.toLocaleLowerCase()}_${
        el.phoneCodes[0]
      }`,
    }));
    return searchArray
      .filter((el: any) => el.combinedName.includes(searchText))
      .sort(
        (a, b) =>
          a.name.toLowerCase().indexOf(searchText) -
          b.name.toLowerCase().indexOf(searchText)
      );
  }, [search, sortedCountries]);

  const myRef = useClickOutside(() => {
    setIsOpened(false);
  });

  useEffect(() => {
    setSearch("");
    setValue("phone", "");
  }, [country]);

  return (
    <div
      className={`country-selector ${props.isMinimal ? "mini" : ""} `}
      ref={myRef}
    >
      <div className="selector">
        <button
          type="button"
          className="button"
          onClick={() => setIsOpened(!isOpened)}
          disabled={props.disabled}
          data-cy="country_input_field"
        >
          {country?.id && (
            <img
              className="select-country-flag"
              src={`flags/${country?.id.toLowerCase()}.svg`}
            />
          )}

          <ArrowIcon isOpened={isOpened} />
          <div className="phone-code">+ {country?.phoneCodes[0]}</div>
        </button>
      </div>
      {isOpened && (
        <div className="country-options">
          <div className="country-search">
            <SearchCountry
              search={search}
              setSearch={setSearch}
              resetCountry={() => setValue("country", "")}
              setIsOpened={setIsOpened}
              isMinimal={false}
            />
          </div>
          <div className="option">
            {searchedCountries.length
              ? searchedCountries.map((country: CountryRow) => {
                  return (
                    <CountryOption
                      country={country}
                      setIsOpened={setIsOpened}
                      key={country.id}
                    />
                  );
                })
              : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectCountryPhoneCode;
