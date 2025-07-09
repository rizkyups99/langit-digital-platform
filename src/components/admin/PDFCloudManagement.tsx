import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { uploadFile } from '../../utils/supabaseStorage';
import { useToast } from '../../contexts/ToastContext';
import { 
  Cloud, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Upload,
  ExternalLink
} from 'lucide-react';

interface PDFCloudFormData {
  title: string;
  cover_url: string;
  file_url: string;
  categoryId: number;
}

const PDFCloudManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [pdfCloudForm, setPdfCloudForm] = useState<PDFCloudFormData>({
    title: '',
    cover_url: '',
    file_url: '',
    categoryId: 0
  });

  const { 
    pdfCloudFiles,
    categories,
    loading,
    addPDFCloudFile,
    updatePDFCloudFile,
    deletePDFCloudFile,
    refreshData
  } = useData();

  const { addToast } = useToast();

  const resetPdfCloudForm = () => {
    setPdfCloudForm({
      title: '',
      cover_url: '',
      file_url: '',
      categoryId: 0
    });
    setCoverFile(null);
    setUploadProgress(0);
  };

  const handleSubmitPdfCloud = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let coverUrl = pdfCloudForm.cover_url;
      
      // Upload cover image if selected
      if (coverFile) {
        setUploadProgress(20);
        coverUrl = await uploadFile(coverFile, 'pdf-covers');
        setUploadProgress(80);
      }
      
      // Update form data with new URL
      const updatedPdfCloudData = {
        ...pdfCloudForm,
        cover_url: coverUrl
      };
      
      if (editingItem) {
        await updatePDFCloudFile(editingItem.id, updatedPdfCloudData);
      } else {
        await addPDFCloudFile(updatedPdfCloudData);
      }
      
      setUploadProgress(100);
      resetPdfCloudForm();
      setShowAddForm(false);
      setEditingItem(null);
      await refreshData();
      
      addToast({
        type: 'success',
        title: editingItem ? 'PDF Cloud Updated' : 'PDF Cloud Added',
        message: `PDF Cloud ${editingItem ? 'updated' : 'added'} successfully`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error saving PDF Cloud:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Gagal menyimpan PDF Cloud. Silakan coba lagi.',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePdfCloud = async (pdfId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus PDF Cloud ini?')) {
      try {
        await deletePDFCloudFile(pdfId);
        await refreshData();
      } catch (error) {
        console.error('Error deleting PDF Cloud:', error);
        alert('Gagal menghapus PDF Cloud. Silakan coba lagi.');
      }
    }
  };

  const handleEditPdfCloud = (pdf: any) => {
    setPdfCloudForm({
      title: pdf.title,
      cover_url: pdf.cover_url,
      file_url: pdf.file_url,
      categoryId: pdf.categoryId
    });
    setCoverFile(null);
    setEditingItem(pdf);
    setShowAddForm(true);
  };

  // Filter and pagination
  const filteredPdfCloudFiles = pdfCloudFiles.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || pdf.categoryId.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPdfCloudFiles.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredPdfCloudFiles.length / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.id === categoryId)?.name || 'Tidak ada kategori';
  };

  const PaginationControls = () => {
    const totalPages = getTotalPages();
    
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPdfCloudFiles.length)} of {filteredPdfCloudFiles.length} files
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-red-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen PDF Cloud</h2>
          <p className="text-gray-600">Upload dan kelola file PDF Cloud untuk pengguna</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all"
        >
          <Cloud className="w-4 h-4" />
          <span>Upload PDF Cloud</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="">Semua Kategori</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button
          onClick={() => {
            setSearchTerm('');
            setCategoryFilter('');
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Add/Edit PDF Cloud Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit PDF Cloud' : 'Upload PDF Cloud'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    resetPdfCloudForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitPdfCloud} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul PDF Cloud
                  </label>
                  <input
                    type="text"
                    value={pdfCloudForm.title}
                    onChange={(e) => setPdfCloudForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Masukkan judul PDF Cloud"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={pdfCloudForm.categoryId}
                    onChange={(e) => setPdfCloudForm(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {coverFile && (
                      <div className="text-sm text-green-600">
                        Selected: {coverFile.name}
                      </div>
                    )}
                    {editingItem && !coverFile && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Current cover:</span>
                        <a 
                          href={pdfCloudForm.cover_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          View
                        </a>
                        <img 
                          src={pdfCloudForm.cover_url} 
                          alt="Current cover" 
                          className="h-10 w-auto rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File PDF Cloud
                  </label>
                  <input
                    type="url"
                    value={pdfCloudForm.file_url}
                    onChange={(e) => setPdfCloudForm(prev => ({ ...prev, file_url: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format file: PDF dari Google Drive atau cloud storage
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                      resetPdfCloudForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>
                          {uploadProgress > 0 && uploadProgress < 100
                            ? `Uploading... ${uploadProgress}%`
                            : 'Menyimpan...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Cloud className="w-4 h-4" />
                        <span>{editingItem ? 'Update' : 'Upload'} PDF Cloud</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PDF Cloud Files Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul PDF Cloud
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                      <span className="text-gray-500">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : getPaginatedData().length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada PDF Cloud yang ditemukan
                  </td>
                </tr>
              ) : (
                getPaginatedData().map((pdf, index) => (
                  <tr key={pdf.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((currentPage - 1) * itemsPerPage) + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <img
                          src={pdf.cover_url}
                          alt={pdf.title}
                          className="w-12 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=100';
                          }}
                        />
                        <div className="absolute -top-1 -right-1">
                          <Cloud className="w-4 h-4 text-red-500" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pdf.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-600 hover:text-blue-800 max-w-xs truncate">
                        <a href={pdf.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
                          <span>{pdf.file_url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {getCategoryName(pdf.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPdfCloud(pdf)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePdfCloud(pdf.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <PaginationControls />
      </div>
    </div>
  );
};

export default PDFCloudManagement;