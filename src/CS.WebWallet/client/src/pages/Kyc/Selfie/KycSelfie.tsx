import React, { useCallback, useMemo, useRef } from "react";
import "./kyc-selfie.scss";
import ProfileStatusComment from "@components/ProfileStatusComment";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import {
  $selfieUpload,
  selfieFinishReceived,
  selfieReceived,
  selfieResetReceived,
} from "./kyc-selfie.store";
import { BlueFilledButton } from "@compv2/Buttons";
import Webcam from "react-webcam";
import TurnIcon from "@components/Icons/TurnIcon";
import PhotoButtonIcon from "@components/Icons/PhotoButtonIcon";

const KycSelfie: React.FC = (): JSX.Element => {
  const { selfieImage, canContinue, note, sumsub } = useStore($selfieUpload);
  const { t } = useTranslation();

  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    if (webcamRef !== null && webcamRef.current) {
      const imageSrc = (webcamRef.current as any).getScreenshot();
      selfieReceived(imageSrc);
    }
  }, [webcamRef]);

  const whatToRender = useMemo(() => {
    if (selfieImage) {
      return <img src={selfieImage} />;
    }

    return (
      <Webcam
        ref={webcamRef}
        audio={false}
        height="250px"
        width="100%"
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user",
        }}
        className={"flash"}
      />
    );
  }, [selfieImage, sumsub, webcamRef]);

  return (
    <div className="kyc-selfie-page">
      <div className="page-title">{t("selfie_upload_title")}</div>
      <ProfileStatusComment comment={note ?? ""} />
      <div className="selfie-upload">
        <div className="title">{t("make_photo")}</div>
        <div className="photo-group">{whatToRender}</div>
        <div className="button-group">
          {selfieImage && (
            <button
              type="button"
              className="erase-button"
              onClick={() => selfieResetReceived()}
            >
              <TurnIcon />
            </button>
          )}
          <button
            type="button"
            className="photo-button"
            onClick={() => capture()}
          >
            <PhotoButtonIcon />
          </button>
        </div>
      </div>
      <BlueFilledButton
        text={t("Continue")}
        disabled={canContinue === false}
        onClick={selfieFinishReceived}
      />
    </div>
  );
};

export default KycSelfie;
