import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { $kyc } from "@store/kyc/kyc";
import { useStore } from "effector-react";
import { $referral } from "@store/partner";
import { KycStatuses } from "@enums/kyc";
import MenuProfile from "@compv2/Icons/MenuProfile";
import MenuSettings from "@compv2/Icons/MenuSettings";
import MenuCards from "@compv2/Icons/MenuCards";
import MenuRefferals from "@compv2/Icons/MenuRefferals";
import MenuTariffs from "@compv2/Icons/MenuTariffs";
import MenuLogout from "@compv2/Icons/MenuLogout";

import "./styles.scss";

interface ProfileDropdownProps {
  setOpenProfile: (bool: boolean) => void;
  setModal: (bool: boolean) => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = (
  props: ProfileDropdownProps
): JSX.Element => {
  const { t } = useTranslation();
  const { setOpenProfile, setModal } = props;
  const navigate = useNavigate();
  const { minimalStatus } = useStore($kyc);
  const { url } = useStore($referral);

  const statusBadge = useMemo(() => {
    if (minimalStatus !== KycStatuses.Approved.id) {
      return (
        <div className="kyc-status">
          <div className="not-verified">
            <span>{t("not_verified")}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="kyc-status">
        <div className="verified">
          <span>{t("verified")}</span>
        </div>
      </div>
    );
  }, [minimalStatus]);

  return (
    <>
      <button
        type="button"
        className="dropdown-link"
        onClick={() => {
          setOpenProfile(false);
          return navigate("/kyc");
        }}
      >
        <div className="icon">
          <MenuProfile />
        </div>
        <span>{t("profile")}</span>

        {statusBadge}
      </button>
      <button
        type="button"
        className="dropdown-link"
        onClick={() => {
          setOpenProfile(false);
          return navigate("/settings");
        }}
      >
        <div className="icon">
          <MenuSettings />
        </div>
        <span>{t("settings")}</span>
      </button>
      <button
        type="button"
        className="dropdown-link"
        onClick={() => {
          setOpenProfile(false);
          return navigate("/cards");
        }}
      >
        <div className="icon">
          <MenuCards />
        </div>
        <span>{t("cards")}</span>
      </button>
      <button
        type="button"
        className="dropdown-link"
        onClick={() => {
          setOpenProfile(false);
          return navigate("/tariffs");
        }}
      >
        <div className="icon">
          <MenuTariffs />
        </div>
        <span>{t("tariffs")}</span>
      </button>
      {url !== null && (
        <button
          type="button"
          className="dropdown-link"
          onClick={() => {
            setOpenProfile(false);
            return navigate("referral");
          }}
        >
          <div className="icon">
            <MenuRefferals />
          </div>
          <span>{t("menu_referral")}</span>
        </button>
      )}
      <hr />
      <button
        type="button"
        className="dropdown-link"
        onClick={() => {
          setModal(true);
          setOpenProfile(false);
        }}
      >
        <div className="icon">
          <MenuLogout />
        </div>
        <span>{t("menu_logout")}</span>
      </button>
    </>
  );
};

export default ProfileDropdown;
