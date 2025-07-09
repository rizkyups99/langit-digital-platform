import { supabase } from '../../lib/supabase';
import { UserAccount } from './useDataFetching';

export const useUserAccountCRUD = (
  userAccounts: UserAccount[],
  setUserAccounts: React.Dispatch<React.SetStateAction<UserAccount[]>>
) => {
  const addUserAccount = async (user: Omit<UserAccount, 'id' | 'created_at'>) => {
    try {
      console.log('Adding user account:', user);
      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: user.username,
          password: 'default',
          access_code: user.access_code,
          name: user.name,
          is_active: user.is_active !== undefined ? user.is_active : true
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase add user error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Failed to create user account - no data returned');
      }
      
      const newUser = {
        id: data.id,
        username: data.username,
        access_code: data.access_code,
        name: data.name,
        is_active: data.is_active,
        created_at: new Date(data.created_at)
      };
      
      setUserAccounts(prev => [...prev, newUser]);
      console.log('User account added successfully:', newUser);
      
      // Return the new user data for immediate use
      return newUser;
    } catch (error) {
      console.error('Error adding user account:', error);
      throw error;
    }
  };

  const updateUserAccount = async (id: number, user: Partial<UserAccount>) => {
    try {
      const updateData: any = {};
      if (user.username) updateData.username = user.username;
      if (user.access_code) updateData.access_code = user.access_code;
      if (user.name) updateData.name = user.name;
      if (user.is_active !== undefined) updateData.is_active = user.is_active;
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error(`User with ID ${id} not found or could not be updated`);
      }
      
      setUserAccounts(prev => prev.map(account => account.id === id ? {
        id: data.id,
        username: data.username,
        access_code: data.access_code,
        name: data.name,
        is_active: data.is_active,
        created_at: new Date(data.created_at)
      } : account));
    } catch (error) {
      console.error('Error updating user account:', error);
      throw error;
    }
  };

  const deleteUserAccount = async (id: number) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setUserAccounts(prev => prev.filter(account => account.id !== id));
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  };

  return {
    addUserAccount,
    updateUserAccount,
    deleteUserAccount
  };
};