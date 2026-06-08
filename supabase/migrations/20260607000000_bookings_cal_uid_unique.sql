-- Bookings can originate from two places: the website booking widget
-- (/api/cal/book) and the native Cal.com booking page (synced via the
-- /api/webhooks/cal handler). Both keep the row keyed by the Cal booking uid,
-- so a unique index lets either source upsert idempotently without creating
-- duplicate jobs.
create unique index if not exists bookings_cal_booking_uid_key
  on public.bookings (cal_booking_uid);
