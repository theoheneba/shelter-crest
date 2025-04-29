/*
  # Fix Database Settings RLS Policy

  1. Changes
    - Add proper RLS policy for database_settings table
    - Ensure admin users can insert and update database settings
    
  2. Security
    - Maintain security by only allowing admin users to modify settings
    - Enable proper access for authenticated admin users
*/

-- First, check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS database_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_frequency text DEFAULT 'daily' CHECK (backup_frequency IN ('daily', 'weekly', 'monthly')),
  backup_retention_period integer DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE database_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can view database settings" ON database_settings;
DROP POLICY IF EXISTS "Only admins can manage database settings" ON database_settings;

-- Create new policies
CREATE POLICY "Only admins can view database settings"
  ON database_settings
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]));

CREATE POLICY "Only admins can manage database settings"
  ON database_settings
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]))
  WITH CHECK ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]));

-- Insert default settings if the table is empty
INSERT INTO database_settings (
  backup_frequency,
  backup_retention_period
)
SELECT
  'daily',
  30
WHERE NOT EXISTS (SELECT 1 FROM database_settings);