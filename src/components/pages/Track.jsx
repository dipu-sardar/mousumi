import { useApp } from "../../context/AppContext.jsx";

export default function Track() {
  const {
    trackNotFound,
    trackQuery,
    onTrackQuery,
    trackSearch,
    trackError,
    trackBusy,
    goAccount,
    trackFound,
    trackedPhotoStyle,
    trackedCategory,
    trackedPriority,
    trackedProduct,
    orderId,
    trackedStatus,
    payStatusStyle,
    payStatusLabel,
    printReceipt,
    trackReset,
    keyFacts,
    trackStages,
    measureProfileName,
    orderMeasureRows,
    customerRows,
    payRows,
    dueLabel,
  } = useApp();

  return (
    <div style={{ padding: "48px 56px 90px", animation: "msRise 0.55s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2.6px", color: "#D32F4D" }}>LIVE ORDER TRACKING</div>

      {trackNotFound && (
        <div style={{ maxWidth: "620px", animation: "msFadeUp .45s cubic-bezier(0.22,1,0.36,1) both" }}>
          <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: "56px", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.02, margin: "14px 0 12px" }}>
            TRACK YOUR
            <br />
            ORDER
          </h2>
          <p style={{ fontSize: "14.5px", lineHeight: 1.7, color: "#6A6A64", margin: "0 0 28px" }}>Enter the order ID from your confirmation message — it looks like MSM-2026-0148.</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              value={trackQuery}
              onChange={onTrackQuery}
              placeholder="MSM-2026-0148"
              className="fc-border-dark"
              style={{ flex: 1, minWidth: "240px", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E8E8E2", background: "#FFFFFF", fontFamily: "Outfit,sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", outline: "none", color: "#181818" }}
            />
            <div
              onClick={trackBusy ? undefined : trackSearch}
              className="hv-bg-accent-lift-2"
              style={{ padding: "18px 32px", borderRadius: "16px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: trackBusy ? "default" : "pointer", opacity: trackBusy ? 0.6 : 1, transition: "all .25s ease" }}
            >
              {trackBusy ? "SEARCHING…" : "TRACK ORDER"}
            </div>
          </div>
          {trackError && <div style={{ marginTop: "16px", padding: "14px 18px", borderRadius: "14px", background: "#F9E5E9", color: "#A32138", fontSize: "13px", lineHeight: 1.6 }}>{trackError}</div>}
          <div onClick={goAccount} className="hv-text-accent" style={{ display: "inline-block", marginTop: "26px", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#6A6A64", cursor: "pointer", textDecoration: "underline" }}>
            FIND MY ORDER IDS IN MY ACCOUNT
          </div>
        </div>
      )}

      {trackFound && (
        <div style={{ animation: "msFadeUp .45s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "26px", flexWrap: "wrap", margin: "16px 0 26px" }}>
            <div style={{ width: "104px", height: "132px", borderRadius: "20px", overflow: "hidden", background: "#EFEFE9", flexShrink: 0 }}>
              <div role="img" aria-label="Ordered design" style={trackedPhotoStyle} />
            </div>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92" }}>{trackedCategory}</div>
                {trackedPriority && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 11px", borderRadius: "20px", background: "#F9E5E9", color: "#A32138", fontFamily: "Outfit,sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "1.2px" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" y1="22" x2="4" y2="15" />
                    </svg>
                    <span>URGENT</span>
                  </div>
                )}
              </div>
              <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: "40px", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.05, margin: "10px 0 0" }}>{trackedProduct}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "15px", fontWeight: 800, letterSpacing: "1.4px" }}>{orderId}</div>
                <div style={{ padding: "6px 13px", borderRadius: "24px", background: "#F0F0EA", fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.2px", color: "#4A4A46" }}>{trackedStatus}</div>
                <div style={payStatusStyle}>{payStatusLabel}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <div onClick={printReceipt} className="hv-fill-dark" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "13px 20px", borderRadius: "32px", border: "1px solid #E2E2DA", background: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.2px", cursor: "pointer", transition: "all .25s ease" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>PRINT RECEIPT</span>
              </div>
              <div onClick={trackReset} className="hv-border-dark" style={{ padding: "13px 20px", borderRadius: "32px", border: "1px solid #E2E2DA", background: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.2px", cursor: "pointer", transition: "all .25s ease" }}>
                TRACK ANOTHER
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1px", background: "#E8E8E2", border: "1px solid #E8E8E2", borderRadius: "20px", overflow: "hidden", marginBottom: "34px" }}>
            {keyFacts.map((k) => (
              <div key={k.k} style={{ background: "#FFFFFF", padding: "20px 22px" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "9.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92" }}>{k.k}</div>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "15px", fontWeight: 700, marginTop: "9px", lineHeight: 1.35 }}>{k.v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,340px)", gap: "34px", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "26px", padding: "30px" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92", marginBottom: "24px" }}>PROGRESS</div>
                {trackStages.map((stg, i) => (
                  <div key={i} onClick={stg.onClick} style={{ display: "flex", gap: "20px", cursor: "pointer" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={stg.dotStyle} />
                      <div style={stg.lineStyle} />
                    </div>
                    <div style={{ paddingBottom: "26px" }}>
                      <div style={stg.titleStyle}>{stg.label}</div>
                      <div style={{ fontSize: "12.5px", color: "#9A9A92", marginTop: "6px", lineHeight: 1.6 }}>{stg.note}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "26px", padding: "30px" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
                  <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92" }}>MEASUREMENTS USED</div>
                  <div style={{ fontSize: "12px", color: "#B5B5AD" }}>{measureProfileName}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "12px 26px" }}>
                  {orderMeasureRows.map((m) => (
                    <div key={m.k} style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "12.5px", paddingBottom: "10px", borderBottom: "1px solid #F2F2EC" }}>
                      <span style={{ color: "#9A9A92" }}>{m.k}</span>
                      <span style={{ fontFamily: "Outfit,sans-serif", fontWeight: 700 }}>{m.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "24px", padding: "24px" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92", marginBottom: "16px" }}>CUSTOMER &amp; DELIVERY</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                  {customerRows.map((c) => (
                    <div key={c.k} style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12.5px", paddingBottom: "10px", borderBottom: "1px solid #F2F2EC" }}>
                      <span style={{ color: "#9A9A92", whiteSpace: "nowrap" }}>{c.k}</span>
                      <span style={{ fontWeight: 600, textAlign: "right" }}>{c.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "24px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92" }}>PAYMENT</div>
                  <div style={payStatusStyle}>{payStatusLabel}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                  {payRows.map((p) => (
                    <div key={p.k} style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12.5px", paddingBottom: "10px", borderBottom: "1px solid #F2F2EC" }}>
                      <span style={{ color: "#9A9A92" }}>{p.k}</span>
                      <span style={{ fontWeight: 600 }}>{p.v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "16px" }}>
                  <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "12px", fontWeight: 800, letterSpacing: "1.2px" }}>DUE ON DELIVERY</span>
                  <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "24px", fontWeight: 800 }}>{dueLabel}</span>
                </div>
              </div>

              <div style={{ background: "#E4F0D2", borderRadius: "24px", padding: "24px" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "15px", fontWeight: 800, letterSpacing: "-0.3px" }}>3 months free service</div>
                <div style={{ fontSize: "12.5px", color: "#4A4A46", marginTop: "8px", lineHeight: 1.65 }}>Any fit issue within 3 months is fixed free. Outside Barishal Sadar, only the delivery charge applies.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
