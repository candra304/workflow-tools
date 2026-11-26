import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@workflow-tools/ui/theme.css";
import "./styles/app.css";
import { App } from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
