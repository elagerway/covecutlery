-- Cove Blades sends its own appointment reminders (/api/cron/booking-reminders)
-- rather than relying on Cal.com workflows. The Cal.com "sms_attendee" workflows
-- required an `smsReminderNumber` booking-field response that the v2 bookings API
-- (cal-api-version 2024-08-13) gives no way to supply, so every widget booking
-- 400'd with `responses - {smsReminderNumber}error_required_field`. The workflows
-- are now detached from the event type and these columns drive the replacement.
--
-- Nullable and set only once per booking, so they double as the idempotency guard
-- for a cron that runs every 15 minutes.
alter table public.bookings
  add column if not exists reminder_24h_sent_at timestamptz,
  add column if not exists reminder_1h_sent_at timestamptz;

-- The cron scans only upcoming, still-confirmed bookings.
create index if not exists bookings_reminder_scan_idx
  on public.bookings (appointment_date)
  where status = 'confirmed';
