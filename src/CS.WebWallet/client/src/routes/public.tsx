import React from "react";
import EmailConfirmationPage from "../pages/PublicPages/EmailConfirmationPage/EmailConfirmationPage";
import SumSubPage from "../pages/PublicPages/Sumsub/SumSubPage";
import SumSubSuccessPage from "../pages/PublicPages/SumsubSuccess/SumsubSuccess";

const publicRoutes = [
  {
    element: <EmailConfirmationPage />,
    path: "/confirmation/mail",
  },
  {
    element: <SumSubPage />,
    path: "/sumsub",
  },
  {
    element: <SumSubSuccessPage />,
    path: "/sumsub-finish/:self?",
  },
];

export default publicRoutes;
