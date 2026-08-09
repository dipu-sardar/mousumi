import { BUDGETS, CATS, DESIGNS, FIELDS, HOW_STEPS, OFFERS, RATING_BARS, REVIEWS, SHOP_STATS, STAGES, tk } from "../data/catalog.js";

/**
 * Builds the view-model the whole UI reads from — one call per render.
 *
 * This is a direct, section-by-section port of the original prototype's
 * `renderVals()`: same fields, same derived values, same handlers. The one
 * mechanical difference is that every dynamic `style="…css text…"` string
 * is now a plain style object (React inline styles), and a handful of
 * `background: <color> <pos>/<size> <repeat>; background-image:url(...)`
 * shorthand pairs were split into explicit longhands (backgroundColor /
 * backgroundPosition / backgroundSize / backgroundRepeat / backgroundImage)
 * to avoid shorthand-vs-longhand ordering pitfalls in JS style objects.
 *
 * A few fields the original computed but never rendered anywhere (unused
 * leftovers such as `fabricOptions`, `relatedDesigns`, `notifications`,
 * `riderName`) were left out — dropping them changes nothing about how the
 * site looks or behaves.
 */
export function buildViewModel(state, actions) {
  const s = state;
  const { go, flash, chip, card, setState } = actions;

  const byId = (id) => DESIGNS.find((d) => d.id === id) || DESIGNS[0];

  const deco = (d) => ({
    ...d,
    priceLabel: tk(d.price),
    daysLabel: d.days + " days",
    photoStyle: {
      width: "100%",
      height: "100%",
      backgroundImage: `url(${d.img})`,
      backgroundPosition: "50% 18%",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      transition: "transform .7s cubic-bezier(0.22,1,0.36,1)",
    },
    open: () => go("design", d.id),
  });

  const design = deco(byId(s.designId));
  const identityDesign = deco(DESIGNS[0]); // the real-photo product the home hero shows off
  const budget = BUDGETS.find((b) => b.label === s.budget) || BUDGETS[0];
  const activeProfile = s.profiles.find((p) => p.id === s.profileId);
  const activeAddr = s.addresses.find((a) => a.id === s.addressId);
  const myOrderList = s.myOrders;
  const tracked = s.trackedOrder;
  const addrText = activeAddr ? activeAddr.label + " — " + activeAddr.line : "No address set";
  const da = s.draftAddr || {};

  const list = DESIGNS.filter((d) => (s.cat === "ALL" || d.category === s.cat) && d.price >= budget.min && d.price <= budget.max).map(deco);

  const q = s.query.trim().toLowerCase();
  const results = (q ? DESIGNS.filter((d) => (d.short + " " + d.category + " " + d.fabricNote).toLowerCase().indexOf(q) > -1) : DESIGNS).map(deco);

  const delivery = 0;
  const discount = s.promoOk ? 200 : 0;
  const orderLines = s.fromCart && s.cart.length ? s.cart.map((c) => ({ d: byId(c.id), fabric: c.fabric, qty: c.qty })) : [{ d: design, fabric: s.fabric, qty: 1 }];
  const linesSubtotal = orderLines.reduce((a, l) => a + l.d.price * l.qty, 0);
  const total = linesSubtotal + delivery - discount;
  const view = design.gallery[Math.min(s.viewIdx, design.gallery.length - 1)];

  const stepLabels = [
    { n: "01", label: "MEASUREMENTS" },
    { n: "02", label: "PICKUP SLOT" },
    { n: "03", label: "PAYMENT" },
  ];

  return {
    // ---------------- page flags ----------------
    isHome: s.page === "home",
    isCatalogue: s.page === "catalogue",
    isDesign: s.page === "design",
    isOrder: s.page === "order",
    isTrack: s.page === "track",
    isHow: s.page === "how",
    isOffers: s.page === "offers",
    isReviews: s.page === "reviews",
    isAccount: s.page === "account",
    isDone: s.page === "done",
    isCart: s.page === "cart",

    // ---------------- global nav ----------------
    goHome: () => go("home"),
    goCatalogue: () => go("catalogue"),
    goTrack: () => go("track"),
    goCart: () => go("cart"),
    goHow: () => go("how"),
    goOffers: () => go("offers"),
    goReviews: () => go("reviews"),
    trackThisOrder: () =>
      setState((st) => ({
        page: "track",
        trackQuery: st.lastOrder ? st.lastOrder.id : "",
        trackFound: !!st.lastOrder,
        trackedOrder: st.lastOrder,
        trackError: "",
        stage: st.lastOrder ? st.lastOrder.stage : 0,
      })),
    goAccount: () => {
      if (s.authed) go("account");
      else actions.openAuth("account");
    },
    goOrderMeasure: () => setState({ page: "order", orderStep: 1, menuOpen: false, searchOpen: false }),

    toggleMenu: () => setState((st) => ({ menuOpen: !st.menuOpen })),
    toggleSearch: () => setState((st) => ({ searchOpen: !st.searchOpen })),
    menuOpen: s.menuOpen,
    searchOpen: s.searchOpen,
    toast: s.toast,
    query: s.query,
    onQuery: (e) => setState({ query: e.target.value }),
    searchCount: results.length + " DESIGN" + (results.length === 1 ? "" : "S"),
    searchResults: results,

    cartCount: s.cart.reduce((a, c) => a + c.qty, 0),

    navLinks: [
      { label: "HOME", page: "home" },
      { label: "DESIGNS", page: "catalogue" },
      { label: "MEASURE", page: "how" },
      { label: "TRACK", page: "track" },
      { label: "OFFERS", page: "offers" },
    ].map((l) => ({
      label: l.label,
      active: s.page === l.page,
      onClick: () => go(l.page),
      style: {
        position: "relative",
        padding: "6px 0",
        cursor: "pointer",
        fontFamily: "Outfit,sans-serif",
        fontSize: "11.5px",
        fontWeight: 800,
        letterSpacing: "1.6px",
        transition: "opacity .25s ease",
        opacity: s.page === l.page ? 1 : 0.55,
      },
    })),
    menuLinks: [
      { label: "Home", p: "home" },
      { label: "Designs", p: "catalogue" },
      { label: "How it works", p: "how" },
      { label: "Cart", p: "cart" },
      { label: "Order tracking", p: "track" },
      { label: "Offers & referral", p: "offers" },
      { label: "Reviews", p: "reviews" },
      { label: "My account", p: "account" },
    ].map((m) => ({ label: m.label, onClick: () => go(m.p) })),

    // ---------------- home (brand hero — no product carousel here on purpose) ----------------
    identityDesign,
    identityPhotoStyle: {
      position: "absolute",
      inset: 0,
      borderRadius: "26px",
      backgroundImage: `url(${identityDesign.img})`,
      backgroundPosition: "50% 25%",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
    goIdentityDesign: () => go("design", identityDesign.id),
    trustPills: [{ label: "3 months free alteration" }, { label: "Doorstep pickup" }, { label: "Female staff for home visits" }, { label: "bKash · Nagad · Rocket" }],

    // ---------------- catalogue ----------------
    cat: s.cat === "ALL" ? "ALL DESIGNS" : s.cat,
    catChips: CATS.map((c) => ({ label: c, onClick: () => setState({ cat: c }), style: chip(s.cat === c) })),
    budgetChips: BUDGETS.map((b) => ({ label: b.label, onClick: () => setState({ budget: b.label }), style: chip(s.budget === b.label) })),
    catalogueCount: list.length + " DESIGNS · STITCHING FROM ৳650",
    catalogueDesigns: list.map((d) => ({ ...d, cardStyle: { position: "relative", width: "100%", height: "380px", borderRadius: "22px", overflow: "hidden", background: d.tone } })),

    // ---------------- design detail ----------------
    design,
    designImageStyle: { position: "relative", zIndex: 5, width: "min(330px, 62%)", height: "82%", alignSelf: "center", borderRadius: "26px", overflow: "hidden", boxShadow: "0 26px 60px rgba(0,0,0,0.12)", backgroundPosition: "50% 50%", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: `url(${view})` },
    designCircleStyle: { position: "absolute", width: "min(480px, 70%)", aspectRatio: "1/1", borderRadius: "50%", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 1, transition: "background-color .5s ease", backgroundColor: design.tone },
    designThumbs: design.gallery.map((src, i) => ({
      onClick: () => setState({ viewIdx: i }),
      style: { width: "66px", height: "84px", borderRadius: "14px", cursor: "pointer", transition: "all .25s ease", backgroundColor: "#EFEFE9", backgroundPosition: "50% 18%", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: `url(${src})`, border: s.viewIdx === i ? "2px solid #181818" : "2px solid transparent" },
    })),
    fabric: s.fabric,
    startOrder: () => {
      if (!s.authed) {
        actions.openAuth("order");
        return;
      }
      setState({ page: "order", orderStep: 1, fromCart: false });
    },
    addToCart: () => {
      const id = s.designId,
        fab = s.fabric;
      setState((st) => {
        const cart = st.cart.slice();
        const hit = cart.findIndex((c) => c.id === id && c.fabric === fab);
        if (hit > -1) cart[hit] = { ...cart[hit], qty: cart[hit].qty + 1 };
        else cart.push({ id, fabric: fab, qty: 1 });
        return { cart };
      });
      flash("ADDED TO CART");
    },

    // ---------------- order / checkout ----------------
    orderLines: orderLines.map((l) => ({
      ...deco(l.d),
      fabric: l.fabric,
      qty: l.qty,
      qtyLabel: l.qty > 1 ? "×" + l.qty : "",
      metaLabel: l.fabric + " · " + l.d.days + " days",
      lineTotal: tk(l.d.price * l.qty),
    })),
    linesSubtotalLabel: tk(linesSubtotal),
    orderSteps: stepLabels.map((o, i) => ({
      n: o.n,
      label: o.label,
      onClick: () => setState({ orderStep: i + 1 }),
      style: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", borderRadius: "34px", cursor: "pointer", transition: "all .25s ease", border: s.orderStep === i + 1 ? "1px solid #181818" : "1px solid #E2E2DA", background: s.orderStep === i + 1 ? "#181818" : "#FFFFFF", color: s.orderStep === i + 1 ? "#FFFFFF" : "#9A9A92" },
    })),
    stepMeasure: s.orderStep === 1,
    stepPickup: s.orderStep === 2,
    stepPay: s.orderStep === 3,

    measureMethods: [
      { key: "saved", label: "USE A SAVED PROFILE" },
      { key: "manual", label: "ENTER MEASUREMENTS MYSELF" },
      { key: "home", label: "MEASURE ME AT HOME" },
    ].map((m) => ({
      ...m,
      onClick: () => setState({ measureMethod: m.key }),
      style: chip(s.measureMethod === m.key),
    })),
    measureBySaved: s.measureMethod === "saved",
    measureManual: s.measureMethod === "manual",
    measureAtHome: s.measureMethod === "home",

    measureFields: FIELDS.map((f) => ({
      label: f.label,
      value: s.m[f.k],
      onChange: (e) => {
        const v = e.target.value;
        setState((st) => ({ m: { ...st.m, [f.k]: v } }));
      },
    })),

    pickupDays: [
      { day: "Today", date: "7 Aug" },
      { day: "Tomorrow", date: "8 Aug" },
      { day: "Saturday", date: "9 Aug" },
    ].map((d) => ({
      ...d,
      onClick: () => setState({ day: d.day }),
      style: { padding: "14px 22px", borderRadius: "18px", cursor: "pointer", textAlign: "center", transition: "all .25s ease", border: s.day === d.day ? "1.5px solid #181818" : "1.5px solid #E2E2DA", background: s.day === d.day ? "#181818" : "#FFFFFF", color: s.day === d.day ? "#FFFFFF" : "#181818" },
    })),
    pickupSlots: [
      { label: "Morning", window: "9:00 AM – 12:00 PM" },
      { label: "Afternoon", window: "12:00 PM – 4:00 PM" },
      { label: "Evening", window: "4:00 PM – 8:00 PM" },
    ].map((p) => ({ ...p, onClick: () => setState({ slot: p.label }), style: card(s.slot === p.label) })),

    addressText: addrText,
    savedAddresses: s.addresses.map((a) => ({
      id: a.id,
      label: a.label,
      line: a.line,
      contact: (a.phone || "") + (a.note ? " · " + a.note : ""),
      selected: s.addressId === a.id,
      onClick: () => {
        setState({ addressId: a.id });
        flash("DELIVERING TO " + a.label.toUpperCase());
      },
      edit: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        actions.openAddrEditor(a);
      },
      remove: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        actions.deleteAddr(a.id);
      },
      style: card(s.addressId === a.id),
    })),
    newAddress: () => actions.newAddrDraft(),
    addrEditorOpen: !!s.addrEditId,
    addrEditorTitle: s.addrEditId === "new" ? "NEW ADDRESS" : "EDIT ADDRESS",
    draftLabel: da.label || "",
    draftLine: da.line || "",
    draftPhone: da.phone || "",
    draftNote: da.note || "",
    onDraftLabel: (e) => {
      const v = e.target.value;
      setState((st) => ({ draftAddr: { ...st.draftAddr, label: v } }));
    },
    onDraftLine: (e) => {
      const v = e.target.value;
      setState((st) => ({ draftAddr: { ...st.draftAddr, line: v } }));
    },
    onDraftPhone: (e) => {
      const v = e.target.value;
      setState((st) => ({ draftAddr: { ...st.draftAddr, phone: v } }));
    },
    onDraftNote: (e) => {
      const v = e.target.value;
      setState((st) => ({ draftAddr: { ...st.draftAddr, note: v } }));
    },
    saveAddr: () => actions.saveAddr(),
    cancelAddr: () => setState({ addrEditId: "", draftAddr: null }),
    addressCount: s.addresses.length + " SAVED ADDRESS" + (s.addresses.length === 1 ? "" : "ES"),

    payMethods: [
      { label: "bKash", note: "Instant · most used" },
      { label: "Nagad", note: "Instant" },
      { label: "Rocket", note: "Instant" },
      { label: "Card", note: "Visa / Mastercard" },
    ].map((p) => ({
      ...p,
      onClick: () => setState({ pay: p.label }),
      style: { display: "flex", alignItems: "center", gap: "14px", padding: "18px", borderRadius: "18px", cursor: "pointer", transition: "all .25s ease", background: "#FFFFFF", border: s.pay === p.label ? "1.5px solid #181818" : "1.5px solid #EDEDE6" },
      dotStyle: { width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, transition: "all .25s ease", border: s.pay === p.label ? "5px solid #D32F4D" : "5px solid #E2E2DA" },
    })),
    promo: s.promo,
    onPromo: (e) => setState({ promo: e.target.value }),
    applyPromo: () => {
      const ok = s.promo.trim().toUpperCase() === "EID26";
      setState({ promoOk: ok });
      flash(ok ? "PROMO APPLIED — ৳200 OFF" : "INVALID CODE");
    },
    promoNote: s.promoOk ? "EID26 applied — ৳200 off this order." : "Try EID26 for ৳200 off orders above ৳1000.",

    deliveryLabel: "Free",
    discountLabel: discount ? "−" + tk(discount) : "৳0",
    orderTotal: tk(total),
    orderSubmitting: s.orderSubmitting,
    orderError: s.orderError,
    orderPrimaryLabel: s.orderSubmitting ? "PLACING ORDER…" : s.orderStep === 3 ? "CONFIRM & PAY " + tk(total) : "CONTINUE",
    orderPrimary: () => {
      if (s.orderStep < 3) {
        setState({ orderStep: s.orderStep + 1 });
        return;
      }
      if (s.orderSubmitting) return;
      const measureSnapshot = s.measureMethod === "manual" ? { ...s.m } : s.measureMethod === "saved" && activeProfile ? { ...activeProfile.m } : null;
      actions.placeOrder({
        measureMethod: s.measureMethod,
        measurementProfileId: s.measureMethod === "saved" && activeProfile ? activeProfile.id : null,
        measureSnapshot,
        pickupDay: s.day,
        pickupSlot: s.slot,
        addressId: s.addressId || null,
        paymentMethod: s.pay,
        promoCode: s.promoOk ? "EID26" : null,
        items: orderLines.map((l) => ({ designId: l.d.id, fabric: l.fabric, qty: l.qty, unitPrice: l.d.price, days: l.d.days })),
        subtotal: linesSubtotal,
        discount,
        total,
      });
    },

    // ---------------- cart ----------------
    cartEmpty: s.cart.length === 0,
    cartFilled: s.cart.length > 0,
    cartItems: s.cart.map((c, i) => {
      const d = byId(c.id);
      return {
        ...deco(d),
        qty: c.qty,
        meta: c.fabric + " · " + d.days + " days · saved measurements",
        lineTotal: tk(d.price * c.qty),
        inc: () =>
          setState((st) => {
            const cart = st.cart.slice();
            cart[i] = { ...cart[i], qty: cart[i].qty + 1 };
            return { cart };
          }),
        dec: () =>
          setState((st) => {
            const cart = st.cart.slice();
            if (cart[i].qty > 1) cart[i] = { ...cart[i], qty: cart[i].qty - 1 };
            return { cart };
          }),
        remove: () => setState((st) => ({ cart: st.cart.filter((x, j) => j !== i) })),
      };
    }),
    cartSubtotal: tk(s.cart.reduce((a, c) => a + byId(c.id).price * c.qty, 0)),
    cartDays: (s.cart.length ? Math.max.apply(null, s.cart.map((c) => byId(c.id).days)) : 0) + " days",
    cartCheckout: () => {
      if (!s.authed) {
        actions.openAuth("order");
        return;
      }
      setState({ page: "order", orderStep: 1, fromCart: true });
    },

    // ---------------- account / auth ----------------
    accountName: s.account.name.toUpperCase(),
    accountRows: [
      { k: "Phone", v: s.account.phone },
      { k: "WhatsApp", v: s.account.whatsapp },
      { k: "Email", v: s.account.email },
      { k: "City", v: s.account.city },
      { k: "Date of birth", v: s.account.dob },
      { k: "Preferred language", v: s.account.language },
    ].map((r) => ({ k: r.k, v: r.v && String(r.v).trim() ? r.v : "— not added yet" })),
    accountJoined: s.account.joined,
    accountInitials: s.account.name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    accountStats: [
      { n: String(myOrderList.length), t: "orders placed", big: true },
      { n: tk(myOrderList.reduce((a, o) => a + o.total, 0)), t: "stitched value", big: true },
      { n: String(s.profiles.length), t: "measurement profiles", big: true },
      { n: s.account.referral || "—", t: "referral code", big: false },
    ].map((st) => ({
      ...st,
      valueStyle: { fontFamily: "Outfit,sans-serif", fontWeight: 800, minWidth: 0, overflowWrap: "anywhere", fontSize: st.big ? "24px" : "15px", letterSpacing: st.big ? "-0.8px" : "1.8px" },
    })),
    accountEditOpen: s.accountEdit,
    openAccountEditor: () => setState((st) => ({ accountEdit: true, draftAcc: { ...st.account } })),
    cancelAccount: () => setState({ accountEdit: false, draftAcc: null }),
    saveAccount: () => actions.saveAccount(),
    accountFields: [
      { k: "name", label: "Full name" },
      { k: "phone", label: "Phone" },
      { k: "whatsapp", label: "WhatsApp" },
      { k: "email", label: "Email" },
      { k: "city", label: "City" },
      { k: "dob", label: "Date of birth" },
      { k: "gender", label: "Gender" },
      { k: "language", label: "Preferred language" },
    ].map((fd) => ({
      label: fd.label,
      value: (s.draftAcc && s.draftAcc[fd.k]) || "",
      onChange: (e) => {
        const v = e.target.value;
        setState((st) => ({ draftAcc: { ...st.draftAcc, [fd.k]: v } }));
      },
    })),
    authed: s.authed,
    guest: !s.authed,
    authOpen: s.authOpen,
    authBusy: s.authBusy,
    authStep: s.authStep,
    stepEmail: s.authStep === "email",
    stepOtp: s.authStep === "otp",
    stepName: s.authStep === "name",
    authTitle: s.authStep === "email" ? "LOG IN OR REGISTER" : s.authStep === "otp" ? "CHECK YOUR EMAIL" : "CREATE YOUR PROFILE",
    authSub:
      s.authStep === "email"
        ? "Just your email — we send a code to confirm it, no password to remember."
        : s.authStep === "otp"
          ? "We sent a code to " + s.authEmail + ". Check your inbox (and spam folder)."
          : "Tell us your name — measurements and addresses come later.",
    authEmail: s.authEmail,
    authOtp: s.authOtp,
    authName: s.authName,
    authError: s.authError,
    onAuthEmail: (e) => setState({ authEmail: e.target.value }),
    onAuthOtp: (e) => setState({ authOtp: e.target.value }),
    onAuthName: (e) => setState({ authName: e.target.value }),
    sendOtp: () => actions.sendOtp(),
    verifyOtp: () => actions.verifyOtp(),
    finishAuth: () => actions.finishAuth(),
    openLogin: () => actions.openAuth("account"),
    openRegister: () => actions.openAuth("account"),
    closeAuth: () => setState({ authOpen: false, authError: "" }),
    backToEmail: () => setState({ authStep: "email", authOtp: "", authError: "" }),
    logout: () => actions.logout(),

    profileName: activeProfile ? activeProfile.name : "No profile",
    profileCount: s.profiles.length + " SAVED PROFILE" + (s.profiles.length === 1 ? "" : "S"),
    savedProfiles: s.profiles.map((p) => ({
      id: p.id,
      name: p.name,
      updated: p.updated,
      summary: "Bust " + (p.m.bust || "–") + " · Waist " + (p.m.waist || "–") + " · Length " + (p.m.length || "–"),
      selected: s.profileId === p.id,
      onClick: () => {
        setState({ profileId: p.id, m: { ...p.m } });
        flash("USING " + p.name.toUpperCase());
      },
      edit: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        actions.openEditor(p);
      },
      duplicate: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        actions.duplicateProfile(p);
      },
      remove: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        actions.deleteProfile(p.id);
      },
      style: card(s.profileId === p.id),
    })),
    newProfile: () => actions.newProfileDraft(),
    editorOpen: !!s.editId,
    editorTitle: s.editId === "new" ? "NEW MEASUREMENT PROFILE" : "EDIT PROFILE",
    draftName: s.draftName,
    onDraftName: (e) => setState({ draftName: e.target.value }),
    draftFields: FIELDS.map((fd) => ({
      label: fd.label,
      value: (s.draftM && s.draftM[fd.k]) || "",
      onChange: (e) => {
        const v = e.target.value;
        setState((st) => ({ draftM: { ...st.draftM, [fd.k]: v } }));
      },
    })),
    saveDraft: () => actions.saveDraft(),
    cancelDraft: () => setState({ editId: "", draftM: null }),

    // ---------------- track ----------------
    // `tracked` is a real order fetched from Supabase (actions.trackOrder /
    // AppContext's trackOrder action), scoped by RLS to whichever customer
    // is logged in — see the note on that action for why a guest can't just
    // look any code up anymore.
    trackQuery: s.trackQuery,
    onTrackQuery: (e) => setState({ trackQuery: e.target.value }),
    trackFound: s.trackFound,
    trackNotFound: !s.trackFound,
    trackBusy: s.trackBusy,
    trackError: s.trackError,
    trackSearch: () => actions.trackOrder(s.trackQuery),
    trackReset: () => setState({ trackFound: false, trackQuery: "", trackError: "", trackedOrder: null }),
    orderId: s.trackQuery ? s.trackQuery.toUpperCase() : s.lastOrder ? s.lastOrder.id : "",
    trackSummary: tracked
      ? tracked.productShort + " · " + tracked.slot + " slot · " + tracked.day + " · " + tracked.addr
      : s.lastOrder
        ? s.lastOrder.productShort + " · " + s.lastOrder.slot + " slot · " + s.lastOrder.day + " · " + (s.lastOrder.addrLabel ? s.lastOrder.addrLabel + " — " + s.lastOrder.addr : "No address set")
        : orderLines[0].d.short + (orderLines.length > 1 ? " +" + (orderLines.length - 1) + " more" : "") + " · " + s.slot + " slot · " + s.day + " · " + addrText,
    trackedStatus: tracked ? tracked.status : "",
    trackedPriority: !!(tracked && tracked.priority),
    orderFacts: tracked
      ? [
          { k: "Customer", v: tracked.customer },
          { k: "Contact", v: tracked.phone },
          { k: "Delivery mode", v: tracked.mode },
          { k: "Delivery address", v: tracked.addrLabel + " — " + tracked.addr },
          { k: "Product", v: tracked.productShort },
          { k: "Order ID / SKU", v: tracked.id },
          { k: "Order date", v: tracked.date },
          { k: tracked.stage >= 4 ? "Delivered on" : "Expected delivery", v: tracked.delivery },
          { k: "Fabric", v: tracked.fabricSource },
          { k: "Assigned karigor", v: tracked.tailor },
        ]
      : [],
    trackedProduct: tracked ? tracked.productShort : "",
    trackedCategory: tracked ? tracked.productCategory : "",
    trackedPhotoStyle: tracked ? { width: "100%", height: "100%", backgroundPosition: "50% 18%", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: `url(${tracked.productImg})` } : {},
    keyFacts: tracked
      ? [
          { k: "ORDER DATE", v: tracked.date },
          { k: tracked.stage >= 4 ? "DELIVERED ON" : "EXPECTED DELIVERY", v: tracked.delivery },
          { k: "PICKUP SLOT", v: tracked.slot + " · " + tracked.day },
          { k: "ASSIGNED KARIGOR", v: tracked.tailor },
        ]
      : [],
    customerRows: tracked
      ? [
          { k: "Name", v: tracked.customer },
          { k: "Phone", v: tracked.phone },
          { k: "Delivery mode", v: tracked.mode },
          { k: "Address", v: tracked.addrLabel + " — " + tracked.addr },
          { k: "Fabric", v: tracked.fabricSource },
        ]
      : [],
    orderMeasureRows: tracked ? FIELDS.map((fd) => ({ k: fd.label, v: tracked.m[fd.k] ? tracked.m[fd.k] + '"' : "—" })) : [],
    measureProfileName: tracked ? tracked.profile : "",
    payRows: tracked
      ? [
          { k: "Total", v: tk(tracked.total) },
          { k: "Advance paid", v: tk(tracked.advance) },
          { k: "Due", v: tk(tracked.total - tracked.advance) },
          { k: "Method", v: tracked.payMethod },
        ]
      : [],
    payStatusLabel: tracked ? tracked.payStatus.toUpperCase() : "",
    payStatusStyle: {
      padding: "7px 14px",
      borderRadius: "24px",
      fontFamily: "Outfit,sans-serif",
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "1.2px",
      whiteSpace: "nowrap",
      ...(tracked
        ? tracked.payStatus === "Paid"
          ? { background: "#E4F0D2", color: "#3F6B1F" }
          : tracked.payStatus === "Partial"
            ? { background: "#FBEFD2", color: "#8A6512" }
            : { background: "#F9E5E9", color: "#A32138" }
        : {}),
    },
    dueLabel: tracked ? tk(tracked.total - tracked.advance) : "",
    printReceipt: () => {
      if (typeof window !== "undefined") window.print();
    },
    trackStages: STAGES.map((st, i) => ({
      label: st.label,
      note: st.note,
      onClick: () => setState({ stage: i }),
      dotStyle: { width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0, transition: "all .3s ease", background: i <= s.stage ? "#D32F4D" : "#E2E2DA", boxShadow: i === s.stage ? "0 0 0 6px rgba(211,47,77,0.16)" : "none" },
      lineStyle: { width: "2px", flex: 1, minHeight: i === STAGES.length - 1 ? "0px" : "46px", background: i < s.stage ? "#D32F4D" : "#EFEFE9" },
      titleStyle: { fontFamily: "Outfit,sans-serif", fontSize: "17px", fontWeight: i === s.stage ? 800 : 600, color: i <= s.stage ? "#181818" : "#B5B5AD" },
    })),

    // ---------------- how it works ----------------
    howSteps: HOW_STEPS,
    stats: SHOP_STATS,

    // ---------------- offers ----------------
    offers: OFFERS.map((o) => ({
      ...o,
      cardStyle: { borderRadius: "24px", padding: "26px", cursor: "pointer", transition: "transform .3s cubic-bezier(0.22,1,0.36,1)", background: o.tone },
      use: () => {
        setState({ promo: o.code, page: "order", orderStep: 3, promoOk: o.code === "EID26" });
        flash("CODE " + o.code + " ADDED");
      },
    })),
    copyReferral: () => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(s.account.referral || "").catch(() => {});
      }
      flash("REFERRAL CODE COPIED");
    },

    // ---------------- reviews ----------------
    ratingBars: RATING_BARS.map((r) => ({ ...r, fillStyle: { height: "100%", borderRadius: "6px", background: "#181818", width: r.w + "%" } })),
    reviews: REVIEWS,

    // ---------------- account: orders ----------------
    hasOrders: myOrderList.length > 0,
    noOrders: myOrderList.length === 0,
    referralCode: s.account.referral || "—",
    referralNote: myOrderList.length ? "3 friends joined · ৳600 earned" : "Share your code to start earning.",
    myOrders: myOrderList.map((o) => ({
      id: o.id,
      date: o.date,
      status: o.status,
      short: o.productShort,
      priceLabel: tk(o.total),
      photoStyle: { width: "100%", height: "100%", backgroundPosition: "50% 18%", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: `url(${o.productImg})` },
      track: () => setState({ page: "track", trackQuery: o.id, trackFound: true, trackError: "", stage: o.stage, trackedOrder: o }),
      statusStyle: { padding: "8px 14px", borderRadius: "24px", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.2px", whiteSpace: "nowrap", ...(o.live ? { background: "#E4F0D2", color: "#3F6B1F" } : { background: "#F0F0EA", color: "#8A8A82" }) },
    })),
  };
}
