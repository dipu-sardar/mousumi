import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";

export default function OrderFlow() {
  const { isMobile } = useViewport();
  const {
    orderSteps,
    stepMeasure,
    stepPickup,
    stepPay,
    measureMethods,
    measureBySaved,
    measureAtHome,
    savedProfiles,
    newProfile,
    goHow,
    measureFields,
    pickupDays,
    pickupSlots,
    savedAddresses,
    newAddress,
    payMethods,
    promo,
    onPromo,
    applyPromo,
    promoNote,
    orderLines,
    linesSubtotalLabel,
    deliveryLabel,
    discountLabel,
    orderTotal,
    orderPrimary,
    orderPrimaryLabel,
    orderSubmitting,
    orderError,
  } = useApp();

  return (
    <div style={{ padding: isMobile ? "26px 18px 70px" : "44px 56px 90px", animation: "msRise 0.55s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "34px" }}>
        {orderSteps.map((o) => (
          <div key={o.n} onClick={o.onClick} style={o.style}>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1.2px" }}>{o.n}</span>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1.2px" }}>{o.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "minmax(0,1fr) minmax(0,340px)", gap: isMobile ? "34px" : "48px", alignItems: "start" }}>
        <div>
          {stepMeasure && (
            <div style={{ animation: "msFadeUp .45s cubic-bezier(0.22,1,0.36,1) both" }}>
              <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "28px" : "38px", fontWeight: 800, letterSpacing: "-1.4px", margin: "0 0 8px" }}>MEASUREMENTS</h2>
              <p style={{ fontSize: "14px", color: "#6A6A64", margin: "0 0 22px", maxWidth: "520px", lineHeight: 1.65 }}>Pick a saved profile, take fresh measurements with the guide, or let our staff measure you at home.</p>

              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92", marginBottom: "12px" }}>HOW WOULD YOU LIKE TO GIVE YOUR MEASUREMENTS?</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
                {measureMethods.map((m) => (
                  <div key={m.key} onClick={m.onClick} style={m.style}>
                    {m.label}
                  </div>
                ))}
              </div>

              {measureAtHome ? (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "22px", padding: "26px", maxWidth: "620px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#F3E6F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A3B63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>Our staff will measure you at home</div>
                    <div style={{ fontSize: "13px", color: "#6A6A64", lineHeight: 1.7 }}>
                      A female staff member will take your measurements in person when she visits for fabric pickup — no need to fill anything in now. Just confirm your pickup slot and address on the next step.
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {measureBySaved && (
                    <>
                      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92", marginBottom: "12px" }}>SAVED PROFILES</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "14px", marginBottom: "32px" }}>
                        {savedProfiles.map((p) => (
                          <div key={p.id} onClick={p.onClick} style={p.style}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14px", fontWeight: 700 }}>{p.name}</div>
                              {p.selected && (
                                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#181818", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div style={{ fontSize: "12px", color: "#9A9A92", marginTop: "8px", lineHeight: 1.6 }}>{p.summary}</div>
                            <div style={{ fontSize: "11px", color: "#B5B5AD", marginTop: "8px" }}>{p.updated}</div>
                          </div>
                        ))}
                        <div onClick={newProfile} className="hv-border-dark-bg-tint" style={{ border: "1px dashed #CFCFC6", borderRadius: "18px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px", cursor: "pointer", transition: "all .25s ease" }}>
                          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14px", fontWeight: 700 }}>+ New profile</div>
                          <div style={{ fontSize: "12px", color: "#9A9A92" }}>Take fresh measurements</div>
                        </div>
                      </div>
                    </>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "14px" }}>
                    <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92" }}>MEASUREMENT SHEET (INCHES)</div>
                    <div onClick={goHow} className="hv-fade-70" style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.2px", color: "#D32F4D", cursor: "pointer" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>WATCH VIDEO GUIDE</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px", background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "22px", padding: "22px" }}>
                    {measureFields.map((m) => (
                      <div key={m.label}>
                        <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "7px" }}>{m.label}</div>
                        <input
                          value={m.value}
                          onChange={m.onChange}
                          placeholder="0.0"
                          className="fc-border-dark-bg-white"
                          style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E8E8E2", background: "#F9F9F7", fontSize: "14px", fontWeight: 600, outline: "none", color: "#181818" }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {stepPickup && (
            <div style={{ animation: "msFadeUp .45s cubic-bezier(0.22,1,0.36,1) both" }}>
              <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "28px" : "38px", fontWeight: 800, letterSpacing: "-1.4px", margin: "0 0 8px" }}>PICKUP SLOT</h2>
              <p style={{ fontSize: "14px", color: "#6A6A64", margin: "0 0 16px", maxWidth: "520px", lineHeight: 1.65 }}>Choose when our rider should collect your fabric. Delivery of the finished dress follows the same slot.</p>

              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 18px", borderRadius: "30px", background: "#F3E6F0", color: "#7A3B63", fontSize: "12.5px", fontWeight: 600, margin: "0 0 26px", maxWidth: "520px", textAlign: "left" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Measurements and fabric pickup at your home are handled by a female staff member.</span>
              </div>

              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92", marginBottom: "12px" }}>DAY</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
                {pickupDays.map((d) => (
                  <div key={d.day} onClick={d.onClick} style={d.style}>
                    <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 800 }}>{d.day}</div>
                    <div style={{ fontSize: "11.5px", opacity: 0.7, marginTop: "4px" }}>{d.date}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92", marginBottom: "12px" }}>TIME SLOT</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "14px", marginBottom: "28px" }}>
                {pickupSlots.map((sl) => (
                  <div key={sl.label} onClick={sl.onClick} style={sl.style}>
                    <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14px", fontWeight: 700 }}>{sl.label}</div>
                    <div style={{ fontSize: "12px", color: "#9A9A92", marginTop: "6px" }}>{sl.window}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92", marginBottom: "12px" }}>PICKUP &amp; DELIVERY ADDRESS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px", maxWidth: "760px" }}>
                {savedAddresses.map((a) => (
                  <div key={a.id} onClick={a.onClick} className="hv-border-dark" style={a.style}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14px", fontWeight: 700 }}>{a.label}</div>
                      {a.selected && (
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#181818", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#6A6A64", marginTop: "8px", lineHeight: 1.6 }}>{a.line}</div>
                    <div style={{ fontSize: "11.5px", color: "#B5B5AD", marginTop: "6px", lineHeight: 1.5 }}>{a.contact}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
                      <div onClick={a.edit} className="hv-text-accent" style={{ fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.2px", color: "#6A6A64", cursor: "pointer" }}>
                        EDIT
                      </div>
                      <div onClick={a.remove} className="hv-text-accent" style={{ fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.2px", color: "#6A6A64", cursor: "pointer" }}>
                        REMOVE
                      </div>
                    </div>
                  </div>
                ))}
                <div onClick={newAddress} className="hv-border-dark-bg-tint" style={{ border: "1px dashed #CFCFC6", borderRadius: "18px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px", cursor: "pointer", transition: "all .25s ease" }}>
                  <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14px", fontWeight: 700 }}>+ New address</div>
                  <div style={{ fontSize: "12px", color: "#9A9A92" }}>Home, office or a relative's place</div>
                </div>
              </div>
            </div>
          )}

          {stepPay && (
            <div style={{ animation: "msFadeUp .45s cubic-bezier(0.22,1,0.36,1) both" }}>
              <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "28px" : "38px", fontWeight: 800, letterSpacing: "-1.4px", margin: "0 0 8px" }}>PAYMENT</h2>
              <p style={{ fontSize: "14px", color: "#6A6A64", margin: "0 0 26px", maxWidth: "520px", lineHeight: 1.65 }}>Pay a 30% advance now and the rest on delivery, or settle the full amount today.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px", marginBottom: "26px" }}>
                {payMethods.map((p) => (
                  <div key={p.label} onClick={p.onClick} style={p.style}>
                    <div style={p.dotStyle} />
                    <div>
                      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14px", fontWeight: 700 }}>{p.label}</div>
                      <div style={{ fontSize: "11.5px", color: "#9A9A92", marginTop: "4px" }}>{p.note}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92", marginBottom: "12px" }}>PROMO CODE</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", maxWidth: "520px" }}>
                <input
                  value={promo}
                  onChange={onPromo}
                  placeholder="EID26"
                  className="fc-border-dark"
                  style={{ flex: 1, minWidth: "200px", padding: "15px 16px", borderRadius: "14px", border: "1px solid #E8E8E2", background: "#FFFFFF", fontSize: "14px", letterSpacing: "1.4px", textTransform: "uppercase", outline: "none", color: "#181818" }}
                />
                <div onClick={applyPromo} className="hv-bg-accent" style={{ padding: "15px 26px", borderRadius: "14px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1.4px", cursor: "pointer", transition: "background .25s ease" }}>
                  APPLY
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "#9A9A92", marginTop: "12px" }}>{promoNote}</div>
            </div>
          )}
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "24px", padding: "26px", boxShadow: "0 16px 40px rgba(0,0,0,0.04)", position: isMobile ? "static" : "sticky", top: "20px" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92", marginBottom: "18px" }}>ORDER SUMMARY</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "18px" }}>
            {orderLines.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{ width: "56px", height: "70px", borderRadius: "12px", overflow: "hidden", background: "#EFEFE9", flexShrink: 0 }}>
                  <div role="img" aria-label="Ordered design" style={l.photoStyle} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "13.5px", fontWeight: 700, lineHeight: 1.3 }}>
                    {l.short} {l.qtyLabel}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#9A9A92", marginTop: "5px" }}>{l.metaLabel}</div>
                </div>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "13.5px", fontWeight: 800, whiteSpace: "nowrap" }}>{l.lineTotal}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", marginBottom: "11px", paddingTop: "14px", borderTop: "1px solid #EFEFE9" }}>
            <span style={{ color: "#6A6A64" }}>Stitching subtotal</span>
            <span style={{ fontWeight: 600 }}>{linesSubtotalLabel}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", marginBottom: "11px" }}>
            <span style={{ color: "#6A6A64" }}>Pickup &amp; delivery</span>
            <span style={{ fontWeight: 600 }}>{deliveryLabel}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", paddingBottom: "16px", borderBottom: "1px solid #EFEFE9" }}>
            <span style={{ color: "#6A6A64" }}>Discount</span>
            <span style={{ fontWeight: 600, color: "#D32F4D" }}>{discountLabel}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "16px 0 20px" }}>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "1.4px" }}>TOTAL</span>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "26px", fontWeight: 800 }}>{orderTotal}</span>
          </div>
          <div
            onClick={orderSubmitting ? undefined : orderPrimary}
            className="hv-bg-accent-lift-2"
            style={{ textAlign: "center", padding: "17px 0", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: orderSubmitting ? "default" : "pointer", opacity: orderSubmitting ? 0.6 : 1, transition: "all .25s ease" }}
          >
            {orderPrimaryLabel}
          </div>
          {orderError && (
            <div style={{ marginTop: "14px", padding: "13px 16px", borderRadius: "14px", background: "#F9E5E9", color: "#A32138", fontSize: "12.5px", lineHeight: 1.6 }}>{orderError}</div>
          )}
          <div style={{ fontSize: "11.5px", color: "#9A9A92", textAlign: "center", marginTop: "14px", lineHeight: 1.6 }}>
            Free alterations for 3 months.
            <br />
            Rider collects the fabric from your door.
            <br />
            Home visits are handled by female staff.
          </div>
        </div>
      </div>
    </div>
  );
}
