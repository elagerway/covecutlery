-- Create invoices table for invoice management system
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  client_address text,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal integer NOT NULL DEFAULT 0,
  notes text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue')),
  payment_method text CHECK (payment_method IN ('stripe', 'etransfer')),
  due_date date NOT NULL,
  sent_at timestamptz,
  paid_at timestamptz,
  stripe_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: admin full access only
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access" ON invoices
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'elagerway@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'elagerway@gmail.com');
