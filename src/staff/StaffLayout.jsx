import { useStaff } from "./StaffContext.jsx";
import { useViewport } from "../hooks/useViewport.js";

const ROLE_LABEL = { admin: "অ্যাডমিন", tailor: "কর্মী" };

export default function StaffLayout({ children }) {
  const { staffRow, logout, toast } = useStaff();
  const { isMobile } = useViewport();

  return (
    <div style={{ minHeight: "100dvh", background: "#F9F9F7", color: "#181818", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <header
        style={{
          height: isMobile ? "60px" : "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 16px" : "0 32px",
          borderBottom: "1px solid #E8E8E2",
          background: "#F9F9F7",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v9M12 11L5 22M12 11l7 11" />
          </svg>
          <span style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "13px" : "15px", fontWeight: 800, letterSpacing: "2.2px" }}>MOUSUMI</span>
          {!isMobile && <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.6px", color: "#D32F4D", marginLeft: "6px" }}>STAFF PANEL</span>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "16px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "12px" : "13px", fontWeight: 700, lineHeight: 1.2 }}>{staffRow.name}</div>
            <div style={{ fontSize: "10.5px", color: "#9A9A92" }}>{ROLE_LABEL[staffRow.role] || staffRow.role}</div>
          </div>
          <div onClick={logout} className="hv-text-border-accent" style={{ padding: isMobile ? "9px 14px" : "11px 18px", borderRadius: "30px", border: "1px solid #E2E2DA", background: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.2px", color: "#6A6A64", cursor: "pointer", transition: "all .25s ease" }}>
            লগ আউট
          </div>
        </div>
      </header>

      <main style={{ padding: isMobile ? "20px 16px 60px" : "36px 40px 80px" }}>{children}</main>

      {toast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: "28px",
            transform: "translateX(-50%)",
            zIndex: 80,
            maxWidth: "calc(100vw - 32px)",
            padding: "14px 24px",
            borderRadius: "40px",
            background: "#181818",
            color: "#fff",
            textAlign: "center",
            fontFamily: "Outfit,sans-serif",
            fontSize: "11.5px",
            fontWeight: 800,
            letterSpacing: "1.2px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
