-- Add 'imported' as a valid source, drop and recreate the check constraint
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_source_check;
ALTER TABLE customers ADD CONSTRAINT customers_source_check
  CHECK (source IN ('manual', 'cal.com', 'booking', 'invoice', 'imported'));

-- Update existing manual records to imported
UPDATE customers SET source = 'imported' WHERE source = 'manual';
