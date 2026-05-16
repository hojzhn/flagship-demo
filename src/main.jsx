import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { StandingsProvider } from "./data/StandingsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StandingsProvider>
      <App />
    </StandingsProvider>
  </StrictMode>,
);
