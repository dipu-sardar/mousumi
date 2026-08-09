import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FIELDS } from "../data/catalog.js";
import { buildViewModel } from "./selectors.js";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient.js";
import { mapCustomerToAccount, makeReferralCode } from "../lib/customerMapper.js";
import { listProfiles, createProfile, updateProfile, deleteProfile as apiDeleteProfile } from "../lib/profilesApi.js";
import { listAddresses, createAddress, updateAddress, deleteAddress as apiDeleteAddress } from "../lib/addressesApi.js";
import { placeOrder as apiPlaceOrder, fetchOrderByCode, fetchMyOrders } from "../lib/ordersApi.js";

const AppContext = createContext(null);

/** Every "page" the app has, mapped to a real URL — the single place that
 *  translates between the two. `design` isn't in here: it's the one page
 *  with an id in its path (`/design/:id`), handled separately below. */
const PAGE_PATH = {
  home: "/",
  catalogue: "/catalogue",
  how: "/how",
  track: "/track",
  offers: "/offers",
  reviews: "/reviews",
  account: "/account",
  cart: "/cart",
  order: "/order",
  done: "/done",
};

/** URL -> `{ page, designId }`. The inverse of PAGE_PATH (plus the
 *  `/design/:id` case) — this is what makes a direct visit or a refresh on
 *  any URL land on the right page instead of always falling back to home. */
function resolvePathToPage(pathname) {
  const designMatch = pathname.match(/^\/design\/([^/]+)\/?$/);
  if (designMatch) return { page: "design", designId: decodeURIComponent(designMatch[1]) };
  const entry = Object.entries(PAGE_PATH).find(([, path]) => path === pathname);
  return { page: entry ? entry[0] : "home", designId: null };
}

/**
 * Initial application state.
 *
 * `account`/`profiles`/`addresses`/`cart` start out as the same demo data
 * ("Rumana Akter") the original prototype shipped with — that's what a
 * guest (not logged in) sees while browsing. A guest never actually reaches
 * the profile/address management UI (Account.jsx gates it behind `authed`),
 * so these demo arrays are decorative until real login happens. Logging in
 * for real (email OTP via Supabase) replaces `account` with the signed-in
 * customer's real row, clears `profiles`/`addresses`/`myOrders` to empty,
 * and then loadCustomerData() below fills them from the real
 * measurement_profiles/addresses/orders tables — see supabase/README.md.
 */
