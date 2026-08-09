import { supabase } from "./supabaseClient.js";

const str = (v) => (v == null ? "" : String(v));
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");

// The full embed used by both fetchOrderByCode and fetchMyOrders — order
// items with their design, plus the address/profile/customer the order
// points at, all in one round trip via PostgREST's FK-based embedding.
const ORDER_SELECT = "*, order_items(*, designs(*)), addresses(*), measurement_profiles(*), customers(name, phone, whatsapp)";

/** Maps a fetched order row (with the embeds above) onto the flat shape
 *  Track.jsx / Account.jsx already read — this used to be a row straight
 *  out of the demo ORDERS array in catalog.js; now it's assembled from the
 *  real tables instead. A cart checkout can have more than one design, but
 *  the UI was built around "one order = one product", so the first item is
 *  shown as the headline product with a "+N more" suffix, same pattern
 *  trackSummary already used for the pre-checkout cart preview. */
export function mapOrderRow(row) {
  const items = row.order_items || [];
  const primary = items[0] ? items[0].designs : null;
  const extra = items.length - 1;
  const addr = row.addresses;
  const cust = row.customers;
  const profile = row.measurement_profiles;
  const snapshot =
    row.measure_snapshot ||
    (profile
      ? { length: profile.length, shoulder: profile.shoulder, bust: profile.bust, waist: profile.waist, hip: profile.hip, sleeve: profile.sleeve, armhole: profile.armhole, neckDepth: profile.neck_depth }
      : null);

  return {
    id: row.order_code,
    designId: primary ? primary.id : null,
    productShort: primary ? primary.short + (extra > 0 ? ` +${extra} more` : "") : "Order",
    productCategory: primary ? primary.category : "",
    productImg: primary ? primary.img_url : "",
    items: items.map((it) => ({ designId: it.design_id, short: (it.designs && it.designs.short) || it.design_id, fabric: it.fabric, qty: it.qty, unitPrice: it.unit_price })),
    stage: row.stage,
    status: row.status_label,
    live: row.stage < 4,
    slot: row.pickup_slot || "",
    day: row.pickup_day || "",
    addr: addr ? addr.line : "",
    addrLabel: addr ? addr.label : "",
    date: fmtDate(row.created_at),
    delivery: row.stage >= 4 ? fmtDate(row.delivered_at) : fmtDate(row.expected_delivery),
    customer: cust ? cust.name : "",
    phone: cust ? cust.phone || cust.whatsapp || "" : "",
    mode: "Home delivery",
    fabricSource: items[0] ? items[0].fabric : "",
    profile: profile ? profile.name : row.measure_method === "home" ? "Measured at home" : "Manual entry",
    m: {
      length: str(snapshot && snapshot.length),
      shoulder: str(snapshot && snapshot.shoulder),
      bust: str(snapshot && snapshot.bust),
      waist: str(snapshot && snapshot.waist),
      hip: str(snapshot && snapshot.hip),
      sleeve: str(snapshot && snapshot.sleeve),
      armhole: str(snapshot && snapshot.armhole),
      neckDepth: str(snapshot && snapshot.neckDepth),
    },
    total: row.total,
    advance: row.advance_paid,
    payMethod: row.payment_method || "",
    payStatus: row.pay_status,
    tailor: row.assigned_staff_id ? "Assigned" : "Not yet assigned",
    priority: false,
    owner: row.customer_id,
  };
}

/** Inserts the order + its line items. `items` is
 *  `[{ designId, fabric, qty, unitPrice, days }]`; `days` (per item) only
 *  feeds the expected-delivery estimate, it isn't stored. Two inserts, not
 *  a single RPC — good enough for now; if partial failure ever turns out to
 *  matter in practice, wrap both in a `plpgsql` function instead. */
export async function placeOrder({ customerId, measureMethod, measurementProfileId, measureSnapshot, pickupDay, pickupSlot, addressId, paymentMethod, promoCode, items, subtotal, discount, total }) {
  const expected = new Date();
  expected.setDate(expected.getDate() + Math.max(3, ...items.map((it) => it.days || 5)));

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      measure_method: measureMethod,
      measurement_profile_id: measurementProfileId || null,
      measure_snapshot: measureSnapshot || null,
      pickup_day: pickupDay,
      pickup_slot: pickupSlot,
      address_id: addressId || null,
      payment_method: paymentMethod,
      promo_code: promoCode || null,
      subtotal,
      discount,
      total,
      advance_paid: 0,
      pay_status: "Unpaid",
      expected_delivery: expected.toISOString().slice(0, 10),
    })
    .select()
    .single();
  if (orderErr) throw orderErr;

  const rows = items.map((it) => ({ order_id: order.id, design_id: it.designId, fabric: it.fabric, qty: it.qty, unit_price: it.unitPrice }));
  const { error: itemsErr } = await supabase.from("order_items").insert(rows);
  if (itemsErr) throw itemsErr;

  return order;
}

export async function fetchOrderByCode(code) {
  const { data, error } = await supabase.from("orders").select(ORDER_SELECT).eq("order_code", code).maybeSingle();
  if (error) throw error;
  return data ? mapOrderRow(data) : null;
}

export async function fetchMyOrders() {
  const { data, error } = await supabase.from("orders").select(ORDER_SELECT).order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapOrderRow);
}
