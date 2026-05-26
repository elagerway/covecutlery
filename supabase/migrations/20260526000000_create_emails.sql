create table emails (
  id bigserial primary key,
  message_id text unique,
  in_reply_to text,
  email_references text[],
  from_email text not null,
  from_name text,
  to_email text not null,
  cc_emails text[],
  subject text,
  text_body text,
  html_body text,
  stripped_reply text,
  direction text not null check (direction in ('inbound', 'outbound')),
  status text not null default 'new' check (status in ('new', 'read', 'auto_replied', 'responded')),
  postmark_message_id text,
  attachments jsonb not null default '[]'::jsonb,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index emails_to_created_idx on emails (to_email, created_at desc);
create index emails_in_reply_to_idx on emails (in_reply_to);
create index emails_status_idx on emails (status);

alter table emails enable row level security;
-- no policies: service role only, accessed via /api/admin/emails
