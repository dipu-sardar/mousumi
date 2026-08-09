// Stopgap client-side persistence for measurement profiles & addresses.
//
// There's no backend CRUD for these yet (see supabase/README.md — profiles
// and addresses still live only in AppContext state). Until that exists,
// this keeps them in localStorage so a page refresh doesn't throw away
// what someone just saved. Swap this for real Supabase tables later; the
// call sites (AppContext.jsx) are the only place that needs to change.

const STORAGE_KEY = "mousumi.saved.v1";

/** Reads the persisted `{ profiles, profileId, addresses, addressId }` blob,
 *  or `null` if nothing's saved yet / storage is unavailable / the JSON is
 *  corrupt (private browsing, quota errors, a hand-edited value, etc.). */
export function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Best-effort write — silently gives up if storage isn't available
 *  (private browsing, quota exceeded) rather than crashing the app. */
export function saveSaved(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore — refresh-persistence is a nice-to-have, not critical
  }
}
