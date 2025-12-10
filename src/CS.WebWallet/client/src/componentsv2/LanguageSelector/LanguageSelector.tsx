import React, { useEffect, useMemo, useState } from "react";
import "./languageSelector.scss";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import {
  $translation,
  languageChanged,
  loadTranslationsFx,
} from "@store/translation";

const LanguageSelector: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const { currentLanguage, languages } = useStore($translation);

  useEffect(() => {
    loadTranslationsFx();
  }, []);

  const changeLanguage = async (iso: string) => {
    await i18n.changeLanguage(iso, () => {
      languageChanged(iso);
      setOpen(false);
    });
    i18n.reloadResources();
  };

  const flag = (iso: string) => {
    const isoNative = iso.toLowerCase();
    if (isoNative === "en") {
      return "gb";
    }
    if (isoNative === "uk") {
      return "ua";
    }
    return isoNative;
  };

  const dropdownList = useMemo(() => {
    if (languages == null) return <></>;
    if (isOpen) {
      return (
        <div className="dd-list">
          {languages.map((lng) => (
            <button
              key={lng.iso6391}
              className="dd-list-item"
              onClick={() => changeLanguage(lng.iso6391.toLowerCase())}
            >
              <div
                className="flag-invoker"
                style={{
                  backgroundImage: `url(flags/${flag(lng.iso6391)}.svg)`,
                  marginRight: "10px",
                }}
              />
              {lng.nativeName}
            </button>
          ))}
        </div>
      );
    }
    return <></>;
  }, [isOpen, languages]);

  const current = useMemo(() => {
    let currentLanguagei18n = i18n.language;
    if (currentLanguagei18n.indexOf("-") !== -1) {
      currentLanguagei18n = currentLanguagei18n.split("-")[1].toLowerCase();
    }
    if (languages) {
      const res = languages.find(
        (f) => f.iso6391.toLowerCase() === currentLanguagei18n
      );
      return res?.iso6391;
    }
    return "EN";
  }, [languages, currentLanguage, i18n]);

  return (
    <div className="language-dd-wrapper">
      <div className="dd-header" onClick={() => setOpen(!isOpen)}>
        <div className="txt-bold-18">{current ?? "EN"}</div>
        <img src="/icons/dropdown-grey.svg" />
      </div>
      {dropdownList}
    </div>
  );
};

export default LanguageSelector;
