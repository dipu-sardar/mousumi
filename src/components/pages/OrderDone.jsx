import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";
import { HEADER_HEIGHT } from "../layout/Header.jsx";

export default function OrderDone() {
  const { orderId, trackSummary, trackThisOrder, goCatalogue } = useApp();
  const { isDesktop, isMobile } = useViewport();

  return (
    <div
      style={{
        minHeight: "calc(100dvh - " + (isDesktop ? HEADER_HEIGHT.desktop : HEADER_HEIGHT.compact) + "px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "safe center",
        textAlign: "center",
        padding: isMobile ? "32px 20px" : "40px",
        overflowY: "auto",
        animation: "msRise 0.6s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <div style={{ width: "78px", height: "78px", borderRadius: "50%", background: "#E4F0D2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "26px" }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4E7A26" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      {/* Says "received", not "confirmed" — every order starts at the Pending
          stage (see catalog.js STAGES) until the shop reviews and confirms
          it, and Track's progress list right below this says so too. Saying
          "confirmed" here would contradict that a click later. */}
      <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "32px" : "50px", fontWeight: 800, letterSpacing: "-1.8px", margin: 0 }}>ORDER RECEIVED</h2>
      <p style={{ fontSize: "15px", color: "#6A6A64", margin: "16px 0 8px", maxWidth: "460px", lineHeight: 1.7 }}>Order {orderId} is placed and pending confirmation. Once we confirm it, our rider will collect your fabric in the chosen slot — you can follow every stage live.</p>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 18px", borderRadius: "30px", background: "#F3E6F0", color: "#7A3B63", fontSize: "12.5px", fontWeight: 600, margin: "6px 0 20px", maxWidth: "460px", textAlign: "left" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Measurements and fabric pickup at your home are handled by a female staff member.</span>
      </div>
      <div style={{ fontSize: "13px", color: "#9A9A92", marginBottom: "28px" }}>{trackSummary}</div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <div onClick={trackThisOrder} className="hv-bg-accent" style={{ padding: "16px 32px", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer" }}>
          TRACK ORDER
        </div>
        <div onClick={goCatalogue} className="hv-border-dark" style={{ padding: "16px 30px", borderRadius: "40px", border: "1px solid #DDDDD5", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer" }}>
          BROWSE MORE
        </div>
      </div>
    </div>
  );
}
