-- MOUSUMI — initial schema
-- Applied 2026-08-08. Run this once in the Supabase SQL Editor (or via the
-- Supabase CLI) on a fresh project. See supabase/README.md for how future
-- changes get their own numbered migration file instead of editing this one.

create extension if not exists "pgcrypto"; -- gives us gen_random_uuid()

-- ============================================================
-- customers — one row per phone number, linked to Supabase Auth
-- ============================================================
create table customers (
  id             uuid primary key default gen_random_uuid(),
  auth_user_id   uuid unique references auth.users (id) on delete set null,
  phone          text unique not null,          -- "01712-000000" style, pretty-printed
  name           text not null default '',
  email          text not null default '',
  whatsapp       text not null default '',
  gender         text not null default '',
  dob            text not null default '',
  city           text not null default 'Barishal',
  language       text not null default 'Bangla',
  referral_code  text unique,
  joined_at      timestamptz not null default now()
);

-- ============================================================
-- measurement_profiles — a customer can save more than one
-- ============================================================
create table measurement_profiles (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references customers (id) on delete cascade,
  name         text not null,
  length       numeric, shoulder numeric, bust numeric, waist numeric,
  hip          numeric, sleeve numeric, armhole numeric, neck_depth numeric,
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- addresses — pickup / delivery addresses a customer saved
-- ============================================================
create table addresses (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references customers (id) on delete cascade,
  label        text not null,
  line         text not null,
  phone        text not null default '',
  note         text not null default '',
  is_default   boolean not null default false
);

-- ============================================================
-- designs — the catalogue. You (or staff) manage this, not customers.
-- ============================================================
create table designs (
  id           text primary key,      -- short slug, e.g. 'd0', 'olive-sequin-kurti'
  name         text not null,         -- display name, may contain a line break
  short        text not null,
  price        integer not null,
  days         integer not null,
  category     text not null,
  tone         text not null,         -- hex card colour, e.g. '#DDE7C4'
  fabric_note  text not null default '',
  description  text not null default '',
  img_url      text not null,
  gallery      text[] not null default '{}',
  active       boolean not null default true
);

-- ============================================================
-- promo_codes
-- ============================================================
create table promo_codes (
  code              text primary key,
  description       text not null default '',
  discount_amount   integer,     -- flat ৳ off, or...
  discount_percent  numeric,     -- ...% off (use one or the other)
  active            boolean not null default true,
  expires_at        timestamptz
);

-- ============================================================
-- staff — riders / measurers / tailors / admins
-- ============================================================
create table staff (
  id      uuid primary key default gen_random_uuid(),
  name    text not null,
  phone   text not null,
  role    text not null check (role in ('measurer', 'rider', 'tailor', 'admin')),
  active  boolean not null default true
);

-- ============================================================
-- orders — one row per placed order
-- ============================================================
create table orders (
  id                      uuid primary key default gen_random_uuid(),
  order_code              text unique not null,   -- "MSM-2026-0149" style, shown to the customer
  customer_id             uuid not null references customers (id),

  measure_method          text not null default 'saved'
                            check (measure_method in ('saved', 'manual', 'home')),
  measurement_profile_id  uuid references measurement_profiles (id),
  measure_snapshot        jsonb,   -- the 8 measurements as they were AT ORDER TIME
                                    -- (frozen copy — a profile edited later must not change past orders)

  pickup_day     text,
  pickup_slot    text,
  address_id     uuid references addresses (id),

  payment_method  text,
  promo_code      text references promo_codes (code),
  subtotal        integer not null default 0,
  discount        integer not null default 0,
  total           integer not null default 0,
  advance_paid    integer not null default 0,
  pay_status      text not null default 'Unpaid'
                    check (pay_status in ('Unpaid', 'Partial', 'Paid')),

  stage             integer not null default 0 check (stage between 0 and 4),
  status_label      text not null default 'Fabric pending',
  assigned_staff_id uuid references staff (id),

  created_at        timestamptz not null default now(),
  expected_delivery date,
  delivered_at       timestamptz
);

-- ============================================================
-- order_items — every order has 1+ rows here (single "Order Now" or a
-- multi-item cart checkout both go through this table the same way)
-- ============================================================
create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders (id) on delete cascade,
  design_id   text not null references designs (id),
  fabric      text not null default 'Cotton',
  qty         integer not null default 1,
  unit_price  integer not null
);

-- ============================================================
-- reviews
-- ============================================================
create table reviews (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid references orders (id),
  customer_id  uuid references customers (id),
  stars        integer not null check (stars between 1 and 5),
  text         text not null,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- Row Level Security — every table starts locked down; policies below
-- open exactly the access each role needs.
-- ============================================================
alter table customers               enable row level security;
alter table measurement_profiles    enable row level security;
alter table addresses               enable row level security;
alter table designs                 enable row level security;
alter table promo_codes             enable row level security;
alter table staff                   enable row level security;
alter table orders                  enable row level security;
alter table order_items             enable row level security;
alter table reviews                 enable row level security;

-- Catalogue & active offers: public, read-only (needed before login too)
create policy "designs are publicly readable"
  on designs for select using (active = true);

create policy "active promo codes are publicly readable"
  on promo_codes for select using (active = true);

create policy "reviews are publicly readable"
  on reviews for select using (true);

-- A logged-in customer can see and edit only their own row
create policy "customers view own row"
  on customers for select using (auth.uid() = auth_user_id);
create policy "customers update own row"
  on customers for update using (auth.uid() = auth_user_id);

-- ...and only their own profiles / addresses / orders / order items / reviews
create policy "customers manage own measurement profiles"
  on measurement_profiles for all
  using (customer_id in (select id from customers where auth_user_id = auth.uid()));

create policy "customers manage own addresses"
  on addresses for all
  using (customer_id in (select id from customers where auth_user_id = auth.uid()));

create policy "customers view own orders"
  on orders for select
  using (customer_id in (select id from customers where auth_user_id = auth.uid()));
create policy "customers create own orders"
  on orders for insert
  with check (customer_id in (select id from customers where auth_user_id = auth.uid()));

create policy "customers view own order items"
  on order_items for select
  using (order_id in (
    select id from orders where customer_id in (
      select id from customers where auth_user_id = auth.uid()
    )
  ));

create policy "customers write own reviews"
  on reviews for insert
  with check (customer_id in (select id from customers where auth_user_id = auth.uid()));

-- staff table + staff's ability to update order stage/status are deliberately
-- left out of this migration — that needs a staff-role design decision first
-- (see the "staff panel" step in README.md). Nobody but the project owner
-- (via the Supabase dashboard) can read/write `staff` until then.
