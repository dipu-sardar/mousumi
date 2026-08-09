import { supabase } from "./supabaseClient.js";

function rowToAddress(row) {
  return { id: row.id, label: row.label, line: row.line, phone: row.phone || "", note: row.note || "", isDefault: !!row.is_default };
}

export async function listAddresses(customerId) {
  const { data, error } = await supabase.from("addresses").select("*").eq("customer_id", customerId).order("is_default", { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToAddress);
}

/** The very first address a customer saves becomes their default
 *  (`isFirst` — the caller knows the current list length, no extra
 *  round trip needed to decide this). */
export async function createAddress(customerId, d, isFirst) {
  const { data, error } = await supabase
    .from("addresses")
    .insert({ customer_id: customerId, label: d.label, line: d.line, phone: d.phone || "", note: d.note || "", is_default: !!isFirst })
    .select()
    .single();
  if (error) throw error;
  return rowToAddress(data);
}

export async function updateAddress(id, d) {
  const { data, error } = await supabase
    .from("addresses")
    .update({ label: d.label, line: d.line, phone: d.phone || "", note: d.note || "" })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return rowToAddress(data);
}

export async function deleteAddress(id) {
  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) throw error;
}
