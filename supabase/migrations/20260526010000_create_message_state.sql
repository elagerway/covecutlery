-- Local read state for SMS messages. Magpipe doesn't track who-read-what
-- per-message for us, and we need this to power unread badges + the inbox UI.
-- Works for both Magpipe message IDs (UUIDs) and SignalWire SIDs (strings).
create table sms_message_reads (
  message_id text primary key,
  read_at timestamptz not null default now()
);

-- Historical SMS messages from SignalWire, imported via the backfill script.
-- These predate the Magpipe migration and live only in SignalWire's archive
-- until backfilled into our DB. New (post-Apr-30) messages still flow through
-- Magpipe live API — these two sources are merged at query time.
create table historical_sms_messages (
  id bigserial primary key,
  external_id text unique not null,
  from_number text not null,
  to_number text not null,
  body text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  status text,
  date_sent timestamptz not null,
  imported_at timestamptz not null default now()
);

create index historical_sms_messages_date_idx on historical_sms_messages (date_sent desc);
create index historical_sms_messages_from_idx on historical_sms_messages (from_number);
create index historical_sms_messages_to_idx on historical_sms_messages (to_number);

alter table sms_message_reads enable row level security;
alter table historical_sms_messages enable row level security;
-- no policies: service role only, accessed via /api/admin/messages
