import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { MemoryRouter } from "react-router-dom";
import { debug, error, info, trace, warn } from "@tauri-apps/plugin-log";

console.warn = warn;
console.debug = debug;
console.trace = trace;
console.info = info;
console.error = error;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </React.StrictMode>,
);
