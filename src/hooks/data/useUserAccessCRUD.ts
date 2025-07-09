import { supabase } from '../../lib/supabase';
import { UserAccess } from './useDataFetching';

export const useUserAccessCRUD = (
  setUserAudioAccess: React.Dispatch<React.SetStateAction<UserAccess[]>>,
  setUserPdfAccess: React.Dispatch<React.SetStateAction<UserAccess[]>>,
  setUserVideoAccess: React.Dispatch<React.SetStateAction<UserAccess[]>>,
  setUserAudioCloudAccess: React.Dispatch<React.SetStateAction<UserAccess[]>>,
  setUserPdfCloudAccess: React.Dispatch<React.SetStateAction<UserAccess[]>>,
  setUserFileCloudAccess: React.Dispatch<React.SetStateAction<UserAccess[]>>
) => {
  const addUserAccess = async (access: Omit<UserAccess, 'id'>, type: string) => {
    try {
      const tableName = `user_${type}_access`;
      const { data, error } = await supabase
        .from(tableName)
        .insert([{
          user_id: access.user_id,
          category_id: access.category_id
        }])
        .select()
        .single();
      
      if (error) {
        console.error(`Supabase add user ${type} access error:`, error);
        throw error;
      }
      
      if (!data) throw new Error(`Failed to add user ${type} access`);
      
      const newAccess = {
        id: data.id,
        user_id: data.user_id,
        category_id: data.category_id
      };

      switch (type) {
        case 'audio':
          setUserAudioAccess(prev => [...prev, newAccess]);
          break;
        case 'pdf':
          setUserPdfAccess(prev => [...prev, newAccess]);
          break;
        case 'video':
          setUserVideoAccess(prev => [...prev, newAccess]);
          break;
        case 'audio_cloud':
          setUserAudioCloudAccess(prev => [...prev, newAccess]);
          break;
        case 'pdf_cloud':
          setUserPdfCloudAccess(prev => [...prev, newAccess]);
          break;
        case 'file_cloud':
          setUserFileCloudAccess(prev => [...prev, newAccess]);
          break;
      }
    } catch (error) {
      console.error(`Error adding user ${type} access:`, error);
      throw error;
    }
  };

  const deleteUserAccess = async (id: number, type: string) => {
    try {
      const tableName = `user_${type}_access`;
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Supabase delete user ${type} access error:`, error);
        throw error;
      }
      
      switch (type) {
        case 'audio':
          setUserAudioAccess(prev => prev.filter(access => access.id !== id));
          break;
        case 'pdf':
          setUserPdfAccess(prev => prev.filter(access => access.id !== id));
          break;
        case 'video':
          setUserVideoAccess(prev => prev.filter(access => access.id !== id));
          break;
        case 'audio_cloud':
          setUserAudioCloudAccess(prev => prev.filter(access => access.id !== id));
          break;
        case 'pdf_cloud':
          setUserPdfCloudAccess(prev => prev.filter(access => access.id !== id));
          break;
        case 'file_cloud':
          setUserFileCloudAccess(prev => prev.filter(access => access.id !== id));
          break;
      }
    } catch (error) {
      console.error(`Error deleting user ${type} access:`, error);
      throw error;
    }
  };

  const deleteAllUserAccessForType = async (userId: number, type: string) => {
    try {
      const tableName = `user_${type}_access`;
      console.log(`Deleting all ${type} access for user ${userId} from table ${tableName}`);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.error(`Supabase delete all user ${type} access error:`, error);
        throw error;
      }
      
      // Update local state by filtering out all access records for this user and type
      switch (type) {
        case 'audio':
          setUserAudioAccess(prev => prev.filter(access => access.user_id !== userId));
          break;
        case 'pdf':
          setUserPdfAccess(prev => prev.filter(access => access.user_id !== userId));
          break;
        case 'video':
          setUserVideoAccess(prev => prev.filter(access => access.user_id !== userId));
          break;
        case 'audio_cloud':
          setUserAudioCloudAccess(prev => prev.filter(access => access.user_id !== userId));
          break;
        case 'pdf_cloud':
          setUserPdfCloudAccess(prev => prev.filter(access => access.user_id !== userId));
          break;
        case 'file_cloud':
          setUserFileCloudAccess(prev => prev.filter(access => access.user_id !== userId));
          break;
      }
    } catch (error) {
      console.error(`Error deleting all user ${type} access:`, error);
      throw error;
    }
  };

  return {
    addUserAccess,
    deleteUserAccess,
    deleteAllUserAccessForType
  };
};