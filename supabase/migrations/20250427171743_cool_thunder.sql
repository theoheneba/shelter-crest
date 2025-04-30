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
-- Commenting out policy creation since they already exist
/*
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
  TO authenticated
  USING ((auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text]));

CREATE POLICY "Only admins can view support stats"
  ON support_stats
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text]));
*/

-- Create function to calculate support stats
CREATE OR REPLACE FUNCTION calculate_support_stats()
RETURNS support_stats
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats support_stats;
BEGIN
  -- Calculate resolution rate
  WITH ticket_stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE status = 'resolved') AS resolved_count,
      COUNT(*) AS total_count
    FROM support_tickets
    WHERE created_at >= NOW() - INTERVAL '30 days'
  )
  SELECT 
    (resolved_count::numeric / NULLIF(total_count, 0) * 100)::numeric(5,2)
  INTO stats.resolution_rate
  FROM ticket_stats;

  -- Calculate average response time (in hours)
  WITH response_times AS (
    SELECT 
      AVG(
        EXTRACT(EPOCH FROM (
          (SELECT MIN(created_at) 
           FROM ticket_replies 
           WHERE ticket_replies.ticket_id = support_tickets.id)
          - support_tickets.created_at
        ))/3600
      )::numeric(10,2) as avg_time
    FROM support_tickets
    WHERE created_at >= NOW() - INTERVAL '30 days'
  )
  SELECT avg_time INTO stats.avg_response_time
  FROM response_times;

  -- Calculate CSAT score (mock data for now)
  stats.csat_score := 4.8;

  -- Count open tickets
  SELECT COUNT(*)
  INTO stats.open_tickets
  FROM support_tickets
  WHERE status = 'open';

  stats.calculated_at := NOW();
  stats.id := gen_random_uuid();

  RETURN stats;
END;
$$;

-- Insert initial settings
INSERT INTO system_settings (
  system_name, 
  default_currency, 
  default_language
) VALUES (
  'RentAssist Admin',
  'GHS',
  'en'
) ON CONFLICT DO NOTHING;

INSERT INTO security_settings DEFAULT VALUES;
INSERT INTO database_settings DEFAULT VALUES;

-- Insert sample properties
INSERT INTO properties (
  name,
  address,
  city,
  state,
  total_units,
  occupied_units,
  monthly_revenue,
  status
) VALUES 
  (
    'Skyline Apartments',
    '123 Main St',
    'Accra',
    'Greater Accra',
    24,
    20,
    28000,
    'active'
  ),
  (
    'Harbor View Complex',
    '456 Beach Road',
    'Tema',
    'Greater Accra',
    36,
    30,
    42000,
    'active'
  ),
  (
    'Green Valley Residences',
    '789 Park Ave',
    'Kumasi',
    'Ashanti',
    18,
    15,
    21000,
    'maintenance'
  )
ON CONFLICT DO NOTHING;
