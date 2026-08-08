import { useApp } from "../../context/AppContext.jsx";

export default function OrderDone() {
  const { orderId, trackSummary, trackThisOrder, goCatalogue } = useApp();

  return (
    <div style={{ height: "calc(100vh - 78px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "safe center", textAlign: "center", padding: "40px", overflowY: "auto", animation: "msRise 0.6s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div style={{ width: "78px", height: "78px", borderRadius: "50%", background: "#E4F0D2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "26px" }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4E7A26" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: "50px", fontWeight: 800, letterSpacing: "-1.8px", margin: 0 }}>ORDER CONFIRMED</h2>
      <p style={{ fontSize: "15px", color: "#6A6A64", margin: "16px 0 8px", maxWidth: "460px", lineHeight: 1.7 }}>Order {orderId} is placed. Our rider will collect your fabric in the chosen slot, and you can follow every stage live.</p>
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
