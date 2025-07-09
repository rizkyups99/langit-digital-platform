import React from 'react';
import { BookOpen, Cloud } from 'lucide-react';

interface PDFCloudCardProps {
  pdf: {
    id: number;
    title: string;
    cover_url: string;
    file_url: string;
    categoryId: number;
  };
  categoryName: string;
}

const PDFCloudCard: React.FC<PDFCloudCardProps> = ({ pdf, categoryName }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-red-200">
      <div className="relative aspect-[3/4] sm:aspect-[4/5]">
        <img
          src={pdf.cover_url}
          alt={pdf.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
        <div className="absolute top-2 right-2">
          <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Cloud className="w-3 h-3" />
            <span>Cloud</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {pdf.title}
        </h3>
        <div className="flex flex-col space-y-3">
          <span className="text-xs sm:text-sm text-gray-500 truncate">
            {categoryName}
          </span>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              PDF
            </span>
          </div>
          <a 
            href={pdf.file_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1 text-red-600 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg text-sm w-full"
          >
            <BookOpen className="w-4 h-4" />
            <span>Baca</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PDFCloudCard;