const initialState = {
  page: "home",
  designId: "d1",
  viewIdx: 0,
  cat: "ALL",
  budget: "ALL",
  fabric: "Cotton",

  orderStep: 1,
  measureMethod: "saved", // "saved" | "manual" | "home"
  slot: "Morning",
  day: "Today",
  orderSubmitting: false,
  orderError: "",
  lastOrder: null, // the just-placed order, shaped by ordersApi.mapOrderRow

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
  customerId: null, // the real Supabase customers.id — null until logged in
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
  myOrders: [], // real orders for the signed-in customer — see loadCustomerData()
  trackQuery: "",
  trackFound: false,
  trackError: "",
  trackBusy: false,
  trackedOrder: null, // result of the last successful track-by-code lookup

  stage: 2,
  menuOpen: false,
  searchOpen: false,
  query: "",
  toast: "",

  m: { length: "40.0", shoulder: "14.5", bust: "36.0", waist: "30.0", hip: "38.0", sleeve: "22.0", armhole: "16.0", neckDepth: "7.0" },
};

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // The very first render already reflects whatever URL the browser loaded
  // (a fresh visit, a shared link, or a refresh) — resolved synchronously
  // here rather than in an effect, so there's no first-frame flash of the
  // wrong page before it corrects itself.
  const [state, setStateRaw] = useState(() => {
    const resolved = resolvePathToPage(window.location.pathname);
    return {
      ...initialState,
      page: resolved.page,
      ...(resolved.designId ? { designId: resolved.designId, viewIdx: 0 } : {}),
    };
  });

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
  const scrollRef = useRef(null);

  // Keeps `state.page`/`state.designId` in lockstep with the URL — the URL
  // is the single source of truth (via react-router's `location`), this
  // just mirrors it into state so every existing `isHome`/`isCatalogue`/…
  // flag in selectors.js keeps working unchanged. Runs for every kind of
  // navigation: a go() call below, the browser's back/forward buttons, or
  // typing/pasting a URL directly — react-router updates `location` the
  // same way in all three cases. useLayoutEffect (not useEffect) so this
  // resolves before the browser paints, avoiding a one-frame flash of the
  // previous page's content after a route change.
  useLayoutEffect(() => {
    const resolved = resolvePathToPage(location.pathname);
    setState((st) => {
      const samePage = st.page === resolved.page && (resolved.page !== "design" || st.designId === resolved.designId);
      if (samePage) return { menuOpen: false, searchOpen: false };
      return resolved.page === "design"
        ? { page: "design", designId: resolved.designId, viewIdx: 0, menuOpen: false, searchOpen: false }
        : { page: resolved.page, menuOpen: false, searchOpen: false };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /** Navigates to a named page (see PAGE_PATH) or, with a `designId`, to
   *  that design's detail page — the one place that turns a page name into
   *  a real URL. `state.page` itself updates via the effect above, once
   *  react-router's `location` reflects the new URL. */
  const go = (page, designId) => {
    navigate(designId ? `/design/${designId}` : PAGE_PATH[page] || "/");
  };

  /** Fetches this customer's measurement profiles, addresses and orders from
   *  Supabase and drops them into state — called right after every login
   *  (fresh OTP or a restored session) so `authed: true` never sits next to
   *  stale/demo profiles & addresses for long. Best-effort: a failure here
   *  just leaves the customer with an empty (not wrong) list rather than
   *  crashing the app. */
  const loadCustomerData = async (customerId) => {
    try {
      const [profiles, addresses, myOrders] = await Promise.all([listProfiles(customerId), listAddresses(customerId), fetchMyOrders()]);
      setState({
        profiles,
        profileId: profiles[0] ? profiles[0].id : "",
        addresses,
        addressId: (addresses.find((a) => a.isDefault) || addresses[0] || {}).id || "",
        myOrders,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[mousumi] failed to load customer data", err);
    }
  };

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
        setState({ authed: true, account: mapCustomerToAccount(row), customerId: row.id, profiles: [], profileId: "", addresses: [], addressId: "", myOrders: [] });
        loadCustomerData(row.id);
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
    };
  }, []);

  const flash = (msg) => {
    setState({ toast: msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState({ toast: "" }), 2200);
  };

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
    setState({
      authed: true,
      authOpen: false,
      authError: "",
      account: mapCustomerToAccount(row),
      customerId: row.id,
      profiles: [],
      profileId: "",
      addresses: [],
      addressId: "",
      myOrders: [],
    });
    go(state.authNext || "account");
    // A brand-new customer has nothing saved yet, but calling this anyway
    // keeps the loading path identical for every login — cheap for how
    // rarely signup happens.
    loadCustomerData(row.id);
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
      setState({ authed: true, authOpen: false, authError: "", account: mapCustomerToAccount(row), customerId: row.id, profiles: [], profileId: "", addresses: [], addressId: "", myOrders: [] });
      go(state.authNext || "account");
      loadCustomerData(row.id);
      flash("LOGGED IN");
    } else {
      // Real email confirmed, but no profile yet — one more step.
      setState({ authStep: "name", authError: "" });
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setState({ authed: false, customerId: null, profiles: [], profileId: "", addresses: [], addressId: "", myOrders: [], trackedOrder: null, lastOrder: null });
    go("home");
    flash("LOGGED OUT");
  };

  const saveAccount = () => {
    const d = state.draftAcc || {};
    setState((st) => ({ account: { ...st.account, ...d, name: (d.name || "").trim() || st.account.name }, accountEdit: false, draftAcc: null }));
    flash("PROFILE UPDATED");
  };

  const openAddrEditor = (a) => setState({ addrEditId: a.id, draftAddr: { ...a } });

  const newAddrDraft = () => setState({ addrEditId: "new", draftAddr: { label: "", line: "", phone: "", note: "" } });

  const saveAddr = async () => {
    const s = state;
    const d = s.draftAddr || {};
    const label = (d.label || "").trim() || "Address";
    const line = (d.line || "").trim() || "—";
    if (!s.customerId) return; // address UI is authed-only — shouldn't happen
    try {
      if (s.addrEditId === "new") {
        const a = await createAddress(s.customerId, { label, line, phone: d.phone, note: d.note }, s.addresses.length === 0);
        setState((st) => ({ addresses: st.addresses.concat([a]), addressId: a.id, addrEditId: "", draftAddr: null }));
        flash("ADDRESS SAVED");
      } else {
        const a = await updateAddress(s.addrEditId, { label, line, phone: d.phone, note: d.note });
        setState((st) => ({ addresses: st.addresses.map((x) => (x.id === a.id ? a : x)), addrEditId: "", draftAddr: null }));
        flash("ADDRESS UPDATED");
      }
    } catch (err) {
      flash("COULDN'T SAVE — " + (err.message || "please try again"));
    }
  };

  const deleteAddr = async (id) => {
    try {
      await apiDeleteAddress(id);
      setState((st) => {
        const addresses = st.addresses.filter((x) => x.id !== id);
        const addressId = st.addressId === id ? (addresses[0] ? addresses[0].id : "") : st.addressId;
        return { addresses, addressId, addrEditId: st.addrEditId === id ? "" : st.addrEditId };
      });
      flash("ADDRESS REMOVED");
    } catch (err) {
      flash("COULDN'T REMOVE — " + (err.message || "please try again"));
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

  const saveDraft = async () => {
    const s = state;
    const name = (s.draftName || "").trim() || "Untitled profile";
    if (!s.customerId) return; // profile UI is authed-only — shouldn't happen
    try {
      if (s.editId === "new") {
        const p = await createProfile(s.customerId, name, s.draftM);
        setState((st) => ({ profiles: st.profiles.concat([p]), profileId: p.id, editId: "", draftM: null }));
        flash("PROFILE SAVED");
      } else {
        const p = await updateProfile(s.editId, name, s.draftM);
        setState((st) => ({ profiles: st.profiles.map((x) => (x.id === p.id ? p : x)), editId: "", draftM: null }));
        flash("PROFILE UPDATED");
      }
    } catch (err) {
      flash("COULDN'T SAVE — " + (err.message || "please try again"));
    }
  };

  const deleteProfile = async (id) => {
    try {
      await apiDeleteProfile(id);
      setState((st) => {
        const profiles = st.profiles.filter((x) => x.id !== id);
        const profileId = st.profileId === id ? (profiles[0] ? profiles[0].id : "") : st.profileId;
        return { profiles, profileId, editId: st.editId === id ? "" : st.editId };
      });
      flash("PROFILE DELETED");
    } catch (err) {
      flash("COULDN'T DELETE — " + (err.message || "please try again"));
    }
  };

  const duplicateProfile = async (p) => {
    if (!state.customerId) return;
    try {
      const copy = await createProfile(state.customerId, p.name + " (copy)", p.m);
      setState((st) => ({ profiles: st.profiles.concat([copy]) }));
      flash("PROFILE DUPLICATED");
    } catch (err) {
      flash("COULDN'T DUPLICATE — " + (err.message || "please try again"));
    }
  };

  /** Places a real order: inserts `orders` + `order_items` in Supabase,
   *  re-fetches the fully-joined row (design/address/profile names for
   *  display), then moves to the confirmation page. `payload` is assembled
   *  by orderPrimary() in selectors.js, which already has the priced-out
   *  order lines computed for the summary panel. */
  const placeOrder = async (payload) => {
    if (!state.customerId) {
      openAuth("order");
      return;
    }
    setState({ orderSubmitting: true, orderError: "" });
    try {
      const order = await apiPlaceOrder({ customerId: state.customerId, ...payload });
      const full = await fetchOrderByCode(order.order_code);
      setState((st) => ({
        stage: 0,
        orderSubmitting: false,
        orderError: "",
        lastOrder: full,
        myOrders: full ? [full].concat(st.myOrders) : st.myOrders,
        trackQuery: order.order_code,
        trackFound: false,
        trackError: "",
        cart: st.fromCart ? [] : st.cart,
      }));
      go("done");
      flash("ORDER PLACED");
    } catch (err) {
      setState({ orderSubmitting: false, orderError: (err && err.message) || "Something went wrong — please try again." });
    }
  };

  /** Looks a real order up by its "MSM-2026-XXXX" code, scoped by RLS to
   *  whichever customer is currently logged in — order tracking now
   *  requires being signed into the account that placed it (Supabase's
   *  `orders` policy is owner-only; there's no separate "know the code"
   *  bypass), so a guest gets nudged to log in instead of a dead-end
   *  "not found". */
  const trackOrder = async (codeRaw) => {
    const code = (codeRaw || "").trim().toUpperCase();
    if (!code) {
      setState({ trackError: "Enter your order ID to continue." });
      return;
    }
    if (!state.authed) {
      setState({ trackError: "Log in to the account that placed this order to track it." });
      openAuth("track");
      return;
    }
    setState({ trackBusy: true, trackError: "" });
    try {
      const order = await fetchOrderByCode(code);
      if (order) {
        setState({ trackBusy: false, trackFound: true, trackError: "", trackQuery: code, stage: order.stage, trackedOrder: order });
        flash("ORDER FOUND");
      } else {
        setState({ trackBusy: false, trackFound: false, trackedOrder: null, trackError: "No order found for " + code + ". Check the ID from your confirmation message." });
      }
    } catch (err) {
      setState({ trackBusy: false, trackError: (err && err.message) || "Something went wrong — please try again." });
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
    deleteAddr,
    openEditor,
    newProfileDraft,
    saveDraft,
    deleteProfile,
    duplicateProfile,
    placeOrder,
    trackOrder,
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
