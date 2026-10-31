-- Which payment methods an invoice offers the customer.
-- 'both' keeps the existing behaviour for all current invoices.
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS payment_options text NOT NULL DEFAULT 'both'
  CHECK (payment_options IN ('both', 'card', 'etransfer'));
