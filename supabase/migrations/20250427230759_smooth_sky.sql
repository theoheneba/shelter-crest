/*
  # Fix system settings table

  1. Changes
    - Add unique constraint to ensure only one row exists
    - Add default row if table is empty
    
  2. Security
    - Maintain existing RLS policies
*/

-- First ensure we have exactly one row
DO $$
BEGIN
  -- If we have multiple rows, keep only the most recently updated one
  DELETE FROM system_settings
  WHERE id NOT IN (
    SELECT id
    FROM system_settings
    ORDER BY updated_at DESC
    LIMIT 1
  );
  
  -- If we have no rows, insert default settings
  IF NOT EXISTS (SELECT 1 FROM system_settings) THEN
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
    ) VALUES (
      'RentAssist Admin',
      'GHS',
      'en',
      'smtp.hostinger.com',
      465,
      'info@sheltercrest.org',
      true,
      true,
      true
    );
  END IF;
END $$;

-- Add a trigger to prevent multiple rows
CREATE OR REPLACE FUNCTION prevent_multiple_system_settings()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM system_settings) > 0 AND TG_OP = 'INSERT' THEN
    RAISE EXCEPTION 'Only one row is allowed in system_settings table';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_single_row ON system_settings;
CREATE TRIGGER ensure_single_row
  BEFORE INSERT ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION prevent_multiple_system_settings();