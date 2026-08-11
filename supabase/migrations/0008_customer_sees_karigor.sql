-- MOUSUMI — customer can see their assigned karigor's contact info
-- Run in the SQL Editor after 0007_item_pickup_tags.sql.
--
-- Requested by the project owner (2026-08-11): once an order is assigned
-- to a tailor, the customer should be able to see that tailor's name,
-- phone and email via Track — not just "Assigned"/"Not yet assigned" as
-- it's shown today.
--
-- Scoped narrowly on purpose: this grants a customer SELECT on a `staff`
-- row only when that staff member is assigned to one of *their own*
-- orders — never the whole roster, and it stops applying the moment an
-- order gets reassigned or unassigned. RLS is row-level, not column-level,
-- so this does expose the same row's phone/email a customer would see for
-- name — that's deliberate here (the owner explicitly asked for all
-- three), not an oversight.
create policy "customers view assigned staff contact"
  on staff for select
  using (
    id in (
      select assigned_staff_id from orders
      where assigned_staff_id is not null
        and customer_id in (select id from customers where auth_user_id = auth.uid())
    )
  );
