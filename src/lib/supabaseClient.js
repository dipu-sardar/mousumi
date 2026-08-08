import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Shared Supabase client for the whole app.
 *
 * `null` until `.env.local` has real values in it (see supabase/README.md) —
 * every call site should check `isSupabaseConfigured` first so the app keeps
 * running on the built-in demo data rather than crashing when the backend
 * hasn't been wired up yet.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — running on the built-in demo data. See supabase/README.md.",
  );
}
