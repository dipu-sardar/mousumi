import { createContext, useContext, useEffect, useRef, useState } from "react";
import { DESIGNS, FIELDS } from "../data/catalog.js";
import { buildViewModel } from "./selectors.js";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient.js";
import { mapCustomerToAccount, makeReferralCode } from "../lib/customerMapper.js";

const AppContext = createContext(null);

/**
 * Initial application state.
 *
 * `account`/`profiles`/`addresses`/`cart` start out as the same demo data
 * ("Rumana Akter") the original prototype shipped with — that's what a
 * guest (not logged in) sees while browsing. Logging in for real (email
 * OTP via Supabase, see the auth actions below) replaces `account` with
 * the signed-in customer's real row and clears `profiles`/`addresses` to
 * match what's actually saved for them (still nothing, until that CRUD is
 * wired up next — see supabase/README.md).
 */
const initialState = {
  page: "home",
  designId: "d1",
  homeIdx: 0,
  viewIdx: 0,
  cat: "ALL",
  budget: "ALL",
  fabric: "Cotton",
  prevIdx: null,

  orderStep: 1,
  measureMethod: "saved", // "saved" | "manual" | "home"
  slot: "Morning",
  day: "Today",

  profiles: [
    { id: "pr1", name: "Rumana — Kameez set", updated: "Updated 12 Jun 2026", m: { length: "40.0", shoulder: "14.5", bust: "36.0", waist: "30.0", hip: "38.0", sleeve: "22.0", armhole: "16.0", neckDepth: "7.0" } },
    { id: "pr2", name: "Office kurti fit", updated: "Updated 2 Apr 2026", m: { length: "38.0", shoulder: "14.0", bust: "35.0", waist: "29.0", hip: "37.0", sleeve: "19.0", armhole: "15.5", neckDepth: "6.5" } },
    { id: "pr3", name: "Ammu — blouse", updated: "Updated 18 Mar 2026", m: { length: "15.0", shoulder: "13.5", bust: "38.0", waist: "33.0", hip: "40.0", sleeve: "9.0", armhole: "17.0", neckDepth: "8.0" } },
  ],
  profileId: "pr1",
  editId: "",
  draftName: "",
  draftM: null,

  addresses: [
    { id: "a1", label: "Home", line: "House 24, Sadar Road, Barishal", phone: "01712-000000", note: "Ring the bell on the 2nd floor" },
    { id: "a2", label: "Office", line: "Bank Road, Nathullabad, Barishal", phone: "01812-111111", note: "Reception, 10 AM – 6 PM" },
  ],
  addressId: "a1",
  addrEditId: "",
  draftAddr: null,

  account: {
    name: "Rumana Akter",
    phone: "01712-000000",
    email: "rumana.akter@gmail.com",
    whatsapp: "01712-000000",
    gender: "Female",
    dob: "14 March 1996",
    city: "Barishal",
    joined: "Member since Jan 2026",
    language: "Bangla",
    referral: "RUMANA200",
  },
  accountEdit: false,
  draftAcc: null,

  authed: false,
  authOpen: false,
  authBusy: false,
  authStep: "email", // "email" | "otp" | "name"
  authEmail: "",
  authOtp: "",
  authName: "",
  authError: "",
  authNext: "",

  pay: "bKash",
  promo: "",
  promoOk: false,

  cart: [{ id: "d4", fabric: "Own fabric", qty: 1 }],
  fromCart: false,
  trackQuery: "",
  trackFound: false,
  trackError: "",

  stage: 2,
  menuOpen: false,
  searchOpen: false,
  query: "",
  toast: "",
  swap: false,

  m: { length: "40.0", shoulder: "14.5", bust: "36.0", waist: "30.0", hip: "38.0", sleeve: "22.0", armhole: "16.0", neckDepth: "7.0" },
};

