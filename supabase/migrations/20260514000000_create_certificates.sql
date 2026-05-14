-- Training certificates issued to students by admins.

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  short_code text not null unique,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  recipient_name text not null,
  course_title text not null,
  issued_date date not null,
  issued_by uuid references auth.users(id) on delete set null,
  pdf_path text not null,
  revoked_at timestamptz,
  email_sent_at timestamptz,
  created_at timestamptz default now() not null
);

create index idx_certificates_user on public.certificates(user_id);
create index idx_certificates_course on public.certificates(course_id);

alter table public.certificates enable row level security;

create policy "Users view own certificates"
  on public.certificates
  for select
  using (auth.uid() = user_id);

-- All inserts/updates/deletes go through service-role admin routes.
-- No user-level write policies.

-- Private storage bucket for the rendered PDFs.
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', false)
on conflict (id) do nothing;
