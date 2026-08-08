-- MOUSUMI — auth helper functions for phone+OTP login
-- Run in the SQL Editor after 0001_init.sql.
--
-- Why these exist: the anon/publishable key can only do what RLS allows for
-- an ordinary row, and a brand-new session has no customer row yet — so it
-- can't even check "does this phone already exist?" through a normal
-- select. These two functions run with elevated privilege (`security
-- definer`) to do exactly two narrow, safe things and nothing else:
--   1. answer "is this phone registered?" without exposing any customer data
--   2. link the calling session to a customer row (creating it if new)

-- ============================================================
-- phone_is_registered — used before OTP entry, to route to the
-- login screen or the register screen. Leaks no data, just true/false.
-- ============================================================
create or replace function public.phone_is_registered(p_phone text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from customers where phone = p_phone);
$$;

grant execute on function public.phone_is_registered(text) to anon, authenticated;

-- ============================================================
-- claim_customer — links the CURRENT session (auth.uid()) to the
-- customers row for p_phone: creates it if it doesn't exist yet, or
-- re-points an existing row's auth_user_id to this session if it does.
--
-- ⚠️ TEST-MODE SECURITY NOTE — read this before going live:
-- this function trusts whatever phone number the caller passes in. There
-- is currently no real SMS verification behind it (the OTP the frontend
-- checks against is a fixed test code), so right now anyone who knows —
-- or guesses — a phone number already in the table can "log in" as that
-- customer and see their saved measurements/addresses/orders. This is
-- fine for development, but this function (and the frontend OTP check)
-- MUST be replaced with real Supabase Phone Auth + a real SMS provider
-- before this handles any real customer's data.
-- ============================================================
create or replace function public.claim_customer(
  p_phone text,
  p_name text default '',
  p_referral_code text default null
)
returns customers
language plpgsql
security definer
set search_path = public
as $$
declare
  result customers;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  update customers set auth_user_id = auth.uid()
  where phone = p_phone
  returning * into result;

  if not found then
    insert into customers (auth_user_id, phone, name, referral_code)
    values (auth.uid(), p_phone, coalesce(p_name, ''), p_referral_code)
    returning * into result;
  end if;

  return result;
end;
$$;

grant execute on function public.claim_customer(text, text, text) to anon, authenticated;
