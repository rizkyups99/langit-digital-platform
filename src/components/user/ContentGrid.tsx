import React from 'react';
import { Play, BookOpen, Video, FileText, Cloud } from 'lucide-react';

interface ContentGridProps {
  children: React.ReactNode;
  isEmpty: boolean;
  emptyIcon: React.ComponentType<{ className?: string }>;
  emptyMessage: string;
}

const ContentGrid: React.FC<ContentGridProps> = ({ 
  children, 
  isEmpty, 
  emptyIcon: EmptyIcon, 
  emptyMessage 
}) => {
  if (isEmpty) {
    return (
      <div className="col-span-full text-center py-12">
        <EmptyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {children}
    </div>
  );
};

export default ContentGrid;