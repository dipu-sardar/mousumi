import { useApp } from "../../context/AppContext.jsx";

export default function DesignDetail() {
  const { goCatalogue, design, startOrder, addToCart, designThumbs, designCircleStyle, designImageStyle } = useApp();

  return (
    <div style={{ height: "calc(100vh - 78px)", minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0, 420px) minmax(0, 1fr)", animation: "msRise 0.55s cubic-bezier(0.22,1,0.36,1) both" }}>
      <section style={{ padding: "28px 26px 32px 48px", display: "flex", flexDirection: "column", justifyContent: "safe center", overflowY: "auto", minHeight: 0 }}>
        <div onClick={goCatalogue} className="hv-text-accent" style={{ display: "inline-flex", alignItems: "center", gap: "9px", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#6A6A64", cursor: "pointer", marginBottom: "24px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>BACK TO CATALOGUE</span>
        </div>
        <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "2px", color: "#D32F4D", marginBottom: "10px" }}>{design.category}</div>
        <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: "40px", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-1.2px", textTransform: "uppercase", whiteSpace: "pre-line", margin: 0 }}>{design.name}</h1>
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px", margin: "16px 0 12px" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "30px", fontWeight: 700 }}>{design.priceLabel}</div>
          <div style={{ fontSize: "12.5px", color: "#6A6A64" }}>stitching only · {design.daysLabel}</div>
        </div>
        <p style={{ maxWidth: "320px", fontSize: "14px", lineHeight: 1.65, color: "#6A6A64", margin: "0 0 22px", textWrap: "pretty" }}>{design.desc}</p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", maxWidth: "100%" }}>
          <div
            onClick={startOrder}
            className="hv-lift-3-shadow-accent"
            style={{ padding: "18px 30px", borderRadius: "44px", background: "#D32F4D", color: "#fff", textAlign: "center", fontFamily: "Outfit,sans-serif", fontSize: "12px", fontWeight: 800, letterSpacing: "2px", cursor: "pointer", boxShadow: "0 12px 30px rgba(211,47,77,0.28)", transition: "transform .25s cubic-bezier(0.34,1.56,0.64,1), box-shadow .25s ease" }}
          >
            ORDER NOW
          </div>
          <div onClick={addToCart} className="hv-border-dark-lift-3" style={{ padding: "18px 28px", borderRadius: "44px", border: "1px solid #DDDDD5", textAlign: "center", fontFamily: "Outfit,sans-serif", fontSize: "12px", fontWeight: 800, letterSpacing: "2px", cursor: "pointer", transition: "all .25s ease" }}>
            ADD TO CART
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "26px" }}>
          {designThumbs.map((t, i) => (
            <div key={i} onClick={t.onClick} style={t.style} />
          ))}
        </div>
      </section>

      <section style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", minWidth: 0, minHeight: 0 }}>
        <div style={designCircleStyle} />
        <div style={{ position: "absolute", top: "17%", left: "15%", animation: "msFloat 4.4s ease-in-out infinite alternate" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D32F4D" strokeWidth="3" strokeLinecap="round">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: "19%", right: "15%", animation: "msFloat 5.4s ease-in-out infinite alternate" }}>
          <div style={{ width: "13px", height: "13px", borderRadius: "50%", border: "2.5px solid #7FA24B" }} />
        </div>
        <div role="img" aria-label="Design view" style={designImageStyle} />
      </section>
    </div>
  );
}
