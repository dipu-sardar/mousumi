import { supabase } from "./supabaseClient.js";

// App-side field key -> measurement_profiles column name.
const COLS = { length: "length", shoulder: "shoulder", bust: "bust", waist: "waist", hip: "hip", sleeve: "sleeve", armhole: "armhole", neckDepth: "neck_depth" };

/** DB row -> the `{ id, name, updated, m }` shape the rest of the app already
 *  reads (unchanged since the localStorage-only version — see selectors.js).
 *  Supabase returns `numeric` columns as strings, so these round-trip as
 *  the same "40.0"-style text the measurement inputs already use. */
function rowToProfile(row) {
  const m = {};
  Object.entries(COLS).forEach(([k, col]) => {
    m[k] = row[col] != null ? String(row[col]) : "";
  });
  const updated = row.updated_at ? new Date(row.updated_at) : new Date();
  return {
    id: row.id,
    name: row.name,
    updated: "Updated " + updated.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    m,
  };
}

/** `m` fields -> DB columns, blank strings become `null` (empty text isn't
 *  valid input for a `numeric` column). */
function mFieldsToRow(m) {
  const out = {};
  Object.entries(COLS).forEach(([k, col]) => {
    const v = m && m[k] != null ? String(m[k]).trim() : "";
    out[col] = v === "" ? null : v;
  });
  return out;
}

export async function listProfiles(customerId) {
  const { data, error } = await supabase.from("measurement_profiles").select("*").eq("customer_id", customerId).order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToProfile);
}

export async function createProfile(customerId, name, m) {
  const { data, error } = await supabase
    .from("measurement_profiles")
    .insert({ customer_id: customerId, name, ...mFieldsToRow(m) })
    .select()
    .single();
  if (error) throw error;
  return rowToProfile(data);
}

export async function updateProfile(id, name, m) {
  const { data, error } = await supabase
    .from("measurement_profiles")
    .update({ name, ...mFieldsToRow(m), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return rowToProfile(data);
}

export async function deleteProfile(id) {
  const { error } = await supabase.from("measurement_profiles").delete().eq("id", id);
  if (error) throw error;
}
