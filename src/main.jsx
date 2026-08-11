import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import "./styles/interactions.css";
import "./styles/responsive.css";
import App from "./App.jsx";
import StaffApp from "./staff/StaffApp.jsx";

/**
 * Two completely separate apps share this one build/deploy:
 *   - the shop (App.jsx — AppContext, AppShell, everything customer-facing)
 *   - the staff panel (StaffApp.jsx — its own auth, no shared state at all)
 *
 * Which one mounts is decided once, here, before either app's code runs —
 * by hostname in production (`staff.mousumi.dipusardar.com` vs
 * `mousumi.dipusardar.com`, both aliased to this same Vercel deployment),
 * or by a `/staff` path prefix for local dev, where there's only one
 * hostname (localhost) to test both apps against.
 */
const isStaffHost = typeof window !== "undefined" && (window.location.hostname.startsWith("staff.") || window.location.pathname.startsWith("/staff"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>{isStaffHost ? <StaffApp /> : <App />}</BrowserRouter>
  </StrictMode>,
);
