import { useApp } from "../../context/AppContext.jsx";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: "36px",
        zIndex: 80,
        maxWidth: "calc(100vw - 32px)",
        padding: "15px 26px",
        borderRadius: "40px",
        background: "#181818",
        color: "#fff",
        textAlign: "center",
        fontFamily: "Outfit,sans-serif",
        fontSize: "11.5px",
        fontWeight: 800,
        letterSpacing: "1.4px",
        boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
        animation: "msToast 2.2s ease both",
      }}
    >
      {toast}
    </div>
  );
}
