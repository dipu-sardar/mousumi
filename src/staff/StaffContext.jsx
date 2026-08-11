import { createContext, useContext, useEffect, useRef, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";
import { sendStaffOtp, verifyStaffOtp, linkStaffAccount, fetchMyStaffRow, signOutStaff } from "../lib/staffApi.js";

const StaffContext = createContext(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Auth-only context for the staff app — deliberately much smaller than the
 * customer AppContext.jsx. Order/design data lives in local state inside
 * each view (Dashboard.jsx, OrdersView.jsx, DesignsView.jsx, TailorQueue.jsx)
 * instead of here, since only the role-appropriate ones ever render for a
 * given session and there's nothing to share between them.
 */
export function StaffProvider({ children }) {
  const [loading, setLoading] = useState(true); // true while restoring a session on first load
  const [staffRow, setStaffRow] = useState(null);
  const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
  const [authEmail, setAuthEmail] = useState("");
  const [authOtp, setAuthOtp] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const flash = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  // On mount: restore a session the same way AppContext does for
  // customers — if supabase-js already has one, look up the matching
  // `staff` row and skip straight past the login screen.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const row = await fetchMyStaffRow();
        if (!cancelled) setStaffRow(row);
      } catch {
        // no session / no linked row yet — normal on a first visit
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const sendCode = async () => {
    const email = authEmail.trim();
    if (!EMAIL_RE.test(email)) {
      setAuthError("সঠিক ইমেইল ঠিকানা দিন।");
      return;
    }
    if (!isSupabaseConfigured) {
      setAuthError("ব্যাকএন্ড এখনো যুক্ত হয়নি।");
      return;
    }
    setAuthBusy(true);
    setAuthError("");
    try {
      await sendStaffOtp(email);
      setAuthStep("otp");
    } catch (err) {
      setAuthError((err && err.message) || "কোড পাঠানো যায়নি, আবার চেষ্টা করুন।");
    } finally {
      setAuthBusy(false);
    }
  };

  const verifyCode = async () => {
    const code = authOtp.trim();
    if (!code) {
      setAuthError("ইমেইলে পাওয়া কোডটি লিখুন।");
      return;
    }
    setAuthBusy(true);
    setAuthError("");
    try {
      await verifyStaffOtp(authEmail.trim(), code);
      const row = await linkStaffAccount();
      setStaffRow(row);
      flash("স্বাগতম, " + row.name);
    } catch (err) {
      await signOutStaff();
      setAuthError(
        (err && err.message === "this email is not registered as staff"
          ? "এই ইমেইল স্টাফ হিসেবে নিবন্ধিত না। অ্যাডমিনের সাথে যোগাযোগ করুন।"
          : (err && err.message)) || "কোড সঠিক না বা মেয়াদ শেষ — আবার চেষ্টা করুন।",
      );
    } finally {
      setAuthBusy(false);
    }
  };

  const backToEmail = () => {
    setAuthStep("email");
    setAuthOtp("");
    setAuthError("");
  };

  const logout = async () => {
    await signOutStaff();
    setStaffRow(null);
    setAuthStep("email");
    setAuthEmail("");
    setAuthOtp("");
    setAuthError("");
  };

  const value = {
    loading,
    staffRow,
    isAdmin: !!staffRow && staffRow.role === "admin",
    isTailor: !!staffRow && staffRow.role === "tailor",
    authStep,
    authEmail,
    authOtp,
    authBusy,
    authError,
    toast,
    onAuthEmail: (e) => setAuthEmail(e.target.value),
    onAuthOtp: (e) => setAuthOtp(e.target.value),
    sendCode,
    verifyCode,
    backToEmail,
    logout,
    flash,
  };

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaff() must be used inside <StaffProvider>");
  return ctx;
}
