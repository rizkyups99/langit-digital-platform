import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useUserAccess } from '../hooks/useUserAccess';
import AudioPlayer from '../components/AudioPlayer';
import AudioCard from '../components/user/AudioCard';
import AudioCloudCard from '../components/user/AudioCloudCard';
import PDFCard from '../components/user/PDFCard';
import PDFCloudCard from '../components/user/PDFCloudCard';
import VideoCard from '../components/user/VideoCard';
import FileCard from '../components/user/FileCard';
import CategorySection from '../components/user/CategorySection';
import TabNavigation from '../components/user/TabNavigation';
import UserWelcome from '../components/user/UserWelcome';
import { LogOut, Cloud, Play, BookOpen, Video, FileText } from 'lucide-react';

const UserPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('');
  const [currentAudio, setCurrentAudio] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({
    audio: true, // Default first category expanded
  });
  
  const { user, logout } = useAuth();
  const { categories, loading } = useData();
  const accessibleContent = useUserAccess();
  const navigate = useNavigate();

  // Set initial active tab based on available tabs
  React.useEffect(() => {
    if (accessibleContent.availableTabs && accessibleContent.availableTabs.length > 0 && !activeTab) {
      setActiveTab(accessibleContent.availableTabs[0]);
    }
  }, [accessibleContent.availableTabs, activeTab]);

  // Update active tab if current tab is not available
  React.useEffect(() => {
    if (activeTab && accessibleContent.availableTabs && !accessibleContent.availableTabs.includes(activeTab)) {
      if (accessibleContent.availableTabs.length > 0) {
        setActiveTab(accessibleContent.availableTabs[0]);
      }
    }
  }, [activeTab, accessibleContent.availableTabs]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePlayAudio = (audio: any) => {
    if (currentAudio && currentAudio.id === audio.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(audio);
      setIsPlaying(true);
    }
  };

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Group content by categories
  const groupContentByCategory = (content: any[], type: string) => {
    const grouped: {[key: number]: any[]} = {};
    content.forEach(item => {
      if (!grouped[item.categoryId]) {
        grouped[item.categoryId] = [];
      }
      grouped[item.categoryId].push(item);
    });
    return grouped;
  };

  const getCategoryInfo = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      name: category?.name || 'Kategori Umum',
      description: category?.description || 'Deskripsi kategori tidak tersedia'
    };
  };

  const renderCategoryContent = (contentType: string, content: any[], emptyMessage: string) => {
    const groupedContent = groupContentByCategory(content, contentType);
    const categoryIds = Object.keys(groupedContent).map(Number);

    if (categoryIds.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
            {contentType === 'audio' && <Play className="w-full h-full" />}
            {contentType === 'pdf' && <BookOpen className="w-full h-full" />}
            {contentType === 'video' && <Video className="w-full h-full" />}
            {contentType === 'files' && <FileText className="w-full h-full" />}
            {contentType.includes('cloud') && <Cloud className="w-full h-full" />}
          </div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {categoryIds.map(categoryId => {
          const categoryInfo = getCategoryInfo(categoryId);
          const categoryContent = groupedContent[categoryId];
          const categoryKey = `${contentType}-${categoryId}`;
          
          return (
            <CategorySection
              key={categoryKey}
              title={categoryInfo.name}
              description={categoryInfo.description}
              contentCount={categoryContent.length}
              contentType={getContentTypeLabel(contentType)}
              isExpanded={expandedCategories[categoryKey] || false}
              onToggle={() => toggleCategory(categoryKey)}
              isEmpty={categoryContent.length === 0}
              emptyMessage={`Tidak ada ${getContentTypeLabel(contentType).toLowerCase()} dalam kategori ini`}
            >
              {categoryContent.map((item) => {
                switch (contentType) {
                  case 'audio':
                    return (
                      <AudioCard
                        key={item.id}
                        audio={item}
                        isPlaying={isPlaying}
                        isCurrentAudio={currentAudio?.id === item.id}
                        onPlay={() => handlePlayAudio(item)}
                        categoryName={categoryInfo.name}
                      />
                    );
                  case 'audio-cloud':
                    return (
                      <AudioCloudCard
                        key={`cloud-${item.id}`}
                        audio={item}
                        isPlaying={isPlaying}
                        isCurrentAudio={currentAudio?.id === item.id}
                        onPlay={() => handlePlayAudio(item)}
                        categoryName={categoryInfo.name}
                      />
                    );
                  case 'pdf':
                    return (
                      <PDFCard
                        key={item.id}
                        pdf={item}
                        categoryName={categoryInfo.name}
                      />
                    );
                  case 'pdf-cloud':
                    return (
                      <PDFCloudCard
                        key={`cloud-${item.id}`}
                        pdf={item}
                        categoryName={categoryInfo.name}
                      />
                    );
                  case 'video':
                    return (
                      <VideoCard
                        key={item.id}
                        video={item}
                        categoryName={categoryInfo.name}
                      />
                    );
                  case 'files':
                    return (
                      <FileCard
                        key={item.id}
                        file={item}
                        categoryName={categoryInfo.name}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </CategorySection>
          );
        })}
      </div>
    );
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'audio': return 'Audio';
      case 'audio-cloud': return 'Audio Cloud';
      case 'pdf': return 'PDF';
      case 'pdf-cloud': return 'PDF Cloud';
      case 'video': return 'Video';
      case 'files': return 'File';
      default: return 'Konten';
    }
  };

  const renderCloudHeader = (title: string, description: string, gradientClass: string, icon: React.ComponentType<{ className?: string }>) => {
    const Icon = icon;
    return (
      <div className={`${gradientClass} rounded-xl p-4 sm:p-6 text-white mb-6`}>
        <div className="flex items-center space-x-3 mb-2">
          <Icon className="w-6 sm:w-8 h-6 sm:h-8" />
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        </div>
        <p className="text-sm sm:text-base opacity-90">{description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Langit Digital</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-red-600 transition-colors text-sm bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20">
        {/* Welcome Section */}
        <UserWelcome 
          user={user} 
          accessibleContent={accessibleContent} 
          userAccessCounts={accessibleContent.userAccessCounts}
        />

        {/* Tabs */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          availableTabs={accessibleContent.availableTabs || []}
        />

        {/* Content */}
        <div className="space-y-6">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Memuat data...</span>
            </div>
          )}

          {/* Audio Tab */}
          {activeTab === 'audio' && !loading && accessibleContent.availableTabs?.includes('audio') && (
            renderCategoryContent('audio', accessibleContent.audio, 'Tidak ada audio yang dapat diakses')
          )}

          {/* Audio Cloud Tab */}
          {activeTab === 'audio-cloud' && !loading && accessibleContent.availableTabs?.includes('audio-cloud') && (
            <div className="space-y-6">
              {renderCloudHeader(
                "Audio Cloud", 
                "Streaming dan download audio MP3 berkualitas tinggi",
                "bg-gradient-to-r from-blue-500 to-purple-600",
                Cloud
              )}
              {renderCategoryContent('audio-cloud', accessibleContent.audioCloud, 'Tidak ada audio cloud yang dapat diakses')}
            </div>
          )}

          {/* PDF Tab */}
          {activeTab === 'pdf' && !loading && accessibleContent.availableTabs?.includes('pdf') && (
            renderCategoryContent('pdf', accessibleContent.pdf, 'Tidak ada e-book yang dapat diakses')
          )}

          {/* PDF Cloud Tab */}
          {activeTab === 'pdf-cloud' && !loading && accessibleContent.availableTabs?.includes('pdf-cloud') && (
            <div className="space-y-6">
              {renderCloudHeader(
                "PDF Cloud", 
                "Koleksi e-book dan dokumen PDF premium",
                "bg-gradient-to-r from-red-500 to-pink-600",
                Cloud
              )}
              {renderCategoryContent('pdf-cloud', accessibleContent.pdfCloud, 'Tidak ada PDF cloud yang dapat diakses')}
            </div>
          )}

          {/* Video Tab */}
          {activeTab === 'video' && !loading && accessibleContent.availableTabs?.includes('video') && (
            renderCategoryContent('video', accessibleContent.video, 'Tidak ada video yang dapat diakses')
          )}

          {/* Files Tab */}
          {activeTab === 'files' && !loading && accessibleContent.availableTabs?.includes('files') && (
            renderCategoryContent('files', accessibleContent.fileCloud, 'Tidak ada file yang dapat diakses')
          )}

          {/* No Access Message */}
          {!loading && (!accessibleContent.availableTabs || accessibleContent.availableTabs.length === 0) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                <FileText className="w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Akses</h3>
              <p className="text-gray-500 mb-4">Anda belum memiliki akses ke konten apapun.</p>
              <p className="text-sm text-gray-400">Silakan hubungi admin untuk mendapatkan akses.</p>
            </div>
          )}
        </div>

        {/* Audio Player */}
        <AudioPlayer
          currentAudio={currentAudio}
          isPlaying={isPlaying}
          onPlayingChange={setIsPlaying}
          audioFiles={activeTab === 'audio-cloud' ? accessibleContent.audioCloud : accessibleContent.audio}
          onAudioChange={setCurrentAudio}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default UserPanel;