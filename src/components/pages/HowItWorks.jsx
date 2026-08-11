import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";

export default function HowItWorks() {
  const { goOrderMeasure, howSteps, stats } = useApp();
  const { isDesktop, isMobile } = useViewport();

  return (
    <div style={{ animation: "msRise 0.55s cubic-bezier(0.22,1,0.36,1) both", paddingBottom: "90px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "minmax(0, 380px) minmax(0, 1fr)" : "minmax(0,1fr)",
          gap: isMobile ? "26px" : "44px",
          alignItems: "center",
          padding: isMobile ? "32px 20px 36px" : isDesktop ? "52px 56px 56px" : "40px 40px 44px",
          background: "#F3F3EF",
          borderBottom: "1px solid #E8E8E2",
        }}
      >
        <div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2.6px", color: "#D32F4D" }}>MEASUREMENT GUIDE</div>
          <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "34px" : "52px", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, margin: "16px 0 0" }}>
            MEASURE
            <br />
            AT HOME
          </h2>
          <p style={{ fontSize: "14.5px", lineHeight: 1.75, color: "#6A6A64", margin: "18px 0 24px", textWrap: "pretty" }}>A walkthrough of the platform and how each measurement is taken with a simple tape. Save it once — every future order reuses it.</p>
          <div onClick={goOrderMeasure} className="hv-lift-3" style={{ display: "inline-block", padding: "15px 30px", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.6px", cursor: "pointer", transition: "all .25s ease" }}>
            OPEN MEASUREMENT SHEET
          </div>
        </div>
        <div style={{ borderRadius: "20px", overflow: "hidden", background: "#181818", boxShadow: "0 26px 60px rgba(0,0,0,0.14)", border: "1px solid #E2E2DA" }}>
          <div style={{ height: "36px", display: "flex", alignItems: "center", gap: "7px", padding: "0 14px", background: "#EDEDE7", borderBottom: "1px solid #E2E2DA" }}>
            <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#D9D9D1" }} />
            <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#D9D9D1" }} />
            <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#D9D9D1" }} />
            <div style={{ marginLeft: "12px", fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "1.4px", color: "#9A9A92" }}>MOUSUMI — PLATFORM WALKTHROUGH</div>
          </div>
          <iframe
            src="https://www.youtube.com/embed/VSPe-qgIWUk"
            title="MOUSUMI — platform walkthrough"
            style={{ display: "block", width: "100%", aspectRatio: "16/10", border: "none", background: "#151513" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      <div style={{ overflow: "hidden", borderBottom: "1px solid #E8E8E2", padding: "20px 0", background: "#F9F9F7" }}>
        <div style={{ display: "flex", width: "max-content", animation: "msMarquee 28s linear infinite", fontFamily: "Outfit,sans-serif", fontSize: "14px", fontWeight: 800, letterSpacing: "4px" }}>
          <span style={{ paddingRight: "40px" }}>DOORSTEP PICKUP — SAVED MEASUREMENTS — 3 MONTHS FREE ALTERATION — CASH ON PICKUP/DELIVERY — DOORSTEP PICKUP — SAVED MEASUREMENTS — 3 MONTHS FREE ALTERATION — </span>
          <span style={{ paddingRight: "40px" }}>DOORSTEP PICKUP — SAVED MEASUREMENTS — 3 MONTHS FREE ALTERATION — CASH ON PICKUP/DELIVERY — DOORSTEP PICKUP — SAVED MEASUREMENTS — 3 MONTHS FREE ALTERATION — </span>
        </div>
      </div>

      <div style={{ padding: isMobile ? "40px 20px 0" : "64px 56px 0" }}>
        <h3 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "26px" : "34px", fontWeight: 800, letterSpacing: "-1.2px", margin: "0 0 30px" }}>FIVE STEPS, START TO FINISH</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "20px" }}>
          {howSteps.map((h) => (
            <div key={h.n} className="hv-lift-5-border-dark" style={{ background: "#FFFFFF", border: "1px solid #EDEDE6", borderRadius: "22px", padding: "24px", transition: "transform .3s cubic-bezier(0.22,1,0.36,1), border-color .3s ease" }}>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "34px", fontWeight: 800, letterSpacing: "-1.5px", color: "#D32F4D" }}>{h.n}</div>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "15px", fontWeight: 700, marginTop: "12px" }}>{h.t}</div>
              <div style={{ fontSize: "12.5px", color: "#6A6A64", marginTop: "8px", lineHeight: 1.65 }}>{h.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: isMobile ? "40px 20px 0" : "64px 56px 0", display: "grid", gridTemplateColumns: isDesktop ? "1.35fr 1fr" : "minmax(0,1fr)", gap: "26px" }}>
        <div style={{ height: isDesktop ? "400px" : isMobile ? "220px" : "300px", borderRadius: "26px", overflow: "hidden", background: "#EFEFE9" }}>
          <div role="img" aria-label="Atelier" style={{ width: "100%", height: "100%", backgroundImage: "url(/assets/summer_banner.png)", backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px", justifyContent: "center" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2.6px", color: "#D32F4D" }}>THE SHOP</div>
          <h3 style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "27px" : "38px", fontWeight: 800, letterSpacing: "-1.4px", lineHeight: 1.05, margin: 0 }}>A BARISHAL TAILORING FLOOR, NOW ONLINE.</h3>
          <p style={{ fontSize: "14.5px", lineHeight: 1.8, color: "#6A6A64", margin: 0, textWrap: "pretty" }}>The same cutters and machinists who serve our walk-in customers stitch every online order. The website only removes the two trips you used to make.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? "10px" : "18px", marginTop: "6px" }}>
            {stats.map((st) => (
              <div key={st.t} style={{ borderTop: "2px solid #181818", paddingTop: "14px" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "23px" : "32px", fontWeight: 800, letterSpacing: "-1.2px" }}>{st.n}</div>
                <div style={{ fontSize: "12px", color: "#6A6A64", marginTop: "5px", lineHeight: 1.55 }}>{st.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
