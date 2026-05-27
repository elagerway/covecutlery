create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  course_name text not null,
  amount integer not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  payment_method text check (payment_method in ('stripe', 'etransfer')),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'cancelled')),
  stripe_session_id text,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.course_enrollments enable row level security;

create policy "Admin full access" on public.course_enrollments
  for all using (auth.jwt() ->> 'email' = 'elagerway@gmail.com');
