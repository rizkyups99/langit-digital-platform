import React from 'react';
import { Image, BookOpen, FileText, Video } from 'lucide-react';

interface FileCardProps {
  file: {
    id: number;
    title: string;
    cover_url: string;
    file_url: string;
    file_type?: string;
    categoryId: number;
  };
  categoryName: string;
}

const FileCard: React.FC<FileCardProps> = ({ file, categoryName }) => {
  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase() || '';
    if (type.includes('image') || type.includes('jpg') || type.includes('png') || type.includes('jpeg')) {
      return <Image className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />;
    }
    if (type.includes('pdf')) {
      return <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />;
    }
    if (type.includes('video') || type.includes('mp4') || type.includes('avi')) {
      return <Video className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />;
    }
    if (type.includes('doc') || type.includes('docx') || type.includes('txt')) {
      return <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />;
    }
    if (type.includes('ppt') || type.includes('pptx')) {
      return <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />;
    }
    if (type.includes('xls') || type.includes('xlsx')) {
      return <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />;
    }
    return <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0">
          {getFileIcon(file.file_type || '')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {file.title}
          </h3>
          <div className="flex flex-col space-y-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium uppercase w-fit">
              {file.file_type || 'file'}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 truncate">
              {categoryName}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        {file.cover_url && (
          <div className="flex justify-center">
            <img
              src={file.cover_url}
              alt={file.title}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
        <a 
          href={file.file_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>View</span>
        </a>
      </div>
    </div>
  );
};

export default FileCard;