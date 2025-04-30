/*
  # Fix Security Settings RLS Policy

  1. Changes
    - Add proper RLS policy for security_settings table
    - Ensure admin users can insert and update security settings
    
  2. Security
    - Maintain security by only allowing admin users to modify settings
    - Enable proper access for authenticated admin users
*/

-- First, check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  two_factor_auth boolean DEFAULT false,
  password_complexity text DEFAULT 'high' CHECK (password_complexity IN ('high', 'medium', 'low')),
  session_timeout integer DEFAULT 30,
  ip_whitelisting boolean DEFAULT false,
  account_lockout integer DEFAULT 3,
  log_retention integer DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can view security settings" ON security_settings;
DROP POLICY IF EXISTS "Only admins can manage security settings" ON security_settings;

-- Create new policies
CREATE POLICY "Only admins can view security settings"
  ON security_settings
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]));

CREATE POLICY "Only admins can manage security settings"
  ON security_settings
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]))
  WITH CHECK ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]));

-- Insert default settings if the table is empty
INSERT INTO security_settings (
  two_factor_auth,
  password_complexity,
  session_timeout,
  ip_whitelisting,
  account_lockout,
  log_retention
)
SELECT
  false,
  'high',
  30,
  false,
  3,
  30
WHERE NOT EXISTS (SELECT 1 FROM security_settings);