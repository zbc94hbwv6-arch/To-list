import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/newsreader/500.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root is missing.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