export function AppProvider({ children }) {
  const [state, setStateRaw] = useState(initialState);

  /** Mimics React class `setState`: merges a partial object, or the result
   *  of an updater `(prevState) => partial`, into state. Every action below
   *  is a 1:1 port of the original `Component` class method of the same
   *  name, so this keeps their bodies unchanged. */
  const setState = (update) => {
    setStateRaw((prev) => {
      const patch = typeof update === "function" ? update(prev) : update;
      return { ...prev, ...patch };
    });
  };

  // Instance-level data that isn't part of the render tree — mirrors the
  // plain (non-`state`) instance fields on the original class.
  const toastTimer = useRef(null);
  const swapTimer = useRef(null);
  const swappingRef = useRef(false);
  const scrollRef = useRef(null);

  // On mount: if a Supabase session already exists (the browser was logged
  // in before this page load — supabase-js persists sessions itself), and
  // that session has a matching `customers` row, restore the logged-in
  // state automatically. This is what makes login survive a page refresh,
  // unlike the original demo's pure-in-memory session.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || cancelled) return;
      const { data: row } = await supabase.from("customers").select("*").eq("auth_user_id", session.user.id).maybeSingle();
      if (row && !cancelled) {
        setState({ authed: true, account: mapCustomerToAccount(row), profiles: [], profileId: "", addresses: [], addressId: "" });
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset scroll position on every page change, same as componentDidUpdate().
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [state.page]);

  // Clear pending timers on unmount.
  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(swapTimer.current);
    };
  }, []);

  const go = (page, designId) => {
    const next = { page, menuOpen: false, searchOpen: false };
    if (designId) {
      next.designId = designId;
      next.viewIdx = 0;
    }
    setState(next);
  };

  const flash = (msg) => {
    setState({ toast: msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState({ toast: "" }), 2200);
  };

  const goToDesignIdx = (i) => {
    if (swappingRef.current || i === state.homeIdx) return;
    swappingRef.current = true;
    setState((s) => ({ prevIdx: s.homeIdx, homeIdx: i, swap: true }));
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => {
      setState({ swap: false, prevIdx: null });
      swappingRef.current = false;
    }, 430);
  };

  const nextHome = () => goToDesignIdx((state.homeIdx + 1) % DESIGNS.length);

  const today = () => "Updated " + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const openAuth = (next) => {
    setState({ authOpen: true, authStep: "email", authEmail: "", authOtp: "", authName: "", authError: "", authNext: next || "" });
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const sendOtp = async () => {
    const email = (state.authEmail || "").trim();
    if (!EMAIL_RE.test(email)) {
      setState({ authError: "Enter a valid email address." });
      return;
    }
    if (!isSupabaseConfigured) {
      setState({ authError: "The backend isn't connected yet — ask the site owner to finish setup." });
      return;
    }
    setState({ authBusy: true, authError: "" });
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) {
      setState({ authBusy: false, authError: error.message });
      return;
    }
    setState({ authBusy: false, authStep: "otp", authError: "" });
    flash("CODE SENT TO " + email.toUpperCase());
  };

  /** Runs after a correct OTP: creates the `customers` row for a
   *  brand-new email (once its name has been collected — see verifyOtp
   *  below), then logs them in. Existing customers never reach this;
   *  verifyOtp logs them straight in once their row is found. */
  const finishAuth = async () => {
    const name = (state.authName || "").trim();
    if (!name) {
      setState({ authError: "Please enter your name." });
      return;
    }
    setState({ authBusy: true, authError: "" });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setState({ authBusy: false, authError: "Session expired — please start again." });
      return;
    }
    const { data: row, error } = await supabase
      .from("customers")
      .insert({ auth_user_id: user.id, email: user.email, name, city: "Barishal", language: "Bangla", referral_code: makeReferralCode(name) })
      .select()
      .single();
    setState({ authBusy: false });
    if (error) {
      setState({ authError: error.message });
      return;
    }
    setState((st) => ({
      authed: true,
      authOpen: false,
      authError: "",
      account: mapCustomerToAccount(row),
      profiles: [],
      profileId: "",
      addresses: [],
      addressId: "",
      page: st.authNext || "account",
    }));
    flash("WELCOME, " + name.toUpperCase());
  };

  const verifyOtp = async () => {
    const email = (state.authEmail || "").trim();
    const code = (state.authOtp || "").trim();
    if (!code) {
      setState({ authError: "Enter the code from your email." });
      return;
    }
    setState({ authBusy: true, authError: "" });
    const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) {
      setState({ authBusy: false, authError: "Wrong or expired code — please try again." });
      return;
    }
    const { data: row } = await supabase.from("customers").select("*").eq("auth_user_id", data.user.id).maybeSingle();
    setState({ authBusy: false });
    if (row) {
      setState((st) => ({ authed: true, authOpen: false, authError: "", account: mapCustomerToAccount(row), profiles: [], profileId: "", addresses: [], addressId: "", page: st.authNext || "account" }));
      flash("LOGGED IN");
    } else {
      // Real email confirmed, but no profile yet — one more step.
      setState({ authStep: "name", authError: "" });
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setState({ authed: false, page: "home" });
    flash("LOGGED OUT");
  };

  const saveAccount = () => {
    const d = state.draftAcc || {};
    setState((st) => ({ account: { ...st.account, ...d, name: (d.name || "").trim() || st.account.name }, accountEdit: false, draftAcc: null }));
    flash("PROFILE UPDATED");
  };

  const openAddrEditor = (a) => setState({ addrEditId: a.id, draftAddr: { ...a } });

  const newAddrDraft = () => setState({ addrEditId: "new", draftAddr: { label: "", line: "", phone: "", note: "" } });

  const saveAddr = () => {
    const s = state;
    const d = s.draftAddr || {};
    const label = (d.label || "").trim() || "Address";
    const line = (d.line || "").trim() || "—";
    if (s.addrEditId === "new") {
      const id = "a" + Date.now();
      setState((st) => ({ addresses: st.addresses.concat([{ id, label, line, phone: d.phone || "", note: d.note || "" }]), addressId: id, addrEditId: "", draftAddr: null }));
      flash("ADDRESS SAVED");
    } else {
      setState((st) => ({ addresses: st.addresses.map((a) => (a.id === st.addrEditId ? { ...a, label, line, phone: d.phone || "", note: d.note || "" } : a)), addrEditId: "", draftAddr: null }));
      flash("ADDRESS UPDATED");
    }
  };

  const openEditor = (p) => setState({ editId: p.id, draftName: p.name, draftM: { ...p.m } });

  const newProfileDraft = () => {
    const blank = {};
    FIELDS.forEach((f) => {
      blank[f.k] = "";
    });
    setState({ editId: "new", draftName: "", draftM: blank });
  };

  const saveDraft = () => {
    const s = state;
    const name = (s.draftName || "").trim() || "Untitled profile";
    if (s.editId === "new") {
      const id = "pr" + Date.now();
      setState((st) => ({ profiles: st.profiles.concat([{ id, name, updated: today(), m: { ...st.draftM } }]), profileId: id, editId: "", draftM: null }));
      flash("PROFILE SAVED");
    } else {
      setState((st) => ({ profiles: st.profiles.map((p) => (p.id === st.editId ? { ...p, name, updated: today(), m: { ...st.draftM } } : p)), editId: "", draftM: null }));
      flash("PROFILE UPDATED");
    }
  };

  /** Active/inactive pill button style — ported from the class's `chip()` helper. */
  const chip = (active) => ({
    padding: "10px 18px",
    borderRadius: "30px",
    fontFamily: "Outfit,sans-serif",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.3px",
    cursor: "pointer",
    transition: "all .25s ease",
    border: active ? "1px solid #181818" : "1px solid #DDDDD5",
    background: active ? "#181818" : "transparent",
    color: active ? "#FFFFFF" : "#181818",
  });

  /** Active/inactive selectable-card style — ported from the class's `card()` helper. */
  const card = (active) => ({
    borderRadius: "18px",
    padding: "18px",
    cursor: "pointer",
    transition: "all .25s ease",
    background: "#FFFFFF",
    border: active ? "1.5px solid #181818" : "1.5px solid #EDEDE6",
  });

  const actions = {
    setState,
    go,
    flash,
    goToDesignIdx,
    nextHome,
    today,
    openAuth,
    sendOtp,
    verifyOtp,
    finishAuth,
    logout,
    saveAccount,
    openAddrEditor,
    newAddrDraft,
    saveAddr,
    openEditor,
    newProfileDraft,
    saveDraft,
    chip,
    card,
  };

  const vals = buildViewModel(state, actions);

  return <AppContext.Provider value={{ state, scrollRef, ...vals }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp() must be used inside <AppProvider>");
  return ctx;
}
