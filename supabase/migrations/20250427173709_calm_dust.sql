/*
  # Fix Missing Columns in Settings Tables

  1. Changes
    - Add missing 'application_updates' column to system_settings table
    - Add missing 'backup_frequency' column to database_settings table
    - Insert default values if tables are empty
    
  2. Security
    - Maintain existing RLS policies
    - Ensure proper constraints and default values
*/

-- Add missing column to system_settings if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'system_settings' AND column_name = 'application_updates'
  ) THEN
    ALTER TABLE system_settings 
    ADD COLUMN application_updates boolean DEFAULT true;
  END IF;
END $$;

-- Add missing column to database_settings if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'database_settings' AND column_name = 'backup_frequency'
  ) THEN
    ALTER TABLE database_settings 
    ADD COLUMN backup_frequency text DEFAULT 'daily' CHECK (backup_frequency IN ('daily', 'weekly', 'monthly'));
  END IF;
END $$;

-- Insert default system settings if table is empty
INSERT INTO system_settings (
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

-- Insert default database settings if table is empty
INSERT INTO database_settings (
  backup_frequency,
  backup_retention_period
)
SELECT 
  'daily',
  30
WHERE NOT EXISTS (SELECT 1 FROM database_settings);

-- Create realtime triggers if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'realtime_system_settings'
  ) THEN
    CREATE TRIGGER realtime_system_settings
    AFTER INSERT OR UPDATE OR DELETE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'realtime_database_settings'
  ) THEN
    CREATE TRIGGER realtime_database_settings
    AFTER INSERT OR UPDATE OR DELETE ON database_settings
    FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();
  END IF;
END $$;