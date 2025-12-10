import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import HeaderProfileIcon from "@components/Icons/HeaderProfileIcon";
import useClickOutside from "../../../../hooks/useClickOutside";
import ProfileDropdown from "@components/ProfileDropdown";
import ProfileStatusBadge from "@components/Header/components/Profile/ProfileStatusBadge";
import { useStore } from "effector-react";
import { $kyc } from "@store/kyc/kyc";
import Modal from "@components/Modal";
import BlueTextButton from "@components/BlueTextButton";
import { BlueFilledButton } from "@compv2/Buttons";
import { logoutRequested } from "@store/auth";
import "./styles.scss";
import { $tariffs } from "@store/tariffs";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { name, personalInfo } = useStore($kyc);
  const { current } = useStore($tariffs);
  const [openProfile, setOpenProfile] = useState<boolean>(false);

  const [modal, setModal] = React.useState<boolean>(false);

  const toggleRef = useRef<HTMLButtonElement>(null);

  const myRef = useClickOutside(() => {
    setOpenProfile(false);
  }, toggleRef);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="profile-button"
        onClick={() => setOpenProfile(!openProfile)}
      >
        <div className="profile-button-container">
          <div className="user_name">
            <span className="txt-bold-16">
              <div>{name}</div>
              <div style={{ textAlign: "right" }}>{current?.name}</div>
            </span>
            <div className="badge_wrapper">
              <ProfileStatusBadge />
            </div>
          </div>
          {personalInfo?.avatarUrl ? (
            <img
              src={personalInfo?.avatarUrl}
              width={41}
              height={41}
              className="header-avatar"
            />
          ) : (
            <HeaderProfileIcon />
          )}
          {openProfile ? (
            <div ref={myRef} className="dropdown-profile">
              <ProfileDropdown
                setOpenProfile={setOpenProfile}
                setModal={setModal}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </button>
      <Modal modal={modal} setModal={() => setModal(false)}>
        <div className="logout_confirmation">
          <div className="title">{t("log_out")}?</div>
          <div className="divider" />
          <div className="buttons">
            <BlueTextButton width={170} onClick={() => setModal(false)}>
              {t("Cancel")}
            </BlueTextButton>
            <BlueFilledButton
              text={t("yes")}
              style={{ width: "170px" }}
              onClick={() => logoutRequested()}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
