# Supabase — schema & how it evolves

## Setup (one time)

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine to start).
2. Open **SQL Editor** in the Supabase dashboard, paste in the contents of
   [`migrations/0001_init.sql`](migrations/0001_init.sql), and run it. That
   creates every table this app needs, with Row Level Security locked down
   from the start.
3. Open **Settings → API** and copy two values:
   - **Project URL**
   - **anon / public** key (not the `service_role` key — that one is secret
     and never goes in frontend code)
4. Put those two values in `.env.local` at the project root (copy
   `.env.example` and fill it in). This file is gitignored — it never gets
   committed.

That's it — the app can now talk to a real database instead of the
hardcoded arrays in `src/data/catalog.js`.

## Yes — adding a new column later is normal and safe

This is exactly what **migrations** are for. Nothing about the initial
schema is final.

Say six months from now you add a "gift wrapping" feature and `orders`
needs a `gift_wrapped boolean` column. You would:

1. Create a new file: `supabase/migrations/0002_add_gift_wrapping.sql`
2. Put one line in it:
   ```sql
   alter table orders add column gift_wrapped boolean not null default false;
   ```
3. Run that file in the SQL Editor (or via the Supabase CLI, once you're
   using it) against your live project.
4. Commit the file to git, same as any other code change.

Existing rows automatically get the default value (`false` here) — nothing
is lost, nothing breaks. The same pattern covers new tables, new indexes,
changing a check constraint, etc. The one thing that needs real care later
is *renaming or deleting* a column/table that's already storing real data —
at that point, ask me and I'll write a migration that moves the data across
safely instead of just dropping it.

**The rule going forward: schema changes are always a new numbered file
here, never an edit to `0001_init.sql`.** That gives you (and me, in a future
session) a full, ordered history of exactly how the database got to its
current shape — which is also just `git log` on this folder.

## Orders are real (as of migration 0004)

`0004_orders_go_live.sql` seeds `designs` (the 8-item catalogue) and
`promo_codes` (EID26 / FIRST15 / BLOUSE2) with the real, confirmed
catalogue and offers — not placeholder — so that real orders can reference
them. It also adds the `order_items` INSERT policy 0001 was missing, and an
`order_code` auto-generator ("MSM-2026-XXXX") via a sequence + trigger.

After this migration, checkout (src/context/selectors.js `orderPrimary` →
AppContext `placeOrder` → src/lib/ordersApi.js) writes real `orders` +
`order_items` rows instead of faking a confirmation screen, and Track /
Account read those rows back (RLS-scoped to whoever is logged in — order
tracking now requires being signed into the account that placed the order,
there's no separate "just know the code" bypass). Measurement profiles and
addresses (src/lib/profilesApi.js, addressesApi.js) moved from a
localStorage stopgap to the real `measurement_profiles`/`addresses` tables
at the same time, since orders need real rows to (optionally) point at.

**Run `0004_orders_go_live.sql` in the SQL Editor** the same way as the
earlier migrations before testing this on a project that hasn't seen it yet.

## Staff panel (as of migration 0005)

`0005_staff_panel.sql` gives `staff` a real login (same email+OTP mechanism
`customers` already uses) and two roles: `admin` (you — full read/write on
orders, customers, addresses, designs, promo codes, staff) and `tailor`
(stitching staff — a narrow queue with no pricing or customer contact info,
and the only write they get is advancing an order's stage).

**Staff sign-in is not self-service.** A `customers` row is created
automatically on first login; a `staff` row is not — you create it first,
then that email can log in at the staff panel. Run this in the SQL Editor
for every staff member (change the values):

```sql
insert into staff (name, phone, email, role, active)
values ('Your Name', '01712-000000', 'you@example.com', 'admin', true);
```

Use `role => 'tailor'` for stitching staff. Nobody reaches the staff panel
until at least one row like this exists with their real login email.

**Run `0005_staff_panel.sql`** in the SQL Editor the same way as the earlier
migrations before testing the staff panel on a project that hasn't seen it
yet.

## What's deliberately not in the schema yet

- **`measurer` / `rider` staff roles.** The `staff.role` check constraint
  still allows these (from 0001), but 0005 grants no access to them yet —
  the owner is doing rider work personally for now, and home-visit
  measurement staff don't have panel access yet either. Same migration
  pattern as `tailor` when that's needed.
- **Seed data for `reviews`.** Still the original prototype's demo content —
  don't load it as if it's real customer testimonials unless it is.
- **Real payment processing.** "CONFIRM & PAY" records the chosen method
  (bKash/Nagad/Rocket/Card) on the order but doesn't call any payment
  gateway — every order is created `pay_status: 'Unpaid'`, `advance_paid: 0`.
  Wiring an actual gateway is a separate step.
- **FIRST15 / BLOUSE2 discount math at checkout.** Both codes exist for real
  in `promo_codes` now, but only EID26's flat ৳200 is actually wired into
  the order total (same as before this migration) — percent and bundle
  pricing rules are a follow-up.
