import React from "react";
import { RouteObject } from "react-router-dom";
import { Cookies } from "react-cookie";
import Branch from "branch-sdk";
import Loader from "@components/Loader";
import LoginLayout from "@components/Layouts/LoginLayout";
import Login from "@pages/Login";

const loginRoutes: RouteObject[] = [
  {
    path: "",
    element: <LoginLayout />,
    errorElement: <Loader />,
    loader: async ({ request }) => {
      try {
        const cookies = new Cookies();
        const url = new URL(request.url);
        cookies.remove("referral");

        if (!url.search) return true;
        const params = JSON.parse(
          '{"' +
            decodeURI(
              url.search
                .replace(/\?/g, "")
                .replace(/&/g, '","')
                .replace(/=/g, '":"')
            ) +
            '"}'
        );

        try {
          const data: any = await new Promise((resolve, reject) =>
            Branch.init(import.meta.env.VITE_BRANCH_KEY, {}, (e, d) => {
              if (e || !d) {
                reject(e);
                return;
              }
              resolve(d);
            })
          );

          if (!!data)
            (Object.getOwnPropertyNames(data.data_parsed) ?? [])
              .filter((e) => !Array.isArray(data.data_parsed[e]))
              .map((e) => {
                params[e.replace(/^[\+~\-\$\_]?/, "")] =
                  (data.data_parsed as any)[e] + "";
              });
        } catch (error) {
          console.log(error, "no branch");
        }

        const refferer = url.searchParams.get("referral") ?? params.feature;
        if (refferer) cookies.set("referral", refferer);
        cookies.set("refparams", params);
      } catch (e) {
        console.log("cookie exception");
      }
      return true;
    },
    children: [
      { index: true, path: "", element: <Login /> },
      { path: "/login", element: <Login /> },
    ],
  },
];

export default loginRoutes;
