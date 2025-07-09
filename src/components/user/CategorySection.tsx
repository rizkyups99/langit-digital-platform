import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  description: string;
  contentCount: number;
  contentType: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  description,
  contentCount,
  contentType,
  isExpanded,
  onToggle,
  children,
  isEmpty,
  emptyMessage
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      {/* Category Header - Clickable */}
      <div 
        className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {title}
              </h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {contentCount} {contentType} tersedia
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Content Area - Collapsible */}
      {isExpanded && (
        <div className="p-4 sm:p-6">
          {isEmpty ? (
            <div className="text-center py-8">
              <p className="text-gray-500">{emptyMessage}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySection;