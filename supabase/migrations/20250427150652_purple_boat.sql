/*
  # Create Demo Users and Profiles

  1. Changes
    - Add test user and superadmin user to auth.users
    - Create corresponding profiles in public.profiles
    
  2. Security
    - Handle existing records safely
    - Ensure proper role assignments
*/

-- Create demo users if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'testuser@sheltercrest.org') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      created_at,
      updated_at
    ) VALUES (
      'd7a94ca1-934e-4a0a-a94d-999e519894a4',
      '00000000-0000-0000-0000-000000000000',
      'testuser@sheltercrest.org',
      '$2a$10$4k9PYwYv1.NswXw.H1W8hezjWGxkroX.C.j1bw4D.eJ.K.0i9qzTK',
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"first_name":"Test","last_name":"User"}',
      'authenticated',
      'authenticated',
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'superadmin@sheltercrest.org') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      created_at,
      updated_at
    ) VALUES (
      '2c0c449b-3e4a-4c1f-8b80-33e498b957e2',
      '00000000-0000-0000-0000-000000000000',
      'superadmin@sheltercrest.org',
      '$2a$10$OI2Fk1AdYvgUaJz0vjer.u93YvD/e9rKjX/2.j.x40j0K.x0c9.m',
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"first_name":"Super","last_name":"Admin"}',
      'authenticated',
      'authenticated',
      now(),
      now()
    );
  END IF;
END $$;

-- Create corresponding profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'testuser@sheltercrest.org') THEN
    INSERT INTO public.profiles (
      id,
      first_name,
      last_name,
      email,
      role,
      created_at,
      updated_at
    ) VALUES (
      'd7a94ca1-934e-4a0a-a94d-999e519894a4',
      'Test',
      'User',
      'testuser@sheltercrest.org',
      'user',
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'superadmin@sheltercrest.org') THEN
    INSERT INTO public.profiles (
      id,
      first_name,
      last_name,
      email,
      role,
      created_at,
      updated_at
    ) VALUES (
      '2c0c449b-3e4a-4c1f-8b80-33e498b957e2',
      'Super',
      'Admin',
      'superadmin@sheltercrest.org',
      'superadmin',
      now(),
      now()
    );
  END IF;
END $$;
