import { createEvent, createStore } from "effector";
import React from "react";

import { AppStoreQRCode, GooglePlayQRCode } from "@components/QRCodes";

type Modal = "app_store" | "google_play";

type storeData = {
  modal?: Modal;
  QRCode?: JSX.Element;
  button?: JSX.Element;
};

const defaultStore: storeData = {};

export const setModal = createEvent<Modal>();
export const resetAppLinksModal = createEvent();

export const $appLinksModalData = createStore<storeData>(defaultStore)
  .on(setModal, (prev, state) => {
    switch (state) {
      case "app_store":
        return {
          modal: state,
          QRCode: <AppStoreQRCode />,
          //button: <AppStoreButton />,
        };
      case "google_play":
        return {
          modal: state,
          QRCode: <GooglePlayQRCode />,
          //button: <GooglePlayButton />,
        };
    }
  })
  .on(resetAppLinksModal, () => defaultStore)
  .reset(resetAppLinksModal);
