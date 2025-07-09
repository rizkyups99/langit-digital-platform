import React from 'react';
import { Video } from 'lucide-react';

interface VideoCardProps {
  video: {
    id: number;
    title: string;
    video_url: string;
    categoryId: number;
  };
  categoryName: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, categoryName }) => {
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(video.video_url);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-video relative">
        {videoId ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1&fs=1&iv_load_policy=3&cc_load_policy=0&playsinline=1&widget_referrer=${encodeURIComponent(window.location.origin)}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="w-full h-full"
              style={{
                pointerEvents: 'auto'
              }}
            />
            {/* Overlay to block clickable areas while preserving controls */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Block top area (title and menu) */}
              <div 
                className="absolute top-0 left-0 right-0 h-12 pointer-events-auto bg-transparent"
                onClick={(e) => e.preventDefault()}
                onMouseDown={(e) => e.preventDefault()}
                style={{ zIndex: 10 }}
              />
              {/* Block bottom-left area (YouTube logo) */}
              <div 
                className="absolute bottom-0 left-0 w-20 h-12 pointer-events-auto bg-transparent"
                onClick={(e) => e.preventDefault()}
                onMouseDown={(e) => e.preventDefault()}
                style={{ zIndex: 10 }}
              />
              {/* Block top-right area (watch later, share) */}
              <div 
                className="absolute top-0 right-0 w-24 h-12 pointer-events-auto bg-transparent"
                onClick={(e) => e.preventDefault()}
                onMouseDown={(e) => e.preventDefault()}
                style={{ zIndex: 10 }}
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Video className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {video.title}
        </h3>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <span className="text-xs sm:text-sm text-gray-500 truncate">
            {categoryName}
          </span>
          <div className="text-blue-600 bg-blue-50 px-3 py-2 rounded-lg text-sm">
            Tonton di Player
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;