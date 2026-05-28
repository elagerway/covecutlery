#!/usr/bin/env python3
"""
One-shot Supabase data migrator: copy OLD project -> NEW project.

Uses only the Supabase Management API + PostgREST -- no psql/pg_dump required.

Source ($SUPABASE_*) and destination ($NEW_SUPABASE_*) creds read from env
(source .env.local first).

Phases:
  1. Create phantom tables on NEW (blog_posts, bookings, contact_submissions)
  2. Apply supabase/migrations/*.sql in order on NEW
  3. Recreate indexes + RLS policies for phantom tables
  4. Copy auth.users + auth.identities (preserving UUIDs)
  5. Copy public.* table data in FK-dependency order
  6. Advance sequences on NEW
  7. Verify row counts old vs new
"""
import json, os, sys, time
from pathlib import Path
import urllib.request, urllib.error


def env(k):
    v = os.environ.get(k)
    if not v:
        sys.exit(f"missing env: {k}")
    return v


OLD = dict(
    ref=env("SUPABASE_PROJECT_REF"),
    tok=env("SUPABASE_ACCESS_TOKEN"),
    url=env("NEXT_PUBLIC_SUPABASE_URL"),
    key=env("SUPABASE_SERVICE_ROLE_KEY"),
)
NEW = dict(
    ref=env("NEW_SUPABASE_PROJECT_REF"),
    tok=env("NEW_SUPABASE_ACCESS_TOKEN"),
    url=env("NEW_SUPABASE_URL"),
    key=env("NEW_SUPABASE_SERVICE_ROLE_KEY"),
)


UA = "covecutlery-migrator/1.0"


