import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
  Filter,
  UserPlus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface UserFormData {
  username: string;
  name: string;
  access_code: string;
  is_active: boolean;
  audioCategories: number[];
  pdfCategories: number[];
  videoCategories: number[];
  audioCloudCategories: number[];
  pdfCloudCategories: number[];
  fileCloudCategories: number[];
}

const UserManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [userForm, setUserForm] = useState<UserFormData>({
    username: '',
    name: '',
    access_code: '',
    is_active: true,
    audioCategories: [],
    pdfCategories: [],
    videoCategories: [],
    audioCloudCategories: [],
    pdfCloudCategories: [],
    fileCloudCategories: []
  });

  const { 
    categories,
    userAccounts,
    userAudioAccess,
    userPdfAccess,
    userVideoAccess,
    userAudioCloudAccess,
    userPdfCloudAccess,
    userFileCloudAccess,
    loading,
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
    addUserAccess,
    deleteUserAccess,
    deleteAllUserAccessForType,
    refreshData
  } = useData();
  
  const { addToast } = useToast();

  const generateAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setUserForm(prev => ({ ...prev, access_code: code }));
  };

  const resetUserForm = () => {
    setUserForm({
      username: '',
      name: '',
      access_code: '',
      is_active: true,
      audioCategories: [],
      pdfCategories: [],
      videoCategories: [],
      audioCloudCategories: [],
      pdfCloudCategories: [],
      fileCloudCategories: []
    });
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingItem) {
        console.log('Updating existing user:', editingItem.id);
        
        try {
          // Update existing user
          await updateUserAccount(editingItem.id, {
            username: userForm.username,
            name: userForm.name,
            access_code: userForm.access_code,
            is_active: userForm.is_active
          });
          console.log('User account updated successfully');
        } catch (updateError) {
          console.error('Failed to update user account:', updateError);
          throw new Error('Gagal mengupdate akun user');
        }

        try {
          // Delete all existing access for this user using the new function
          console.log('Deleting existing access permissions...');
          await Promise.all([
            deleteAllUserAccessForType(editingItem.id, 'audio'),
            deleteAllUserAccessForType(editingItem.id, 'pdf'),
            deleteAllUserAccessForType(editingItem.id, 'video'),
            deleteAllUserAccessForType(editingItem.id, 'audio_cloud'),
            deleteAllUserAccessForType(editingItem.id, 'pdf_cloud'),
            deleteAllUserAccessForType(editingItem.id, 'file_cloud')
          ]);
          console.log('Existing access permissions deleted successfully');
        } catch (deleteError) {
          console.error('Failed to delete existing access permissions:', deleteError);
          throw new Error('Gagal menghapus akses lama');
        }

        try {
          // Add new access based on form selections
          console.log('Adding new access permissions...');
          const addPromises = [];

          for (const categoryId of userForm.audioCategories) {
            addPromises.push(addUserAccess({ user_id: editingItem.id, category_id: categoryId }, 'audio'));
          }
          for (const categoryId of userForm.pdfCategories) {
            addPromises.push(addUserAccess({ user_id: editingItem.id, category_id: categoryId }, 'pdf'));
          }
          for (const categoryId of userForm.videoCategories) {
            addPromises.push(addUserAccess({ user_id: editingItem.id, category_id: categoryId }, 'video'));
          }
          for (const categoryId of userForm.audioCloudCategories) {
            addPromises.push(addUserAccess({ user_id: editingItem.id, category_id: categoryId }, 'audio_cloud'));
          }
          for (const categoryId of userForm.pdfCloudCategories) {
            addPromises.push(addUserAccess({ user_id: editingItem.id, category_id: categoryId }, 'pdf_cloud'));
          }
          for (const categoryId of userForm.fileCloudCategories) {
            addPromises.push(addUserAccess({ user_id: editingItem.id, category_id: categoryId }, 'file_cloud'));
          }

          await Promise.all(addPromises);
          console.log('New access permissions added successfully');
        } catch (addError) {
          console.error('Failed to add new access permissions:', addError);
          throw new Error('Gagal menambahkan akses baru');
        }
      } else {
        console.log('Creating new user...');
        
        let newUser;
        try {
          // Create new user
          newUser = await addUserAccount({
            username: userForm.username,
            access_code: userForm.access_code,
            name: userForm.name,
            is_active: userForm.is_active
          });
          console.log('New user created successfully:', newUser);
        } catch (createError) {
          console.error('Failed to create user account:', createError);
          throw new Error('Gagal membuat akun user');
        }

        if (newUser) {
          try {
            console.log('Adding access permissions for new user...');
            const accessPromises = [];
            
            for (const categoryId of userForm.audioCategories) {
              accessPromises.push(addUserAccess({ user_id: newUser.id, category_id: categoryId }, 'audio'));
            }
            for (const categoryId of userForm.pdfCategories) {
              accessPromises.push(addUserAccess({ user_id: newUser.id, category_id: categoryId }, 'pdf'));
            }
            for (const categoryId of userForm.videoCategories) {
              accessPromises.push(addUserAccess({ user_id: newUser.id, category_id: categoryId }, 'video'));
            }
            for (const categoryId of userForm.audioCloudCategories) {
              accessPromises.push(addUserAccess({ user_id: newUser.id, category_id: categoryId }, 'audio_cloud'));
            }
            for (const categoryId of userForm.pdfCloudCategories) {
              accessPromises.push(addUserAccess({ user_id: newUser.id, category_id: categoryId }, 'pdf_cloud'));
            }
            for (const categoryId of userForm.fileCloudCategories) {
              accessPromises.push(addUserAccess({ user_id: newUser.id, category_id: categoryId }, 'file_cloud'));
            }
            
            await Promise.all(accessPromises);
            console.log('Access permissions added successfully for new user');
          } catch (accessError) {
            console.error('Failed to add access permissions for new user:', accessError);
            throw new Error('Gagal menambahkan akses untuk user baru');
          }
        } else {
          throw new Error('User baru tidak berhasil dibuat');
        }
      }

      console.log('User operation completed successfully');
      resetUserForm();
      setShowAddForm(false);
      setEditingItem(null);
      await refreshData();
      
      // Show success toast
      addToast({
        type: 'success',
        title: editingItem ? 'User Updated!' : 'User Created!',
        message: editingItem ? 'User berhasil diupdate dengan akses baru' : 'User baru berhasil dibuat dengan akses yang dipilih',
        duration: 4000
      });
    } catch (error) {
      console.error('Error in user operation:', error);
      const errorMessage = error instanceof Error ? error.message : 
        (editingItem ? 'Gagal mengupdate user. Silakan coba lagi.' : 'Gagal membuat user. Silakan coba lagi.');
      
      // Show error toast
      addToast({
        type: 'error',
        title: editingItem ? 'Update Failed' : 'Create Failed',
        message: errorMessage,
        duration: 6000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await deleteUserAccount(userId);
        await refreshData();
        
        addToast({
          type: 'success',
          title: 'User Deleted',
          message: 'User berhasil dihapus dari sistem',
          duration: 3000
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: 'Gagal menghapus user. Silakan coba lagi.',
          duration: 5000
        });
      }
    }
  };

  const handleEditUser = (user: any) => {
    const userAccess = getUserAccess(user.id);
    
    setUserForm({
      username: user.username,
      name: user.name || '',
      access_code: user.access_code,
      is_active: user.is_active,
      audioCategories: userAccess.audio.map(access => access.category_id),
      pdfCategories: userAccess.pdf.map(access => access.category_id),
      videoCategories: userAccess.video.map(access => access.category_id),
      audioCloudCategories: userAccess.audioCloud.map(access => access.category_id),
      pdfCloudCategories: userAccess.pdfCloud.map(access => access.category_id),
      fileCloudCategories: userAccess.fileCloud.map(access => access.category_id)
    });
    
    setEditingItem(user);
    setShowAddForm(true);
  };

  const getUserAccess = (userId: number) => {
    return {
      audio: userAudioAccess.filter(access => access.user_id === userId),
      pdf: userPdfAccess.filter(access => access.user_id === userId),
      video: userVideoAccess.filter(access => access.user_id === userId),
      audioCloud: userAudioCloudAccess.filter(access => access.user_id === userId),
      pdfCloud: userPdfCloudAccess.filter(access => access.user_id === userId),
      fileCloud: userFileCloudAccess.filter(access => access.user_id === userId)
    };
  };

  // Filter and pagination
  const filteredUsers = userAccounts.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredUsers.length / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleCategoryToggle = (categoryId: number, type: keyof UserFormData) => {
    setUserForm(prev => {
      const currentCategories = prev[type] as number[];
      const isSelected = currentCategories.includes(categoryId);
      
      return {
        ...prev,
        [type]: isSelected 
          ? currentCategories.filter(id => id !== categoryId)
          : [...currentCategories, categoryId]
      };
    });
  };

  const PaginationControls = () => {
    const totalPages = getTotalPages();
    
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen User</h2>
          <p className="text-gray-600">Tambah, edit, dan kelola akun pengguna dengan akses ke kategori konten</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari username atau nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
            Aktif
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium">
            Non-aktif
          </button>
        </div>
      </div>

      {/* Add User Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Tambah User Baru</h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowAddForm(false);
                    resetUserForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitUser} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={userForm.username}
                      onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Masukkan username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Masukkan nama"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Access Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Akses
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={userForm.access_code}
                      onChange={(e) => setUserForm(prev => ({ ...prev, access_code: e.target.value }))}
                      placeholder="Kode akses akan digenerate otomatis"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateAccessCode}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={userForm.is_active}
                    onChange={(e) => setUserForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Aktif
                  </label>
                </div>

                {/* Category Access */}
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Akses Kategori</h4>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Regular Categories */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-800">Kategori Regular</h5>
                      
                      {/* Audio Categories */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="font-medium text-gray-700">Audio</span>
                        </div>
                        <div className="space-y-2 ml-5">
                          {categories.filter(c => !c.filter || c.filter === 'audio').map(category => (
                            <label key={`audio-${category.id}`} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={userForm.audioCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id, 'audioCategories')}
                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                              />
                              <span className="text-sm text-gray-700">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* PDF Categories */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-700">PDF</span>
                        </div>
                        <div className="space-y-2 ml-5">
                          {categories.filter(c => c.filter === 'pdf').map(category => (
                            <label key={`pdf-${category.id}`} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={userForm.pdfCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id, 'pdfCategories')}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                              <span className="text-sm text-gray-700">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Video Categories */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium text-gray-700">Video</span>
                        </div>
                        <div className="space-y-2 ml-5">
                          {categories.filter(c => c.filter === 'video').map(category => (
                            <label key={`video-${category.id}`} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={userForm.videoCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id, 'videoCategories')}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Cloud Categories */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-800">Kategori Cloud</h5>
                      
                      {/* Audio Cloud Categories */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-700">Audio Cloud</span>
                        </div>
                        <div className="space-y-2 ml-5">
                          {categories.filter(c => c.filter === 'audio_cloud').map(category => (
                            <label key={`audio-cloud-${category.id}`} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={userForm.audioCloudCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id, 'audioCloudCategories')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* PDF Cloud Categories */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-medium text-gray-700">PDF Cloud</span>
                        </div>
                        <div className="space-y-2 ml-5">
                          {categories.filter(c => c.filter === 'pdf_cloud').map(category => (
                            <label key={`pdf-cloud-${category.id}`} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={userForm.pdfCloudCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id, 'pdfCloudCategories')}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                              />
                              <span className="text-sm text-gray-700">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* File Cloud Categories */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                          <span className="font-medium text-gray-700">File Cloud</span>
                        </div>
                        <div className="space-y-2 ml-5">
                          {categories.filter(c => c.filter === 'file_cloud').map(category => (
                            <label key={`file-cloud-${category.id}`} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={userForm.fileCloudCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id, 'fileCloudCategories')}
                                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                              />
                              <span className="text-sm text-gray-700">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setShowAddForm(false);
                      resetUserForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    {/* Update Button */}
                    <button
                      type="submit"
                      disabled={!editingItem || isSubmitting}
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting && editingItem ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Mengupdate...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Update</span>
                        </>
                      )}
                    </button>
                    
                    {/* Create Button */}
                    <button
                      type="submit"
                      disabled={editingItem !== null || isSubmitting}
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting && !editingItem ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Membuat...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Create</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kode Akses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori Regular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori Cloud
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                    Tidak ada user yang ditemukan
                  </td>
                </tr>
              ) : (
                getPaginatedData().map((user) => {
                  const userAccess = getUserAccess(user.id);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900 font-mono">
                            {showPassword ? user.access_code : '••••••'}
                          </span>
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.name || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {userAccess.audio.length > 0 && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                              Audio ({userAccess.audio.length})
                            </span>
                          )}
                          {userAccess.pdf.length > 0 && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              PDF ({userAccess.pdf.length})
                            </span>
                          )}
                          {userAccess.video.length > 0 && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                              Video ({userAccess.video.length})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {userAccess.audioCloud.length > 0 && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Audio Cloud ({userAccess.audioCloud.length})
                            </span>
                          )}
                          {userAccess.pdfCloud.length > 0 && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              PDF Cloud ({userAccess.pdfCloud.length})
                            </span>
                          )}
                          {userAccess.fileCloud.length > 0 && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
                              File Cloud ({userAccess.fileCloud.length})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <PaginationControls />
      </div>
    </div>
  );
};

export default UserManagement;