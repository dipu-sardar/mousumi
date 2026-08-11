-- MOUSUMI — order confirmation step
-- Run in the SQL Editor after 0005_staff_panel.sql.
--
-- Requested by the project owner (2026-08-11): every order should sit in a
-- "Pending" state until the owner explicitly confirms it — before any
-- pickup or stitching work starts — rather than being treated as already
-- underway the moment it's placed. Two new stages go in at the front:
--
--   0 Pending   (new — the default a freshly placed order starts at)
--   1 Confirmed (new)
--   2 Fabric picked up  (was 0)
--   3 Cutting           (was 1)
--   4 Stitching         (was 2)
--   5 Ready             (was 3)
--   6 Delivered         (was 4)
--
-- src/data/catalog.js's STAGES array already has the two new entries at
-- the front; every place that reads `orders.stage` as a plain integer
-- (selectors.js, ordersApi.js, staffApi.js) shifts automatically once this
-- runs — the only hardcoded index that needed a source change was
-- "stage >= 4 means delivered", now "stage >= 6".
--
-- (A Telegram notification on new-order-insert is the next piece of this
-- flow, but that's a separate integration the owner will wire up later —
-- nothing here depends on it existing.)

-- ============================================================
-- 1. Widen the range check — 0001_init.sql's inline `check (stage between
-- 0 and 4)` is named orders_stage_check by Postgres's default naming for
-- an unnamed column constraint.
-- ============================================================
alter table orders drop constraint orders_stage_check;
alter table orders add constraint orders_stage_check check (stage between 0 and 6);

-- A fresh order's default status_label should read "Pending", matching
-- the new stage-0 label (it was "Fabric pending", written for the old
-- stage-0 meaning).
alter table orders alter column status_label set default 'Pending';

-- ============================================================
-- 2. staff_update_order_stage() — widen the bound to match, and add the
-- admin-only guard on the two new stages. Same function signature as
-- 0005, so `create or replace` redefines it in place; no drop needed.
-- ============================================================
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
  if p_stage < 0 or p_stage > 6 then
    raise exception 'stage must be between 0 and 6';
  end if;
  if not is_admin() and p_stage < 2 then
    raise exception 'only admin can set the pending/confirmed stages';
  end if;
  if not is_admin() and not exists (select 1 from orders where id = p_order_id and assigned_staff_id = my_staff_id) then
    raise exception 'this order is not assigned to you';
  end if;
  update orders set stage = p_stage, status_label = p_status_label where id = p_order_id;
end;
$$;
