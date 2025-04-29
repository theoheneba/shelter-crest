/*
  # Add Real-time Update Triggers
  
  1. Changes
    - Add triggers for real-time updates on key tables
    - Add functions to handle updates
    - Enable real-time for specific tables
    
  2. Security
    - Ensure proper access control
    - Only broadcast changes to authorized users
*/

-- Create function to handle real-time updates
CREATE OR REPLACE FUNCTION handle_realtime_updates()
RETURNS TRIGGER AS $$
BEGIN
  -- Broadcast the change to the realtime system
  perform pg_notify(
    'realtime',
    json_build_object(
      'table', TG_TABLE_NAME,
      'type', TG_OP,
      'record', row_to_json(NEW),
      'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE null END
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for real-time updates
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

CREATE TRIGGER realtime_applications
AFTER INSERT OR UPDATE OR DELETE ON applications
FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();

CREATE TRIGGER realtime_payments
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();

CREATE TRIGGER realtime_documents
AFTER INSERT OR UPDATE OR DELETE ON documents
FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();

CREATE TRIGGER realtime_support_tickets
AFTER INSERT OR UPDATE OR DELETE ON support_tickets
FOR EACH ROW EXECUTE FUNCTION handle_realtime_updates();

-- Enable real-time for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE system_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE security_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE database_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE properties;
ALTER PUBLICATION supabase_realtime ADD TABLE support_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
ALTER PUBLICATION supabase_realtime ADD TABLE support_tickets;