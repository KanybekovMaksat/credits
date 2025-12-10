import React, { useEffect, useMemo } from "react";
import BlueButton from "@components/BlueButton/BlueButton";
import "./styles.scss";
import Modal from "@components/Modal";

import { useTranslation } from "react-i18next";
import DeleteCardModal from "./DeleteCardModal";
import {
  $cards,
  cardModalHidden,
  cardModalShown,
  deleteCardIdUpdated,
  getCardListFx,
} from "@store/card";
import { useStore } from "effector-react";

const CardsPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { cardList, deleteCardId } = useStore($cards);
  useEffect(() => {
    getCardListFx();
  }, []);

  const cardsGrid = useMemo(() => {
    if (cardList === null) return [];
    return cardList.map((card: any) => {
      const [name, surname] = card.holder.split(" ");
      const holder =
        name && surname && `${name.slice(0, 2)}* ${surname.slice(0, 3)}***`;

      return (
        <tr className="card-info" key={card.id}>
          <td>{card.maskedPan}</td>
          <td className="name_column">{holder}</td>
          <td
            className={`status_column ${
              card.isVerified ? "verified" : "not_verified"
            }`}
          >
            {card.isVerified ? t("Verified") : t("Not Verified")}
          </td>
          <td>
            <button
              className="card-action"
              onClick={() => deleteCardIdUpdated(card.id)}
            >
              {t("delete")}
            </button>
          </td>
        </tr>
      );
    });
  }, [cardList]);

  return (
    <div className="cards-page">
      <div className="page-title">{t("verified_cards_page")}</div>
      <span className="page-subtitle">{t("card_list_description")}</span>

      <div className="grid">
        <table className="card-table">
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          {cardsGrid}
        </table>
      </div>
      <div style={{ paddingTop: "15px" }}>
        <BlueButton width={240} type="submit" onClick={() => cardModalShown()}>
          {t("add_card")}
        </BlueButton>
      </div>
      <Modal modal={deleteCardId !== null} setModal={cardModalHidden}>
        <DeleteCardModal />
      </Modal>
    </div>
  );
};

export default CardsPage;
