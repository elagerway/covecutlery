-- Add address column for training and other intake forms that need a validated address
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS address text;
