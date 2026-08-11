import { useEffect, useState } from "react";

/**
 * Tracks which responsive tier the viewport currently falls into.
 *
 * Three tiers, used consistently across every layout/page component:
 *   - mobile:  <768px   (phones)
 *   - tablet:  768–1023px (small/portrait tablets)
 *   - desktop: >=1024px (everything the original design was built for)
 *
 * Backed by `matchMedia` listeners rather than a `resize` poll, so a
 * component only re-renders when it actually crosses a breakpoint, not on
 * every pixel of a drag-resize. Any file that needs to switch a style object
 * (stack a grid, shrink a heading, hide a label) between tiers calls this
 * directly — mirrors how pages already compute their own local style
 * objects (e.g. Home.jsx's `arrowBtnStyle`) rather than centralizing layout
 * decisions in selectors.js, which stays a pure function of app state.
 */
const QUERIES = {
  isMobile: "(max-width: 767px)",
  isTablet: "(min-width: 768px) and (max-width: 1023px)",
  isDesktop: "(min-width: 1024px)",
};

function readState() {
  if (typeof window === "undefined" || !window.matchMedia) {
    // SSR / non-browser fallback — default to desktop, the original layout.
    return { isMobile: false, isTablet: false, isDesktop: true };
  }
  return {
    isMobile: window.matchMedia(QUERIES.isMobile).matches,
    isTablet: window.matchMedia(QUERIES.isTablet).matches,
    isDesktop: window.matchMedia(QUERIES.isDesktop).matches,
  };
}

export function useViewport() {
  const [state, setState] = useState(readState);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mqls = Object.values(QUERIES).map((q) => window.matchMedia(q));
    const update = () => setState(readState());
    mqls.forEach((mql) => mql.addEventListener("change", update));
    update(); // catch anything that changed between the initial render and this effect
    return () => mqls.forEach((mql) => mql.removeEventListener("change", update));
  }, []);

  return state;
}
