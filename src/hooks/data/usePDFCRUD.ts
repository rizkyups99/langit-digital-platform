import { supabase } from '../../lib/supabase';
import { PDFFile } from './useDataFetching';

export const usePDFCRUD = (
  pdfFiles: PDFFile[],
  setPdfFiles: React.Dispatch<React.SetStateAction<PDFFile[]>>
) => {
  const addPDFFile = async (file: Omit<PDFFile, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('pdfs')
        .insert([{
          title: file.title,
          cover_url: file.cover_url,
          file_url: file.file_url,
          category_id: file.categoryId
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setPdfFiles(prev => [...prev, {
        id: data.id,
        title: data.title,
        cover_url: data.cover_url,
        file_url: data.file_url,
        categoryId: data.category_id
      }]);
    } catch (error) {
      console.error('Error adding PDF file:', error);
      throw error;
    }
  };

  const updatePDFFile = async (id: number, file: Partial<PDFFile>) => {
    try {
      const updateData: any = {};
      if (file.title) updateData.title = file.title;
      if (file.cover_url) updateData.cover_url = file.cover_url;
      if (file.file_url) updateData.file_url = file.file_url;
      if (file.categoryId) updateData.category_id = file.categoryId;
      
      const { data, error } = await supabase
        .from('pdfs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setPdfFiles(prev => prev.map(pdf => pdf.id === id ? {
        id: data.id,
        title: data.title,
        cover_url: data.cover_url,
        file_url: data.file_url,
        categoryId: data.category_id
      } : pdf));
    } catch (error) {
      console.error('Error updating PDF file:', error);
      throw error;
    }
  };

  const deletePDFFile = async (id: number) => {
    try {
      const { error } = await supabase
        .from('pdfs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setPdfFiles(prev => prev.filter(pdf => pdf.id !== id));
    } catch (error) {
      console.error('Error deleting PDF file:', error);
      throw error;
    }
  };

  return {
    addPDFFile,
    updatePDFFile,
    deletePDFFile
  };
};