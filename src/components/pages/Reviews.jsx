import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";

export default function Reviews() {
  const { ratingBars, reviews } = useApp();
  const { isMobile } = useViewport();

  return (
    <div style={{ padding: isMobile ? "28px 18px 70px" : "48px 56px 90px", animation: "msRise 0.55s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2.6px", color: "#D32F4D" }}>CUSTOMER REVIEWS</div>
      <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "32px" : "56px", fontWeight: 800, letterSpacing: "-2px", margin: "14px 0 34px" }}>WHAT THEY SAY</h2>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "minmax(0,300px) minmax(0,1fr)", gap: isMobile ? "24px" : "44px", alignItems: "start" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "24px", padding: "28px" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "64px", fontWeight: 800, letterSpacing: "-3px", lineHeight: 1 }}>4.8</div>
          <div style={{ fontSize: "12.5px", color: "#9A9A92", margin: "10px 0 22px" }}>based on 412 delivered orders</div>
          {ratingBars.map((r) => (
            <div key={r.star} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 700, width: "14px" }}>{r.star}</span>
              <div style={{ flex: 1, height: "6px", borderRadius: "6px", background: "#EFEFE9", overflow: "hidden" }}>
                <div style={r.fillStyle} />
              </div>
              <span style={{ fontSize: "11.5px", color: "#9A9A92", width: "34px", textAlign: "right" }}>{r.pct}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "20px" }}>
          {reviews.map((v) => (
            <div key={v.name + v.item} className="hv-lift-5-border-dark" style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "22px", padding: "24px", transition: "transform .3s cubic-bezier(0.22,1,0.36,1), border-color .3s ease" }}>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#D4A93F" }}>{v.stars}</div>
              <p style={{ fontSize: "13.5px", lineHeight: 1.7, color: "#4A4A46", margin: "14px 0 18px", textWrap: "pretty" }}>{v.text}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", borderTop: "1px solid #EFEFE9", paddingTop: "14px" }}>
                <div>
                  <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 700 }}>{v.name}</div>
                  <div style={{ fontSize: "11.5px", color: "#9A9A92", marginTop: "3px" }}>{v.item}</div>
                </div>
                <div style={{ fontSize: "11.5px", color: "#B5B5AD" }}>{v.when}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
