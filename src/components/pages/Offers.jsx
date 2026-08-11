import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";

export default function Offers() {
  const { offers, referralCode, copyReferral, referralNote } = useApp();
  const { isMobile } = useViewport();

  return (
    <div style={{ padding: isMobile ? "28px 18px 70px" : "48px 56px 90px", animation: "msRise 0.55s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2.6px", color: "#D32F4D" }}>OFFERS &amp; REFERRALS</div>
      <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "32px" : "56px", fontWeight: 800, letterSpacing: "-2px", margin: "14px 0 34px" }}>SAVE ON EVERY STITCH</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "22px", marginBottom: "44px" }}>
        {offers.map((o) => (
          <div key={o.code} onClick={o.use} className="hv-lift-5" style={o.cardStyle}>
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1.8px", opacity: 0.7 }}>{o.tag}</div>
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "40px", fontWeight: 800, letterSpacing: "-1.6px", margin: "14px 0 8px" }}>{o.value}</div>
            <div style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.85 }}>{o.desc}</div>
            <div style={{ marginTop: "22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 16px", borderRadius: "14px", background: "rgba(255,255,255,0.55)", border: "1px dashed rgba(24,24,24,0.25)" }}>
              <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "2px" }}>{o.code}</span>
              <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.2px" }}>USE CODE</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "minmax(0,1fr) minmax(0,340px)", gap: isMobile ? "26px" : "44px", alignItems: "center", background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "26px", padding: isMobile ? "24px 20px" : "34px" }}>
        <div>
          <h3 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "24px" : "32px", fontWeight: 800, letterSpacing: "-1.2px", margin: "0 0 12px" }}>REFER A FRIEND, BOTH SAVE ৳200</h3>
          <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#6A6A64", margin: 0, maxWidth: "520px" }}>Share your code. When your friend's first order is delivered, ৳200 lands in both accounts — usable on any design above ৳600.</p>
        </div>
        <div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92", marginBottom: "12px" }}>YOUR REFERRAL CODE</div>
          <div onClick={copyReferral} className="hv-bg-accent" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", padding: "18px 20px", borderRadius: "16px", background: "#181818", color: "#fff", cursor: "pointer", transition: "background .25s ease" }}>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "18px", fontWeight: 800, letterSpacing: "2.5px", minWidth: 0, overflowWrap: "anywhere" }}>{referralCode}</span>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.2px", opacity: 0.8, whiteSpace: "nowrap" }}>COPY</span>
          </div>
          <div style={{ fontSize: "12px", color: "#9A9A92", marginTop: "12px" }}>{referralNote}</div>
        </div>
      </div>
    </div>
  );
}
