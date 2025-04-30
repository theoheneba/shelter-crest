/*
  # Add Admin Functionality Tables

  1. New Tables
    - system_settings: Stores system-wide configuration
    - security_settings: Stores security configuration
    - database_settings: Stores database configuration
    - properties: Stores property information
    - support_stats: Stores support statistics
    
  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create system_settings table
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

-- Create security_settings table
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

-- Create database_settings table
CREATE TABLE IF NOT EXISTS database_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_frequency text DEFAULT 'daily' CHECK (backup_frequency IN ('daily', 'weekly', 'monthly')),
  backup_retention_period integer DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  total_units integer NOT NULL,
  occupied_units integer DEFAULT 0,
  monthly_revenue numeric(10,2) DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create support_stats table
CREATE TABLE IF NOT EXISTS support_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  open_tickets integer DEFAULT 0,
  resolution_rate numeric(5,2) DEFAULT 0,
  avg_response_time numeric(10,2) DEFAULT 0,
  csat_score numeric(3,2) DEFAULT 0,
  calculated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Only admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text]));

CREATE POLICY "Only admins can manage security settings"
  ON security_settings
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text]));

CREATE POLICY "Only admins can manage database settings"
  ON database_settings
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text]));

CREATE POLICY "Only admins can manage properties"
  ON properties
  FOR ALL
  TO