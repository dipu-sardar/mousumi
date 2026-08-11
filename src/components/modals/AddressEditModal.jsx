import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";

export default function AddressEditModal() {
  const { addrEditorOpen, cancelAddr, addrEditorTitle, draftLabel, onDraftLabel, draftLine, onDraftLine, draftPhone, onDraftPhone, draftNote, onDraftNote, saveAddr } = useApp();
  const { isMobile } = useViewport();
  if (!addrEditorOpen) return null;

  const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid #E8E8E2", background: "#FFFFFF", fontSize: "14px", outline: "none", color: "#181818" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 76, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "16px" : "40px", background: "rgba(24,24,24,0.38)", backdropFilter: "blur(4px)", animation: "msFadeIn 0.25s ease both" }}>
      <div onClick={cancelAddr} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "relative", width: "min(560px, 100%)", maxHeight: "100%", overflowY: "auto", background: "#F9F9F7", borderRadius: "26px", padding: isMobile ? "24px 20px" : "34px", boxShadow: "0 30px 80px rgba(0,0,0,0.24)", animation: "msRise 0.4s cubic-bezier(0.22,1,0.36,1) both", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", color: "#D32F4D" }}>{addrEditorTitle}</div>
          <div onClick={cancelAddr} className="hv-text-accent" style={{ cursor: "pointer", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#9A9A92" }}>
            CLOSE ✕
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "7px" }}>Label</div>
          <input value={draftLabel} onChange={onDraftLabel} placeholder="Home, Office, Ammu's place" className="fc-border-dark" style={{ ...inputStyle, fontWeight: 600 }} />
        </div>
        <div>
          <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "7px" }}>Full address</div>
          <input value={draftLine} onChange={onDraftLine} placeholder="House, road, area, city" className="fc-border-dark" style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
          <div>
            <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "7px" }}>Phone</div>
            <input value={draftPhone} onChange={onDraftPhone} placeholder="01XXX-XXXXXX" className="fc-border-dark" style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "7px" }}>Note for the rider</div>
            <input value={draftNote} onChange={onDraftNote} placeholder="Floor, landmark, timing" className="fc-border-dark" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "6px", flexWrap: "wrap" }}>
          <div onClick={saveAddr} className="hv-lift-2" style={{ padding: "16px 32px", borderRadius: "40px", background: "#D32F4D", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer", transition: "transform .25s ease" }}>
            SAVE ADDRESS
          </div>
          <div onClick={cancelAddr} className="hv-border-dark" style={{ padding: "16px 28px", borderRadius: "40px", border: "1px solid #DDDDD5", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer", transition: "all .25s ease" }}>
            CANCEL
          </div>
        </div>
      </div>
    </div>
  );
}
