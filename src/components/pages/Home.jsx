import { useApp } from "../../context/AppContext.jsx";

export default function Home() {
  const { home, featuredStyle, openHomeDesign, goCatalogue, homeDots, trustPills, circleStyle, swapping, prevHeroStyle, homeHeroStyle, homeSteps, goHow, nextHomeDesign, nextHome, nextTextStyle } = useApp();

  return (
    <div style={{ height: "calc(100vh - 78px)", minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0, 380px) minmax(0, 1fr) minmax(0, 250px)", animation: "msFadeIn 0.5s ease both" }}>
      {/* ---------- left: intro + featured design ---------- */}
      <section style={{ padding: "0 30px 34px 48px", display: "flex", flexDirection: "column", justifyContent: "safe center", gap: "22px", overflowY: "auto", minHeight: 0, zIndex: 10, background: "#F9F9F7" }}>
        <div style={{ animation: "msFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2.6px", color: "#D32F4D", marginBottom: "14px" }}>SMART TAILORING — BARISHAL</div>
          <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: "36px", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-1.3px", textTransform: "uppercase", margin: 0 }}>
            STITCHED
            <br />
            TO YOUR MEASURE
          </h1>
          <p style={{ maxWidth: "300px", margin: "12px 0 0", fontSize: "13px", lineHeight: 1.6, color: "#6A6A64", textWrap: "pretty" }}>
            Our rider collects the fabric from your door and brings back the finished dress — with three months of free alterations.
          </p>
        </div>

        <div style={{ height: "1px", background: "#E8E8E2" }} />

        <div style={featuredStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "9.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92" }}>FEATURED</div>
            <div style={{ height: "1px", flex: 1, background: "#EDEDE6" }} />
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "9.5px", fontWeight: 800, letterSpacing: "1.4px", color: "#B5B5AD" }}>{home.counter}</div>
          </div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "23px", fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.14, textTransform: "uppercase" }}>{home.short}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "12px" }}>
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "22px", fontWeight: 800 }}>{home.priceLabel}</div>
            <div style={{ width: "22px", height: "1px", background: "#CFCFC6" }} />
            <div style={{ fontSize: "12px", letterSpacing: "0.4px", color: "#6A6A64" }}>{home.turnaround}</div>
          </div>
          <div style={{ fontSize: "12px", color: "#9A9A92", marginTop: "7px" }}>{home.fabricNote}</div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
            <div
              onClick={openHomeDesign}
              className="hv-bg-accent-lift-2"
              style={{ padding: "15px 28px", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.6px", cursor: "pointer", transition: "transform .25s ease, background .25s ease" }}
            >
              VIEW DESIGN
            </div>
            <div onClick={goCatalogue} className="hv-border-dark-lift-2" style={{ padding: "15px 24px", borderRadius: "40px", border: "1px solid #DDDDD5", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.6px", cursor: "pointer", transition: "all .25s ease" }}>
              ALL DESIGNS
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginTop: "18px" }}>
            {homeDots.map((d, i) => (
              <div key={i} onClick={d.onClick} style={d.style} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {trustPills.map((t) => (
            <div key={t.label} style={{ padding: "7px 13px", borderRadius: "30px", background: "#FFFFFF", border: "1px solid #ECECE5", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.8px", color: "#4A4A46" }}>
              {t.label}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- middle: hero image with floating decorations ---------- */}
      <section style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", minWidth: 0 }}>
        <div style={circleStyle} />
        <div style={{ position: "absolute", top: "15%", left: "13%", animation: "msFloat 4s ease-in-out infinite alternate" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D32F4D" strokeWidth="3" strokeLinecap="round">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </div>
        <div style={{ position: "absolute", top: "11%", right: "17%", animation: "msFloat 5.2s ease-in-out infinite alternate" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7FA24B" strokeWidth="2.4" strokeLinejoin="round">
            <polygon points="12,3 22,21 2,21" />
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: "20%", left: "10%", animation: "msFloat 4.6s ease-in-out infinite alternate" }}>
          <svg width="48" height="20" viewBox="0 0 50 20" fill="none" stroke="#D4A93F" strokeWidth="2.6" strokeLinecap="round">
            <path d="M 4 12 Q 15 0, 25 12 T 46 10" />
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: "15%", right: "12%", animation: "msFloat 5.8s ease-in-out infinite alternate" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2.5px solid #7FA24B" }} />
        </div>

        <div style={{ position: "relative", zIndex: 5, width: "min(340px, 46%)", height: "82%", alignSelf: "center" }}>
          {swapping && <div role="img" aria-label="Previous design" style={prevHeroStyle} />}
          <div role="img" aria-label="Featured design" style={homeHeroStyle} />
        </div>

        <div
          onClick={openHomeDesign}
          className="hv-scale-114"
          style={{ position: "absolute", bottom: "9%", left: "50%", width: "62px", height: "62px", margin: "0 0 0 -31px", borderRadius: "50%", background: "#181818", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 14, animation: "msRing 2.6s infinite", transition: "transform .3s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </section>

      {/* ---------- right: how it works + up next ---------- */}
      <section style={{ position: "relative", borderLeft: "1px solid #E8E8E2", display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ padding: "16px 14px", borderBottom: "1px solid #E8E8E2", display: "flex", flexDirection: "column", gap: "10px", background: "#F9F9F7", animation: "msFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "9.5px", fontWeight: 800, letterSpacing: "1.8px", color: "#9A9A92" }}>HOW IT WORKS</div>
          {homeSteps.map((st) => (
            <div key={st.n} onClick={goHow} className="hv-bg-tint" style={{ display: "flex", alignItems: "center", gap: "11px", cursor: "pointer", padding: "5px 6px", borderRadius: "12px", transition: "background .25s ease" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{st.n}</div>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 700, lineHeight: 1.3, minWidth: 0 }}>{st.t}</div>
            </div>
          ))}
        </div>
        <div
          onClick={nextHomeDesign}
          className="hv-next-arrow"
          style={{ position: "absolute", left: "-27px", top: "58%", width: "54px", height: "54px", borderRadius: "50%", background: "#fff", border: "1px solid #E8E8E2", boxShadow: "0 10px 28px rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 30, transition: "transform .35s cubic-bezier(0.34,1.56,0.64,1), background .3s ease" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <div onClick={nextHomeDesign} style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden", cursor: "pointer", background: "#EDEDE7" }}>
          <div role="img" aria-label="Next design" className="hv-scale-105" style={nextHome.bannerStyle} />
          <div style={nextTextStyle}>
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "9.5px", fontWeight: 800, letterSpacing: "2px", color: "rgba(255,255,255,0.75)" }}>UP NEXT</div>
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "13.5px", fontWeight: 700, color: "#fff", marginTop: "6px", lineHeight: 1.25 }}>{nextHome.short}</div>
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.8)", marginTop: "3px" }}>{nextHome.priceLabel}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
