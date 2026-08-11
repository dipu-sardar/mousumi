import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";
import { HEADER_HEIGHT } from "../layout/Header.jsx";

/**
 * Home is mainly a brand statement — identity copy on the left, one real
 * photo on the right — but the photo itself steps through the catalogue via
 * the prev/next arrows either side of it, so it doubles as a lightweight
 * first look at the designs without leaving Home.
 */
export default function Home() {
  const { goCatalogue, goHow, trustPills, stats, identityDesign, identityPhotoStyle, goIdentityDesign, prevIdentityDesign, nextIdentityDesign } = useApp();
  const { isDesktop, isMobile } = useViewport();

  const arrowBtnStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "#181818",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(0,0,0,0.16)",
    transition: "all .25s ease",
    zIndex: 2,
  };

  // Below desktop, the 5fr:6fr split has nowhere near enough width for a
  // 58px headline next to a photo — stack photo-over-copy instead, and let
  // the page scroll normally (drop the fixed viewport-height box; the photo
  // section gets its own fixed band height instead of splitting 100% of the
  // viewport height with the copy column below it).
  return (
    <div
      style={
        isDesktop
          ? { height: "calc(100dvh - " + HEADER_HEIGHT.desktop + "px)", minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)", animation: "msFadeIn 0.5s ease both" }
          : { display: "flex", flexDirection: "column", animation: "msFadeIn 0.5s ease both" }
      }
    >
      {/* ---------- left: brand identity ---------- */}
      <section
        style={
          isDesktop
            ? { padding: "0 40px 34px 56px", display: "flex", flexDirection: "column", justifyContent: "safe center", gap: "26px", overflowY: "auto", minHeight: 0, background: "#F9F9F7" }
            : { padding: isMobile ? "28px 20px 44px" : "36px 40px 52px", display: "flex", flexDirection: "column", gap: "22px", background: "#F9F9F7" }
        }
      >
        <div style={{ animation: "msFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "2.6px", color: "#D32F4D", marginBottom: "16px" }}>SMART TAILORING — BARISHAL</div>
          <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: isDesktop ? "58px" : isMobile ? "38px" : "48px", fontWeight: 800, lineHeight: 0.98, letterSpacing: "-2px", textTransform: "uppercase", margin: 0 }}>
            Stitched
            <br />
            to Your
            <br />
            Measure
          </h1>
          <p style={{ maxWidth: isDesktop ? "420px" : "560px", margin: "20px 0 0", fontSize: "14.5px", lineHeight: 1.75, color: "#6A6A64", textWrap: "pretty" }}>
            The same cutters and machinists who serve our walk-in customers in Barishal stitch every order placed here. Our rider collects the fabric from your door and brings back the finished piece — with three months of free alterations.
          </p>
        </div>

        <div style={{ height: "1px", background: "#E8E8E2" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", animation: "msFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both" }}>
          {trustPills.map((t) => (
            <div key={t.label} style={{ padding: "7px 13px", borderRadius: "30px", background: "#FFFFFF", border: "1px solid #ECECE5", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.8px", color: "#4A4A46" }}>
              {t.label}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? "12px" : "22px", maxWidth: isDesktop ? "440px" : "560px", animation: "msFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both" }}>
          {stats.map((st) => (
            <div key={st.t} style={{ borderTop: "2px solid #181818", paddingTop: "12px" }}>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: isMobile ? "21px" : "26px", fontWeight: 800, letterSpacing: "-1px" }}>{st.n}</div>
              <div style={{ fontSize: "11.5px", color: "#6A6A64", marginTop: "5px", lineHeight: 1.5 }}>{st.t}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", animation: "msFadeUp 1s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div onClick={goCatalogue} className="hv-bg-accent-lift-2" style={{ padding: "17px 32px", borderRadius: "40px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer", transition: "transform .25s ease, background .25s ease" }}>
            VIEW DESIGNS
          </div>
          <div onClick={goHow} className="hv-border-dark-lift-2" style={{ padding: "17px 28px", borderRadius: "40px", border: "1px solid #DDDDD5", fontFamily: "Outfit,sans-serif", fontSize: "11.5px", fontWeight: 800, letterSpacing: "1.8px", cursor: "pointer", transition: "all .25s ease" }}>
            HOW IT WORKS
          </div>
        </div>
      </section>

      {/* ---------- right: the real product, as a brand photo ---------- */}
      <section
        style={
          isDesktop
            ? { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", minWidth: 0, background: identityDesign.tone, transition: "background-color .6s ease" }
            : { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", height: isMobile ? "360px" : "460px", background: identityDesign.tone, transition: "background-color .6s ease" }
        }
      >
        <div style={{ position: "absolute", top: "13%", left: "10%", animation: "msFloat 4s ease-in-out infinite alternate" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D32F4D" strokeWidth="3" strokeLinecap="round">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </div>
        <div style={{ position: "absolute", top: "10%", right: "12%", animation: "msFloat 5.2s ease-in-out infinite alternate" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="2.4" strokeLinejoin="round" opacity="0.55">
            <polygon points="12,3 22,21 2,21" />
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: "14%", left: "7%", animation: "msFloat 4.6s ease-in-out infinite alternate" }}>
          <svg width="48" height="20" viewBox="0 0 50 20" fill="none" stroke="#D4A93F" strokeWidth="2.6" strokeLinecap="round">
            <path d="M 4 12 Q 15 0, 25 12 T 46 10" />
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: "11%", right: "9%", animation: "msFloat 5.8s ease-in-out infinite alternate" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2.5px solid #181818", opacity: 0.35 }} />
        </div>

        <div onClick={goIdentityDesign} style={{ position: "relative", width: "min(460px, 68%)", height: "84%", cursor: "pointer", animation: "msRise 0.8s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div role="img" aria-label={identityDesign.short} className="hv-scale-105" style={{ ...identityPhotoStyle, boxShadow: "0 30px 70px rgba(0,0,0,0.16)", transition: "transform .7s cubic-bezier(0.22,1,0.36,1)" }} />
          <div style={{ position: "absolute", left: "24px", right: "24px", bottom: "22px", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 700, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.35)" }}>{identityDesign.short}</span>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 800, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.35)" }}>{identityDesign.priceLabel}</span>
          </div>
        </div>

        <div onClick={prevIdentityDesign} aria-label="Previous design" title="Previous design" className="hv-prev-arrow" style={{ ...arrowBtnStyle, left: "4%" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
        <div onClick={nextIdentityDesign} aria-label="Next design" title="Next design" className="hv-next-arrow" style={{ ...arrowBtnStyle, right: "4%" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </div>
      </section>
    </div>
  );
}
