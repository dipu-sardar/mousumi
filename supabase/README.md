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

## What's deliberately not in the schema yet

- **Staff roles / who can update `orders.stage`.** The `staff` table exists,
  but no policy lets anyone write order status yet — that's the "staff
  panel" feature, designed together when you're ready to build it.
- **Seed data for `designs` / `promo_codes` / `reviews`.** The current
  frontend's designs, offers and reviews are demo content from the original
  prototype. Before loading any of it into the real database, confirm with
  me which of it is your actual catalogue/offers vs. placeholder — reviews
  in particular should never be seeded as if they're real customer
  testimonials unless they are.
