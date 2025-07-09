import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Music, 
  BookOpen, 
  Video, 
  FileText, 
  Settings, 
  LogOut, 
  Shield,
  Cloud,
  Folder,
  MessageCircle
} from 'lucide-react';

// Import management components
import UserManagement from '../components/admin/UserManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import AdminManagement from '../components/admin/AdminManagement';
import AudioManagement from '../components/admin/AudioManagement';
import PDFManagement from '../components/admin/PDFManagement';
import PDFCloudManagement from '../components/admin/PDFCloudManagement';
import VideoManagement from '../components/admin/VideoManagement';
import FileManagement from '../components/admin/FileManagement';
import TelegramManagement from '../components/admin/TelegramManagement';
import ScalevManagement from '../components/admin/ScalevManagement';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user?.isAdmin) {
    return null;
  }

  const tabs = [
    { id: 'users', label: 'Manajemen User', icon: Users, component: UserManagement },
    { id: 'categories', label: 'Manajemen Kategori', icon: Folder, component: CategoryManagement },
    { id: 'admins', label: 'Manajemen Admin', icon: Shield, component: AdminManagement },
    { id: 'audio', label: 'Manajemen Audio', icon: Music, component: AudioManagement },
    { id: 'pdf', label: 'Manajemen PDF', icon: BookOpen, component: PDFManagement },
    { id: 'pdf-cloud', label: 'Manajemen PDF Cloud', icon: Cloud, component: PDFCloudManagement },
    { id: 'video', label: 'Manajemen Video', icon: Video, component: VideoManagement },
    { id: 'files', label: 'Manajemen File', icon: FileText, component: FileManagement },
    { id: 'telegram', label: 'Manajemen Telegram', icon: MessageCircle, component: TelegramManagement },
    { id: 'scalev', label: 'Manajemen Scalev', icon: Cloud, component: ScalevManagement }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              </div>
              <div className="text-sm text-gray-600">
                {user?.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          {/* Desktop Tabs - Horizontal */}
          <nav className="hidden sm:flex space-x-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
          
          {/* Mobile Tabs - Grid Layout */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center py-3 px-2 border-2 font-medium text-xs transition-colors rounded-lg min-h-[70px] ${
                      activeTab === tab.id
                        ? 'border-purple-500 bg-purple-50 text-purple-600'
                        : 'border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-center leading-tight">
                      {tab.label.replace('Manajemen ', '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        {ActiveComponent ? (
          <ActiveComponent />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTabData?.label}
            </h3>
            <p className="text-gray-600">Fitur ini akan segera tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;