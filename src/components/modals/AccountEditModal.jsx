import { useApp } from "../../context/AppContext.jsx";

export default function AccountEditModal() {
  const { accountEditOpen, cancelAccount, accountFields, saveAccount } = useApp();
  if (!accountEditOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 77, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: "rgba(24,24,24,0.38)", backdropFilter: "blur(4px)", animation: "msFadeIn 0.25s ease both" }}>
      <div onClick={cancelAccount} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "relative", width: "min(640px, 100%)", maxHeight: "100%", overflowY: "auto", background: "#F9F9F7", borderRadius: "26px", padding: "34px", boxShadow: "0 30px 80px rgba(0,0,0,0.24)", animation: "msRise 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "22px" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", color: "#D32F4D" }}>EDIT ACCOUNT DETAILS</div>
          <div onClick={cancelAccount} className="hv-text-accent" style={{ cursor: "pointer", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#9A9A92" }}>
            CLOSE ✕
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "14px", background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "20px", padding: "20px" }}>
          {accountFields.map((a) => (
            <div key={a.label}>
              <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "7px" }}>{a.label}</div>
              <input
                value={a.value}
                onChange={a.onChange}
                className="fc-border-dark-bg-white"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E8E8E2", background: "#F9F9F7", fontSize: "14px", fontWeight: 600, outline: "none", color: "#181818" }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
          <div onClick={saveAccount} className="hv-lift-2" style={{ padding: "16px 32px", borderRadius: "40px", background: "#D32F4D", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer", transition: "transform .25s ease" }}>
            SAVE DETAILS
          </div>
          <div onClick={cancelAccount} className="hv-border-dark" style={{ padding: "16px 28px", borderRadius: "40px", border: "1px solid #DDDDD5", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer", transition: "all .25s ease" }}>
            CANCEL
          </div>
        </div>
      </div>
    </div>
  );
}
