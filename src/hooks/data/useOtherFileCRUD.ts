import { supabase } from '../../lib/supabase';
import { OtherFile } from './useDataFetching';

export const useOtherFileCRUD = (
  otherFiles: OtherFile[],
  setOtherFiles: React.Dispatch<React.SetStateAction<OtherFile[]>>
) => {
  const addOtherFile = async (file: Omit<OtherFile, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('file_cloud_files')
        .insert([{
          title: file.title,
          cover_url: file.cover_url,
          file_url: file.file_url,
          file_type: file.file_type,
          category_id: file.categoryId
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setOtherFiles(prev => [...prev, {
        id: data.id,
        title: data.title,
        cover_url: data.cover_url,
        file_url: data.file_url,
        file_type: data.file_type,
        categoryId: data.category_id
      }]);
    } catch (error) {
      console.error('Error adding other file:', error);
      throw error;
    }
  };

  const updateOtherFile = async (id: number, file: Partial<OtherFile>) => {
    try {
      const updateData: any = {};
      if (file.title) updateData.title = file.title;
      if (file.cover_url) updateData.cover_url = file.cover_url;
      if (file.file_url) updateData.file_url = file.file_url;
      if (file.file_type) updateData.file_type = file.file_type;
      if (file.categoryId) updateData.category_id = file.categoryId;
      
      const { data, error } = await supabase
        .from('file_cloud_files')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setOtherFiles(prev => prev.map(other => other.id === id ? {
        id: data.id,
        title: data.title,
        cover_url: data.cover_url,
        file_url: data.file_url,
        file_type: data.file_type,
        categoryId: data.category_id
      } : other));
    } catch (error) {
      console.error('Error updating other file:', error);
      throw error;
    }
  };

  const deleteOtherFile = async (id: number) => {
    try {
      const { error } = await supabase
        .from('file_cloud_files')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setOtherFiles(prev => prev.filter(other => other.id !== id));
    } catch (error) {
      console.error('Error deleting other file:', error);
      throw error;
    }
  };

  return {
    addOtherFile,
    updateOtherFile,
    deleteOtherFile
  };
};