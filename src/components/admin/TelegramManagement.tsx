import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  MessageCircle, 
  Settings, 
  Save, 
  RefreshCw,
  Bot,
  Globe,
  Copy,
  CheckCircle,
  Plus,
  Trash2,
  Edit,
  Clock,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const TelegramManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('settings');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [whatsappSettings, setWhatsappSettings] = useState({
    whatsapp_number: '',
    whatsapp_message: ''
  });
  
  const [telegramSettings, setTelegramSettings] = useState({
    bot_token: '',
    webhook_url: '',
    active_domain: '',
    additional_domains: [
      'https://langit-digital-telelogin.vercel.app',
      'https://telegram-autologin.getcreatr.dev',
      'https://www.ikhtiarjalurlangit.my.id'
    ] as string[]
  });

  const { 
    telegramMessages,
    telegramSettings: dbTelegramSettings,
    whatsappButtonSettings,
    loading,
    updateTelegramSetting,
    updateWhatsappButtonSetting,
    refreshData
  } = useData();

  // Initialize settings from database
  React.useEffect(() => {
    if (dbTelegramSettings.length > 0) {
      const settingsObj: any = {};
      dbTelegramSettings.forEach(setting => {
        if (setting.key === 'additional_domains') {
          settingsObj[setting.key] = setting.value ? JSON.parse(setting.value) : [];
        } else {
          settingsObj[setting.key] = setting.value || '';
        }
      });
      setTelegramSettings(prev => ({ ...prev, ...settingsObj }));
    }
  }, [dbTelegramSettings]);

  // Initialize WhatsApp settings from database
  React.useEffect(() => {
    if (whatsappButtonSettings.length > 0) {
      const settingsObj: any = {};
      whatsappButtonSettings.forEach(setting => {
        settingsObj[setting.key] = setting.value || '';
      });
      setWhatsappSettings(prev => ({ ...prev, ...settingsObj }));
    }
  }, [whatsappButtonSettings]);

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateTelegramSetting('bot_token', telegramSettings.bot_token),
        updateTelegramSetting('webhook_url', telegramSettings.webhook_url),
        updateTelegramSetting('active_domain', telegramSettings.active_domain),
        updateTelegramSetting('additional_domains', JSON.stringify(telegramSettings.additional_domains))
      ]);
      await refreshData();
      alert('Pengaturan Telegram berhasil disimpan!');
    } catch (error) {
      console.error('Error saving telegram settings:', error);
      alert('Gagal menyimpan pengaturan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveWhatsappSettings = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateWhatsappButtonSetting('whatsapp_number', whatsappSettings.whatsapp_number),
        updateWhatsappButtonSetting('whatsapp_message', whatsappSettings.whatsapp_message)
      ]);
      await refreshData();
      alert('Pengaturan WhatsApp berhasil disimpan!');
    } catch (error) {
      console.error('Error saving WhatsApp settings:', error);
      alert('Gagal menyimpan pengaturan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      setTelegramSettings(prev => ({
        ...prev,
        additional_domains: [...prev.additional_domains, newDomain.trim()]
      }));
      setNewDomain('');
      setShowAddDomain(false);
    }
  };

  const handleRemoveDomain = (index: number) => {
    setTelegramSettings(prev => ({
      ...prev,
      additional_domains: prev.additional_domains.filter((_, i) => i !== index)
    }));
  };

  const handleSetActiveDomain = (domain: string) => {
    setTelegramSettings(prev => ({
      ...prev,
      active_domain: domain,
      webhook_url: `${domain}/api/telegram/webhook`
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Disalin ke clipboard!');
  };

  // Pagination for messages
  const getPaginatedMessages = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return telegramMessages.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(telegramMessages.length / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const PaginationControls = () => {
    const totalPages = getTotalPages();
    
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, telegramMessages.length)} of {telegramMessages.length} messages
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        ? 'bg-blue-600 text-white'
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
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan Bot Telegram</h2>
          <p className="text-gray-600">Konfigurasikan bot Telegram Anda untuk menerima pesan ke aplikasi ini</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeSubTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Pengaturan Bot</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab('messages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeSubTab === 'messages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Logs Pesan</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab('whatsapp')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeSubTab === 'whatsapp'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>WA Tombol</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab('format')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeSubTab === 'format'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Format Pesan</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Settings Tab */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6">
          {/* Bot Configuration */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Konfigurasi Bot</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Token
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={telegramSettings.bot_token}
                    onChange={(e) => setTelegramSettings(prev => ({ ...prev, bot_token: e.target.value }))}
                    placeholder="5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(telegramSettings.bot_token)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Dapatkan token ini dari @BotFather saat Anda membuat bot
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="url"
                    value={telegramSettings.webhook_url}
                    onChange={(e) => setTelegramSettings(prev => ({ ...prev, webhook_url: e.target.value }))}
                    placeholder="https://www.langitdigitalcatalog.my.id/api/telegram/webhook"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(telegramSettings.webhook_url)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ini adalah URL tempat Telegram akan mengirimkan notifikasi
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Webhook Status</span>
                </div>
                {telegramSettings.webhook_url ? (
                  <div className="space-y-2">
                    <div className="text-sm text-blue-800 break-all font-mono bg-white p-2 rounded border">
                      {telegramSettings.webhook_url}
                    </div>
                    <p className="text-xs text-blue-700">
                      Webhook URL ini sedang aktif dan dapat menerima notifikasi Telegram
                    </p>
                    <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Update Webhook
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700">
                      Belum ada webhook yang diatur. Silakan atur domain aktif dan webhook URL.
                    </p>
                    <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Atur Webhook
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Domain Management */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900">Pilihan Domain Tambahan</h3>
              <button
                onClick={() => setShowAddDomain(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Domain</span>
              </button>
            </div>

            {/* Add Domain Form */}
            {showAddDomain && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="url"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="https://langit-digital-telegram.vercel.app"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddDomain}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Tambah
                    </button>
                    <button
                      onClick={() => {
                        setShowAddDomain(false);
                        setNewDomain('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Domain List */}
            <div className="space-y-3">
              {telegramSettings.additional_domains.map((domain, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 break-all">{domain}</div>
                    <div className="text-xs text-gray-500">{domain}/api/telegram/webhook</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSetActiveDomain(domain)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        telegramSettings.active_domain === domain
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {telegramSettings.active_domain === domain ? 'Aktif' : 'Atur Aktif'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(`${domain}/api/telegram/webhook`)}
                      className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveDomain(index)}
                      className="p-1 text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {telegramSettings.additional_domains.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Belum ada domain tambahan</p>
                </div>
              )}
            </div>

            {/* Active Domain Display */}
            {telegramSettings.active_domain && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Domain Aktif</span>
                </div>
                <div className="text-sm text-green-800 break-all">
                  {telegramSettings.active_domain}/api/telegram/webhook
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Webhook ini sedang aktif dan dapat menerima pesan Telegram
                </p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Messages Tab - Logs Pesan */}
      {activeSubTab === 'messages' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Logs Pesan yang Diterima</h3>
            <p className="text-sm text-gray-600 mt-1">Daftar pesan yang berhasil diterima dari bot Telegram</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konten
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor HP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <RefreshCw className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                        <span className="text-gray-500">Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : getPaginatedMessages().length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Tidak ada pesan yang ditemukan
                    </td>
                  </tr>
                ) : (
                  getPaginatedMessages().map((message: any, index) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {((currentPage - 1) * itemsPerPage) + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {message.message_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {message.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {message.phone_number || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {message.customer_name || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          message.processed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {message.processed ? 'Diproses' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(message.created_at).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
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
      )}

      {/* WhatsApp Button Tab */}
      {activeSubTab === 'whatsapp' && (
        <div className="space-y-6">
          {/* WhatsApp Button Configuration */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Pengaturan Tombol WhatsApp</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor WhatsApp Admin
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={whatsappSettings.whatsapp_number}
                    onChange={(e) => setWhatsappSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                    placeholder="6281234567890"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(whatsappSettings.whatsapp_number)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Nomor WhatsApp yang akan dihubungi user (format: 62xxxxxxxxxx)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pesan Default
                </label>
                <div className="flex flex-col space-y-2">
                  <textarea
                    value={whatsappSettings.whatsapp_message}
                    onChange={(e) => setWhatsappSettings(prev => ({ ...prev, whatsapp_message: e.target.value }))}
                    placeholder="Halo, saya ingin mengajukan akses ke Langit Digital"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(whatsappSettings.whatsapp_message)}
                    className="self-start px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Pesan</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Pesan yang akan otomatis muncul saat user klik tombol "Chat ke Admin"
                </p>
              </div>

              {/* Preview */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Preview URL WhatsApp</span>
                </div>
                <div className="text-sm text-green-800 break-all font-mono bg-white p-2 rounded border">
                  {`https://wa.me/${whatsappSettings.whatsapp_number}?text=${encodeURIComponent(whatsappSettings.whatsapp_message)}`}
                </div>
                <div className="mt-3">
                  <a
                    href={`https://wa.me/${whatsappSettings.whatsapp_number}?text=${encodeURIComponent(whatsappSettings.whatsapp_message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Test WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveWhatsappSettings}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Format Tab */}
      {activeSubTab === 'format' && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Format Pesan</h3>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Edit className="w-4 h-4" />
              <span>Edit Format</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <div className="text-gray-700">
              <div className="text-blue-600 font-semibold">PERMINTAAN</div>
              <div>Nama : Rizky</div>
              <div>HP : 6285678901234</div>
              <div>Kode Akses : 6285678901234</div>
              <div className="text-red-600 font-semibold mt-2">Kategori Audio :</div>
              <div className="text-green-600 font-semibold">Kategori PDF :</div>
              <div className="text-purple-600 font-semibold">Kategori Video :</div>
              <div className="text-blue-600 font-semibold">Kategori Audio Cloud :</div>
              <div className="text-red-600 font-semibold">Kategori PDF Cloud :</div>
              <div className="text-teal-600 font-semibold">Kategori File Cloud :</div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Sistem akan mengenerate nomor telepon dari nama dan pesan pembayaran dan membuat akun pengguna secara otomatis.
          </p>
        </div>
      )}
    </div>
  );
};

export default TelegramManagement;