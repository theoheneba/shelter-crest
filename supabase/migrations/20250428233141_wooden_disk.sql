-- First check if user_id column exists and drop it if it does
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE payments DROP COLUMN user_id;
  END IF;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create payments" ON payments;
DROP POLICY IF EXISTS "Users can view own payments" ON payments;

-- Create new policies
CREATE POLICY "Users can create payments"
ON payments FOR INSERT
TO authenticated
WITH CHECK (application_id IN (
  SELECT id FROM applications WHERE user_id = auth.uid()
));

CREATE POLICY "Users can view own payments"
ON payments FOR SELECT
TO authenticated
USING (application_id IN (
  SELECT id FROM applications WHERE user_id = auth.uid()
) OR (auth.jwt() ->> 'role')::text = ANY (ARRAY['admin'::text, 'superadmin'::text]));