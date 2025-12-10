import React from "react";
import Magnifier from "@components/Icons/Magnigier";
import RoundCrossIcon from "@components/Icons/RoundCrossIcon";
import "./styles.scss";

interface SearchCountryProps {
  setSearch: (value: string) => void;
  setIsOpened: (value: boolean) => void;
  resetCountry: () => void;
  search: string;
  isMinimal: boolean;
}

const SearchCountry: React.FC<SearchCountryProps> = (
  props: SearchCountryProps
): JSX.Element => {
  const { setSearch, search, setIsOpened, isMinimal } = props;
  const clickHandler = () => (event: any) => {
    event.preventDefault();
    setSearch("");
    setIsOpened(false);
  };

  return (
    <div className={`search ${isMinimal ? "search-personal" : ""}`}>
      <Magnifier />
      <input
        type="text"
        value={search}
        className="input-country-search"
        data-cy="country_search_input"
        onChange={(event) => setSearch(event.target.value)}
        autoFocus
      />
      <button className="cancel_button" type="button" onClick={clickHandler()}>
        <RoundCrossIcon />
      </button>
    </div>
  );
};

export default SearchCountry;
