-- When the paid confirmation (email + SMS receipt) was sent to the customer.
--
-- Paying an invoice used to update a row and notify nobody, so there was no way
-- to tell whether a customer had been told their payment landed. Two customers
-- paid and were shown "unpaid" for weeks; one re-attempted payment five times.
-- Null means no confirmation has gone out for this invoice.
alter table public.invoices
  add column if not exists paid_notified_at timestamptz;
