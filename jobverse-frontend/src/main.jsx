import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "./context/NotificationContext";

const googleClientId = import.meta.env.VITE_GOOGLE_AUTH_KEY;

// ✅ check root safely
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// ✅ warn if missing Google key
if (!googleClientId) {
  console.warn("Google OAuth Client ID is missing");
}

createRoot(rootElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <BrowserRouter>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);

