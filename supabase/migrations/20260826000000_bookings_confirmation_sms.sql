-- Bookings reach the table from two places: the website widget (/api/cal/book)
-- and Cal.com's own booking flow mirrored through /api/webhooks/cal — which now
-- includes bookings made by the Magpipe AI receptionist, since its Cal.com
-- booking function was enabled.
--
-- Only the widget path used to text the customer, so a Cal-native booking left
-- the customer with no confirmation and no self-serve reschedule link. Both
-- paths now send it, and this column is the atomic claim that stops them from
-- both sending for the same booking.
alter table public.bookings
  add column if not exists confirmation_sms_sent_at timestamptz;
