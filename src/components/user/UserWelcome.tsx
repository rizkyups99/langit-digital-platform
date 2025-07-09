import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';

interface UserWelcomeProps {
  user: any;
  accessibleContent: {
    audio: any[];
    pdf: any[];
    video: any[];
    audioCloud: any[];
    pdfCloud: any[];
    fileCloud: any[];
    availableTabs?: string[];
  };
  userAccessCounts: {
    audioCategories: number;
    pdfCategories: number;
    videoCategories: number;
    audioCloudCategories: number;
    pdfCloudCategories: number;
    fileCloudCategories: number;
  };
}

const UserWelcome: React.FC<UserWelcomeProps> = ({ user, accessibleContent, userAccessCounts }) => {
  // Calculate expiry date (example: 1 year from now)
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  
  // Calculate days remaining
  const today = new Date();
  const timeDiff = expiryDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getUserName = () => {
    // Return the actual user name from database, fallback to phone if no name
    if (user?.name && user.name.trim() !== '') {
      return user.name;
    }
    return user?.phone || 'User';
  };

  // Build access text array
  const buildAccessText = () => {
    const accessItems = [];
    
    if (userAccessCounts.audioCategories > 0) {
      accessItems.push(`${userAccessCounts.audioCategories} Audio`);
    }
    if (userAccessCounts.pdfCategories > 0) {
      accessItems.push(`${userAccessCounts.pdfCategories} PDF`);
    }
    if (userAccessCounts.videoCategories > 0) {
      accessItems.push(`${userAccessCounts.videoCategories} Video`);
    }
    if (userAccessCounts.audioCloudCategories > 0) {
      accessItems.push(`${userAccessCounts.audioCloudCategories} Audio Cloud`);
    }
    if (userAccessCounts.pdfCloudCategories > 0) {
      accessItems.push(`${userAccessCounts.pdfCloudCategories} PDF Cloud`);
    }
    if (userAccessCounts.fileCloudCategories > 0) {
      accessItems.push(`${userAccessCounts.fileCloudCategories} File Cloud`);
    }

    return accessItems;
  };

  const accessItems = buildAccessText();

  return (
    <div className="mb-6 sm:mb-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 sm:p-6 text-white mb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              Selamat Datang, {getUserName()}
            </h2>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Masa aktif akses kamu sampai {formatDate(expiryDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>{daysRemaining} hari tersisa</span>
          </div>
        </div>
      </div>

      {/* Access Information - Text Format */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
          Anda Telah Membeli Akses:
        </h3>
        
        {accessItems.length > 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm sm:text-base text-blue-800 font-medium">
              {accessItems.join(' • ')}
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm sm:text-base text-gray-600">
              Belum ada akses yang diberikan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWelcome;