import { useApp } from "../../context/AppContext.jsx";

export default function AuthModal() {
  const { authOpen, closeAuth, authTitle, authSub, authBusy, stepEmail, authEmail, onAuthEmail, sendOtp, stepOtp, authOtp, onAuthOtp, verifyOtp, backToEmail, stepName, authName, onAuthName, finishAuth, authError } = useApp();
  if (!authOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 82, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: "rgba(24,24,24,0.42)", backdropFilter: "blur(5px)", animation: "msFadeIn 0.25s ease both" }}>
      <div onClick={closeAuth} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "relative", width: "min(460px, 100%)", background: "#F9F9F7", borderRadius: "28px", padding: "36px", boxShadow: "0 30px 80px rgba(0,0,0,0.26)", animation: "msRise 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "8px" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", color: "#D32F4D" }}>{authTitle}</div>
          <div onClick={closeAuth} className="hv-text-accent" style={{ cursor: "pointer", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#9A9A92" }}>
            CLOSE ✕
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "14px 0 10px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="2" width="12" height="20" rx="3" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "26px", fontWeight: 800, letterSpacing: "-1px" }}>MOUSUMI</span>
        </div>
        <p style={{ fontSize: "13.5px", lineHeight: 1.7, color: "#6A6A64", margin: "0 0 22px" }}>{authSub}</p>

        {stepEmail && (
          <div>
            <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "8px" }}>Email address</div>
            <input
              value={authEmail}
              onChange={onAuthEmail}
              placeholder="you@example.com"
              type="email"
              autoFocus
              className="fc-border-dark"
              style={{ width: "100%", padding: "17px 20px", borderRadius: "16px", border: "1px solid #E8E8E2", background: "#FFFFFF", fontFamily: "Outfit,sans-serif", fontSize: "16px", fontWeight: 700, outline: "none", color: "#181818" }}
            />
            <div onClick={authBusy ? undefined : sendOtp} className="hv-lift-2" style={{ marginTop: "16px", textAlign: "center", padding: "17px 0", borderRadius: "40px", background: "#D32F4D", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: authBusy ? "default" : "pointer", opacity: authBusy ? 0.6 : 1, transition: "transform .25s ease" }}>
              {authBusy ? "SENDING…" : "SEND CODE"}
            </div>
          </div>
        )}

        {stepOtp && (
          <div>
            <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "8px" }}>Code from your email</div>
            <input
              value={authOtp}
              onChange={onAuthOtp}
              placeholder="123456"
              maxLength={6}
              autoFocus
              className="fc-border-dark"
              style={{ width: "100%", padding: "17px 20px", borderRadius: "16px", border: "1px solid #E8E8E2", background: "#FFFFFF", fontFamily: "Outfit,sans-serif", fontSize: "22px", fontWeight: 800, letterSpacing: "6px", textAlign: "center", outline: "none", color: "#181818" }}
            />
            <div onClick={authBusy ? undefined : verifyOtp} className="hv-lift-2" style={{ marginTop: "16px", textAlign: "center", padding: "17px 0", borderRadius: "40px", background: "#D32F4D", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: authBusy ? "default" : "pointer", opacity: authBusy ? 0.6 : 1, transition: "transform .25s ease" }}>
              {authBusy ? "VERIFYING…" : "VERIFY"}
            </div>
            <div onClick={backToEmail} className="hv-text-accent" style={{ marginTop: "14px", textAlign: "center", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#9A9A92", cursor: "pointer" }}>
              CHANGE EMAIL
            </div>
          </div>
        )}

        {stepName && (
          <div>
            <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "8px" }}>Your name</div>
            <input
              value={authName}
              onChange={onAuthName}
              placeholder="e.g. Rumana Akter"
              autoFocus
              className="fc-border-dark"
              style={{ width: "100%", padding: "17px 20px", borderRadius: "16px", border: "1px solid #E8E8E2", background: "#FFFFFF", fontSize: "16px", fontWeight: 600, outline: "none", color: "#181818" }}
            />
            <div onClick={authBusy ? undefined : finishAuth} className="hv-lift-2" style={{ marginTop: "16px", textAlign: "center", padding: "17px 0", borderRadius: "40px", background: "#D32F4D", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: authBusy ? "default" : "pointer", opacity: authBusy ? 0.6 : 1, transition: "transform .25s ease" }}>
              {authBusy ? "SAVING…" : "CREATE ACCOUNT"}
            </div>
          </div>
        )}

        {authError && <div style={{ marginTop: "16px", padding: "13px 16px", borderRadius: "14px", background: "#F9E5E9", color: "#A32138", fontSize: "12.5px", lineHeight: 1.6 }}>{authError}</div>}

        <div style={{ fontSize: "11.5px", color: "#B5B5AD", marginTop: "20px", lineHeight: 1.6 }}>By continuing you agree to receive order updates at this email.</div>
      </div>
    </div>
  );
}