def mgmt(p, sql, allow_error=False):
    req = urllib.request.Request(
        f"https://api.supabase.com/v1/projects/{p['ref']}/database/query",
        data=json.dumps({"query": sql}).encode(),
        method="POST",
        headers={
            "Authorization": f"Bearer {p['tok']}",
            "Content-Type": "application/json",
            "User-Agent": UA,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            text = r.read()
            return json.loads(text) if text else None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        if allow_error:
            return None
        raise RuntimeError(
            f"Mgmt {e.code} on {p['ref']}: {body[:500]} | SQL: {sql[:200]}"
        )


def rest(p, method, path, body=None, extra_headers=None):
    url = f"{p['url']}/rest/v1/{path}"
    headers = {
        "apikey": p["key"],
        "Authorization": f"Bearer {p['key']}",
        "User-Agent": UA,
    }
    if extra_headers:
        headers.update(extra_headers)
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            text = r.read().decode("utf-8", "replace")
            return json.loads(text) if text else None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        raise RuntimeError(f"REST {method} {path} {e.code}: {body[:500]}")


def sql_literal(v):
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "TRUE" if v else "FALSE"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, (list, dict)):
        return "'" + json.dumps(v).replace("'", "''") + "'::jsonb"
    s = str(v).replace("'", "''")
    return "'" + s + "'"


# ----------------------------------------------------------------------------
# Phase 1: phantom tables (created outside the migrations folder)
# ----------------------------------------------------------------------------
PHANTOM_DDL = """
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text,
  excerpt text,
  meta_description text,
  featured_image_url text,
  status text default 'draft',
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  author_email text not null
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  cal_booking_uid text not null,
  stripe_session_id text,
  stripe_payment_intent_id text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  appointment_date date not null,
  appointment_time text not null,
  address text,
  deposit_amount integer not null default 5000,
  amount_charged integer,
  status text not null default 'pending_payment',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  stripe_customer_id text,
  payment_method text,
  receipt_sent_at timestamptz
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text,
  email text not null,
  service_type text,
  item_count text,
  message text,
  status text not null default 'new',
  address text
);

create index if not exists bookings_appointment_date_idx on public.bookings (appointment_date);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_stripe_session_id_idx on public.bookings (stripe_session_id);

alter table public.blog_posts enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_submissions enable row level security;

create policy "Admin full access" on public.blog_posts for all
  using (auth.jwt() ->> 'email' = 'elagerway@gmail.com')
  with check (auth.jwt() ->> 'email' = 'elagerway@gmail.com');
create policy "Public read published posts" on public.blog_posts for select
  using (status = 'published');

create policy "Admin full access" on public.bookings for all
  using (auth.jwt() ->> 'email' = 'elagerway@gmail.com')
  with check (auth.jwt() ->> 'email' = 'elagerway@gmail.com');
"""


def phase_phantom():
    print("[1/7] Creating phantom tables on new project...")
    mgmt(NEW, PHANTOM_DDL)
    print("      done")


# ----------------------------------------------------------------------------
# Phase 2: apply migration files
# ----------------------------------------------------------------------------
def phase_migrations():
    print("[2/7] Applying migration files on new project...")
    migs = sorted(Path("supabase/migrations").glob("*.sql"))
    for m in migs:
        sql = m.read_text()
        version = m.name.split("_", 1)[0]
        name = m.name.split("_", 1)[1].replace(".sql", "")
        print(f"      {m.name}")
        mgmt(NEW, sql)
        # Record in supabase_migrations tracking table
        mgmt(
            NEW,
            f"insert into supabase_migrations.schema_migrations(version, name) values ({sql_literal(version)}, {sql_literal(name)}) on conflict do nothing",
            allow_error=True,
        )
    print("      applied", len(migs), "migrations")


# ----------------------------------------------------------------------------
# Phase 3: auth.users + auth.identities (preserve UUIDs)
# ----------------------------------------------------------------------------
def get_columns(p, schema, table):
    rows = mgmt(
        p,
        f"select column_name from information_schema.columns "
        f"where table_schema='{schema}' and table_name='{table}' "
        f"and is_generated = 'NEVER' "
        f"and identity_generation is null "
        f"order by ordinal_position",
    )
    return [r["column_name"] for r in rows]


def phase_auth():
    print("[3/7] Copying auth.users + auth.identities...")
    for table in ["users", "identities"]:
        old_cols = set(get_columns(OLD, "auth", table))
        new_cols = set(get_columns(NEW, "auth", table))
        common = sorted(old_cols & new_cols)
        cols_sql = ", ".join(f'"{c}"' for c in common)
        rows = mgmt(OLD, f"select {cols_sql} from auth.{table}")
        if not rows:
            print(f"      auth.{table}: 0 rows"); continue
        for row in rows:
            values = ", ".join(sql_literal(row[c]) for c in common)
            mgmt(
                NEW,
                f"insert into auth.{table} ({cols_sql}) values ({values}) on conflict (id) do nothing",
            )
        print(f"      auth.{table}: {len(rows)} rows")


# ----------------------------------------------------------------------------
# Phase 4: copy public.* data in FK-dependency order
# ----------------------------------------------------------------------------
INSERT_ORDER = [
    # Independent
    "customers",
    "courses",
    "achievements",
    "app_credentials",
    "profiles",
    "contact_submissions",
    "invoices",
    "bookings",
    "blog_posts",
    "campaigns",
    "magpipe_call_logs",
    "analytics_events",
    "sms_message_reads",
    "historical_sms_messages",
    "emails",
    "course_enrollments",
    # Tier 2 (depend on courses)
    "modules",
    "certificates",
    "course_invites",
    "user_enrollments",
    # Tier 3 (depend on modules)
    "lessons",
    "module_quizzes",
    # Tier 4
    "user_progress",
    "module_quiz_results",
    "user_achievements",
    "xp_log",
]


def copy_table(table):
    # Empty out any migration-seeded rows so we don't collide on unique constraints.
    mgmt(NEW, f"truncate public.{table} restart identity cascade", allow_error=True)
    PAGE = 500
    offset = 0
    total = 0
    while True:
        rows = rest(
            OLD,
            "GET",
            f"{table}?select=*&offset={offset}&limit={PAGE}",
        )
        if not rows:
            break
        rest(
            NEW,
            "POST",
            table,
            body=rows,
            extra_headers={"Prefer": "return=minimal"},
        )
        total += len(rows)
        if len(rows) < PAGE:
            break
        offset += PAGE
    return total


def phase_data():
    print("[4/7] Copying public.* data...")
    # Re-establish default Supabase grants on public (lost on schema reset)
    mgmt(
        NEW,
        """
        grant usage on schema public to anon, authenticated, service_role;
        grant all on all tables in schema public to anon, authenticated, service_role;
        grant all on all sequences in schema public to anon, authenticated, service_role;
        grant all on all functions in schema public to anon, authenticated, service_role;
        alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
        alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
        alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
        notify pgrst, 'reload schema';
        """,
    )
    time.sleep(2)
    for t in INSERT_ORDER:
        n = copy_table(t)
        print(f"      {t}: {n} rows")


# ----------------------------------------------------------------------------
# Phase 5: reset sequences
# ----------------------------------------------------------------------------
def phase_sequences():
    print("[5/7] Resetting sequences...")
    seqs = mgmt(
        NEW,
        """
        select n.nspname || '.' || c.relname as seq,
               t.relname as tbl,
               a.attname as col
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        join pg_depend d on d.objid = c.oid
        join pg_class t on t.oid = d.refobjid
        join pg_namespace tn on tn.oid = t.relnamespace
        join pg_attribute a on a.attrelid = t.oid and a.attnum = d.refobjsubid
        where c.relkind = 'S' and tn.nspname = 'public'
        """,
    )
    for s in seqs:
        mgmt(
            NEW,
            f"select setval('{s['seq']}', "
            f"coalesce((select max({s['col']}) from public.{s['tbl']}), 1), "
            f"(select max({s['col']}) is not null from public.{s['tbl']}))",
            allow_error=True,
        )
    print(f"      reset {len(seqs)} sequences")


# ----------------------------------------------------------------------------
# Phase 6: verify
# ----------------------------------------------------------------------------
def phase_verify():
    print("[6/7] Verifying row counts...")
    tables = mgmt(
        NEW,
        "select table_name from information_schema.tables "
        "where table_schema='public' and table_type='BASE TABLE' "
        "order by table_name",
    )
    bad = []
    print(f"      {'TABLE':<30} {'OLD':>10} {'NEW':>10}  STATUS")
    for t in tables:
        tn = t["table_name"]
        old = mgmt(OLD, f"select count(*)::int as n from public.{tn}", allow_error=True)
        new = mgmt(NEW, f"select count(*)::int as n from public.{tn}", allow_error=True)
        ov = old[0]["n"] if old else None
        nv = new[0]["n"] if new else None
        status = "OK" if ov == nv else "MISMATCH"
        if ov != nv:
            bad.append((tn, ov, nv))
        print(f"      {tn:<30} {ov!s:>10} {nv!s:>10}  {status}")
    for t in ["users", "identities"]:
        old = mgmt(OLD, f"select count(*)::int as n from auth.{t}")[0]["n"]
        new = mgmt(NEW, f"select count(*)::int as n from auth.{t}")[0]["n"]
        status = "OK" if old == new else "MISMATCH"
        if old != new:
            bad.append((f"auth.{t}", old, new))
        print(f"      {('auth.' + t):<30} {old:>10} {new:>10}  {status}")
    return bad


if __name__ == "__main__":
    print(f"SOURCE: {OLD['url']}")
    print(f"DEST:   {NEW['url']}")
    print()
    t0 = time.time()
    phase_phantom()
    phase_migrations()
    phase_auth()
    phase_data()
    phase_sequences()
    bad = phase_verify()
    elapsed = time.time() - t0
    print(f"\n[7/7] Done in {elapsed:.1f}s.")
    if bad:
        print(f"\n{len(bad)} MISMATCHES:")
        for tn, ov, nv in bad:
            print(f"  {tn}: old={ov} new={nv}")
        sys.exit(1)
    print("All row counts match.")
