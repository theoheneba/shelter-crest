/*
  # Create Trigger Helper Function

  1. Changes
    - Add function to safely create triggers
    - Update realtime triggers using the helper function
*/

-- Create function to safely create or replace a trigger
CREATE OR REPLACE FUNCTION create_trigger_if_not_exists(
  trigger_name text,
  table_name text,
  function_name text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = trigger_name
  ) THEN
    EXECUTE format('
      CREATE TRIGGER %I
      AFTER INSERT OR UPDATE OR DELETE ON %I
      FOR EACH ROW EXECUTE FUNCTION %I();
    ', trigger_name, table_name, function_name);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Use the helper function to create triggers
SELECT create_trigger_if_not_exists('realtime_system_settings', 'system_settings', 'handle_realtime_updates');
SELECT create_trigger_if_not_exists('realtime_security_settings', 'security_settings', 'handle_realtime_updates');
SELECT create_trigger_if_not_exists('realtime_database_settings', 'database_settings', 'handle_realtime_updates');
SELECT create_trigger_if_not_exists('realtime_properties', 'properties', 'handle_realtime_updates');
SELECT create_trigger_if_not_exists('realtime_support_stats', 'support_stats', 'handle_realtime_updates');
SELECT create_trigger_if_not_exists('realtime_applications', 'applications', 'handle_realtime_updates');
SELECT create_trigger_if_not_exists('realtime_payments', 'payments', 'handle_realtime_updates');
SELECT create_trigger_if_not_exists('realtime_documents', 'documents', 'handle_realtime_updates');
SELECT create_trigger_if_not_exists('realtime_support_tickets', 'support_tickets', 'handle_realtime_updates');