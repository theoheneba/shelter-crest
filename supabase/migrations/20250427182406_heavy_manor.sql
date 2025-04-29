/*
  # Fix Realtime Triggers and Policies

  1. Changes
    - Safely recreate realtime triggers
    - Add missing policies only if they don't exist
    - Create backup_database function
    - Create audit_log table if it doesn't exist
    
  2. Security
    - Check for existing objects before creating
    - Maintain RLS policies
*/

-- Check if trigger exists before creating it
DO $$
BEGIN
  -- Drop existing triggers if they exist
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'realtime_system_settings') THEN
    DROP TRIGGER realtime_system_settings ON system_settings;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'realtime_security_settings') THEN
    DROP TRIGGER realtime_security_settings ON security_settings;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'realtime_database_settings') THEN
    DROP TRIGGER realtime_database_settings ON database_settings;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'realtime_properties') THEN
    DROP TRIGGER realtime_properties ON properties;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'realtime_support_stats') THEN
    DROP TRIGGER realtime_support_stats ON support_stats;
  END IF;
END $$;

-- Recreate triggers
CREATE TRIGGER realtime_system_settings
AFTER INSERT OR UPDATE OR DELETE ON system_settings
FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();

CREATE TRIGGER realtime_security_settings
AFTER INSERT OR UPDATE OR DELETE ON security_settings
FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();

CREATE TRIGGER realtime_database_settings
AFTER INSERT OR UPDATE OR DELETE ON database_settings
FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();

CREATE TRIGGER realtime_properties
AFTER INSERT OR UPDATE OR DELETE ON properties
FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();

CREATE TRIGGER realtime_support_stats
AFTER INSERT OR UPDATE OR DELETE ON support_stats
FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();

-- Add missing policy for support_stats if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'support_stats' AND policyname = 'Only admins can view support stats'
  ) THEN
    CREATE POLICY "Only admins can view support stats"
      ON support_stats
      FOR ALL
      TO authenticated
      USING ((auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text]));
  END IF;
END $$;

-- Complete the missing policy for properties
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'properties' AND policyname = 'Only admins can manage properties'
  ) THEN
    CREATE POLICY "Only admins can manage properties"
      ON properties
      FOR ALL
      TO authenticated
      USING ((auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text]));
  END IF;
END $$;

-- Create function to backup database if it doesn't exist
CREATE OR REPLACE FUNCTION backup_database()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This is a placeholder function that would typically call an external service
  -- or use pg_dump in a real production environment
  RAISE NOTICE 'Database backup initiated';
  
  -- In a real implementation, you might:
  -- 1. Use pg_dump to create a backup file
  -- 2. Store the backup in a secure location
  -- 3. Rotate backups based on retention policy
  
  -- For now, we'll just log the action
  -- Check if audit_log table exists before inserting
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_log') THEN
    INSERT INTO audit_log (action, details)
    VALUES ('database_backup', 'Manual backup initiated');
  END IF;
  
  RETURN;
END;
$$;

-- Create audit_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  details text,
  performed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit_log if not already enabled
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for audit_log only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_log' AND policyname = 'Only admins can view audit logs'
  ) THEN
    CREATE POLICY "Only admins can view audit logs"
      ON audit_log
      FOR ALL
      TO authenticated
      USING ((auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text]));
  END IF;
END $$;