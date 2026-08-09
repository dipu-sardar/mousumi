-- MOUSUMI — real order creation goes live
-- Run in the SQL Editor after 0003_email_login.sql.
--
-- Three things, confirmed with the project owner first (2026-08-09):
--   1. Seed `designs` with the real catalogue (8 items, ৳650–২৬০০) — this
--      IS the real sellable catalogue, not placeholder, so order_items can
--      finally reference real rows instead of failing their foreign key.
--   2. Seed `promo_codes` with the three real live offers (EID26, FIRST15,
--      BLOUSE2).
--   3. Fix a gap 0001 left in RLS: `order_items` had a SELECT policy but no
--      INSERT policy, so a customer placing an order could never actually
--      write their line items. Also add order-code auto-generation so the
--      frontend doesn't have to invent "MSM-2026-XXXX" itself.

-- ============================================================
-- 1. designs — the real catalogue
-- ============================================================
insert into designs (id, name, short, price, days, category, tone, fabric_note, description, img_url, gallery, active) values
  ('d0', 'OLIVE SEQUIN' || chr(10) || 'STRAIGHT KURTI', 'Olive Sequin Straight Kurti', 1650, 6, 'PARTY', '#DDE7C4', 'Sequin-dotted viscose · side slits',
    'Floor-length straight kurti in olive viscose scattered with tiny sequins. Square neckline, full sleeves, high side slits and covered back-button placket.',
    '/assets/olive_kurti_full.png',
    array['/assets/olive_kurti_full.png','/assets/olive_kurti_neck.png','/assets/olive_kurti_back.png','/assets/olive_kurti_detail.png'], true),
  ('d1', 'EMBROIDERED' || chr(10) || 'SALWAR KAMEEZ', 'Embroidered Salwar Kameez', 1450, 5, 'SALWAR-KAMEEZ', '#E4F0D2', 'Cotton or georgette · lining included',
    'Three-piece kameez with a hand-embroidered yoke, side slits and a matching dupatta finish. Cut to your saved measurements.',
    '/assets/hero_front.png',
    array['/assets/hero_front.png','/assets/hero_back.png','/assets/hero_pose.png'], true),
  ('d2', 'OFFICE KURTI' || chr(10) || 'WITH PANTS', 'Office Kurti with Pants', 1200, 4, 'OFFICE', '#EBE4F6', 'Linen blend · crease resistant',
    'A straight-cut kurti with a mandarin collar and tapered trousers — built for long working days and easy washing.',
    '/assets/hero_pose.png',
    array['/assets/hero_pose.png','/assets/hero_front.png','/assets/hero_sitting.png'], true),
  ('d3', 'PARTY MAXI' || chr(10) || 'GOWN', 'Party Maxi Gown', 2600, 7, 'PARTY', '#F5E3E6', 'Silk or velvet · full lining',
    'Floor-length gown with a fitted bodice, concealed zip and a flared skirt panel. Finished with hand-stitched hems.',
    '/assets/summer_banner.png',
    array['/assets/summer_banner.png','/assets/hero_sitting.png'], true),
  ('d4', 'DESIGNER' || chr(10) || 'BLOUSE', 'Designer Blouse', 650, 3, 'BLOUSE', '#FBEFD2', 'Your saree fabric welcome',
    'Fitted blouse with princess seams, piped neckline and adjustable back closure — stitched from your own saree fabric if you prefer.',
    '/assets/hero_back.png',
    array['/assets/hero_back.png','/assets/hero_front.png'], true),
  ('d5', 'EVERYDAY COTTON' || chr(10) || 'KAMEEZ', 'Everyday Cotton Kameez', 900, 4, 'SALWAR-KAMEEZ', '#DCEBDD', 'Breathable cotton · daily wear',
    'A relaxed daily kameez with deep pockets, side vents and a soft round neck. The most reordered design in the shop.',
    '/assets/hero_sitting.png',
    array['/assets/hero_sitting.png','/assets/hero_pose.png'], true),
  ('d6', 'FLARED PARTY' || chr(10) || 'MIDI', 'Flared Party Midi', 1800, 6, 'PARTY', '#F1E8DA', 'Chiffon over cotton lining',
    'Mid-length flared dress with gathered sleeves and a fabric belt — a lighter option for daytime functions.',
    '/assets/summer_banner.png',
    array['/assets/summer_banner.png','/assets/hero_front.png'], true),
  ('d7', 'STRAIGHT OFFICE' || chr(10) || 'SHIRT DRESS', 'Office Shirt Dress', 1350, 5, 'OFFICE', '#E0F0EC', 'Poplin · button-through',
    'Button-through shirt dress with a collar stand, roll-up sleeves and a waist tie that can be removed.',
    '/assets/hero_front.png',
    array['/assets/hero_front.png','/assets/hero_pose.png'], true),
  ('d8', 'SILK PARTY' || chr(10) || 'BLOUSE', 'Silk Party Blouse', 1100, 4, 'BLOUSE', '#F3E6F0', 'Silk · hook-and-eye back',
    'Evening blouse in silk with a scooped back, covered hooks and boning at the side seams for a clean line.',
    '/assets/hero_back.png',
    array['/assets/hero_back.png','/assets/summer_banner.png'], true)
on conflict (id) do nothing;

-- ============================================================
-- 2. promo_codes — the three live offers
-- ============================================================
insert into promo_codes (code, description, discount_amount, discount_percent, active, expires_at) values
  ('EID26', 'On any order above ৳1000 placed before 20 August.', 200, null, true, '2026-08-20 23:59:59+06'),
  ('FIRST15', 'For new customers — applies to stitching charge only.', null, 15, true, null),
  ('BLOUSE2', 'Stitch two designer blouses in one pickup.', null, null, true, null)
on conflict (code) do nothing;

-- ============================================================
-- 3a. order_items — 0001 forgot the INSERT policy, so a customer could
-- never actually write their own line items. Add it.
-- ============================================================
create policy "customers create own order items"
  on order_items for insert
  with check (order_id in (
    select id from orders where customer_id in (
      select id from customers where auth_user_id = auth.uid()
    )
  ));

-- ============================================================
-- 3b. orders.order_code auto-fill — "MSM-<year>-<0000>", continuing on
-- from the highest demo order code (…0148) so real orders don't collide
-- with it if the demo data is ever eyeballed side by side.
-- ============================================================
create sequence if not exists orders_code_seq start 149;

create or replace function public.set_order_code()
returns trigger
language plpgsql
as $$
begin
  if new.order_code is null or new.order_code = '' then
    new.order_code := 'MSM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('orders_code_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger orders_set_code
  before insert on orders
  for each row
  execute function public.set_order_code();
