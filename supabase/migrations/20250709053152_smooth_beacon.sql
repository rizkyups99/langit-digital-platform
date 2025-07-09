/*
  # Fix RLS Policies for Audios Table

  1. Security Changes
    - Enable RLS on audios table
    - Add policy for public read access (for user panel)
    - Add policy for authenticated admin operations
    - Add policy for anonymous admin operations (custom auth system)

  2. Tables Updated
    - audios: Enable RLS and add comprehensive policies

  3. Notes
    - Public read access allows users to view audio files
    - Admin policies allow full CRUD operations for admin panel
    - Anonymous policy needed because admin panel uses custom authentication
*/

-- Enable RLS on audios table
ALTER TABLE audios ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read audio files" ON audios;
DROP POLICY IF EXISTS "Admins can manage audio files" ON audios;
DROP POLICY IF EXISTS "Anonymous admin operations on audio files" ON audios;

-- Allow public read access to audio files (for user panel)
CREATE POLICY "Anyone can read audio files"
  ON audios
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated admins to manage audio files
CREATE POLICY "Admins can manage audio files"
  ON audios
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE email = auth.jwt() ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Allow anonymous admin operations (for admin panel with custom auth)
CREATE POLICY "Anonymous admin operations on audio files"
  ON audios
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);