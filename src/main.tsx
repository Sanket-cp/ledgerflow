import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { showConsoleLogo } from "./utils/consoleLogo";

// Show logo in console
showConsoleLogo();

createRoot(document.getElementById("root")!).render(<App />);
