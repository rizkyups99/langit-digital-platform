/*
  # Fix RLS Policies for File Cloud Files Table

  1. Security Updates
    - Enable RLS on file_cloud_files table
    - Add public read access for user panel
    - Add admin management policies
    - Add anonymous access for admin panel operations

  2. Notes
    - This ensures the file management section works properly
    - Allows users to view files and admins to manage them
*/

-- Enable RLS on file_cloud_files table
ALTER TABLE file_cloud_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read file cloud files" ON file_cloud_files;
DROP POLICY IF EXISTS "Admins can manage file cloud files" ON file_cloud_files;
DROP POLICY IF EXISTS "Anonymous admin operations on file cloud files" ON file_cloud_files;

-- Allow public read access to file cloud files (for user panel)
CREATE POLICY "Anyone can read file cloud files"
  ON file_cloud_files
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated admins to manage file cloud files
CREATE POLICY "Admins can manage file cloud files"
  ON file_cloud_files
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
CREATE POLICY "Anonymous admin operations on file cloud files"
  ON file_cloud_files
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);