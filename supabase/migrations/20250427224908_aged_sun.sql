/*
  # Fix System Settings RLS Policy

  1. Changes
    - Add proper RLS policy for system_settings table
    - Ensure admin users can insert and update system settings
    
  2. Security
    - Maintain security by only allowing admin users to modify settings
    - Enable proper access for authenticated admin users
*/

-- First, check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name text NOT NULL,
  default_currency text NOT NULL,
  default_language text NOT NULL,
  smtp_server text,
  smtp_port integer,
  sender_email text,
  email_notifications boolean DEFAULT true,
  system_alerts boolean DEFAULT true,
  application_updates boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can view system settings" ON system_settings;
DROP POLICY IF EXISTS "Only admins can manage system settings" ON system_settings;

-- Create new policies
CREATE POLICY "Only admins can view system settings"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]));

CREATE POLICY "Only admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]))
  WITH CHECK ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]));

-- Insert default settings if the table is empty
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