import React from 'react';
import { Play, Pause, Download, Cloud } from 'lucide-react';
import SoundWaveAnimation from '../SoundWaveAnimation';
import { downloadFileWithTitle } from '../../utils/downloadFile';
import { useToast } from '../../contexts/ToastContext';

interface AudioCloudCardProps {
  audio: {
    id: number;
    title: string;
    file_url: string;
    categoryId: number;
  };
  isPlaying: boolean;
  isCurrentAudio: boolean;
  onPlay: () => void;
  categoryName: string;
}

const AudioCloudCard: React.FC<AudioCloudCardProps> = ({ 
  audio, 
  isPlaying, 
  isCurrentAudio, 
  onPlay, 
  categoryName 
}) => {
  const { addToast } = useToast();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState(0);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isDownloading) return; // Prevent multiple downloads
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      await downloadFileWithTitle(
        audio.file_url, 
        audio.title,
        (progress) => setDownloadProgress(progress)
      );
      
      addToast({
        type: 'success',
        title: 'Download Berhasil!',
        message: `${audio.title} telah berhasil diunduh`,
        duration: 3000
      });
    } catch (error) {
      console.error('Download failed:', error);
      addToast({
        type: 'error',
        title: 'Download Gagal',
        message: 'Terjadi kesalahan saat mengunduh file. Silakan coba lagi.',
        duration: 5000
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all border-2 ${
        isCurrentAudio 
          ? 'border-purple-500 bg-purple-50' 
          : 'border-transparent'
      }`}
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          <Cloud className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
              {audio.title}
            </h3>
            {isCurrentAudio && (
              <div className="mt-2">
                <SoundWaveAnimation isPlaying={isPlaying} size="sm" />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onPlay}
          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-105 flex-shrink-0 ${
            isCurrentAudio
              ? isPlaying 
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg' 
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          {isCurrentAudio && isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-xs sm:text-sm text-gray-500 truncate">
          {categoryName}
        </span>
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            MP3
          </span>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center space-x-1 transition-colors px-3 py-2 rounded-lg text-sm font-medium ${
              isDownloading
                ? 'bg-purple-600 text-white cursor-not-allowed'
                : 'text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100'
            }`}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{downloadProgress > 0 ? `${downloadProgress}%` : 'Mengunduh...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioCloudCard;