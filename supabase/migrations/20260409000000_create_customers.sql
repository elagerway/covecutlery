-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  notes text,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'cal.com', 'booking', 'invoice')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: admin full access only
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access" ON customers
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'elagerway@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'elagerway@gmail.com');
