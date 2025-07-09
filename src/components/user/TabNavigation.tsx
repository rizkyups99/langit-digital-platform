import React from 'react';
import { Play, BookOpen, Video, FileText, Cloud } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortLabel?: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  availableTabs: string[]; // New prop to control which tabs to show
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, availableTabs }) => {
  const allTabs: Tab[] = [
    { id: 'audio', label: 'Audio', icon: Play },
    { id: 'audio-cloud', label: 'Audio Cloud', icon: Cloud, shortLabel: 'Audio Cloud' },
    { id: 'pdf', label: 'PDF', icon: BookOpen },
    { id: 'pdf-cloud', label: 'PDF Cloud', icon: Cloud, shortLabel: 'PDF Cloud' },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'files', label: 'File Cloud', icon: FileText, shortLabel: 'File Cloud' }
  ];

  // Filter tabs based on available tabs
  const tabs = allTabs.filter(tab => availableTabs.includes(tab.id));

  // If no tabs available, don't render anything
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile: Dynamic grid based on number of tabs */}
      <div className="block sm:hidden">
        <div className={`grid gap-2 ${
          tabs.length === 1 ? 'grid-cols-1' :
          tabs.length === 2 ? 'grid-cols-2' :
          tabs.length === 3 ? 'grid-cols-3' :
          tabs.length === 4 ? 'grid-cols-2' :
          tabs.length === 5 ? 'grid-cols-3' :
          'grid-cols-3'
        }`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-3 px-2 border-2 font-medium text-xs transition-colors rounded-lg ${
                  activeTab === tab.id
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-center leading-tight">
                  {tab.shortLabel || tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Horizontal tabs */}
      <div className="hidden sm:block">
        <nav className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-2 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;