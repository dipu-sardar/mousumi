import { StaffProvider, useStaff } from "./StaffContext.jsx";
import StaffLogin from "./StaffLogin.jsx";
import StaffLayout from "./StaffLayout.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import TailorQueue from "./TailorQueue.jsx";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";

function StaffScreen() {
  const { loading, staffRow, isAdmin, isTailor } = useStaff();

  if (!isSupabaseConfigured) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
        <div style={{ maxWidth: "420px", color: "#6A6A64", fontSize: "14px", lineHeight: 1.7 }}>ব্যাকএন্ড এখনো যুক্ত হয়নি — .env.local দেখুন।</div>
      </div>
    );
  }

  if (loading) {
    return <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9A9A92", fontSize: "13px" }}>লোড হচ্ছে…</div>;
  }

  if (!staffRow) return <StaffLogin />;

  return (
    <StaffLayout>
      {isAdmin && <AdminDashboard />}
      {isTailor && !isAdmin && <TailorQueue />}
      {!isAdmin && !isTailor && (
        <div style={{ color: "#9A9A92", fontSize: "13px" }}>এই রোলের জন্য এখনো কোনো ভিউ বানানো হয়নি — অ্যাডমিনের সাথে যোগাযোগ করুন।</div>
      )}
    </StaffLayout>
  );
}

export default function StaffApp() {
  return (
    <StaffProvider>
      <StaffScreen />
    </StaffProvider>
  );
}
