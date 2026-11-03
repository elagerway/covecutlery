-- Admin-controlled site switches, read server-side with the service role.
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- No policies: only the service role (server code) reads or writes it.
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Whether the public site offers booking and /api/cal/book accepts new bookings.
INSERT INTO site_settings (key, value) VALUES ('bookings_enabled', 'true'::jsonb)
  ON CONFLICT (key) DO NOTHING;
