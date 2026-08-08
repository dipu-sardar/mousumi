import { useApp } from "../../context/AppContext.jsx";

export default function ProfileEditModal() {
  const { editorOpen, cancelDraft, editorTitle, draftName, onDraftName, draftFields, saveDraft } = useApp();
  if (!editorOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 75, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: "rgba(24,24,24,0.38)", backdropFilter: "blur(4px)", animation: "msFadeIn 0.25s ease both" }}>
      <div onClick={cancelDraft} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "relative", width: "min(680px, 100%)", maxHeight: "100%", overflowY: "auto", background: "#F9F9F7", borderRadius: "26px", padding: "34px", boxShadow: "0 30px 80px rgba(0,0,0,0.24)", animation: "msRise 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "22px" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", color: "#D32F4D" }}>{editorTitle}</div>
          <div onClick={cancelDraft} className="hv-text-accent" style={{ cursor: "pointer", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#9A9A92" }}>
            CLOSE ✕
          </div>
        </div>
        <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "7px" }}>Profile name</div>
        <input
          value={draftName}
          onChange={onDraftName}
          placeholder="e.g. Rumana — party dress"
          className="fc-border-dark"
          style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid #E8E8E2", background: "#FFFFFF", fontSize: "14px", fontWeight: 600, outline: "none", color: "#181818", marginBottom: "22px" }}
        />
        <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#9A9A92", marginBottom: "12px" }}>MEASUREMENTS (INCHES)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px", background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "20px", padding: "20px" }}>
          {draftFields.map((d) => (
            <div key={d.label}>
              <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "7px" }}>{d.label}</div>
              <input
                value={d.value}
                onChange={d.onChange}
                placeholder="0.0"
                className="fc-border-dark-bg-white"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E8E8E2", background: "#F9F9F7", fontSize: "14px", fontWeight: 600, outline: "none", color: "#181818" }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
          <div onClick={saveDraft} className="hv-lift-2" style={{ padding: "16px 32px", borderRadius: "40px", background: "#D32F4D", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer", transition: "transform .25s ease" }}>
            SAVE PROFILE
          </div>
          <div onClick={cancelDraft} className="hv-border-dark" style={{ padding: "16px 28px", borderRadius: "40px", border: "1px solid #DDDDD5", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer", transition: "all .25s ease" }}>
            CANCEL
          </div>
        </div>
      </div>
    </div>
  );
}
