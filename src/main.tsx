import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Log so you can tell app errors from browser-extension errors (Zotero, SingleFile, etc.)
if (typeof window !== "undefined") {
  console.info(
    "[BioEnergy] App loaded. Console errors containing 'ZOTERO_CONFIG', 'MAX_BACKOFF', 'Schema', 'TranslateWeb', 'SingleFile', 'ZoteroFrame', 'MessagingGeneric' are from browser extensions, not this app."
  );
}

createRoot(document.getElementById("root")!).render(<App />);
