import { useStaff } from "./StaffContext.jsx";
import { useViewport } from "../hooks/useViewport.js";

export default function StaffLogin() {
  const { authStep, authEmail, onAuthEmail, sendCode, authOtp, onAuthOtp, verifyCode, backToEmail, authBusy, authError } = useStaff();
  const { isMobile } = useViewport();

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9F9F7", padding: isMobile ? "24px" : "40px" }}>
      <div style={{ width: "min(420px, 100%)", background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "28px", padding: isMobile ? "28px 24px" : "38px", boxShadow: "0 30px 80px rgba(0,0,0,0.08)", animation: "msRise 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v9M12 11L5 22M12 11l7 11" />
          </svg>
          <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.6px" }}>MOUSUMI</span>
        </div>
        <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "2px", color: "#D32F4D", marginBottom: "22px" }}>STAFF PANEL</div>

        {authStep === "email" && (
          <div>
            <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "8px" }}>ইমেইল ঠিকানা</div>
            <input
              value={authEmail}
              onChange={onAuthEmail}
              placeholder="you@example.com"
              type="email"
              autoFocus
              className="fc-border-dark"
              style={{ width: "100%", padding: "17px 20px", borderRadius: "16px", border: "1px solid #E8E8E2", background: "#F9F9F7", fontFamily: "Outfit,sans-serif", fontSize: "16px", fontWeight: 700, outline: "none", color: "#181818" }}
            />
            <div
              onClick={authBusy ? undefined : sendCode}
              className="hv-lift-2"
              style={{ marginTop: "16px", textAlign: "center", padding: "17px 0", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: authBusy ? "default" : "pointer", opacity: authBusy ? 0.6 : 1, transition: "transform .25s ease" }}
            >
              {authBusy ? "পাঠানো হচ্ছে…" : "কোড পাঠান"}
            </div>
          </div>
        )}

        {authStep === "otp" && (
          <div>
            <div style={{ fontSize: "11.5px", letterSpacing: "0.6px", color: "#9A9A92", marginBottom: "8px" }}>{authEmail}-এ পাঠানো কোড</div>
            <input
              value={authOtp}
              onChange={onAuthOtp}
              placeholder="কোড লিখুন"
              inputMode="numeric"
              autoFocus
              className="fc-border-dark"
              style={{ width: "100%", padding: "17px 20px", borderRadius: "16px", border: "1px solid #E8E8E2", background: "#F9F9F7", fontFamily: "Outfit,sans-serif", fontSize: "22px", fontWeight: 800, letterSpacing: "4px", textAlign: "center", outline: "none", color: "#181818" }}
            />
            <div
              onClick={authBusy ? undefined : verifyCode}
              className="hv-lift-2"
              style={{ marginTop: "16px", textAlign: "center", padding: "17px 0", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: authBusy ? "default" : "pointer", opacity: authBusy ? 0.6 : 1, transition: "transform .25s ease" }}
            >
              {authBusy ? "যাচাই হচ্ছে…" : "লগইন করুন"}
            </div>
            <div onClick={backToEmail} className="hv-text-accent" style={{ marginTop: "14px", textAlign: "center", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#9A9A92", cursor: "pointer" }}>
              ইমেইল বদলান
            </div>
          </div>
        )}

        {authError && <div style={{ marginTop: "16px", padding: "13px 16px", borderRadius: "14px", background: "#F9E5E9", color: "#A32138", fontSize: "12.5px", lineHeight: 1.6 }}>{authError}</div>}
      </div>
    </div>
  );
}
