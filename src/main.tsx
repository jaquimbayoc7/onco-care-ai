import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./utils/serviceWorkerRegistration";

createRoot(document.getElementById("root")!).render(<App />);

// Registrar Service Worker para funcionamiento offline
registerServiceWorker();
