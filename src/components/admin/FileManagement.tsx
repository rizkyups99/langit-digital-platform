import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { uploadFile } from '../../utils/supabaseStorage';
import { useToast } from '../../contexts/ToastContext';
import { 
  FileText, 
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
  ExternalLink,
  Image,
  File
} from 'lucide-react';

interface FileFormData {
  title: string;
  cover_url: string;
  file_url: string;
  file_type: string;
  categoryId: number;
}

const FileManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [fileForm, setFileForm] = useState<FileFormData>({
    title: '',
    cover_url: '',
    file_url: '',
    file_type: '',
    categoryId: 0
  });

  const { 
    otherFiles,
    categories,
    loading,
    addOtherFile,
    updateOtherFile,
    deleteOtherFile,
    refreshData
  } = useData();

  const { addToast } = useToast();

  const resetFileForm = () => {
    setFileForm({
      title: '',
      cover_url: '',
      file_url: '',
      file_type: '',
      categoryId: 0
    });
    setCoverFile(null);
    setUploadProgress(0);
  };

  const handleSubmitFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let coverUrl = fileForm.cover_url;
      
      // Upload cover image if selected
      if (coverFile) {
        setUploadProgress(20);
        coverUrl = await uploadFile(coverFile, 'file-cloud-covers');
        setUploadProgress(80);
      }
      
      // Update form data with new URL
      const updatedFileData = {
        ...fileForm,
        cover_url: coverUrl
      };
      
      if (editingItem) {
        await updateOtherFile(editingItem.id, updatedFileData);
      } else {
        await addOtherFile(updatedFileData);
      }
      
      setUploadProgress(100);
      resetFileForm();
      setShowAddForm(false);
      setEditingItem(null);
      await refreshData();
      
      addToast({
        type: 'success',
        title: editingItem ? 'File Updated' : 'File Added',
        message: `File ${editingItem ? 'updated' : 'added'} successfully`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error saving file:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Gagal menyimpan file. Silakan coba lagi.',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus file ini?')) {
      try {
        await deleteOtherFile(fileId);
        await refreshData();
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Gagal menghapus file. Silakan coba lagi.');
      }
    }
  };

  const handleEditFile = (file: any) => {
    setFileForm({
      title: file.title,
      cover_url: file.cover_url,
      file_url: file.file_url,
      file_type: file.file_type || '',
      categoryId: file.categoryId
    });
    setCoverFile(null);
    setEditingItem(file);
    setShowAddForm(true);
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase() || '';
    if (type.includes('image') || type.includes('jpg') || type.includes('png') || type.includes('jpeg')) {
      return <Image className="w-6 h-6 text-green-600" />;
    }
    if (type.includes('pdf')) {
      return <FileText className="w-6 h-6 text-red-600" />;
    }
    if (type.includes('doc') || type.includes('docx') || type.includes('txt')) {
      return <FileText className="w-6 h-6 text-blue-600" />;
    }
    if (type.includes('ppt') || type.includes('pptx')) {
      return <FileText className="w-6 h-6 text-orange-600" />;
    }
    if (type.includes('xls') || type.includes('xlsx')) {
      return <FileText className="w-6 h-6 text-green-600" />;
    }
    return <File className="w-6 h-6 text-gray-600" />;
  };

  const getFileTypeBadgeColor = (fileType: string) => {
    const type = fileType?.toLowerCase() || '';
    if (type.includes('image')) return 'bg-green-100 text-green-800';
    if (type.includes('pdf')) return 'bg-red-100 text-red-800';
    if (type.includes('doc')) return 'bg-blue-100 text-blue-800';
    if (type.includes('ppt')) return 'bg-orange-100 text-orange-800';
    if (type.includes('xls')) return 'bg-emerald-100 text-emerald-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Filter and pagination
  const filteredFiles = otherFiles.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || file.categoryId.toString() === categoryFilter;
    const matchesFileType = !fileTypeFilter || (file.file_type && file.file_type.toLowerCase().includes(fileTypeFilter.toLowerCase()));
    return matchesSearch && matchesCategory && matchesFileType;
  });

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFiles.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredFiles.length / itemsPerPage);
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredFiles.length)} of {filteredFiles.length} files
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                        ? 'bg-teal-600 text-white'
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen File</h2>
          <p className="text-gray-600">Upload dan kelola berbagai jenis file untuk pengguna</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Semua Kategori</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select
          value={fileTypeFilter}
          onChange={(e) => setFileTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Semua Tipe File</option>
          <option value="pdf">PDF</option>
          <option value="doc">Document</option>
          <option value="ppt">Presentation</option>
          <option value="xls">Spreadsheet</option>
          <option value="image">Image</option>
        </select>
        <button
          onClick={() => {
            setSearchTerm('');
            setCategoryFilter('');
            setFileTypeFilter('');
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Add/Edit File Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit File' : 'Upload File'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    resetFileForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitFile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul File
                  </label>
                  <input
                    type="text"
                    value={fileForm.title}
                    onChange={(e) => setFileForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Masukkan judul file"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={fileForm.categoryId}
                    onChange={(e) => setFileForm(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                    Tipe File
                  </label>
                  <select
                    value={fileForm.file_type}
                    onChange={(e) => setFileForm(prev => ({ ...prev, file_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Tipe File</option>
                    <option value="pdf">PDF</option>
                    <option value="doc">Document (DOC/DOCX)</option>
                    <option value="ppt">Presentation (PPT/PPTX)</option>
                    <option value="xls">Spreadsheet (XLS/XLSX)</option>
                    <option value="image">Image (JPG/PNG)</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image (Opsional)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    {coverFile && (
                      <div className="text-sm text-green-600">
                        Selected: {coverFile.name}
                      </div>
                    )}
                    {editingItem && fileForm.cover_url && !coverFile && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Current cover:</span>
                        <a 
                          href={fileForm.cover_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          View
                        </a>
                        <img 
                          src={fileForm.cover_url} 
                          alt="Current cover" 
                          className="h-10 w-auto rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL File
                  </label>
                  <input
                    type="url"
                    value={fileForm.file_url}
                    onChange={(e) => setFileForm(prev => ({ ...prev, file_url: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL file dari Google Drive atau cloud storage lainnya
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                      resetFileForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <Upload className="w-4 h-4" />
                        <span>{editingItem ? 'Update' : 'Upload'} File</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Files Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
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
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                      <span className="text-gray-500">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : getPaginatedData().length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada file yang ditemukan
                  </td>
                </tr>
              ) : (
                getPaginatedData().map((file, index) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((currentPage - 1) * itemsPerPage) + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.file_type || '')}
                        {file.cover_url && (
                          <img
                            src={file.cover_url}
                            alt={file.title}
                            className="w-8 h-8 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {file.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFileTypeBadgeColor(file.file_type || '')}`}>
                        {file.file_type?.toUpperCase() || 'FILE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-600 hover:text-blue-800 max-w-xs truncate">
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
                          <span>{file.file_url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">
                        {getCategoryName(file.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditFile(file)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
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

export default FileManagement;