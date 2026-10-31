-- Invoices need an email OR a phone (enforced in /api/admin/invoices), not both.
-- dc29034 relaxed the API but left these NOT NULL, so single-contact invoices 500'd.
ALTER TABLE invoices ALTER COLUMN client_email DROP NOT NULL;
ALTER TABLE invoices ALTER COLUMN client_phone DROP NOT NULL;
