import { useEffect, useState } from "react";
import { fetchTailorQueue, advanceStage, STAGES } from "../lib/staffApi.js";
import { useStaff } from "./StaffContext.jsx";
import { useViewport } from "../hooks/useViewport.js";

const MEASURE_LABELS = { length: "দৈর্ঘ্য", shoulder: "কাঁধ", bust: "বুক", waist: "কোমর", hip: "হিপ", sleeve: "হাতা", armhole: "আর্মহোল", neckDepth: "গলার গভীরতা" };

// Pending/Confirmed (STAGES[0]/[1]) are the owner's call, not the stitching
// floor's — staff_update_order_stage() rejects a tailor session setting
// either one, so there's no point offering clickable chips for them here.
// A tailor's queue only ever contains assigned orders anyway (see
// staff_order_queue() in 0005), which in practice means "already past
// Confirmed" — but showing only the stages they can actually use keeps
// that guarantee visible in the UI too, not just enforced server-side.
const TAILOR_STAGE_OFFSET = 2;
const TAILOR_STAGES = STAGES.slice(TAILOR_STAGE_OFFSET);

export default function TailorQueue() {
  const { flash } = useStaff();
  const { isMobile } = useViewport();
  const [queue, setQueue] = useState(null); // null = loading
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = async () => {
    try {
      setQueue(await fetchTailorQueue());
    } catch (err) {
      setError((err && err.message) || "লোড করা যায়নি।");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onAdvance = async (orderId, stageIndex) => {
    setBusyId(orderId);
    try {
      await advanceStage(orderId, stageIndex);
      setQueue((q) => q.map((o) => (o.orderId === orderId ? { ...o, stage: stageIndex, statusLabel: STAGES[stageIndex].label } : o)));
      flash("স্টেজ আপডেট হয়েছে");
    } catch (err) {
      flash("আপডেট করা যায়নি — " + ((err && err.message) || "আবার চেষ্টা করুন"));
    } finally {
      setBusyId("");
    }
  };

  if (error) return <div style={{ padding: "24px", borderRadius: "16px", background: "#F9E5E9", color: "#A32138", fontSize: "13px" }}>{error}</div>;
  if (queue === null) return <div style={{ color: "#9A9A92", fontSize: "13px" }}>লোড হচ্ছে…</div>;
  if (queue.length === 0) return <div style={{ color: "#9A9A92", fontSize: "13px" }}>এখনো আপনাকে কোনো অর্ডার দেওয়া হয়নি — অ্যাডমিন কোনো অর্ডার assign করলে এখানে দেখাবে।</div>;

  return (
    <div>
      <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "26px" : "34px", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 22px" }}>আমার কাজের তালিকা</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {queue.map((o) => (
          <div key={o.orderId} style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "20px", padding: isMobile ? "18px" : "22px" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ width: "64px", height: "80px", borderRadius: "12px", overflow: "hidden", background: "#EFEFE9", flexShrink: 0 }}>
                <div role="img" aria-label={o.designName} style={{ width: "100%", height: "100%", backgroundImage: `url(${o.designImg})`, backgroundPosition: "50% 18%", backgroundSize: "cover" }} />
              </div>
              <div style={{ flex: 1, minWidth: "180px" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#9A9A92" }}>{o.orderCode}</div>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "15px", fontWeight: 700, marginTop: "4px" }}>{o.designName}</div>
                <div style={{ fontSize: "12px", color: "#6A6A64", marginTop: "4px" }}>
                  {o.fabric} {o.qty > 1 ? "· ×" + o.qty : ""} · ডেলিভারি {o.expectedDelivery}
                </div>
              </div>
            </div>

            {o.m && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "8px 20px", margin: "16px 0", padding: "14px 16px", background: "#F9F9F7", borderRadius: "14px" }}>
                {Object.keys(MEASURE_LABELS).map((k) =>
                  o.m[k] ? (
                    <div key={k} style={{ fontSize: "12px" }}>
                      <span style={{ color: "#9A9A92" }}>{MEASURE_LABELS[k]}: </span>
                      <span style={{ fontWeight: 700 }}>{o.m[k]}"</span>
                    </div>
                  ) : null,
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" }}>
              {TAILOR_STAGES.map((st, offsetI) => {
                const i = offsetI + TAILOR_STAGE_OFFSET;
                return (
                  <div
                    key={i}
                    onClick={busyId ? undefined : () => onAdvance(o.orderId, i)}
                    style={{
                      padding: "9px 14px",
                      borderRadius: "20px",
                      fontFamily: "Outfit,sans-serif",
                      fontSize: "10.5px",
                      fontWeight: 800,
                      letterSpacing: "0.6px",
                      cursor: busyId ? "default" : "pointer",
                      opacity: busyId && busyId !== o.orderId ? 0.5 : 1,
                      border: o.stage === i ? "1px solid #181818" : "1px solid #E2E2DA",
                      background: o.stage === i ? "#181818" : "#FFFFFF",
                      color: o.stage === i ? "#FFFFFF" : "#6A6A64",
                      transition: "all .2s ease",
                    }}
                  >
                    {st.label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
