import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LocationsProvider } from "./context/LocationContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocationsProvider>
      <App />
    </LocationsProvider>
  </React.StrictMode>,
);
