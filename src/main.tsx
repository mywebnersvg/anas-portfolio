import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import favicon from "./assets/faviicon.jpeg";
import "./index.css";

const faviconLink = document.createElement("link");
faviconLink.rel = "icon";
faviconLink.type = "image/jpeg";
faviconLink.href = favicon;
document.head.appendChild(faviconLink);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
