import { useApp } from "../context/AppContext.jsx";

/**
 * Print-only invoice. Hidden on screen (`#ms-receipt` in global.css), shown
 * in place of the app when the browser print dialog opens (see the
 * `@media print` rules) — triggered by the "PRINT RECEIPT" button on the
 * Track page.
 */
export default function Receipt() {
  const { orderId, trackedStatus, payStatusLabel, orderFacts, measureProfileName, orderMeasureRows, payRows, dueLabel } = useApp();

  return (
    <div id="ms-receipt" style={{ padding: 0, background: "#fff", color: "#181818", fontFamily: "Plus Jakarta Sans,sans-serif" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "30px", paddingBottom: "18px", borderBottom: "2px solid #181818" }}>
        <div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "22px", fontWeight: 800, letterSpacing: "4px" }}>MOUSUMI</div>
          <div style={{ fontSize: "11pt", color: "#4A4A46", marginTop: "6px", lineHeight: 1.6 }}>
            Smart Tailoring · Sadar Road, Barishal
            <br />
            +880 1712-000000 · hello@mousumi.com.bd
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "2px", color: "#D32F4D" }}>INVOICE / RECEIPT</div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "20px", fontWeight: 800, marginTop: "8px" }}>{orderId}</div>
          <div style={{ fontSize: "11pt", color: "#4A4A46", marginTop: "6px" }}>
            {trackedStatus} · {payStatusLabel}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px", padding: "22px 0", borderBottom: "1px solid #DDDDD5" }}>
        {orderFacts.map((o) => (
          <div key={o.k} style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "11pt", paddingBottom: "8px" }}>
            <span style={{ color: "#6A6A64" }}>{o.k}</span>
            <span style={{ fontWeight: 600, textAlign: "right" }}>{o.v}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 0", borderBottom: "1px solid #DDDDD5" }}>
        <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "12px", fontWeight: 800, letterSpacing: "1.6px", marginBottom: "12px" }}>MEASUREMENTS — {measureProfileName}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 20px" }}>
          {orderMeasureRows.map((m) => (
            <div key={m.k} style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "11pt", borderBottom: "1px solid #EFEFE9", paddingBottom: "6px" }}>
              <span style={{ color: "#6A6A64" }}>{m.k}</span>
              <span style={{ fontWeight: 600 }}>{m.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "40px", padding: "20px 0" }}>
        <div style={{ fontSize: "11pt", color: "#6A6A64", lineHeight: 1.8, maxWidth: "340px" }}>Free alterations for 3 months from the delivery date. Outside Barishal Sadar only the delivery charge applies. Please keep this receipt for any service claim.</div>
        <div style={{ minWidth: "260px" }}>
          {payRows.map((p) => (
            <div key={p.k} style={{ display: "flex", justifyContent: "space-between", gap: "20px", fontSize: "11pt", paddingBottom: "8px", borderBottom: "1px solid #EFEFE9", marginBottom: "8px" }}>
              <span style={{ color: "#6A6A64" }}>{p.k}</span>
              <span style={{ fontWeight: 600 }}>{p.v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "12px" }}>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "12px", fontWeight: 800, letterSpacing: "1.4px" }}>DUE</span>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "22px", fontWeight: 800 }}>{dueLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
