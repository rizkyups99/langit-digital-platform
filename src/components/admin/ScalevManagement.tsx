import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  Copy,
  CheckCircle,
  Plus,
  Trash2,
  Edit,
  Cloud // Using Cloud for Scalev general icon
} from 'lucide-react';

const ScalevManagement: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  const [scalevSettings, setScalevSettings] = useState({
    api_key: '', // Placeholder for a generic API key if Scalev has one
    webhook_url: '',
    active_domain: '',
    additional_domains: [] as string[]
  });

  const {
    scalevSettings: dbScalevSettings, // Renamed to avoid conflict with local state
    loading, // Although not directly used for initial load, good to keep
    updateScalevSetting,
    refreshData
  } = useData();

  // Initialize settings from database
  React.useEffect(() => {
    if (dbScalevSettings.length > 0) {
      const settingsObj: any = {};
      dbScalevSettings.forEach(setting => {
        if (setting.key === 'additional_domains') {
          settingsObj[setting.key] = setting.value ? JSON.parse(setting.value) : [];
        } else {
          settingsObj[setting.key] = setting.value || '';
        }
      });
      setScalevSettings(prev => ({ ...prev, ...settingsObj }));
    }
  }, [dbScalevSettings]);

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateScalevSetting('api_key', scalevSettings.api_key),
        updateScalevSetting('webhook_url', scalevSettings.webhook_url),
        updateScalevSetting('active_domain', scalevSettings.active_domain),
        updateScalevSetting('additional_domains', JSON.stringify(scalevSettings.additional_domains))
      ]);
      await refreshData();
      alert('Pengaturan Scalev berhasil disimpan!');
    } catch (error) {
      console.error('Error saving Scalev settings:', error);
      alert('Gagal menyimpan pengaturan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDomain = () => {
    if (newDomain.trim() && !scalevSettings.additional_domains.includes(newDomain.trim())) {
      setScalevSettings(prev => ({
        ...prev,
        additional_domains: [...prev.additional_domains, newDomain.trim()]
      }));
      setNewDomain('');
      setShowAddDomain(false);
    } else if (scalevSettings.additional_domains.includes(newDomain.trim())) {
      alert('Domain sudah ada.');
    }
  };

  const handleRemoveDomain = (index: number) => {
    setScalevSettings(prev => ({
      ...prev,
      additional_domains: prev.additional_domains.filter((_, i) => i !== index)
    }));
  };

  const handleSetActiveDomain = (domain: string) => {
    setScalevSettings(prev => ({
      ...prev,
      active_domain: domain,
      webhook_url: `${domain}/api/scalev/webhook` // Assuming a similar webhook path
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Disalin ke clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan Scalev</h2>
          <p className="text-gray-600">Konfigurasikan integrasi Scalev Anda</p>
        </div>
      </div>

      {/* Settings Tab */}
      <div className="space-y-6">
        {/* Scalev Configuration */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Konfigurasi Scalev</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key (Opsional)
              </label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  value={scalevSettings.api_key}
                  onChange={(e) => setScalevSettings(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="Masukkan API Key Scalev Anda"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => copyToClipboard(scalevSettings.api_key)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Jika Scalev memerlukan API Key untuk otentikasi
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="url"
                  value={scalevSettings.webhook_url}
                  onChange={(e) => setScalevSettings(prev => ({ ...prev, webhook_url: e.target.value }))}
                  placeholder="https://your-app.com/api/scalev/webhook"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => copyToClipboard(scalevSettings.webhook_url)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ini adalah URL tempat Scalev akan mengirimkan notifikasi
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Atur Webhook</span>
              </div>
              <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Atur Webhook (Simulasi)
              </button>
              <p className="text-xs text-blue-700 mt-1">
                (Fungsionalitas ini akan memerlukan implementasi backend terpisah untuk berinteraksi dengan API Scalev)
              </p>
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
                  placeholder="https://your-custom-domain.com"
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
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Domain List */}
          <div className="space-y-3">
            {scalevSettings.additional_domains.map((domain, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 break-all">{domain}</div>
                  <div className="text-xs text-gray-500">{domain}/api/scalev/webhook</div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSetActiveDomain(domain)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      scalevSettings.active_domain === domain
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {scalevSettings.active_domain === domain ? 'Aktif' : 'Atur Aktif'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(`${domain}/api/scalev/webhook`)}
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

            {scalevSettings.additional_domains.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada domain tambahan</p>
              </div>
            )}
          </div>

          {/* Active Domain Display */}
          {scalevSettings.active_domain && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Domain Aktif</span>
              </div>
              <div className="text-sm text-green-800 break-all">
                {scalevSettings.active_domain}/api/scalev/webhook
              </div>
              <p className="text-xs text-green-600 mt-1">
                Webhook ini sedang aktif dan dapat menerima notifikasi Scalev
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
    </div>
  );
};

export default ScalevManagement;
