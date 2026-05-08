-- Course invites table
create table public.course_invites (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  email text not null,
  token text not null unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null,
  accepted_at timestamptz,
  expires_at timestamptz default (now() + interval '30 days') not null
);

-- Indexes
create index idx_course_invites_token on public.course_invites(token);
create index idx_course_invites_email on public.course_invites(email);
create index idx_course_invites_course_id on public.course_invites(course_id);
create unique index idx_course_invites_email_course_pending on public.course_invites(email, course_id)
  where status = 'pending';

-- RLS
alter table public.course_invites enable row level security;
create policy "Anyone can look up invites" on public.course_invites for select using (true);

-- Remove self-enrollment — enrollment now happens via invite callback with service role
drop policy if exists "Users can enroll themselves" on public.user_enrollments;
