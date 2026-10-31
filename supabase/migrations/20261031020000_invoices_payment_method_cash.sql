-- Allow recording cash when an invoice is marked paid by hand.
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_payment_method_check;
ALTER TABLE invoices ADD CONSTRAINT invoices_payment_method_check
  CHECK (payment_method IN ('stripe', 'etransfer', 'cash'));
