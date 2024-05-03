import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LocationsProvider } from "./context/LocationContext.tsx";
import { QLocationsProvider } from "./context/QLocationContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QLocationsProvider>
    <LocationsProvider>
      <App />
    </LocationsProvider>
  </QLocationsProvider>,
);
