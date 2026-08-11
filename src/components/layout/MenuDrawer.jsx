import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";

export default function MenuDrawer() {
  const { menuOpen, toggleMenu, menuLinks } = useApp();
  const { isMobile } = useViewport();
  if (!menuOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", animation: "msFadeIn 0.25s ease both" }}>
      <div onClick={toggleMenu} style={{ position: "absolute", inset: 0, background: "rgba(24,24,24,0.35)", backdropFilter: "blur(3px)" }} />
      <div
        style={{
          position: "relative",
          width: "400px",
          maxWidth: "86vw",
          height: "100%",
          background: "#F9F9F7",
          padding: isMobile ? "28px 24px" : "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto",
          animation: "msDrawer 0.42s cubic-bezier(0.22,1,0.36,1) both",
          boxShadow: "30px 0 60px rgba(0,0,0,0.08)",
        }}
      >
        <div>
          <div onClick={toggleMenu} className="hv-text-accent" style={{ display: "inline-flex", alignItems: "center", gap: "9px", cursor: "pointer", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92", marginBottom: isMobile ? "32px" : "44px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
            <span>CLOSE</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {menuLinks.map((m) => (
              <div key={m.label} onClick={m.onClick} className="hv-menu-link" style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "26px" : "32px", fontWeight: 800, letterSpacing: "-1px", textTransform: "uppercase", cursor: "pointer", transition: "transform .3s cubic-bezier(0.22,1,0.36,1), color .3s ease" }}>
                {m.label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: "12.5px", color: "#9A9A92", lineHeight: 1.8, marginTop: "36px" }}>
          Sadar Road, Barishal
          <br />
          hello@mousumi.com.bd
          <br />
          +880 1712-000000
        </div>
      </div>
    </div>
  );
}
