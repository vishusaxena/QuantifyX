import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import DataProvider from "./context/dataContext.jsx";
import "../src/i18n/index.js";
createRoot(document.getElementById("root")).render(
  <DataProvider>
    <App />
  </DataProvider>
);
