-- Migration: Add new columns to business_types and global_services
-- Run: psql $DATABASE_URL -f scripts/migration-taxonomy-fields.sql

-- business_types: add emoji, description, sort_order
ALTER TABLE business_types ADD COLUMN IF NOT EXISTS emoji TEXT;
ALTER TABLE business_types ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE business_types ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- global_services: add default_price, default_description
ALTER TABLE global_services ADD COLUMN IF NOT EXISTS default_price NUMERIC(10,2);
ALTER TABLE global_services ADD COLUMN IF NOT EXISTS default_description TEXT;

-- Quick verification
SELECT 'business_types columns:' as info, column_name
FROM information_schema.columns
WHERE table_name = 'business_types'
ORDER BY ordinal_position;

SELECT 'global_services columns:' as info, column_name
FROM information_schema.columns
WHERE table_name = 'global_services'
ORDER BY ordinal_position;
