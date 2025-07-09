import { supabase } from '../../lib/supabase';
import { AudioFile } from './useDataFetching';

export const useAudioCRUD = (
  audioFiles: AudioFile[],
  setAudioFiles: React.Dispatch<React.SetStateAction<AudioFile[]>>
) => {
  const addAudioFile = async (file: Omit<AudioFile, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('audios')
        .insert([{
          title: file.title,
          file_url: file.file_url,
          category_id: file.categoryId
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setAudioFiles(prev => [...prev, {
        id: data.id,
        title: data.title,
        file_url: data.file_url,
        categoryId: data.category_id
      }]);
    } catch (error) {
      console.error('Error adding audio file:', error);
      throw error;
    }
  };

  const updateAudioFile = async (id: number, file: Partial<AudioFile>) => {
    try {
      const updateData: any = {};
      if (file.title) updateData.title = file.title;
      if (file.file_url) updateData.file_url = file.file_url;
      if (file.categoryId) updateData.category_id = file.categoryId;
      
      const { data, error } = await supabase
        .from('audios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setAudioFiles(prev => prev.map(audio => audio.id === id ? {
        id: data.id,
        title: data.title,
        file_url: data.file_url,
        categoryId: data.category_id
      } : audio));
    } catch (error) {
      console.error('Error updating audio file:', error);
      throw error;
    }
  };

  const deleteAudioFile = async (id: number) => {
    try {
      const { error } = await supabase
        .from('audios')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setAudioFiles(prev => prev.filter(audio => audio.id !== id));
    } catch (error) {
      console.error('Error deleting audio file:', error);
      throw error;
    }
  };

  return {
    addAudioFile,
    updateAudioFile,
    deleteAudioFile
  };
};