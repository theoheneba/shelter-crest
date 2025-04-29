/*
  # Create Authentication Tables

  1. New Tables
    - `users`
      - Basic user information and authentication
    - `sessions`
      - User session management
    
  2. Security
    - Enable RLS on all tables
    - Add appropriate access policies
*/

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