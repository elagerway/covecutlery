-- App-level credentials that need runtime mutation (e.g. self-rotating OAuth tokens).
-- Service role only — no direct end-user access.
CREATE TABLE IF NOT EXISTS app_credentials (
  name        text PRIMARY KEY,
  value       text NOT NULL,
  expires_at  timestamptz,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_credentials ENABLE ROW LEVEL SECURITY;

-- Allow service role full access. End users (anon/authenticated) get nothing.
CREATE POLICY "service_role_all" ON app_credentials
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);
