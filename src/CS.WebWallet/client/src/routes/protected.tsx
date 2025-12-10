import React from "react";
import { redirect, RouteObject } from "react-router-dom";
import { setMe } from "@store/auth";
import Loader from "@components/Loader";
import ProtectedLayout from "@components/Layouts/ProtectedLayout";
import Crypto from "../pages/Crypto";
import Wallet from "../pages/Wallet";
import AccountDetailsPage from "../pages/AccountDetailsPage";
import WithdrawPage from "../pages/OperationsPages/WithdrawPage";
import TransferPage from "../pages/OperationsPages/TransferPage";
import AllHistoryPage from "../pages/AllHistoryPage";
import KycSummary from "../pages/Kyc/Summary";
import KycPersonal from "../pages/Kyc/Personal";
import KycDocuments from "../pages/Kyc/Documents";
import KycSelfie from "../pages/Kyc/Selfie";
import SettingsPage from "../pages/SettingsPage";
import CardsPage from "../pages/CardsPage";
import PartnerPage from "../pages/PartnerPage";
import KycSumsub from "../pages/Kyc/Sumsub/Sumsub";
import IdentityService from "@services/IdentityService";
import CardVerificationSuccess from "../pages/CardVerificationSuccess";
import CardViewPage from "../pages/CardViewPage";

import OperationPage from "@pages/OperationPage";
import TopUp from "@pages/OperationsPages/TopUp";
import DirectedOperationPage from "@pages/OperationsPages/DirectedOperationPage";
import { Direction } from "@pages/OperationPage/types";
import ExchangePage from "@pages/OperationsPages/ExchangePage";
import SetEmailPage from "@pages/Kyc/SetEmailPage";
import TariffsPage from "@pages/TariffsPage";
import StakingPage from "@pages/StakingPage";
import StakingCalculatorPage from "@pages/StakingPage/StakingCalculatorPage";
import SetPhonePage from "@pages/Kyc/SetPhonePage";

const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <Loader />,
    loader: async () => {
      try {
        const res = await IdentityService.me();
        setMe(res?.data ?? null);
        return true;
      } catch (e) {
        return redirect("/login");
      }
    },
    children: [
      { index: true, path: "accounts", element: <Crypto /> },
      {
        path: "wallet",
        element: <Wallet />,
      },
      {
        path: "wallet/:id",
        element: <AccountDetailsPage />,
      },
      {
        path: "accounts/:id",
        element: <AccountDetailsPage />,
      },
      {
        path: "operation",
        element: <OperationPage />,
      },
      {
        path: "operation/:accountId/:op",
        element: <OperationPage />,
      },
      {
        path: "transfer",
        element: <TransferPage />,
      },
      {
        path: "all-history",
        element: <AllHistoryPage />,
      },
      {
        path: "topup",
        children: [
          { index: true, element: <TopUp /> },
          {
            path: "crypto",
            element: (
              <DirectedOperationPage direction={Direction.TopUpCrypto} />
            ),
          },
          {
            path: "prepaid",
            element: (
              <DirectedOperationPage direction={Direction.TopUpPrepaid} />
            ),
          },
          {
            path: "prepaidBank",
            element: (
              <DirectedOperationPage direction={Direction.TopUpRequisites} />
            ),
          },
        ],
      },
      {
        path: "withdraw",
        children: [
          { index: true, element: <WithdrawPage /> },
          {
            path: "prepaid",
            element: (
              <DirectedOperationPage direction={Direction.WithdrawPrepaid} />
            ),
          },
          {
            path: "prepaidBank",
            element: (
              <DirectedOperationPage direction={Direction.WithdrawRequisites} />
            ),
          },
          {
            path: "prepaidSwift",
            element: <DirectedOperationPage direction={Direction.Swift} />,
          },
        ],
      },
      {
        path: "exchange",
        element: <ExchangePage />,
      },
      {
        path: "kyc",
        children: [
          { index: true, element: <KycSummary /> },
          { path: "mail", element: <SetEmailPage /> },
          { path: "phone", element: <SetPhonePage /> },
          {
            path: "personal-information",
            element: <KycPersonal />,
          },
          {
            path: "document",
            element: <KycDocuments />,
          },
          {
            path: "selfie",
            element: <KycSelfie />,
          },
        ],
      },

      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "cards",
        element: <CardsPage />,
      },
      {
        path: "cards/:cardId",
        element: <CardViewPage />,
      },
      {
        path: "cards/:cardId/verification-completed",
        element: <CardVerificationSuccess />,
      },
      {
        path: "referral",
        element: <PartnerPage />,
      },
      {
        path: "kyc/sumsub",
        element: <KycSumsub />,
      },
      {
        path: "tariffs",
        element: <TariffsPage />,
      },
      {
        path: "staking",
        element: <StakingPage />,
      },
      {
        path: "staking/:id",
        element: <StakingCalculatorPage />,
      },
    ],
  },
];
export default protectedRoutes;
