-- MOUSUMI — staff panel goes live
-- Run in the SQL Editor after 0004_orders_go_live.sql.
--
-- What this adds, confirmed with the project owner first (2026-08-11):
--   1. Links `staff` rows to real Supabase Auth sessions, the same way
--      `customers` already does — same email+OTP mechanism, no new auth
--      system to build or pay for.
--   2. Two roles for now: 'admin' (the owner — full access) and 'tailor'
--      (stitching staff — a narrow, read-mostly queue with no pricing or
--      customer contact info). 'measurer' and 'rider' stay in the
--      `staff.role` check constraint from 0001 for later; nothing here
--      grants them any access yet.
--   3. Staff sign-in is deliberately NOT self-service like customer sign-up
--      is. A `customers` row is created automatically on first login
--      (anyone can become a customer); a `staff` row must already exist —
--      created by the owner via the Supabase dashboard — before that email
--      can ever log in to the staff panel. `link_staff_account()` only
--      *links* a session to a pre-existing row, it never creates one.

-- ============================================================
-- 1. staff can now have a real login
-- ============================================================
alter table staff add column auth_user_id uuid unique references auth.users (id) on delete set null;
alter table staff add column email text unique;

-- ============================================================
-- 2. is_staff() / is_admin() — the same security-definer pattern as
-- phone_is_registered()/claim_customer() in 0002: run with elevated
-- privilege to answer one narrow question without exposing the `staff`
-- table itself to a direct select from just anyone.
-- ============================================================
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from staff where auth_user_id = auth.uid() and active = true);
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from staff where auth_user_id = auth.uid() and active = true and role = 'admin');
$$;

grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- ============================================================
-- 3. link_staff_account — links the CURRENT session to the `staff` row
-- matching its email. Unlike claim_customer(), this never inserts a new
-- row: if no active staff row has this email, it raises and the frontend
-- signs the session back out. That's what keeps staff sign-in from being
-- self-service.
-- ============================================================
create or replace function public.link_staff_account()
returns staff
language plpgsql
security definer
set search_path = public
as $$
declare
  result staff;
  user_email text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select email into user_email from auth.users where id = auth.uid();
  if user_email is null then
    raise exception 'no email on this session';
  end if;

  update staff set auth_user_id = auth.uid()
  where email = user_email and active = true
  returning * into result;

  if not found then
    raise exception 'this email is not registered as staff';
  end if;

  return result;
end;
$$;

grant execute on function public.link_staff_account() to authenticated;

-- ============================================================
-- 4. RLS — admin gets broad read/write on the operational tables (they're
-- doing the rider's job too, so they need the full picture). Tailors get
-- nothing here — their entire access surface is the two functions in
-- section 5, which is what keeps pricing and customer contact info out of
-- their reach at the database level, not just hidden in the UI.
-- ============================================================
create policy "staff view own row"
  on staff for select using (auth_user_id = auth.uid());
create policy "admin manage staff"
  on staff for all using (is_admin()) with check (is_admin());

create policy "admin view all customers"
  on customers for select using (is_admin());
create policy "admin view all addresses"
  on addresses for select using (is_admin());

create policy "admin view all orders"
  on orders for select using (is_admin());
create policy "admin update all orders"
  on orders for update using (is_admin()) with check (is_admin());
create policy "admin view all order items"
  on order_items for select using (is_admin());

create policy "admin manage designs"
  on designs for all using (is_admin()) with check (is_admin());
create policy "admin manage promo codes"
  on promo_codes for all using (is_admin()) with check (is_admin());

-- ============================================================
-- 5. Tailor access — one read (a queue with no pricing/customer contact
-- columns at all, not just hidden client-side) and one write (advance the
-- stage, nothing else). Both run as SECURITY DEFINER so a tailor session
-- never needs a direct SELECT/UPDATE grant on `orders` itself.
--
-- The queue is scoped to orders assigned to THIS tailor (via
-- orders.assigned_staff_id, which the admin dashboard sets) — not every
-- order in the shop. An order nobody's been assigned to yet simply won't
-- appear for anyone until the admin assigns it. The subquery naturally
-- returns zero rows for a non-staff/unlinked session (NULL = anything is
-- never true), so this is safe on its own even without an explicit
-- is_staff() check.
-- ============================================================
create or replace function public.staff_order_queue()
returns table (
  order_id           uuid,
  order_code         text,
  design_name        text,
  design_img         text,
  fabric             text,
  qty                integer,
  measure_snapshot   jsonb,
  stage              integer,
  status_label       text,
  expected_delivery  date
)
language sql
security definer
set search_path = public
as $$
  select o.id, o.order_code, d.name, d.img_url, oi.fabric, oi.qty, o.measure_snapshot, o.stage, o.status_label, o.expected_delivery
  from orders o
  join order_items oi on oi.order_id = o.id
  join designs d on d.id = oi.design_id
  where o.assigned_staff_id = (select s.id from staff s where s.auth_user_id = auth.uid() and s.active = true)
  order by o.stage asc, o.expected_delivery asc nulls last;
$$;

grant execute on function public.staff_order_queue() to authenticated;

-- Checks assignment, not just staff-membership: order UUIDs aren't secret
-- from a determined attacker the way "never appears in this tailor's own
-- queue" makes them in practice, so this closes the gap properly rather
-- than relying only on staff_order_queue() never handing out other
-- tailors' order IDs.
create or replace function public.staff_update_order_stage(p_order_id uuid, p_stage integer, p_status_label text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  my_staff_id uuid;
begin
  select id into my_staff_id from staff where auth_user_id = auth.uid() and active = true;
  if my_staff_id is null then
    raise exception 'not staff';
  end if;
  if p_stage < 0 or p_stage > 4 then
    raise exception 'stage must be between 0 and 4';
  end if;
  if not is_admin() and not exists (select 1 from orders where id = p_order_id and assigned_staff_id = my_staff_id) then
    raise exception 'this order is not assigned to you';
  end if;
  update orders set stage = p_stage, status_label = p_status_label where id = p_order_id;
end;
$$;

grant execute on function public.staff_update_order_stage(uuid, integer, text) to authenticated;

-- ============================================================
-- 6. After running this file: insert the first admin row yourself
-- (Table Editor, or SQL Editor) — see supabase/README.md for the exact
-- statement. Nobody can reach the staff panel until at least one active
-- staff row with your real login email exists.
-- ============================================================
