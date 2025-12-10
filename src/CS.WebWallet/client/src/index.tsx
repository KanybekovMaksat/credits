import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./i18n";
import publicRoutes from "./routes/public";
import loginRoutes from "./routes/login";
import protectedRoutes from "./routes/protected";
import "./app.scss";
import "./app2.scss";

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

const router = createBrowserRouter([
  ...loginRoutes,
  ...publicRoutes,
  ...protectedRoutes,
]);

root.render(<RouterProvider router={router} />);
