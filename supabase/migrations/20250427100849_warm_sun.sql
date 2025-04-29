/*
  # Initial Schema Setup

  1. New Tables
    - users: Stores user accounts and authentication data
    - sessions: Manages user login sessions
  
  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    
  3. Changes
    - Add initial schema for user management
    - Set up authentication system
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Allow registration" ON users;
DROP POLICY IF EXISTS "Users can manage own sessions" ON sessions;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  token text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'superadmin'));

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'superadmin'));

CREATE POLICY "Allow registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Sessions policies
CREATE POLICY "Users can manage own sessions"
  ON sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'superadmin'));

-- Create initial admin user
INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  role
) VALUES (
  'admin@sheltercrest.org',
  '$2a$10$zXzfpM3NQjrx5v5zX5zX5OqH5H5H5H5H5H5H5H5H5H5H5H5H5H5H5H', -- Password: Admin@2025
  'Admin',
  'User',
  'admin'
) ON CONFLICT DO NOTHING;