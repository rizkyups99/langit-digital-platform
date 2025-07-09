import { supabase } from '../../lib/supabase';
import { Category } from './useDataFetching';

export const useCategoryCRUD = (
  categories: Category[],
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: category.name,
          description: category.description,
          filter: category.filter || 'pdf'
        }])
        .select()
        .single();
      
      if (error) throw error;
      setCategories(prev => [...prev, {
        id: data.id,
        name: data.name,
        description: data.description,
        filter: data.filter
      }]);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: number, category: Partial<Category>) => {
    try {
      const updateData: any = {};
      if (category.name) updateData.name = category.name;
      if (category.description) updateData.description = category.description;
      if (category.filter) updateData.filter = category.filter;
      
      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setCategories(prev => prev.map(cat => cat.id === id ? {
        id: data.id,
        name: data.name,
        description: data.description,
        filter: data.filter
      } : cat));
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  return {
    addCategory,
    updateCategory,
    deleteCategory
  };
};