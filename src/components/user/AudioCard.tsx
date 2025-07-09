import React from 'react';
import { Play, Pause, Download } from 'lucide-react';
import SoundWaveAnimation from '../SoundWaveAnimation';
import { downloadFileWithTitle } from '../../utils/downloadFile';
import { useToast } from '../../contexts/ToastContext';

interface AudioCardProps {
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

const AudioCard: React.FC<AudioCardProps> = ({ 
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
          ? 'border-blue-500 bg-blue-50' 
          : 'border-transparent'
      }`}
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
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
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              : 'bg-blue-500 text-white hover:bg-blue-600'
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
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex items-center justify-center space-x-1 transition-colors px-3 py-2 rounded-lg text-sm font-medium ${
            isDownloading
              ? 'bg-blue-600 text-white cursor-not-allowed'
              : 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100'
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
  );
};

export default AudioCard;