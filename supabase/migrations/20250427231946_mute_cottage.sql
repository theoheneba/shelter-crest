/*
  # Fix System Settings RLS Policies

  1. Changes
    - Drop existing RLS policies for system_settings
    - Add new policies for viewing and managing system settings
    
  2. Security
    - Only admins can view and manage system settings
    - Maintain data integrity with proper RLS
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can manage system settings" ON system_settings;
DROP POLICY IF EXISTS "Only admins can view system settings" ON system_settings;

-- Create new policies
CREATE POLICY "Only admins can manage system settings"
ON system_settings
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text])
)
WITH CHECK (
  (auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text])
);

-- Ensure RLS is enabled
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Insert default settings if none exist (with proper RLS check)
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