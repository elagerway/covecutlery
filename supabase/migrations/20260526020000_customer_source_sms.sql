-- Add 'sms' as a valid customer source for customers auto-created from
-- inbound text messages to 604-210-8180.
alter table customers drop constraint if exists customers_source_check;
alter table customers add constraint customers_source_check
  check (source in ('manual', 'cal.com', 'booking', 'invoice', 'imported', 'sms'));
