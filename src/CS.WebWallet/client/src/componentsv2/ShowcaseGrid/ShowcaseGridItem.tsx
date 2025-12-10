import React, { useState } from "react";
import { Link } from "react-router-dom";
import ShowcasesService, { ShowcaseItem } from "@services/ShowcasesService";
import { useTranslation } from "react-i18next";
import Modal from "@components/Modal";
import { BlueFilledButton } from "@compv2/Buttons";
import Checkbox from "@compv2/Inputs/Checkbox";

interface ShowcaseItemProps {
  showcaseItem: ShowcaseItem;
  activateProduct: (id: number, accepted: boolean) => void;
}

const ShowcaseGridItem: React.FC<ShowcaseItemProps> = ({
  showcaseItem,
  activateProduct,
}) => {
  const {
    icon,
    title,
    text,
    id,
    needToAcceptEULA,
    eula,
    eulaLink,
    requiredKycStages,
    requested,
    message,
  } = showcaseItem;
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [eulaAccepted, setEulaAccepted] = useState<boolean>(false);
  const confirmItem = () => {
    if (eulaAccepted === false && needToAcceptEULA) {
      setShowModal(true);
      return;
    }
    if (eulaAccepted) {
      if (requiredKycStages.length === 0 && needToAcceptEULA) {
        setShowModal(true);
        return;
      }
    }
    activateProduct(id, eulaAccepted);
  };

  const confirmEula = async () => {
    if (eulaAccepted) {
      await ShowcasesService.makeRequest(id, true);
      setShowModal(false);
      activateProduct(id, eulaAccepted);
    }
  };

  return (
    <div className="asset_row">
      <div className="asset_icon">{icon !== null && <img src={icon} />}</div>
      <div className="asset">
        <span className="asset_ticker">{title}</span>
        <span className="asset_name">{text}</span>
      </div>

      <div className="asset_amount">
        <div className="item-actions">
          <div className="action-message">{message}</div>
          {!requested && (
            <BlueFilledButton onClick={() => confirmItem()} text={t("open")} />
          )}
          {requested && requiredKycStages.length > 0 && (
            <BlueFilledButton
              onClick={() => confirmItem()}
              text={t("showcase_continue")}
            />
          )}
        </div>
      </div>
      <Modal modal={showModal} setModal={() => setShowModal(false)}>
        <div className="eula_modal">
          <Checkbox value={eulaAccepted} onChange={(e) => setEulaAccepted(e)}>
            {eula}
          </Checkbox>
          <Link to={eulaLink} target="_blank" rel="noopener noreferrer">
            {t("terms_conditions")}
          </Link>
          <BlueFilledButton
            text={t("Confirm")}
            onClick={() => confirmEula()}
            disabled={!eulaAccepted}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ShowcaseGridItem;
