/*
  # Fix Settings Tables Schema

  1. Changes
    - Add missing columns to system_settings table
    - Add missing columns to database_settings table
    
  2. Security
    - Maintain existing RLS policies
    - Ensure data consistency
*/

-- Add missing columns to system_settings
ALTER TABLE system_settings
ADD COLUMN IF NOT EXISTS system_name text NOT NULL DEFAULT 'RentAssist Admin',
ADD COLUMN IF NOT EXISTS default_currency text NOT NULL DEFAULT 'GHS',
ADD COLUMN IF NOT EXISTS default_language text NOT NULL DEFAULT 'en',
ADD COLUMN IF NOT EXISTS smtp_server text,
ADD COLUMN IF NOT EXISTS smtp_port integer,
ADD COLUMN IF NOT EXISTS sender_email text,
ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS system_alerts boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS application_updates boolean DEFAULT true;

-- Add missing columns to database_settings
ALTER TABLE database_settings
ADD COLUMN IF NOT EXISTS backup_frequency text NOT NULL DEFAULT 'daily' CHECK (backup_frequency IN ('daily', 'weekly', 'monthly')),
ADD COLUMN IF NOT EXISTS backup_retention_period integer NOT NULL DEFAULT 30;

-- Insert default system settings if not exists
INSERT INTO system_settings (
  id,
  system_name,
  default_currency,
  default_language,
  smtp_server,
  smtp_port,
  sender_email,
  email_notifications,
  system_alerts,
  application_updates
)
SELECT 
  gen_random_uuid(),
  'RentAssist Admin',
  'GHS',
  'en',
  'smtp.hostinger.com',
  465,
  'info@sheltercrest.org',
  true,
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM system_settings);

-- Insert default database settings if not exists
INSERT INTO database_settings (
  id,
  backup_frequency,
  backup_retention_period
)
SELECT 
  gen_random_uuid(),
  'daily',
  30
WHERE NOT EXISTS (SELECT 1 FROM database_settings);