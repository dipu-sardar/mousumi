import { supabase } from "./supabaseClient.js";
import { STAGES } from "../data/catalog.js";

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");

// The same embed shape src/lib/ordersApi.js uses for customer-facing
// screens, minus nothing — admin sees the full row. Kept as its own query
// (rather than importing ordersApi's ORDER_SELECT) because the two map
// functions below need different output shapes: mapOrderRow overwrites
// `id` with the order code for display, but the admin UI needs the real
// row UUID to issue updates against.
const ADMIN_ORDER_SELECT = "*, order_items(*, designs(*)), addresses(*), measurement_profiles(*), customers(name, phone, whatsapp)";

/** Maps an admin-embedded order row onto the flat shape OrdersView.jsx (and
 *  Dashboard.jsx, via computeDashboardStats()) read. Keeps the real
 *  `orders.id` (for updates) separate from the customer-facing
 *  `order_code`. */
export function mapAdminOrderRow(row) {
  // PostgREST doesn't guarantee embed order on its own — sort by `position`
  // so item 1 is reliably item 1, both for the "primary" summary below and
  // for the per-item pickup-tag breakdown OrdersView.jsx renders.
  const items = (row.order_items || []).slice().sort((a, b) => a.position - b.position);
  const primary = items[0] ? items[0].designs : null;
  const extra = items.length - 1;
  const addr = row.addresses;
  const cust = row.customers;

  return {
    orderId: row.id,
    orderCode: row.order_code,
    customerId: row.customer_id,
    customerName: cust ? cust.name : "—",
    customerPhone: cust ? cust.phone || cust.whatsapp || "" : "",
    productShort: primary ? primary.short + (extra > 0 ? ` +${extra} more` : "") : "Order",
    productImg: primary ? primary.img_url : "",
    fabric: items[0] ? items[0].fabric : "",
    items: items.map((it) => ({
      pickupTag: row.order_code + "-" + it.position, // see 0007_item_pickup_tags.sql
      short: (it.designs && it.designs.short) || it.design_id,
      fabric: it.fabric,
      qty: it.qty,
    })),
    stage: row.stage,
    statusLabel: row.status_label,
    payStatus: row.pay_status,
    total: row.total,
    advancePaid: row.advance_paid,
    paymentMethod: row.payment_method || "—",
    pickupDay: row.pickup_day || "—",
    pickupSlot: row.pickup_slot || "—",
    addressLine: addr ? addr.label + " — " + addr.line : "No address on file",
    assignedStaffId: row.assigned_staff_id,
    createdAt: row.created_at, // raw ISO timestamp — computeDashboardStats() needs real dates, not the pretty-printed one below
    createdDate: fmtDate(row.created_at),
    expectedDelivery: fmtDate(row.expected_delivery),
  };
}

/** Maps a staff_order_queue() row (already flat, no joins needed — the
 *  RPC did those server-side) onto what TailorQueue.jsx reads. Note what's
 *  NOT here: no customer name/phone, no pricing — the RPC never selected
 *  those columns in the first place, so there's nothing to accidentally
 *  leak here even if this mapper changes later. */
export function mapQueueRow(row) {
  return {
    orderId: row.order_id,
    orderCode: row.order_code,
    pickupTag: row.pickup_tag, // see 0007_item_pickup_tags.sql — write this on the paper tag pinned to the fabric
    designName: (row.design_name || "").replace(/\n/g, " "),
    designImg: row.design_img,
    fabric: row.fabric,
    qty: row.qty,
    m: row.measure_snapshot || null,
    stage: row.stage,
    statusLabel: row.status_label,
    expectedDelivery: fmtDate(row.expected_delivery),
  };
}

export { STAGES };

/** Sends an email OTP for staff sign-in — identical mechanism to the
 *  customer flow (supabase.auth.signInWithOtp), just called from the
 *  staff app instead, including `shouldCreateUser: true` — a brand-new
 *  staff member's very first login still needs Supabase to create their
 *  `auth.users` row, same as it does for a first-time customer. That part
 *  is harmless on its own; the real gate is linkStaffAccount() below,
 *  which refuses to attach this session to anything unless an admin
 *  already created a matching `staff` row. Getting an auth session costs
 *  an attacker nothing — reaching the staff panel requires the linked
 *  `staff` row too. */
export async function sendStaffOtp(email) {
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) throw error;
}

export async function verifyStaffOtp(email, code) {
  const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
  if (error) throw error;
}

/** Links the current session to its `staff` row (see 0005_staff_panel.sql
 *  — this never creates a row, only an admin-seeded one can be linked).
 *  Throws with a message worth showing the user if this email isn't staff. */
export async function linkStaffAccount() {
  const { data, error } = await supabase.rpc("link_staff_account");
  if (error) throw error;
  return data;
}

