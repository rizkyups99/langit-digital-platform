import { supabase } from '../../lib/supabase';
import { AdminAccount } from './useDataFetching';

export const useAdminAccountCRUD = (
  adminAccounts: AdminAccount[],
  setAdminAccounts: React.Dispatch<React.SetStateAction<AdminAccount[]>>
) => {
  const addAdminAccount = async (admin: Omit<AdminAccount, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .insert([{
          email: admin.email,
          access_code: admin.access_code
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setAdminAccounts(prev => [...prev, {
        id: data.id,
        email: data.email,
        access_code: data.access_code,
        created_at: new Date(data.created_at)
      }]);
    } catch (error) {
      console.error('Error adding admin account:', error);
      throw error;
    }
  };

  const updateAdminAccount = async (id: number, admin: Partial<AdminAccount>) => {
    try {
      const updateData: any = {};
      if (admin.email) updateData.email = admin.email;
      if (admin.access_code) updateData.access_code = admin.access_code;
      
      const { data, error } = await supabase
        .from('admins')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setAdminAccounts(prev => prev.map(account => account.id === id ? {
        id: data.id,
        email: data.email,
        access_code: data.access_code,
        created_at: new Date(data.created_at)
      } : account));
    } catch (error) {
      console.error('Error updating admin account:', error);
      throw error;
    }
  };

  const deleteAdminAccount = async (id: number) => {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setAdminAccounts(prev => prev.filter(account => account.id !== id));
    } catch (error) {
      console.error('Error deleting admin account:', error);
      throw error;
    }
  };

  return {
    addAdminAccount,
    updateAdminAccount,
    deleteAdminAccount
  };
};