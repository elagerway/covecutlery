-- Mobile bookings now require the customer to declare how many pieces they are
-- bringing, validated against their area's minimum in /api/cal/book.
--
-- Previously the count lived only in free-text notes, so nothing could check it:
-- a Surrey customer booked a visit for four pieces against a 15-piece minimum,
-- and it was only caught by hand after the fact.
--
-- Nullable because every booking written before this column existed has no
-- declared count, and bookings mirrored from Cal.com's own booking page still
-- won't have one.
alter table public.bookings
  add column if not exists piece_count integer;
