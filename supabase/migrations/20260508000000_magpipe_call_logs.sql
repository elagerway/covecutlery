create table if not exists public.magpipe_call_logs (
  id uuid default gen_random_uuid() primary key,
  event_type text not null,
  call_id text,
  agent_id text,
  from_number text,
  to_number text,
  direction text,
  duration_seconds integer,
  status text,
  transcript text,
  summary text,
  recording_url text,
  payload jsonb not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_magpipe_call_logs_call_id on public.magpipe_call_logs(call_id);
create index if not exists idx_magpipe_call_logs_from_number on public.magpipe_call_logs(from_number);
create index if not exists idx_magpipe_call_logs_created_at on public.magpipe_call_logs(created_at desc);

alter table public.magpipe_call_logs enable row level security;
