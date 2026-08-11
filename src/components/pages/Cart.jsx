import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";

export default function Cart() {
  const { cartEmpty, cartFilled, goCatalogue, cartItems, cartSubtotal, cartDays, cartCheckout } = useApp();
  const { isMobile } = useViewport();

  return (
    <div style={{ padding: isMobile ? "28px 18px 70px" : "48px 56px 90px", animation: "msRise 0.55s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2.6px", color: "#D32F4D" }}>YOUR SELECTION</div>
      <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "34px" : "56px", fontWeight: 800, letterSpacing: "-2px", margin: "14px 0 34px" }}>CART</h2>

      {cartEmpty && (
        <div style={{ padding: "60px 0", borderTop: "1px solid #E8E8E2" }}>
          <div style={{ fontSize: "15px", color: "#6A6A64", marginBottom: "22px" }}>Your cart is empty — pick a design and we will stitch it to your measure.</div>
          <div onClick={goCatalogue} className="hv-bg-accent" style={{ display: "inline-block", padding: "15px 30px", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.6px", cursor: "pointer" }}>
            BROWSE DESIGNS
          </div>
        </div>
      )}

      {cartFilled && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "minmax(0,1fr) minmax(0,340px)", gap: isMobile ? "34px" : "48px", alignItems: "start" }}>
          <div style={{ borderTop: "1px solid #E8E8E2" }}>
            {cartItems.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "20px", padding: "22px 0", borderBottom: "1px solid #EFEFE9", flexWrap: "wrap" }}>
                <div onClick={c.open} style={{ width: "92px", height: "116px", borderRadius: "16px", overflow: "hidden", background: "#EFEFE9", cursor: "pointer", flexShrink: 0 }}>
                  <div role="img" aria-label="Cart item" style={c.photoStyle} />
                </div>
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "16px", fontWeight: 700 }}>{c.short}</div>
                  <div style={{ fontSize: "12.5px", color: "#9A9A92", marginTop: "6px" }}>{c.meta}</div>
                  <div onClick={c.remove} className="hv-text-accent" style={{ display: "inline-block", fontSize: "11px", letterSpacing: "1.2px", color: "#9A9A92", marginTop: "12px", cursor: "pointer", textDecoration: "underline" }}>
                    REMOVE
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", border: "1px solid #E8E8E2", borderRadius: "30px", padding: "8px 14px", background: "#fff" }}>
                  <div onClick={c.dec} className="hv-text-accent" style={{ cursor: "pointer", fontFamily: "Outfit,sans-serif", fontSize: "16px", fontWeight: 700, width: "16px", textAlign: "center" }}>
                    −
                  </div>
                  <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "14px", fontWeight: 700, minWidth: "16px", textAlign: "center" }}>{c.qty}</div>
                  <div onClick={c.inc} className="hv-text-accent" style={{ cursor: "pointer", fontFamily: "Outfit,sans-serif", fontSize: "16px", fontWeight: 700, width: "16px", textAlign: "center" }}>
                    +
                  </div>
                </div>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "17px", fontWeight: 800, width: "88px", textAlign: "right" }}>{c.lineTotal}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "24px", padding: "26px", boxShadow: "0 16px 40px rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92", marginBottom: "18px" }}>SUMMARY</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", marginBottom: "11px" }}>
              <span style={{ color: "#6A6A64" }}>Stitching subtotal</span>
              <span style={{ fontWeight: 600 }}>{cartSubtotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", marginBottom: "11px" }}>
              <span style={{ color: "#6A6A64" }}>Pickup &amp; delivery</span>
              <span style={{ fontWeight: 600 }}>Free</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", paddingBottom: "16px", borderBottom: "1px solid #EFEFE9" }}>
              <span style={{ color: "#6A6A64" }}>Longest turnaround</span>
              <span style={{ fontWeight: 600 }}>{cartDays}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "16px 0 20px" }}>
              <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "1.4px" }}>TOTAL</span>
              <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "26px", fontWeight: 800 }}>{cartSubtotal}</span>
            </div>
            <div onClick={cartCheckout} className="hv-bg-accent-lift-2" style={{ textAlign: "center", padding: "17px 0", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer", transition: "all .25s ease" }}>
              CHECKOUT
            </div>
            <div style={{ fontSize: "11.5px", color: "#9A9A92", textAlign: "center", marginTop: "14px", lineHeight: 1.6 }}>
              One pickup covers every item.
              <br />
              Free alterations for 3 months.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
