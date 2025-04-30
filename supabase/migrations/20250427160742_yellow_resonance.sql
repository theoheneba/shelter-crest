/*
  # Update User Role to Superadmin

  1. Changes
    - Update role to 'superadmin' for user with email theohenebasa@gmail.com
    
  2. Security
    - Only updates the specific user
    - Maintains existing data integrity
*/

-- Update the role in profiles table
UPDATE public.profiles 
SET role = 'superadmin',
    updated_at = now()
WHERE email = 'theohenebasa@gmail.com';

-- Update the raw_user_meta_data in auth.users to reflect the role change
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', 'superadmin'),
    updated_at = now()
WHERE email = 'theohenebasa@gmail.com';