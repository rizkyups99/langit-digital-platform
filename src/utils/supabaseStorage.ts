import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param folder Optional folder path within the bucket
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  folder: string = ''
): Promise<string> => {
  try {
    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Deletes a file from Supabase Storage
 * @param url The public URL of the file to delete
 * @returns A boolean indicating success
 */
export const deleteFileFromUrl = async (url: string): Promise<boolean> => {
  try {
    // Extract the bucket and path from the URL
    // URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = url.split('/storage/v1/object/public/');
    if (urlParts.length < 2) return false;
    
    const pathParts = urlParts[1].split('/', 2);
    const bucket = pathParts[0];
    const path = urlParts[1].substring(bucket.length + 1);
    
    if (!bucket || !path) return false;

    // Delete the file
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    return !error;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};