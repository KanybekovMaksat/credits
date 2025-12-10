import React, { useEffect, useMemo, useState } from "react";
import SearchCountry from "@components/SearchCountry";
import { useFormContext } from "react-hook-form";
import useClickOutside from "../../hooks/useClickOutside";
import "./styles.scss";
import { useStore } from "effector-react";
import { CountryRow } from "@services/ReferenceService";
import CountryOption from "@components/CountryOption";
import { $countries, countryFetchReceived } from "@store/countries";

const SelectCountry: React.FC<any> = (props: any): JSX.Element => {
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
    return sortedCountries
      .filter(
        (el: any) =>
          el.name.toLowerCase().includes(searchText) ||
          el.nativeName.toLowerCase().includes(searchText)
      )
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
    countryFetchReceived();
  }, []);

  useEffect(() => {
    setSearch("");
    setValue("phone", "");
  }, [country]);

  return (
    <div className="country-selector-full" ref={myRef}>
      <div className="selector">
        <button
          type="button"
          className="country-sel-button"
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

          <div className="country-name"> {country?.name}</div>
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

export default SelectCountry;
