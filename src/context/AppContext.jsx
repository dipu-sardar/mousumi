import { createContext, useContext, useEffect, useRef, useState } from "react";
import { DESIGNS, FIELDS } from "../data/catalog.js";
import { buildViewModel } from "./selectors.js";

const AppContext = createContext(null);

/**
 * Initial application state.
 *
 * This is a demo data set (one signed-in customer, "Rumana Akter", with a
 * couple of saved measurement profiles/addresses and order history) exactly
 * as shipped in the original prototype — there is no backend yet, so
 * everything here lives in memory for the session. See README.md for what
 * plugging in a real backend would touch.
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
  authStep: "phone",
  authPhone: "",
  authOtp: "",
  authName: "",
  authError: "",
  authMode: "login",
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
  const accountsRef = useRef({}); // phone digits -> {account, profiles, profileId, addresses, addressId}
  const toastTimer = useRef(null);
  const swapTimer = useRef(null);
  const swappingRef = useRef(false);
  const scrollRef = useRef(null);

  const snapshot = () => {
    const s = state;
    return {
      account: { ...s.account },
      profiles: s.profiles.map((p) => ({ ...p })),
      profileId: s.profileId,
      addresses: s.addresses.map((a) => ({ ...a })),
      addressId: s.addressId,
    };
  };

  const stash = () => {
    const s = state;
    if (s.account && s.account.phone) {
      accountsRef.current[s.account.phone.replace(/[^0-9]/g, "")] = snapshot();
    }
  };

  // Stash the demo account once on mount, same as componentDidMount().
  useEffect(() => {
    stash();
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

  const openAuth = (mode, next) => {
    setState({ authOpen: true, authMode: mode || "login", authStep: "phone", authPhone: "", authOtp: "", authName: "", authError: "", authNext: next || "" });
  };

  const sendOtp = () => {
    const p = (state.authPhone || "").replace(/[^0-9]/g, "");
    if (p.length < 11) {
      setState({ authError: "Enter an 11-digit mobile number, e.g. 01712000000." });
      return;
    }
    const known = p === "01712000000";
    setState({ authStep: "otp", authError: "", authMode: known ? "login" : "register" });
    flash("OTP SENT TO " + p);
  };

  const finishAuth = () => {
    const s = state;
    const phone = (s.authPhone || "").replace(/[^0-9]/g, "");
    const pretty = phone.slice(0, 5) + "-" + phone.slice(5);
    if (s.authMode === "register") {
      const name = (s.authName || "").trim();
      if (!name) {
        setState({ authError: "Please enter your name." });
        return;
      }
      stash();
      setState({
        authed: true,
        authOpen: false,
        authError: "",
        account: {
          name,
          phone: pretty,
          email: "",
          whatsapp: pretty,
          gender: "",
          dob: "",
          city: "Barishal",
          joined: "Member since " + new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
          language: "Bangla",
          referral: (name.split(" ")[0] || "MSM").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8) + "200",
        },
        profiles: [],
        profileId: "",
        addresses: [],
        addressId: "",
        page: s.authNext || "account",
      });
      flash("WELCOME, " + name.toUpperCase());
    } else {
      const rec = accountsRef.current[phone];
      if (rec) {
        setState({ authed: true, authOpen: false, authError: "", account: { ...rec.account, phone: pretty }, profiles: rec.profiles, profileId: rec.profileId, addresses: rec.addresses, addressId: rec.addressId, page: s.authNext || "account" });
      } else {
        setState((st) => ({ authed: true, authOpen: false, authError: "", account: { ...st.account, phone: pretty }, page: st.authNext || "account" }));
      }
      flash("LOGGED IN");
    }
  };

  const verifyOtp = () => {
    const s = state;
    if ((s.authOtp || "").trim() !== "1234") {
      setState({ authError: "Wrong code. For this demo the code is 1234." });
      return;
    }
    if (s.authMode === "register") {
      setState({ authStep: "name", authError: "" });
      return;
    }
    finishAuth();
  };

  const logout = () => {
    stash();
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
