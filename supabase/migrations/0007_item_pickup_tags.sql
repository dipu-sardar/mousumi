-- MOUSUMI — per-item pickup tags
-- Run in the SQL Editor after 0006_order_confirmation.sql.
--
-- Requested by the project owner (2026-08-11): when a customer hands over
-- more than one dress in a single pickup, each physical piece needs its
-- own short, hand-writable ID — written on a paper tag and pinned to the
-- fabric — so pieces don't get mixed up before they reach the right
-- karigor. `orders.order_code` ("MSM-2026-0150") already identifies the
-- *order*, but not which of several order_items rows a given piece of
-- fabric is.
--
-- The tag itself isn't a new stored value — it's `order_code || '-' ||
-- position`, computed wherever it's shown (staffApi.js on the admin side,
-- inline SQL in staff_order_queue() below). `position` is the only new
-- thing that needs to persist: a 1-indexed slot per item *within* its
-- order, assigned once at checkout and never touched again.
--
-- Deliberately one tag per order_items row, not one per unit of `qty` —
-- e.g. "2x Designer Blouse" in one line gets one tag, not two. Revisit if
-- that turns out to matter in practice (same fabric bundle usually covers
-- the whole qty on one pickup anyway).

-- Written to be safe to run more than once from scratch — Supabase's SQL
-- Editor runs a pasted block as one implicit transaction, so a failure on
-- any one statement (like the function-signature error below, on a first
-- attempt at this file) rolls the whole block back; every statement here
-- is a no-op if it already ran.

-- ============================================================
-- 1. order_items.position
-- ============================================================
alter table order_items add column if not exists position integer;

-- Backfill whatever's already there. order_items has no created_at to
-- order by (nothing needed one before now), so this orders by `id` —
-- arbitrary, but stable and good enough: at this stage there are only a
-- couple of real orders, and existing multi-item orders just need *some*
-- fixed, non-colliding numbering, not a reconstruction of true insertion
-- order.
with numbered as (
  select id, row_number() over (partition by order_id order by id) as rn
  from order_items
)
update order_items oi set position = numbered.rn
from numbered
where numbered.id = oi.id;

alter table order_items alter column position set not null;
alter table order_items alter column position set default 1; -- safety net only — src/lib/ordersApi.js always sets this explicitly per item

-- ============================================================
-- 2. staff_order_queue() — add the computed tag to what a tailor's queue
-- returns. Existing callers (staffApi.js's mapQueueRow) just need to read
-- the new field, not change how they call this — but Postgres itself
-- won't let CREATE OR REPLACE change a function's return-table shape
-- (adding a column counts), so the old one has to go first.
-- ============================================================
drop function if exists public.staff_order_queue();

create or replace function public.staff_order_queue()
returns table (
  order_id           uuid,
  order_code         text,
  pickup_tag         text,
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
  select o.id, o.order_code, o.order_code || '-' || oi.position, d.name, d.img_url, oi.fabric, oi.qty, o.measure_snapshot, o.stage, o.status_label, o.expected_delivery
  from orders o
  join order_items oi on oi.order_id = o.id
  join designs d on d.id = oi.design_id
  where o.assigned_staff_id = (select s.id from staff s where s.auth_user_id = auth.uid() and s.active = true)
  order by o.stage asc, o.expected_delivery asc nulls last;
$$;
