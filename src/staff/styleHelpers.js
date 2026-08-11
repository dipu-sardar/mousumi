/** Active/inactive pill style shared by every staff-panel screen that
 *  needs clickable filter/status chips (order stage, payment status,
 *  design category, active/inactive…) — same visual language as the
 *  shop's chip()/card() helpers in AppContext.jsx, kept separate since the
 *  two apps share no state. */
export const chip = (active) => ({
  padding: "8px 14px",
  borderRadius: "20px",
  fontFamily: "Outfit,sans-serif",
  fontSize: "10.5px",
  fontWeight: 800,
  letterSpacing: "0.6px",
  cursor: "pointer",
  transition: "all .2s ease",
  border: active ? "1px solid #181818" : "1px solid #E2E2DA",
  background: active ? "#181818" : "#FFFFFF",
  color: active ? "#FFFFFF" : "#6A6A64",
});

/** Plain text/textarea/select input, matching the shop's input styling
 *  (see e.g. AddressEditModal.jsx's inputStyle). */
export const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #E8E8E2",
  background: "#F9F9F7",
  fontSize: "13.5px",
  outline: "none",
  color: "#181818",
  fontFamily: "'Plus Jakarta Sans',sans-serif",
};

export const fieldLabel = {
  fontSize: "11px",
  letterSpacing: "0.4px",
  color: "#9A9A92",
  marginBottom: "6px",
  fontWeight: 600,
};
