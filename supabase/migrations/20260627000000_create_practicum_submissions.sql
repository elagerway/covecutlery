-- Practicum technique-video submissions.
-- Students upload (or link) a video of their sharpening technique after the
-- practicum; the admin (Erik) reviews it, and the course certificate is gated on
-- an approved submission. See GitHub issue #23.
-- Idempotent: safe to re-run.

create table if not exists public.practicum_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  -- exactly one video source is required (enforced below): an uploaded file in
  -- the private 'practicum-submissions' bucket, or a pasted external link.
  storage_path text,
  external_url text,
  student_note text not null default '',
  status text not null default 'submitted'
    check (status in ('submitted', 'in_review', 'approved', 'changes_requested')),
  reviewer_id uuid references auth.users(id) on delete set null,
  reviewer_notes text not null default '',
  reviewed_at timestamptz,
  submitted_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  constraint practicum_submissions_one_video_source
    check (storage_path is not null or external_url is not null)
);

-- Latest submission per (user, course); status queue for the admin review list.
create index if not exists practicum_submissions_user_course_idx
  on public.practicum_submissions (user_id, course_id, submitted_at desc);
create index if not exists practicum_submissions_status_idx
  on public.practicum_submissions (status);

alter table public.practicum_submissions enable row level security;

-- Students can read their own submissions (status + reviewer feedback).
drop policy if exists "own practicum submissions are viewable" on public.practicum_submissions;
create policy "own practicum submissions are viewable"
  on public.practicum_submissions for select
  using (auth.uid() = user_id);

-- Students can insert a submission for a course they're enrolled in. Status
-- transitions and review fields are written server-side via the service role
-- (which bypasses RLS); there is intentionally NO update/delete policy here, so
-- clients cannot self-approve.
drop policy if exists "enrolled users can submit practicum videos" on public.practicum_submissions;
create policy "enrolled users can submit practicum videos"
  on public.practicum_submissions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.user_enrollments e
      where e.user_id = auth.uid() and e.course_id = practicum_submissions.course_id
    )
  );

-- Private bucket for uploaded technique videos. Admin views via short-lived
-- signed URLs minted with the service role (mirrors the 'certificates' bucket).
insert into storage.buckets (id, name, public)
values ('practicum-submissions', 'practicum-submissions', false)
on conflict (id) do nothing;

-- Students may upload to / read only their own folder: {user_id}/{course_id}/...
drop policy if exists "practicum videos: upload own folder" on storage.objects;
create policy "practicum videos: upload own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'practicum-submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "practicum videos: read own folder" on storage.objects;
create policy "practicum videos: read own folder"
  on storage.objects for select
  using (
    bucket_id = 'practicum-submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
