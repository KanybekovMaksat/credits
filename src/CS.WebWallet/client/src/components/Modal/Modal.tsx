import React, { FC } from "react";
import "./styles.scss";

interface ModalProps {
  modal: boolean | string;
  setModal: () => void;
  top?: boolean;
  children?: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ children, modal, setModal, top }) => {
  return (
    <div
      className={`global-modal ${modal && "active"} ${top && "top"}`}
      onClick={() => setModal()}
    >
      <div
        className="modal_container"
        onClick={(event) => event.stopPropagation()}
      >
        {modal && children}
      </div>
    </div>
  );
};

export default Modal;
