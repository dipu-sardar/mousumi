import { useApp } from "../../context/AppContext.jsx";
import { useViewport } from "../../hooks/useViewport.js";

/** Shared header height, in one place — Home/DesignDetail/OrderDone size
 *  their `calc(100dvh - Npx)` full-bleed sections against this, so it can't
 *  drift out of sync with what Header actually renders. */
export const HEADER_HEIGHT = { desktop: 78, compact: 66 };

export default function Header() {
  const { toggleMenu, goHome, navLinks, toggleSearch, goCart, cartCount, authed, goAccount, guest, openLogin } = useApp();
  const { isDesktop } = useViewport();

  // ---------- desktop (>=1024px): unchanged 4-column toolbar ----------
  if (isDesktop) {
    return (
      <header
        style={{
          height: HEADER_HEIGHT.desktop + "px",
          flex: "0 0 " + HEADER_HEIGHT.desktop + "px",
          display: "grid",
          gridTemplateColumns: "minmax(0,230px) minmax(0,1fr) minmax(0,170px) minmax(0,190px)",
          alignItems: "center",
          borderBottom: "1px solid #E8E8E2",
          background: "#F9F9F7",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px", padding: "0 28px", height: "100%", borderRight: "1px solid #E8E8E2" }}>
          <div onClick={toggleMenu} className="hv-fade-60" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
              <path d="M1 1.5H21M1 7H14M1 12.5H21" stroke="#181818" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div onClick={goHome} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: "8px", minWidth: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v9M12 11L5 22M12 11l7 11" />
            </svg>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "15px", fontWeight: 800, letterSpacing: "3px" }}>MOUSUMI</span>
          </div>
        </div>

        <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "30px", height: "100%", padding: "0 16px", borderRight: "1px solid #E8E8E2", minWidth: 0 }}>
          {navLinks.map((l) => (
            <div key={l.label} onClick={l.onClick} style={l.style}>
              {l.label}
              {l.active && <div style={{ position: "absolute", left: "50%", bottom: "-2px", width: "22px", height: "2px", marginLeft: "-11px", background: "#D32F4D" }} />}
            </div>
          ))}
        </nav>

        <div
          onClick={toggleSearch}
          className="hv-text-accent"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "9px", height: "100%", borderRight: "1px solid #E8E8E2", cursor: "pointer", fontFamily: "Outfit,sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "1.4px" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>SEARCH</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "26px", height: "100%" }}>
          <div onClick={goCart} title="Cart" className="hv-fade-60" style={{ position: "relative", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.6" />
              <circle cx="18" cy="20" r="1.6" />
              <path d="M2 3h3l2.4 12h11L21 7H6" />
            </svg>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.2px" }}>CART</span>
            <div style={{ position: "absolute", top: "-6px", left: "12px", minWidth: "16px", height: "16px", padding: "0 4px", borderRadius: "9px", background: "#D32F4D", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {cartCount}
            </div>
          </div>
          {authed && (
            <div onClick={goAccount} title="My account" className="hv-fade-60" style={{ cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
          {guest && (
            <div onClick={openLogin} className="hv-bg-accent" style={{ padding: "11px 20px", borderRadius: "30px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "10.5px", fontWeight: 800, letterSpacing: "1.3px", cursor: "pointer", whiteSpace: "nowrap", transition: "background .25s ease" }}>
              LOG IN
            </div>
          )}
        </div>
      </header>
    );
  }

  // ---------- tablet & mobile (<1024px): compact toolbar ----------
  // The 5-item nav row and the column dividers don't fit under ~1024px, so
  // this drops both — every nav link (and more: cart, tracking, offers,
  // reviews, account) already lives one tap away in MenuDrawer, which the
  // hamburger opens either way. Search and cart collapse to icon-only to
  // keep everything on one line down to a narrow phone.
  return (
    <header
      style={{
        height: HEADER_HEIGHT.compact + "px",
        flex: "0 0 " + HEADER_HEIGHT.compact + "px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        padding: "0 16px",
        borderBottom: "1px solid #E8E8E2",
        background: "#F9F9F7",
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
        <div onClick={toggleMenu} className="hv-fade-60" style={{ cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <path d="M1 1.5H21M1 7H14M1 12.5H21" stroke="#181818" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div onClick={goHome} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: "7px", minWidth: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M12 2v9M12 11L5 22M12 11l7 11" />
          </svg>
          <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "2.2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>MOUSUMI</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "18px", flexShrink: 0 }}>
        <div onClick={toggleSearch} className="hv-text-accent" title="Search" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <div onClick={goCart} title="Cart" className="hv-fade-60" style={{ position: "relative", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="20" r="1.6" />
            <circle cx="18" cy="20" r="1.6" />
            <path d="M2 3h3l2.4 12h11L21 7H6" />
          </svg>
          <div style={{ position: "absolute", top: "-7px", left: "11px", minWidth: "15px", height: "15px", padding: "0 3px", borderRadius: "8px", background: "#D32F4D", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "9px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {cartCount}
          </div>
        </div>
        {authed && (
          <div onClick={goAccount} title="My account" className="hv-fade-60" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#181818" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
        {guest && (
          <div onClick={openLogin} className="hv-bg-accent" style={{ padding: "9px 16px", borderRadius: "30px", background: "#181818", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.1px", cursor: "pointer", whiteSpace: "nowrap", transition: "background .25s ease" }}>
            LOG IN
          </div>
        )}
      </div>
    </header>
  );
}
