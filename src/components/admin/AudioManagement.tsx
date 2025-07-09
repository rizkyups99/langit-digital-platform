import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { uploadFile } from '../../utils/supabaseStorage';
import { useToast } from '../../contexts/ToastContext';
import { 
  Music, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Upload
} from 'lucide-react';

interface AudioFormData {
  title: string;
  file_url: string;
  categoryId: number;
}

const AudioManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [audioForm, setAudioForm] = useState<AudioFormData>({
    title: '',
    file_url: '',
    categoryId: ''
  });

  const { 
    audioFiles,
    categories,
    loading,
    addAudioFile,
    updateAudioFile,
    deleteAudioFile,
    refreshData
  } = useData();

  const { addToast } = useToast();

  const resetAudioForm = () => {
    setAudioForm({
      title: '',
      file_url: '',
      categoryId: ''
    });
    setAudioFile(null);
    setUploadProgress(0);
  };

  const handleSubmitAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Validate category selection
      if (!audioForm.categoryId || audioForm.categoryId === '') {
        addToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Silakan pilih kategori untuk audio ini',
          duration: 5000
        });
        return;
      }

      let fileUrl = audioForm.file_url;
      
      // Upload audio file if selected
      if (audioFile) {
        setUploadProgress(20);
        fileUrl = await uploadFile(audioFile, 'audio-mp3');
        setUploadProgress(80);
      }
      
      // Validate that we have a file URL (either uploaded or existing)
      if (!fileUrl) {
        throw new Error('File audio harus dipilih atau URL harus diisi');
      }
      
      // Update form data with new URL
      const updatedAudioData = {
        ...audioForm,
        file_url: fileUrl,
        categoryId: Number(audioForm.categoryId) // Convert to number for database
      };
      
      if (editingItem) {
        await updateAudioFile(editingItem.id, updatedAudioData);
      } else {
        await addAudioFile(updatedAudioData);
      }
      
      setUploadProgress(100);
      resetAudioForm();
      setShowAddForm(false);
      setEditingItem(null);
      await refreshData();
      
      addToast({
        type: 'success',
        title: editingItem ? 'Audio Updated' : 'Audio Added',
        message: `Audio ${editingItem ? 'updated' : 'added'} successfully`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error saving audio:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Gagal menyimpan audio. Silakan coba lagi.',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAudio = async (audioId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus audio ini?')) {
      try {
        await deleteAudioFile(audioId);
        await refreshData();
      } catch (error) {
        console.error('Error deleting audio:', error);
        alert('Gagal menghapus audio. Silakan coba lagi.');
      }
    }
  };

  const handleEditAudio = (audio: any) => {
    setAudioForm({
      title: audio.title,
      file_url: audio.file_url,
      categoryId: audio.categoryId.toString() // Convert to string for form
    });
    setAudioFile(null);
    setEditingItem(audio);
    setShowAddForm(true);
  };

  // Filter and pagination
  const filteredAudioFiles = audioFiles.filter(audio => {
    const matchesSearch = audio.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || audio.categoryId.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAudioFiles.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredAudioFiles.length / itemsPerPage);
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAudioFiles.length)} of {filteredAudioFiles.length} files
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        ? 'bg-purple-600 text-white'
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Audio</h2>
          <p className="text-gray-600">Upload dan kelola file audio untuk pengguna</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Audio</span>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Semua Kategori</option>
          {categories.filter(c => !c.filter || c.filter === 'audio').map(category => (
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

      {/* Add/Edit Audio Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Audio' : 'Upload Audio'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    resetAudioForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitAudio} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Audio
                  </label>
                  <input
                    type="text"
                    value={audioForm.title}
                    onChange={(e) => setAudioForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Masukkan judul audio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={audioForm.categoryId}
                    onChange={(e) => setAudioForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled hidden>Pilih Kategori</option>
                    {categories.filter(c => !c.filter || c.filter === 'audio').map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Audio
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {audioFile && (
                      <div className="text-sm text-green-600">
                        Selected: {audioFile.name}
                      </div>
                    )}
                    {editingItem && !audioFile && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Current file:</span>
                        <a 
                          href={audioForm.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          View Audio
                        </a>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Format file: MP3, WAV, M4A, atau format audio lainnya (maksimal 50MB)
                    </p>
                  </div>
                </div>

                {/* Alternative URL input for manual entry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Atau masukkan URL Audio (opsional)
                  </label>
                  <input
                    type="url"
                    value={audioForm.file_url}
                    onChange={(e) => setAudioForm(prev => ({ ...prev, file_url: e.target.value }))}
                    placeholder="https://example.com/audio.mp3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={!!audioFile}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Jika Anda memilih file di atas, URL ini akan diabaikan. Salah satu dari file atau URL harus diisi.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                      resetAudioForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span>{editingItem ? 'Update' : 'Upload'} Audio</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Audio Files Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul Audio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audio
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
                    Tidak ada audio yang ditemukan
                  </td>
                </tr>
              ) : (
                getPaginatedData().map((audio, index) => (
                  <tr key={audio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((currentPage - 1) * itemsPerPage) + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {audio.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <audio controls className="w-48">
                          <source src={audio.file_url} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-600 hover:text-blue-800 max-w-xs truncate">
                        <a href={audio.file_url} target="_blank" rel="noopener noreferrer">
                          {audio.file_url}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        {getCategoryName(audio.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAudio(audio)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAudio(audio.id)}
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

export default AudioManagement;