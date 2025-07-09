import { supabase } from '../../lib/supabase';
import { PDFFile } from './useDataFetching';

export const usePDFCloudCRUD = (
  pdfCloudFiles: PDFFile[],
  setPdfCloudFiles: React.Dispatch<React.SetStateAction<PDFFile[]>>
) => {
  const addPDFCloudFile = async (file: Omit<PDFFile, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('pdf_cloud_files')
        .insert([{
          title: file.title,
          cover_url: file.cover_url,
          file_url: file.file_url,
          category_id: file.categoryId
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setPdfCloudFiles(prev => [...prev, {
        id: data.id,
        title: data.title,
        cover_url: data.cover_url,
        file_url: data.file_url,
        categoryId: data.category_id
      }]);
    } catch (error) {
      console.error('Error adding PDF cloud file:', error);
      throw error;
    }
  };

  const updatePDFCloudFile = async (id: number, file: Partial<PDFFile>) => {
    try {
      const updateData: any = {};
      if (file.title) updateData.title = file.title;
      if (file.cover_url) updateData.cover_url = file.cover_url;
      if (file.file_url) updateData.file_url = file.file_url;
      if (file.categoryId) updateData.category_id = file.categoryId;
      
      const { data, error } = await supabase
        .from('pdf_cloud_files')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setPdfCloudFiles(prev => prev.map(pdf => pdf.id === id ? {
        id: data.id,
        title: data.title,
        cover_url: data.cover_url,
        file_url: data.file_url,
        categoryId: data.category_id
      } : pdf));
    } catch (error) {
      console.error('Error updating PDF cloud file:', error);
      throw error;
    }
  };

  const deletePDFCloudFile = async (id: number) => {
    try {
      const { error } = await supabase
        .from('pdf_cloud_files')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setPdfCloudFiles(prev => prev.filter(pdf => pdf.id !== id));
    } catch (error) {
      console.error('Error deleting PDF cloud file:', error);
      throw error;
    }
  };

  return {
    addPDFCloudFile,
    updatePDFCloudFile,
    deletePDFCloudFile
  };
};