/*
  # Update Application Schema

  1. Changes
    - Add new fee columns to applications table
    - Update existing applications with calculated values
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add new fee columns to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS service_fee numeric(10,2),
ADD COLUMN IF NOT EXISTS visit_fee numeric(10,2),
ADD COLUMN IF NOT EXISTS processing_fee numeric(10,2);

-- Update existing applications with calculated values
UPDATE applications
SET 
  service_fee = monthly_rent,
  visit_fee = 120,
  processing_fee = 60,
  interest_amount = monthly_rent * 0.28
WHERE 
  service_fee IS NULL OR 
  visit_fee IS NULL OR 
  processing_fee IS NULL;

-- Recalculate total_initial_payment for existing applications
UPDATE applications
SET total_initial_payment = deposit_amount + interest_amount + service_fee + visit_fee + processing_fee
WHERE deposit_amount IS NOT NULL AND interest_amount IS NOT NULL AND service_fee IS NOT NULL;

-- Create or replace function to calculate initial payment
CREATE OR REPLACE FUNCTION calculate_initial_payment(monthly_rent numeric)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Service fee equals one month's rent
  -- Property visit fee is fixed at 120 GHS
  -- Document processing fee is fixed at 60 GHS
  -- Interest is 28% of one month's rent
  -- Two months deposit
  
  result := jsonb_build_object(
    'deposit', monthly_rent * 2,
    'interest', monthly_rent * 0.28,
    'service_fee', monthly_rent,
    'visit_fee', 120,
    'processing_fee', 60,
    'total', (monthly_rent * 2) + (monthly_rent * 0.28) + monthly_rent + 120 + 60
  );
  
  RETURN result;
END;
$$;