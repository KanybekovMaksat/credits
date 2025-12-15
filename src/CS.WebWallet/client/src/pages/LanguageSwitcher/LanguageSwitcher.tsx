import React, { useMemo } from "react";
import "./styles.scss";
import { useTranslation } from "react-i18next";
import leftArrowIcon from "../../static/icons/left-arrow.svg";
import doneVIcon from "../../static/icons/done-v.svg";

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();

  const languages = useMemo(
    () => [
      {
        code: "en",
        name: "English",
        native: "English",
        flag: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGLx6mq7_hgjlaAIX5gfw5skqzHB22PIn2mw&s",
        selected: true,
      },
      {
        code: "uk",
        name: "Українська",
        native: "Ukraine",
        flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACnCAMAAAAPIrEmAAAADFBMVEUAV7f/1wCrrTzHv0X9S2aBAAAAhUlEQVR4nO3PAREAIAwAoen6dzaH99CAGQAAAAAAAAAAAAAAAAAAAAAAAACA392sOVnqRepF6kXqRepF6kXqRepF6kXqRepF6kXqRepF6kXqRepF6kXqRepF6kXqRepF6kXqRepF6kXqRepF6kXqRepF6kXqRepF6kXqRepF6kXqReX6Zj1cUFT3CQFj+wAAAABJRU5ErkJggg==",
      },
      {
        code: "ru",
        name: "Русский",
        native: "Russian",
        flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/1200px-Flag_of_Russia.svg.png",
      },
      {
        code: "tr",
        name: "Türkçe",
        native: "Turkish",
        flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/250px-Flag_of_Turkey.svg.png",
      },
      {
        code: "es",
        name: "Español",
        native: "Spanish",
        flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/250px-Bandera_de_Espa%C3%B1a.svg.png",
      },
      {
        code: "de",
        name: "Deutsch",
        native: "German",
        flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/250px-Flag_of_Germany.svg.png",
      },
    ],
    []
  );

  return (
    <section className="accounts_page language-page">
      <div className="page-shell">
        <div className="content-wrap">
          <div className="page-title-box">
            <div className="action-inner-wrap">
              <button className="btn button-link button-link-att" type="button">
                <div className="button-icon">
                  <img
                    src={leftArrowIcon}
                    alt="Back"
                  />
                </div>
              </button>
            </div>
            <div className="title-inner-wrap">
              <h1 className="page-title section-title">{t("Language")}</h1>
              <p>{t("Total balance of all assets")}</p>
            </div>
          </div>
        </div>

        <div className="language-card">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-row ${lang.selected ? "is-active" : ""}`}
              type="button"
            >
              <div className="lang-flag">
                <img src={lang.flag} alt={lang.name} />
              </div>
              <div className="lang-info">
                <div className="lang-name">{lang.name}</div>
                <div className="lang-native">{lang.native}</div>
              </div>
              <div className="lang-check">
                <img src={doneVIcon} alt="" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LanguageSwitcher;
