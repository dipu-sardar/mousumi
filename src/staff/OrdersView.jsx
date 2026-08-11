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

  // Stage 0 = Pending (see 0006_order_confirmation.sql) — every order sits
  // here until the owner explicitly confirms it. Surfaced as its own
  // callout, not just another row in the list, so a new order can't get
  // missed the way it could scrolling past 30 already-confirmed ones.
  const pending = useMemo(() => (orders || []).filter((o) => o.stage === 0), [orders]);
  const confirm = (orderId) => patch(orderId, { stage: 1, statusLabel: STAGES[1].label }, { stage: 1, statusLabel: STAGES[1].label });

  if (error) return <div style={{ padding: "24px", borderRadius: "16px", background: "#F9E5E9", color: "#A32138", fontSize: "13px" }}>{error}</div>;
  if (orders === null) return <div style={{ color: "#9A9A92", fontSize: "13px" }}>লোড হচ্ছে…</div>;

  return (
    <div>
      <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "26px" : "34px", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}>সব অর্ডার</h1>
      <div style={{ fontSize: "12.5px", color: "#9A9A92", marginBottom: "18px" }}>{orders.length} টা অর্ডার</div>

      {pending.length > 0 && (
        <div style={{ background: "#FBEFD2", border: "1px solid #F0DDA8", borderRadius: "20px", padding: isMobile ? "16px" : "20px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1px", color: "#8A6512", marginBottom: "14px" }}>
            {pending.length} টা অর্ডার কনফার্মেশনের অপেক্ষায়
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pending.map((o) => (
              <div key={o.orderId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", background: "rgba(255,255,255,0.55)", borderRadius: "14px", padding: "12px 16px" }}>
                <div style={{ fontSize: "13px", color: "#5A4308" }}>
                  <span style={{ fontFamily: "Outfit,sans-serif", fontWeight: 800 }}>{o.orderCode}</span> · {o.productShort} · {o.customerName}
                </div>
                <div onClick={() => confirm(o.orderId)} style={{ padding: "9px 18px", borderRadius: "20px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.8px", cursor: "pointer", flexShrink: 0 }}>
                  ✓ কনফার্ম করুন
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

            {/* One tag per physical piece — write this on paper and pin it
                to the fabric at pickup, so multiple dresses from the same
                customer never get mixed up. See 0007_item_pickup_tags.sql. */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
              {(o.items || []).map((it) => (
                <div
                  key={it.pickupTag}
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(it.pickupTag).catch(() => {});
                    flash("ট্যাগ কপি হয়েছে — " + it.pickupTag);
                  }}
                  title="ক্লিক করে কপি করো"
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "10px", background: "#F3F3EF", cursor: "pointer" }}
                >
                  <span style={{ fontFamily: "monospace", fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.3px" }}>{it.pickupTag}</span>
                  <span style={{ fontSize: "11px", color: "#9A9A92" }}>
                    {it.short} · {it.fabric}
                    {it.qty > 1 ? " ×" + it.qty : ""}
                  </span>
                </div>
              ))}
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
