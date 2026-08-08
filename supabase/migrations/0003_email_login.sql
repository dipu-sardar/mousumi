-- MOUSUMI — support email+OTP login (phone stays optional for later)
-- Run in the SQL Editor after 0002_auth_helpers.sql.

-- phone was required in 0001; email-first customers won't have one yet.
-- Dropping the '' default too — NULL (not '') is what lets many customers
-- each have "no phone" without violating the unique constraint.
alter table customers alter column phone drop not null;
alter table customers alter column phone drop default;
update customers set phone = null where phone = '';

-- Same idea for email, plus make it unique so it can identify a customer.
alter table customers alter column email drop not null;
alter table customers alter column email drop default;
update customers set email = null where email = '';
alter table customers add constraint customers_email_key unique (email);

-- The phone flow (0002) creates its row via the claim_customer() RPC,
-- because an anonymous session isn't "really" verified yet. Email OTP is a
-- real verified identity, so a normal RLS insert policy is enough: a
-- signed-in user may create their own row, and only their own.
create policy "customers can insert own row"
  on customers for insert
  with check (auth.uid() = auth_user_id);
