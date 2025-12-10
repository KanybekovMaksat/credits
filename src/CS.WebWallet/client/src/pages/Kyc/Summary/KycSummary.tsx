import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProfileStatusTag from "@components/ProfileStatusTag";
import "./styles.scss";
import ProfileStatusComment from "@components/ProfileStatusComment";
import { useStore } from "effector-react";
import { $kyc, avatarAdded, uploadAvatar } from "@store/kyc/kyc";
import { useTranslation } from "react-i18next";
import { $kycLinks } from "@store/kyc/kyc-links";
import BlueTextButton from "@components/BlueTextButton";

const KycSummary: React.FC = () => {
  const { documents, selfie, personal, personalInfo, avatarFile } =
    useStore($kyc);
  const kycLinks = useStore($kycLinks);
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<string>(
    personalInfo?.avatarUrl ?? "/images/profile/profile-avatar.png"
  );

  const img = React.useMemo(() => {
    return <img src={avatar} alt="avatar" />;
  }, [avatar]);

  return (
    <section className="profile-main">
      <span className="title">{t("profile_title")}</span>
      <div className="container">
        <div className="upload-btn-wrapper">
          <div className="avatar">{img}</div>
          <input
            type="file"
            name="myfile"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              if (!e.target.files || !e.target.files[0]) return;
              const file = e.target.files[0];
              avatarAdded(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result?.toString() ?? "";
                setAvatar(base64String);
              };
              reader.readAsDataURL(file);
            }}
          />
          {avatarFile && (
            <BlueTextButton
              style={{ fontSize: "11pt", marginTop: "10px" }}
              onClick={() => uploadAvatar()}
            >
              {t("save")}
            </BlueTextButton>
          )}
        </div>
        <div className="info">
          <div className="row">
            <div className="link-div">
              <Link to={kycLinks.personal} className="text">
                <span className="main-info">{t("personal_information")}</span>
                <span className="additional-info">
                  {t("profile_personal_description")}
                </span>
              </Link>
            </div>
            <ProfileStatusComment comment={personal?.note} />
            <ProfileStatusTag status={personal?.status} />
          </div>
          <div className="row">
            <div className="link-div">
              <Link to={kycLinks.documents} className="text">
                <span className="main-info">{t("document")}</span>
                <span className="additional-info">
                  {t("profile_document_description")}
                </span>
              </Link>
            </div>
            <ProfileStatusComment comment={documents?.note} />
            <ProfileStatusTag status={documents?.status} />
          </div>
          <div className="row last">
            <div className="link-div">
              <Link to={kycLinks.selfie} className="text">
                <span className="main-info">{t("selfie")}</span>
                <span className="additional-info">
                  {t("profile_selfie_description")}
                </span>
              </Link>
            </div>
            <ProfileStatusComment comment={selfie?.note} />
            <ProfileStatusTag status={selfie?.status} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default KycSummary;
