create table analytics_events (
  id bigserial primary key,
  name text not null,
  props jsonb not null default '{}'::jsonb,
  path text,
  referrer text,
  session_id text,
  created_at timestamptz not null default now()
);

create index analytics_events_created_at_idx on analytics_events (created_at desc);
create index analytics_events_name_created_at_idx on analytics_events (name, created_at desc);

alter table analytics_events enable row level security;
-- no policies: only the service role (via /api/events) writes and reads
