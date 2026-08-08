import { useApp } from "../../context/AppContext.jsx";

export default function SearchOverlay() {
  const { searchOpen, toggleSearch, query, onQuery, searchCount, searchResults } = useApp();
  if (!searchOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(249,249,247,0.97)", backdropFilter: "blur(8px)", padding: "64px 56px", animation: "msFadeIn 0.28s ease both", overflowY: "auto" }}>
      <div onClick={toggleSearch} className="hv-text-accent" style={{ position: "absolute", top: "28px", right: "40px", cursor: "pointer", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92" }}>
        CLOSE ✕
      </div>
      <input
        value={query}
        onChange={onQuery}
        placeholder="Search designs, categories…"
        autoFocus
        style={{ width: "100%", maxWidth: "900px", border: "none", borderBottom: "2px solid #181818", background: "transparent", fontFamily: "Outfit,sans-serif", fontSize: "44px", fontWeight: 700, letterSpacing: "-1.4px", padding: "0 0 16px", outline: "none", color: "#181818" }}
      />
      <div style={{ fontSize: "12px", letterSpacing: "1.4px", color: "#9A9A92", margin: "20px 0 28px" }}>{searchCount}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "22px", maxWidth: "1200px" }}>
        {searchResults.map((r) => (
          <div key={r.id} onClick={r.open} style={{ cursor: "pointer" }}>
            <div style={{ height: "230px", borderRadius: "18px", overflow: "hidden", background: "#EFEFE9" }}>
              <div role="img" aria-label="Result" className="hv-scale-106" style={r.photoStyle} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "10px", fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 700 }}>
              <span>{r.short}</span>
              <span>{r.priceLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
