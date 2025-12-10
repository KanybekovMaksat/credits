import React, { FC } from "react";
import Modal from "@components/Modal";
import BlueButton from "@components/BlueButton/BlueButton";
import "./styles.scss";
import { useTranslation } from "react-i18next";

export interface ResponseModalProps {
  visible: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  text?: string | null;
}

const defaultVoid = () => {
  /* no op */
};

const ResponseModal: FC<ResponseModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  text,
}) => {
  const { t } = useTranslation();

  const cancel = onCancel ?? defaultVoid;
  const confirm = onConfirm ?? defaultVoid;
  return (
    <Modal modal={visible} setModal={cancel} top>
      <div className="response_modal">
        <div className="text">{text}</div>
        <BlueButton width={300} onClick={confirm}>
          {t("close")}
        </BlueButton>
      </div>
    </Modal>
  );
};

export default ResponseModal;