/** The `staff` row for the current session, or null if not linked (or not
 *  logged in). Used to restore a session on page reload, the same way
 *  AppContext restores a customer session via the `customers` table. */
export async function fetchMyStaffRow() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase.from("staff").select("*").eq("auth_user_id", session.user.id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function signOutStaff() {
  await supabase.auth.signOut();
}

// ---------------- admin ----------------

export async function fetchAdminOrders() {
  const { data, error } = await supabase.from("orders").select(ADMIN_ORDER_SELECT).order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapAdminOrderRow);
}

export async function fetchTailors() {
  const { data, error } = await supabase.from("staff").select("*").eq("role", "tailor").order("name");
  if (error) throw error;
  return data || [];
}

/** Admin's general-purpose order edit — stage, payment, or assignment, any
 *  subset of `patch` at once. Goes straight to the `orders` table (the
 *  "admin update all orders" RLS policy from 0005 covers this); tailors
 *  never call this — they only get staffUpdateStage() below. */
export async function updateOrderAsAdmin(orderId, patch) {
  const row = {};
  if (patch.stage !== undefined) row.stage = patch.stage;
  if (patch.statusLabel !== undefined) row.status_label = patch.statusLabel;
  if (patch.payStatus !== undefined) row.pay_status = patch.payStatus;
  if (patch.advancePaid !== undefined) row.advance_paid = patch.advancePaid;
  if (patch.assignedStaffId !== undefined) row.assigned_staff_id = patch.assignedStaffId;
  const { error } = await supabase.from("orders").update(row).eq("id", orderId);
  if (error) throw error;
}

/** Dashboard numbers, computed client-side from the same order list
 *  OrdersView.jsx already fetches — no new SQL/RPC needed since the
 *  "admin view all orders" policy already covers this data and a small
 *  shop's whole order history is cheap to pull and reduce in JS. If order
 *  volume ever makes that wasteful, replace the caller with a real
 *  aggregate query and keep this function's output shape the same. */
export function computeDashboardStats(orders) {
  const now = new Date();
  const todayStr = now.toDateString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayCount = orders.filter((o) => o.createdAt && new Date(o.createdAt).toDateString() === todayStr).length;
  const monthOrders = orders.filter((o) => o.createdAt && new Date(o.createdAt) >= monthStart);
  const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
  const byStage = STAGES.map((s, i) => ({ label: s.label, count: orders.filter((o) => o.stage === i).length }));
  // Stage indices per 0006_order_confirmation.sql: 0 Pending, 1 Confirmed,
  // 2 Fabric picked up, ... — "still needs pickup" is specifically
  // Confirmed-but-not-yet-collected (1), not Pending (0), which hasn't
  // even been approved yet.
  const pendingConfirmation = orders.filter((o) => o.stage === 0).length;
  const awaitingPickup = orders.filter((o) => o.stage === 1).length;
  const unpaid = orders.filter((o) => o.payStatus !== "Paid");
  const unpaidTotal = unpaid.reduce((sum, o) => sum + Math.max(0, o.total - o.advancePaid), 0);

  return {
    totalOrders: orders.length,
    todayCount,
    monthRevenue,
    monthOrderCount: monthOrders.length,
    byStage,
    pendingConfirmation,
    awaitingPickup,
    unpaidCount: unpaid.length,
    unpaidTotal,
  };
}

// ---------------- admin: designs ----------------

/** Every design, active or not — admin needs to see and reactivate
 *  discontinued ones too, unlike the shop's public "active = true" view. */
export async function fetchAllDesigns() {
  const { data, error } = await supabase.from("designs").select("*").order("id");
  if (error) throw error;
  return data || [];
}

/** `id` is a short hand-picked slug (the table's primary key, not a
 *  generated UUID — see 0001_init.sql), so it's the one field a new
 *  design's form collects that an edit form doesn't: changing it on an
 *  existing row would orphan every order_items row still pointing at the
 *  old id. */
export async function createDesign(design) {
  const { error } = await supabase.from("designs").insert(design);
  if (error) throw error;
}

export async function updateDesign(id, patch) {
  const { error } = await supabase.from("designs").update(patch).eq("id", id);
  if (error) throw error;
}

// ---------------- tailor ----------------

export async function fetchTailorQueue() {
  const { data, error } = await supabase.rpc("staff_order_queue");
  if (error) throw error;
  return (data || []).map(mapQueueRow);
}

/** The only write a non-admin staff member can make — advance (or correct)
 *  an order's stage, via the staff_update_order_stage() RPC so there's no
 *  path from a tailor session to any other column on `orders`. */
export async function advanceStage(orderId, stageIndex) {
  const label = STAGES[stageIndex] ? STAGES[stageIndex].label : "";
  const { error } = await supabase.rpc("staff_update_order_stage", { p_order_id: orderId, p_stage: stageIndex, p_status_label: label });
  if (error) throw error;
}
