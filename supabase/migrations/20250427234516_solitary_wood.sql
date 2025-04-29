/*
  # Add prorated rent columns to applications table

  1. Changes
    - Add landlord_payment_date column to applications table
    - Add prorated_rent column to applications table
    
  2. Updates
    - Update existing applications with default values
*/

-- Add new columns to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS landlord_payment_date date,
ADD COLUMN IF NOT EXISTS prorated_rent numeric(10,2) DEFAULT 0;

-- Update existing applications with default values
UPDATE applications
SET 
  landlord_payment_date = lease_start_date,
  prorated_rent = 0
WHERE 
  landlord_payment_date IS NULL;

-- Create or replace function to calculate prorated rent
CREATE OR REPLACE FUNCTION calculate_prorated_rent(
  monthly_rent numeric,
  payment_date date
)
RETURNS numeric
LANGUAGE plpgsql
AS $$
DECLARE
  day_of_month integer;
  days_in_month integer;
  days_remaining integer;
  daily_rent numeric;
  prorated_amount numeric;
BEGIN
  -- Get the day of the month
  day_of_month := EXTRACT(DAY FROM payment_date);
  
  -- Get the number of days in the month
  days_in_month := EXTRACT(DAY FROM 
    (DATE_TRUNC('MONTH', payment_date) + INTERVAL '1 MONTH - 1 day')::date
  );
  
  -- If payment date is before the 15th, no proration needed
  IF day_of_month < 15 THEN
    RETURN 0;
  END IF;
  
  -- Calculate days remaining in the month
  days_remaining := days_in_month - day_of_month + 1;
  
  -- Calculate daily rent
  daily_rent := monthly_rent / days_in_month;
  
  -- Calculate prorated amount
  prorated_amount := daily_rent * days_remaining;
  
  RETURN prorated_amount;
END;
$$;