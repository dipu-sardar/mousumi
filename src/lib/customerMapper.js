/** Maps a Supabase `customers` row onto the `account` shape the rest of the
 *  app already reads (unchanged since the original demo-data design —
 *  see src/context/selectors.js). Keeping this in one place means the
 *  frontend never has to know the database's column names directly. */
export function mapCustomerToAccount(row) {
  const joined = row.joined_at ? new Date(row.joined_at) : new Date();
  return {
    name: row.name || "",
    phone: row.phone || "",
    email: row.email || "",
    whatsapp: row.whatsapp || "",
    gender: row.gender || "",
    dob: row.dob || "",
    city: row.city || "Barishal",
    joined: "Member since " + joined.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
    language: row.language || "Bangla",
    referral: row.referral_code || "",
  };
}

/** Same referral-code shape as the original design: first name, letters
 *  only, capped at 8 chars, plus "200". */
export function makeReferralCode(name) {
  const base = (name || "").trim().split(/\s+/)[0] || "MSM";
  return (
    base
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 8) + "200"
  );
}
