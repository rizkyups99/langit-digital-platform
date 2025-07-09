import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import SoundWaveAnimation from './SoundWaveAnimation';
import { useToast } from '../contexts/ToastContext';
import { downloadFileWithTitle } from '../utils/downloadFile';

interface AudioFile {
  id: number;
  title: string;
  file_url: string;
  categoryId: number;
}

interface AudioPlayerProps {
  currentAudio: AudioFile | null;
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
  audioFiles: AudioFile[];
  onAudioChange: (audio: AudioFile | null) => void;
  categories: any[];
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  currentAudio, 
  isPlaying,
  onPlayingChange,
  audioFiles, 
  onAudioChange,
  categories 
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const { addToast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAudio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Gagal memuat audio');
      setIsLoading(false);
      onPlayingChange(false);
    };
    const handleEnded = () => {
      onPlayingChange(false);
      playNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentAudio]);

  // Sync audio playback with isPlaying state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAudio) return;

    if (isPlaying && audio.paused) {
      audio.play().catch(() => {
        setError('Gagal memutar audio');
        onPlayingChange(false);
      });
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying, currentAudio, onPlayingChange]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current || !currentAudio) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        onPlayingChange(false);
      } else {
        await audioRef.current.play();
        onPlayingChange(true);
        setError('');
      }
    } catch (err) {
      setError('Gagal memutar audio');
      onPlayingChange(false);
    }
  };

  const playPrevious = () => {
    if (!currentAudio) return;
    const currentIndex = audioFiles.findIndex(audio => audio.id === currentAudio.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : audioFiles.length - 1;
    onAudioChange(audioFiles[previousIndex]);
    onPlayingChange(true);
  };

  const playNext = () => {
    if (!currentAudio) return;
    const currentIndex = audioFiles.findIndex(audio => audio.id === currentAudio.id);
    const nextIndex = currentIndex < audioFiles.length - 1 ? currentIndex + 1 : 0;
    onAudioChange(audioFiles[nextIndex]);
    onPlayingChange(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.id === categoryId)?.name || 'Umum';
  };

  if (!currentAudio) return null;

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!currentAudio || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      await downloadFileWithTitle(
        currentAudio.file_url, 
        currentAudio.title,
        (progress) => setDownloadProgress(progress)
      );
      
      addToast({
        type: 'success',
        title: 'Download Berhasil!',
        message: `${currentAudio.title} telah berhasil diunduh`,
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <audio
        ref={audioRef}
        src={currentAudio.file_url}
        preload="metadata"
      />
      
      {/* Progress Bar */}
      <div 
        ref={progressRef}
        className="w-full h-1 bg-gray-200 cursor-pointer hover:h-2 transition-all"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
          style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
        />
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Audio Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
              isPlaying 
                ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}>
              {isPlaying ? (
                <SoundWaveAnimation isPlaying={isPlaying} size="md" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-gray-900 truncate">{currentAudio.title}</h3>
              <p className="text-sm text-gray-500 truncate">
                {getCategoryName(currentAudio.categoryId)}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 mx-8">
            <button
              onClick={playPrevious}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              disabled={audioFiles.length <= 1}
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              disabled={isLoading}
              className={`p-3 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 ${
                isPlaying
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              disabled={audioFiles.length <= 1}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Time and Volume */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-gray-600 min-w-[40px]">
                {formatTime(currentTime)}
              </span>
              <span className="text-sm text-gray-400">/</span>
              <span className="text-sm text-gray-600 min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
                className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title={isDownloading ? `Mengunduh... ${downloadProgress}%` : "Download"}
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Mobile Time Display */}
      <div className="sm:hidden px-4 pb-2">
        <div className="flex justify-center space-x-2 text-sm text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;