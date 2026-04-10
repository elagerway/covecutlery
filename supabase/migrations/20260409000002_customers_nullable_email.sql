-- Make email nullable and drop unique constraint, use id as primary key instead
-- Remove fake placeholder emails
ALTER TABLE customers ALTER COLUMN email DROP NOT NULL;

-- Drop unique constraint, add unique only for non-null real emails
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_email_key;
CREATE UNIQUE INDEX customers_email_unique ON customers (email) WHERE email IS NOT NULL;

-- Clear out placeholder emails
UPDATE customers SET email = NULL WHERE email LIKE '%@phone.local' OR email LIKE '%@gcal.local' OR email LIKE '%@unknown.local';
