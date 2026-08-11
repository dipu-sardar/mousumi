import { useEffect, useMemo, useState } from "react";
import { fetchAdminOrders, fetchTailors, updateOrderAsAdmin, STAGES } from "../lib/staffApi.js";
import { useStaff } from "./StaffContext.jsx";
import { useViewport } from "../hooks/useViewport.js";
import { tk } from "../data/catalog.js";
import { chip } from "./styleHelpers.js";

const PAY_STATUSES = ["Unpaid", "Partial", "Paid"];
const PAY_LABEL = { Unpaid: "অপরিশোধিত", Partial: "আংশিক", Paid: "পরিশোধিত" };

export default function OrdersView() {
  const { flash } = useStaff();
  const { isMobile } = useViewport();
  const [orders, setOrders] = useState(null); // null = loading
  const [tailors, setTailors] = useState([]);
  const [error, setError] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");

  const load = async () => {
    try {
      const [o, t] = await Promise.all([fetchAdminOrders(), fetchTailors()]);
      setOrders(o);
      setTailors(t);
    } catch (err) {
      setError((err && err.message) || "লোড করা যায়নি।");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const patch = async (orderId, fields, optimistic) => {
    setOrders((list) => list.map((o) => (o.orderId === orderId ? { ...o, ...optimistic } : o)));
    try {
      await updateOrderAsAdmin(orderId, fields);
    } catch (err) {
      flash("সেভ করা যায়নি — " + ((err && err.message) || "আবার চেষ্টা করুন"));
      load(); // roll back to the real server state
    }
  };

  const filtered = useMemo(() => {
    if (!orders) return [];
    if (stageFilter === "ALL") return orders;
    const i = STAGES.findIndex((s) => s.label === stageFilter);
    return orders.filter((o) => o.stage === i);
  }, [orders, stageFilter]);

  if (error) return <div style={{ padding: "24px", borderRadius: "16px", background: "#F9E5E9", color: "#A32138", fontSize: "13px" }}>{error}</div>;
  if (orders === null) return <div style={{ color: "#9A9A92", fontSize: "13px" }}>লোড হচ্ছে…</div>;

  return (
    <div>
      <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "26px" : "34px", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}>সব অর্ডার</h1>
      <div style={{ fontSize: "12.5px", color: "#9A9A92", marginBottom: "18px" }}>{orders.length} টা অর্ডার</div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        <div onClick={() => setStageFilter("ALL")} style={chip(stageFilter === "ALL")}>
          সব
        </div>
        {STAGES.map((s) => (
          <div key={s.label} onClick={() => setStageFilter(s.label)} style={chip(stageFilter === s.label)}>
            {s.label}
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div style={{ color: "#9A9A92", fontSize: "13px" }}>এই ফিল্টারে কোনো অর্ডার নেই।</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filtered.map((o) => (
          <div key={o.orderId} style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "20px", padding: isMobile ? "18px" : "22px" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ width: "56px", height: "70px", borderRadius: "12px", overflow: "hidden", background: "#EFEFE9", flexShrink: 0 }}>
                <div role="img" aria-label={o.productShort} style={{ width: "100%", height: "100%", backgroundImage: `url(${o.productImg})`, backgroundPosition: "50% 18%", backgroundSize: "cover" }} />
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#9A9A92" }}>{o.orderCode}</span>
                  <span style={{ fontSize: "11.5px", color: "#B5B5AD" }}>{o.createdDate}</span>
                </div>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "15px", fontWeight: 700, marginTop: "4px" }}>{o.productShort}</div>
                <div style={{ fontSize: "12.5px", color: "#6A6A64", marginTop: "4px" }}>
                  {o.customerName} · {o.customerPhone || "ফোন নেই"}
                </div>
                <div style={{ fontSize: "12px", color: "#9A9A92", marginTop: "4px" }}>
                  {o.pickupSlot} · {o.pickupDay} · {o.addressLine}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "18px", fontWeight: 800 }}>{tk(o.total)}</div>
                <div style={{ fontSize: "11.5px", color: "#9A9A92", marginTop: "3px" }}>বাকি {tk(o.total - o.advancePaid)}</div>
              </div>
            </div>

            <div style={{ fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.2px", color: "#B5B5AD", margin: "18px 0 8px" }}>স্টেজ</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {STAGES.map((st, i) => (
                <div key={i} onClick={() => patch(o.orderId, { stage: i, statusLabel: st.label }, { stage: i, statusLabel: st.label })} style={chip(o.stage === i)}>
                  {st.label}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "18px" }}>
              <div>
                <div style={{ fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.2px", color: "#B5B5AD", marginBottom: "8px" }}>পেমেন্ট</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {PAY_STATUSES.map((p) => (
                    <div key={p} onClick={() => patch(o.orderId, { payStatus: p }, { payStatus: p })} style={chip(o.payStatus === p)}>
                      {PAY_LABEL[p]}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.2px", color: "#B5B5AD", marginBottom: "8px" }}>দায়িত্বে</div>
                <select
                  value={o.assignedStaffId || ""}
                  onChange={(e) => {
                    const v = e.target.value || null;
                    patch(o.orderId, { assignedStaffId: v }, { assignedStaffId: v });
                  }}
                  style={{ padding: "8px 14px", borderRadius: "20px", border: "1px solid #E2E2DA", background: "#FFFFFF", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 700, color: "#181818", outline: "none" }}
                >
                  <option value="">অনির্ধারিত</option>
                  {tailors.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
