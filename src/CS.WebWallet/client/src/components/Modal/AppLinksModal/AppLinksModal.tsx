import React from "react";
import "./styles.scss";
import {
  $appLinksModalData,
  resetAppLinksModal,
} from "@components/Modal/AppLinksModal/store/data";
import { useStore } from "effector-react";
import CloseIcon from "@components/Icons/CloseIcon";

const AppLinksModal: React.FC = () => {
  const data = useStore($appLinksModalData);

  return (
    <div className="cs_col app_link_modal">
      <div className="cs_row justify_right">
        <button onClick={() => resetAppLinksModal()}>
          <CloseIcon />
        </button>
      </div>
      <div className="cs_col modal_content">
        <span>Download Credits</span>
        {data.QRCode}
        {data.button}
      </div>
    </div>
  );
};

export default AppLinksModal;
