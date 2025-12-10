import React from "react";
import "./kyc-documents.scss";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import { $kyc } from "@store/kyc/kyc";
import ProfileStatusComment from "@components/ProfileStatusComment";
import {
  $docsUpload,
  finishStarted,
  leftSideReceived,
  passportReceived,
  rightSideReceived,
  typeChanged,
} from "./kyc-docs.store";
import { BlueFilledButton } from "@compv2/Buttons";
import passportPhoto from "/images/passport/passport.png";
import frontSide from "/images/passport/passport-front.png";
import backSide from "/images/passport/passport-back.png";

import DownloadIcon from "@components/Icons/DownloadIcon";

const KycDocuments: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { documents } = useStore($kyc);
  const {
    isPassport,
    passport,
    idLeftSide,
    idRightSide,
    canContinue,
    isPending,
  } = useStore($docsUpload);

  const dropFinished = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) {
      return file;
    }
    return null;
  };
  const uploadingArea = () => {
    if (isPassport) {
      return (
        <div className="single-file">
          <div
            className="upload-wrapper"
            onDragStart={(event) => event.preventDefault()}
            onDragLeave={(event) => event.preventDefault()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const file = dropFinished(event);
              if (file !== null) passportReceived(file);
            }}
          >
            <div className="upload-file">
              <img alt="" src={passport ?? passportPhoto} />
            </div>
            <div className="icon">
              <label htmlFor="passport-file">
                <DownloadIcon />
                <span>{"Upload a file"}</span>
                <input
                  type="file"
                  id="passport-file"
                  accept="image/*"
                  onChange={(e) => {
                    if (
                      e.target &&
                      e.target.files &&
                      e.target.files.length === 1
                    ) {
                      const file = e.target?.files[0] ?? null;
                      if (file) passportReceived(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="double-file">
        <div
          className="upload-wrapper"
          onDragStart={(event) => event.preventDefault()}
          onDragLeave={(event) => event.preventDefault()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            const file = dropFinished(event);
            if (file !== null) leftSideReceived(file);
          }}
        >
          <div className="upload-file">
            <img alt="" src={idLeftSide ?? frontSide} />
          </div>
          <div className="icon">
            <label htmlFor="leftSideFile">
              <DownloadIcon />
              <span>{"Upload a file"}</span>
              <input
                type="file"
                id="leftSideFile"
                accept="image/*"
                onChange={(e) => {
                  if (
                    e.target &&
                    e.target.files &&
                    e.target.files.length === 1
                  ) {
                    const file = e.target?.files[0] ?? null;
                    if (file) leftSideReceived(file);
                  }
                }}
              />
            </label>
          </div>
        </div>
        <div
          className="upload-wrapper"
          onDragStart={(event) => event.preventDefault()}
          onDragLeave={(event) => event.preventDefault()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            const file = dropFinished(event);
            if (file !== null) rightSideReceived(file);
          }}
        >
          <div className="upload-file">
            <img alt="" src={idRightSide ?? backSide} />
          </div>
          <div className="icon">
            <label htmlFor="rightSideFile">
              <DownloadIcon />
              <span>{"Upload a file"}</span>
              <input
                type="file"
                id="rightSideFile"
                accept="image/*"
                onChange={(e) => {
                  if (
                    e.target &&
                    e.target.files &&
                    e.target.files.length === 1
                  ) {
                    const file = e.target?.files[0] ?? null;
                    if (file) rightSideReceived(file);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="kyc-document-page">
      <div className="page-title">{t("Document")}</div>
      <ProfileStatusComment comment={documents?.note} />
      <div className="checkboxes">
        <input
          type="checkbox"
          checked={isPassport}
          onChange={() => typeChanged(true)}
        />
        <span>{t("passport")}</span>

        <input
          type="checkbox"
          checked={isPassport == false}
          onChange={() => typeChanged(false)}
        />
        <span>{t("id_card")}</span>
      </div>
      {uploadingArea()}
      <BlueFilledButton
        text={t("Continue")}
        disabled={canContinue === false}
        onClick={finishStarted}
        isLoading={isPending}
      />
    </div>
  );
};

export default KycDocuments;
