/*
  # Fix System Settings RLS Policy

  1. Changes
    - Drop existing policies for system_settings table
    - Create new SELECT policy that properly allows admins to view system settings
    - Create function to prevent multiple system settings rows
    - Add trigger to ensure only one row exists in the system_settings table
    
  2. Security
    - Maintain RLS protection
    - Ensure only admins and superadmins can access settings
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can view system settings" ON system_settings;
DROP POLICY IF EXISTS "Only admins can manage system settings" ON system_settings;

-- Create new policies with correct permissions
CREATE POLICY "Only admins can view system settings" 
ON system_settings
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]));

CREATE POLICY "Only admins can manage system settings"
ON system_settings
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]));

-- Create or replace function to prevent multiple system settings rows
CREATE OR REPLACE FUNCTION prevent_multiple_system_settings()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM public.system_settings) >= 1 THEN
    RAISE EXCEPTION 'Only one row is allowed in the system_settings table';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to ensure single row
DROP TRIGGER IF EXISTS ensure_single_row ON system_settings;
CREATE TRIGGER ensure_single_row
BEFORE INSERT ON public.system_settings
FOR EACH ROW EXECUTE FUNCTION prevent_multiple_system_settings();

-- Insert default settings if none exist
DO $$
BEGIN
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