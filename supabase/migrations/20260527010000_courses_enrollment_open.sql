alter table public.courses add column if not exists enrollment_open boolean not null default false;
