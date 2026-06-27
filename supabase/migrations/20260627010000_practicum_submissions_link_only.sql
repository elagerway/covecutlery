-- Practicum submissions are link-only (YouTube / Vimeo) — we don't store
-- students' large video files. Drop the upload bucket's policies + the
-- storage_path column and require an external video link. See GitHub issue #23.
-- (The 'practicum-submissions' bucket itself is removed via the Storage API,
-- since storage tables can't be mutated with SQL.)
-- Idempotent: safe to re-run.

drop policy if exists "practicum videos: upload own folder" on storage.objects;
drop policy if exists "practicum videos: read own folder" on storage.objects;

-- Submissions now always carry an external link; drop the file path + the
-- "one of file/link" constraint, and require external_url.
alter table public.practicum_submissions
  drop constraint if exists practicum_submissions_one_video_source;
alter table public.practicum_submissions
  drop column if exists storage_path;
alter table public.practicum_submissions
  alter column external_url set not null;
