import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";

export default function Account() {
  const { isMobile } = useViewport();
  const {
    guest,
    openLogin,
    openRegister,
    authed,
    accountInitials,
    accountName,
    accountJoined,
    openAccountEditor,
    logout,
    accountRows,
    accountStats,
    noOrders,
    hasOrders,
    goCatalogue,
    myOrders,
    profileCount,
    profileName,
    savedProfiles,
    newProfile,
    addressCount,
    addressText,
    savedAddresses,
    newAddress,
  } = useApp();

  return (
    <div style={{ padding: isMobile ? "28px 18px 70px" : "48px 56px 90px", animation: "msRise 0.55s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2.6px", color: "#D32F4D" }}>MY ACCOUNT</div>

      {guest && (
        <div style={{ maxWidth: "520px", padding: "26px 0 0" }}>
          <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "32px" : "48px", fontWeight: 800, letterSpacing: "-1.8px", lineHeight: 1.05, margin: "0 0 14px" }}>
            LOG IN WITH
            <br />
            YOUR MOBILE
          </h2>
          <p style={{ fontSize: "14.5px", lineHeight: 1.7, color: "#6A6A64", margin: "0 0 26px" }}>No password, no email. Enter your number, confirm the 4-digit code, and your measurements and addresses stay saved for every future order.</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div onClick={openLogin} className="hv-bg-accent" style={{ padding: "16px 30px", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer" }}>
              LOG IN
            </div>
            <div onClick={openRegister} className="hv-border-dark" style={{ padding: "16px 28px", borderRadius: "40px", border: "1px solid #DDDDD5", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer" }}>
              REGISTER
            </div>
          </div>
        </div>
      )}

      {authed && (
        <>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "26px", flexWrap: "wrap", margin: "14px 0 22px" }}>
            <div style={{ width: "78px", height: "78px", borderRadius: "50%", background: "#E4F0D2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit,sans-serif", fontSize: "26px", fontWeight: 800, flexShrink: 0 }}>{accountInitials}</div>
            <div style={{ flex: 1, minWidth: "260px" }}>
              <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "32px" : "52px", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, margin: 0 }}>{accountName}</h2>
              <div style={{ fontSize: "13px", color: "#9A9A92", marginTop: "10px" }}>{accountJoined}</div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div onClick={openAccountEditor} className="hv-fill-dark" style={{ padding: "14px 24px", borderRadius: "32px", border: "1px solid #E2E2DA", background: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", cursor: "pointer", transition: "all .25s ease" }}>
                EDIT PROFILE
              </div>
              <div onClick={logout} className="hv-text-border-accent" style={{ padding: "14px 22px", borderRadius: "32px", border: "1px solid #E2E2DA", background: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#9A9A92", cursor: "pointer", transition: "all .25s ease" }}>
                LOG OUT
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "minmax(0,1.4fr) minmax(0,1fr)", gap: "22px", marginBottom: "38px" }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "24px", padding: "26px" }}>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92", marginBottom: "18px" }}>ACCOUNT DETAILS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "12px 28px" }}>
                {accountRows.map((a) => (
                  <div key={a.k} style={{ display: "flex", justifyContent: "space-between", gap: "14px", fontSize: "12.5px", paddingBottom: "10px", borderBottom: "1px solid #F2F2EC" }}>
                    <span style={{ color: "#9A9A92", whiteSpace: "nowrap" }}>{a.k}</span>
                    <span style={{ fontWeight: 600, textAlign: "right" }}>{a.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1px", background: "#E8E8E2", border: "1px solid #E8E8E2", borderRadius: "24px", overflow: "hidden" }}>
              {accountStats.map((st) => (
                <div key={st.t} style={{ background: "#FFFFFF", padding: "22px", minWidth: 0, overflow: "hidden" }}>
                  <div style={st.valueStyle}>{st.n}</div>
                  <div style={{ fontSize: "12px", color: "#9A9A92", marginTop: "7px", lineHeight: 1.5 }}>{st.t}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "minmax(0,1fr) minmax(0,340px)", gap: isMobile ? "26px" : "44px", alignItems: "start" }}>
            <div>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92", marginBottom: "14px" }}>ORDERS</div>
              {noOrders && (
                <div style={{ borderTop: "1px solid #E8E8E2", padding: "40px 0" }}>
                  <div style={{ fontSize: "14.5px", color: "#6A6A64", marginBottom: "20px" }}>No orders yet — pick a design and we will stitch it to your measure.</div>
                  <div onClick={goCatalogue} className="hv-bg-accent" style={{ display: "inline-block", padding: "15px 28px", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.6px", cursor: "pointer" }}>
                    BROWSE DESIGNS
                  </div>
                </div>
              )}
              {hasOrders && (
                <div style={{ borderTop: "1px solid #E8E8E2" }}>
                  {myOrders.map((o) => (
                    <div key={o.id} onClick={o.track} className="hv-fade-75" style={{ display: "flex", alignItems: "center", gap: "20px", padding: "20px 0", borderBottom: "1px solid #EFEFE9", cursor: "pointer", flexWrap: "wrap" }}>
                      <div style={{ width: "76px", height: "96px", borderRadius: "14px", overflow: "hidden", background: "#EFEFE9", flexShrink: 0 }}>
                        <div role="img" aria-label="Order" style={o.photoStyle} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "15px", fontWeight: 700 }}>{o.short}</div>
                        <div style={{ fontSize: "12.5px", color: "#9A9A92", marginTop: "6px" }}>
                          {o.id} · {o.date}
                        </div>
                      </div>
                      <div style={o.statusStyle}>{o.status}</div>
                      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "16px", fontWeight: 800, width: "88px", textAlign: "right" }}>{o.priceLabel}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "24px", padding: "26px" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92", marginBottom: "8px" }}>MEASUREMENT PROFILES</div>
                <div style={{ fontSize: "12px", color: "#B5B5AD", marginBottom: "16px" }}>
                  {profileCount} · in use: {profileName}
                </div>
                {savedProfiles.map((p) => (
                  <div key={p.id} onClick={p.onClick} className="hv-border-dark" style={p.style}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14px", fontWeight: 700, minWidth: 0 }}>{p.name}</div>
                      {p.selected && (
                        <div style={{ padding: "5px 10px", borderRadius: "20px", background: "#E4F0D2", color: "#3F6B1F", fontFamily: "Outfit,sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "1.2px", whiteSpace: "nowrap" }}>IN USE</div>
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9A9A92", marginTop: "8px", lineHeight: 1.6 }}>{p.summary}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
                      <div onClick={p.edit} className="hv-text-accent" style={{ fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.2px", color: "#6A6A64", cursor: "pointer" }}>
                        EDIT
                      </div>
                      <div onClick={p.duplicate} className="hv-text-accent" style={{ fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.2px", color: "#6A6A64", cursor: "pointer" }}>
                        DUPLICATE
                      </div>
                      <div onClick={p.remove} className="hv-text-accent" style={{ fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.2px", color: "#6A6A64", cursor: "pointer", marginLeft: "auto" }}>
                        DELETE
                      </div>
                    </div>
                  </div>
                ))}
                <div onClick={newProfile} className="hv-bg-accent" style={{ marginTop: "14px", textAlign: "center", padding: "13px 0", borderRadius: "32px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1.4px", cursor: "pointer", transition: "background .25s ease" }}>
                  + ADD NEW PROFILE
                </div>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "24px", padding: "26px" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92", marginBottom: "8px" }}>SAVED ADDRESSES</div>
                <div style={{ fontSize: "12px", color: "#B5B5AD", marginBottom: "16px" }}>
                  {addressCount} · default: {addressText}
                </div>
                {savedAddresses.map((a) => (
                  <div key={a.id} onClick={a.onClick} className="hv-border-dark" style={a.style}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14px", fontWeight: 700 }}>{a.label}</div>
                      {a.selected && <div style={{ padding: "5px 10px", borderRadius: "20px", background: "#E4F0D2", color: "#3F6B1F", fontFamily: "Outfit,sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "1.2px", whiteSpace: "nowrap" }}>DEFAULT</div>}
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#6A6A64", marginTop: "8px", lineHeight: 1.6 }}>{a.line}</div>
                    <div style={{ fontSize: "11.5px", color: "#B5B5AD", marginTop: "6px", lineHeight: 1.5 }}>{a.contact}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
                      <div onClick={a.edit} className="hv-text-accent" style={{ fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.2px", color: "#6A6A64", cursor: "pointer" }}>
                        EDIT
                      </div>
                      <div onClick={a.remove} className="hv-text-accent" style={{ fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.2px", color: "#6A6A64", cursor: "pointer", marginLeft: "auto" }}>
                        REMOVE
                      </div>
                    </div>
                  </div>
                ))}
                <div onClick={newAddress} className="hv-bg-accent" style={{ marginTop: "14px", textAlign: "center", padding: "13px 0", borderRadius: "32px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1.4px", cursor: "pointer", transition: "background .25s ease" }}>
                  + ADD NEW ADDRESS
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
