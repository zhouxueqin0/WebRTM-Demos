import React from "react";
import ReactDOM from "react-dom/client";
import "./utils/env-polyfill"; // Must be imported before any RTM code
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
