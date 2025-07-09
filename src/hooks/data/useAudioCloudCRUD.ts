import { supabase } from '../../lib/supabase';
import { AudioFile } from './useDataFetching';

export const useAudioCloudCRUD = (
  audioCloudFiles: AudioFile[],
  setAudioCloudFiles: React.Dispatch<React.SetStateAction<AudioFile[]>>
) => {
  const addAudioCloudFile = async (file: Omit<AudioFile, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('audio_cloud_files')
        .insert([{
          title: file.title,
          file_url: file.file_url,
          category_id: file.categoryId
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setAudioCloudFiles(prev => [...prev, {
        id: data.id,
        title: data.title,
        file_url: data.file_url,
        categoryId: data.category_id
      }]);
    } catch (error) {
      console.error('Error adding audio cloud file:', error);
      throw error;
    }
  };

  const updateAudioCloudFile = async (id: number, file: Partial<AudioFile>) => {
    try {
      const updateData: any = {};
      if (file.title) updateData.title = file.title;
      if (file.file_url) updateData.file_url = file.file_url;
      if (file.categoryId) updateData.category_id = file.categoryId;
      
      const { data, error } = await supabase
        .from('audio_cloud_files')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setAudioCloudFiles(prev => prev.map(audio => audio.id === id ? {
        id: data.id,
        title: data.title,
        file_url: data.file_url,
        categoryId: data.category_id
      } : audio));
    } catch (error) {
      console.error('Error updating audio cloud file:', error);
      throw error;
    }
  };

  const deleteAudioCloudFile = async (id: number) => {
    try {
      const { error } = await supabase
        .from('audio_cloud_files')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setAudioCloudFiles(prev => prev.filter(audio => audio.id !== id));
    } catch (error) {
      console.error('Error deleting audio cloud file:', error);
      throw error;
    }
  };

  return {
    addAudioCloudFile,
    updateAudioCloudFile,
    deleteAudioCloudFile
  };
};