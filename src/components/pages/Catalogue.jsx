import { useApp } from "../../context/AppContext.jsx";

export default function Catalogue() {
  const { cat, catChips, budgetChips, catalogueCount, catalogueDesigns } = useApp();

  return (
    <div style={{ padding: "48px 56px 90px", animation: "msRise 0.55s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "36px", flexWrap: "wrap", borderBottom: "1px solid #E8E8E2", paddingBottom: "28px" }}>
        <div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2.6px", color: "#D32F4D" }}>DESIGN CATALOGUE</div>
          <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: "58px", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, margin: "14px 0 0", textTransform: "uppercase" }}>{cat}</h2>
        </div>
        <div style={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
          {catChips.map((c) => (
            <div key={c.label} onClick={c.onClick} style={c.style}>
              {c.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", margin: "26px 0 8px" }}>
        <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92" }}>BUDGET</div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {budgetChips.map((b) => (
            <div key={b.label} onClick={b.onClick} style={b.style}>
              {b.label}
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: "12px", letterSpacing: "1px", color: "#9A9A92", margin: "16px 0 26px" }}>{catalogueCount}</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
        {catalogueDesigns.map((d) => (
          <div key={d.id} onClick={d.open} style={{ cursor: "pointer" }}>
            <div style={d.cardStyle}>
              <div role="img" aria-label="Design" className="hv-scale-106" style={d.photoStyle} />
              <div style={{ position: "absolute", top: "14px", left: "14px", padding: "6px 12px", borderRadius: "20px", background: "rgba(255,255,255,0.94)", fontFamily: "Outfit,sans-serif", fontSize: "9.5px", fontWeight: 800, letterSpacing: "1.4px" }}>{d.category}</div>
              <div style={{ position: "absolute", bottom: "14px", right: "14px", padding: "6px 12px", borderRadius: "20px", background: "rgba(24,24,24,0.85)", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "9.5px", fontWeight: 800, letterSpacing: "1.2px" }}>{d.daysLabel}</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "14px", marginTop: "15px" }}>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14.5px", fontWeight: 700, lineHeight: 1.35 }}>{d.short}</div>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14.5px", fontWeight: 800, whiteSpace: "nowrap" }}>{d.priceLabel}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#9A9A92", marginTop: "5px" }}>{d.fabricNote}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
