import { supabase } from '../../lib/supabase';
import { VideoFile } from './useDataFetching';

export const useVideoCRUD = (
  videoFiles: VideoFile[],
  setVideoFiles: React.Dispatch<React.SetStateAction<VideoFile[]>>
) => {
  const addVideoFile = async (file: Omit<VideoFile, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert([{
          title: file.title,
          video_url: file.video_url,
          category_id: file.categoryId
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setVideoFiles(prev => [...prev, {
        id: data.id,
        title: data.title,
        video_url: data.video_url,
        categoryId: data.category_id
      }]);
    } catch (error) {
      console.error('Error adding video file:', error);
      throw error;
    }
  };

  const updateVideoFile = async (id: number, file: Partial<VideoFile>) => {
    try {
      const updateData: any = {};
      if (file.title) updateData.title = file.title;
      if (file.video_url) updateData.video_url = file.video_url;
      if (file.categoryId) updateData.category_id = file.categoryId;
      
      const { data, error } = await supabase
        .from('videos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setVideoFiles(prev => prev.map(video => video.id === id ? {
        id: data.id,
        title: data.title,
        video_url: data.video_url,
        categoryId: data.category_id
      } : video));
    } catch (error) {
      console.error('Error updating video file:', error);
      throw error;
    }
  };

  const deleteVideoFile = async (id: number) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setVideoFiles(prev => prev.filter(video => video.id !== id));
    } catch (error) {
      console.error('Error deleting video file:', error);
      throw error;
    }
  };

  return {
    addVideoFile,
    updateVideoFile,
    deleteVideoFile
  };
};