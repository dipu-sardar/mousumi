import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminOrders, computeDashboardStats } from "../lib/staffApi.js";
import { useViewport } from "../hooks/useViewport.js";
import { tk } from "../data/catalog.js";

const Tile = ({ label, value, sub, accent, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: accent ? "#FBEFD2" : "#FFFFFF",
      border: accent ? "1px solid #F0DDA8" : "1px solid #EDEDE6",
      borderRadius: "20px",
      padding: "22px",
      cursor: onClick ? "pointer" : "default",
      transition: "transform .15s ease, box-shadow .15s ease",
    }}
    onMouseEnter={onClick ? (e) => (e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)") : undefined}
    onMouseLeave={onClick ? (e) => (e.currentTarget.style.boxShadow = "none") : undefined}
  >
    <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: accent ? "#8A6512" : "#9A9A92", marginBottom: "10px" }}>{label}</div>
    <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "30px", fontWeight: 800, letterSpacing: "-1px", color: accent ? "#5A4308" : "#181818" }}>{value}</div>
    {sub && <div style={{ fontSize: "12px", color: accent ? "#8A6512" : "#9A9A92", marginTop: "6px" }}>{sub}</div>}
  </div>
);

export default function Dashboard() {
  const { isMobile } = useViewport();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const orders = await fetchAdminOrders();
        setStats(computeDashboardStats(orders));
      } catch (err) {
        setError((err && err.message) || "লোড করা যায়নি।");
      }
    })();
  }, []);

  if (error) return <div style={{ padding: "24px", borderRadius: "16px", background: "#F9E5E9", color: "#A32138", fontSize: "13px" }}>{error}</div>;
  if (!stats) return <div style={{ color: "#9A9A92", fontSize: "13px" }}>লোড হচ্ছে…</div>;

  const maxStage = Math.max(1, ...stats.byStage.map((s) => s.count));
  // Every navigation here just deep-links into OrdersView's own filters
  // (stageFilter / payFilter, read from the URL once on mount) — the
  // filtering logic itself lives there, this only picks the starting view.
  const goOrders = (query) => navigate("/orders" + (query ? "?" + query : ""));

  return (
    <div>
      <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "26px" : "34px", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 22px" }}>ড্যাশবোর্ড</h1>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" }}>
        <Tile label="কনফার্মেশনের অপেক্ষায়" value={stats.pendingConfirmation} sub="ক্লিক করে দেখো" accent={stats.pendingConfirmation > 0} onClick={() => goOrders("stage=0")} />
        <Tile label="মোট অর্ডার" value={stats.totalOrders} onClick={() => goOrders()} />
        <Tile label="আজকের নতুন অর্ডার" value={stats.todayCount} />
        <Tile label="এই মাসের রেভিনিউ" value={tk(stats.monthRevenue)} sub={stats.monthOrderCount + " টা অর্ডার"} />
        <Tile label="পিকআপের অপেক্ষায়" value={stats.awaitingPickup} sub="কনফার্ম হয়েছে, রাইডার এখনো যায়নি" onClick={() => goOrders("stage=1")} />
        <Tile label="টাকা বাকি আছে" value={stats.unpaidCount} sub={"মোট বাকি " + tk(stats.unpaidTotal) + " — ক্লিক করে দেখো"} onClick={() => goOrders("pay=due")} />
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "20px", padding: "24px" }}>
        <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#9A9A92", marginBottom: "18px" }}>স্টেজ অনুযায়ী অর্ডার (ক্লিক করে দেখো)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {stats.byStage.map((s, i) => (
            <div key={s.label} onClick={() => goOrders("stage=" + i)} style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
              <div style={{ width: isMobile ? "90px" : "130px", fontSize: "12.5px", color: "#6A6A64", flexShrink: 0 }}>{s.label}</div>
              <div style={{ flex: 1, height: "10px", borderRadius: "6px", background: "#F2F2EC", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: "6px", background: "#181818", width: (s.count / maxStage) * 100 + "%", transition: "width .3s ease" }} />
              </div>
              <div style={{ width: "24px", fontSize: "12.5px", fontWeight: 700, textAlign: "right", flexShrink: 0 }}>{s.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
