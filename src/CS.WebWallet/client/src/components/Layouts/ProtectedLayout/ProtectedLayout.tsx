import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "effector-react";
import SideMenu from "@components/SideMenu/SideMenu";
import Header from "@components/Header";

import ChatToggle from "@components/Chat/ChatToggle";
import LayoutComments from "@components/LayoutComments";
import ResponseModal from "@components/ResponseModal";
import { $modalStore, closeModal } from "@store/modal";
import Modal from "@components/Modal";
import NewCardModal from "@compv2/Modals/NewCardModal";
import { $cards, cardModalHidden, cardStatusModalHidden } from "@store/card";
import Loader from "@components/Loader";
import "./styles.scss";
import CardStatusModal from "@compv2/Modals/CardStatusModal";
import { $layoutStatus, layoutMounted } from "@store/protectedLayout.store";
import { navigationReceived } from "@store/navigation.store";
import ActivateCardModal from "@compv2/Modals/ActivateCardModal";
import { $activateCard, activateCardModalHidden } from "@store/activateCard";
import { $otp, otpModalHidden } from "@store/otp";
import OtpCodeModal from "@compv2/Modals/OtpCodeModal";
import { $kyc } from "@store/kyc/kyc";
import { KycStatuses } from "@enums/kyc";
import FooterV2 from "@compv2/FooterV2";

const ProtectedLayout: React.FC = () => {
  const { cardModal, cardStatusModal } = useStore($cards);
  const { activateCardModalShown } = useStore($activateCard);
  const { visible, body } = useStore($modalStore);
  const { visible: otpVisible } = useStore($otp);
  const { loaded } = useStore($layoutStatus);
  const { email, phone } = useStore($kyc);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (loaded === false) {
      layoutMounted();
    }
  }, [loaded]);

  useEffect(() => {
    navigationReceived(navigate);
  }, [navigate]);

  useEffect(() => {
    if (email?.status === KycStatuses.Created.id && pathname !== "/kyc/mail") {
      navigate("/kyc/mail");
    }
    if (phone?.status === KycStatuses.Created.id && pathname !== "/kyc/phone") {
      navigate("/kyc/phone");
    }
  }, [pathname, email, phone]);

  return (
    <Suspense>
      <div className="protected-layout" data-cy="protected-layout">
        <div className="protected-layout_container">
          {loaded === false && <Loader />}
          {loaded && (
            <>
              <SideMenu />

              <div className="body">
                <Header />
                <div className="content">
                  <LayoutComments />

                  <Outlet />
                </div>
                <ChatToggle />
              </div>
            </>
          )}
        </div>
        <Modal modal={cardModal} setModal={cardModalHidden}>
          <NewCardModal />
        </Modal>
        <Modal
          modal={cardStatusModal !== null}
          setModal={cardStatusModalHidden}
        >
          <CardStatusModal />
        </Modal>
        <Modal
          modal={activateCardModalShown}
          setModal={activateCardModalHidden}
        >
          <ActivateCardModal />
        </Modal>
        <Modal modal={otpVisible} setModal={otpModalHidden}>
          <OtpCodeModal />
        </Modal>
        <ResponseModal
          text={body}
          visible={visible}
          onCancel={closeModal}
          onConfirm={closeModal}
        />
        <FooterV2 />
      </div>
    </Suspense>
  );
};

export default ProtectedLayout;
