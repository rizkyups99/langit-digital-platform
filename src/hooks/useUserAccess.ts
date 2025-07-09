import { useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export const useUserAccess = () => {
  const { user } = useContext(AuthContext);
  const { 
    categories, 
    audioFiles, 
    pdfFiles, 
    videoFiles, 
    audioCloudFiles, 
    pdfCloudFiles, 
    otherFiles,
    userAudioAccess,
    userPdfAccess,
    userVideoAccess,
    userAudioCloudAccess,
    userPdfCloudAccess,
    userFileCloudAccess
  } = useData();

  const accessibleContent = useMemo(() => {
    if (!user) {
      return {
        audio: [],
        pdf: [],
        video: [],
        audioCloud: [],
        pdfCloud: [],
        fileCloud: [],
        availableTabs: [],
        userAccessCounts: {
          audioCategories: 0,
          pdfCategories: 0,
          videoCategories: 0,
          audioCloudCategories: 0,
          pdfCloudCategories: 0,
          fileCloudCategories: 0,
        }
      };
    }

    // Get user's accessible category IDs for each content type
    const userAudioCategoryIds = userAudioAccess
      ?.filter(access => access.user_id === user.id)
      ?.map(access => access.category_id) || [];
    
    const userPdfCategoryIds = userPdfAccess
      ?.filter(access => access.user_id === user.id)
      ?.map(access => access.category_id) || [];
    
    const userVideoCategoryIds = userVideoAccess
      ?.filter(access => access.user_id === user.id)
      ?.map(access => access.category_id) || [];
    
    const userAudioCloudCategoryIds = userAudioCloudAccess
      ?.filter(access => access.user_id === user.id)
      ?.map(access => access.category_id) || [];
    
    const userPdfCloudCategoryIds = userPdfCloudAccess
      ?.filter(access => access.user_id === user.id)
      ?.map(access => access.category_id) || [];
    
    const userFileCloudCategoryIds = userFileCloudAccess
      ?.filter(access => access.user_id === user.id)
      ?.map(access => access.category_id) || [];

    // Filter content based on user's category access
    const accessibleAudio = audioFiles?.filter(audio => 
      userAudioCategoryIds.includes(audio.categoryId)
    ) || [];

    const accessiblePdf = pdfFiles?.filter(pdf => 
      userPdfCategoryIds.includes(pdf.categoryId)
    ) || [];

    const accessibleVideo = videoFiles?.filter(video => 
      userVideoCategoryIds.includes(video.categoryId)
    ) || [];

    const accessibleAudioCloud = audioCloudFiles?.filter(audio => 
      userAudioCloudCategoryIds.includes(audio.categoryId)
    ) || [];

    const accessiblePdfCloud = pdfCloudFiles?.filter(pdf => 
      userPdfCloudCategoryIds.includes(pdf.categoryId)
    ) || [];

    const accessibleFileCloud = otherFiles?.filter(file => 
      userFileCloudCategoryIds.includes(file.categoryId)
    ) || [];

    // Calculate user access counts
    const userAccessCounts = {
      audioCategories: userAudioCategoryIds.length,
      pdfCategories: userPdfCategoryIds.length,
      videoCategories: userVideoCategoryIds.length,
      audioCloudCategories: userAudioCloudCategoryIds.length,
      pdfCloudCategories: userPdfCloudCategoryIds.length,
      fileCloudCategories: userFileCloudCategoryIds.length,
    };

    // Determine available tabs based on user access
    const availableTabs = [];
    if (userAccessCounts.audioCategories > 0) availableTabs.push('audio');
    if (userAccessCounts.audioCloudCategories > 0) availableTabs.push('audio-cloud');
    if (userAccessCounts.pdfCategories > 0) availableTabs.push('pdf');
    if (userAccessCounts.pdfCloudCategories > 0) availableTabs.push('pdf-cloud');
    if (userAccessCounts.videoCategories > 0) availableTabs.push('video');
    if (userAccessCounts.fileCloudCategories > 0) availableTabs.push('files');

    return {
      audio: accessibleAudio,
      pdf: accessiblePdf,
      video: accessibleVideo,
      audioCloud: accessibleAudioCloud,
      pdfCloud: accessiblePdfCloud,
      fileCloud: accessibleFileCloud,
      availableTabs,
      userAccessCounts
    };
  }, [
    user, 
    categories, 
    audioFiles, 
    pdfFiles, 
    videoFiles, 
    audioCloudFiles, 
    pdfCloudFiles, 
    otherFiles,
    userAudioAccess,
    userPdfAccess,
    userVideoAccess,
    userAudioCloudAccess,
    userPdfCloudAccess,
    userFileCloudAccess
  ]);

  const hasAccessToCategory = (categoryId: number, contentType: string) => {
    if (!user) return false;
    
    // Check if user has permission for this content type
    if (!user.permissions.includes(contentType) && !user.permissions.includes('all')) {
      return false;
    }

    return true;
  };

  const getAccessibleCategories = (contentType: string) => {
    if (!user) return [];
    
    return categories.filter(category => 
      hasAccessToCategory(category.id, contentType)
    );
  };

  const filterContentByAccess = (content: any[], contentType: string) => {
    if (!user) return [];
    
    return content.filter(item => 
      hasAccessToCategory(item.category_id, contentType)
    );
  };

  return {
    user,
    hasAccessToCategory,
    getAccessibleCategories,
    filterContentByAccess,
    ...accessibleContent
  };
};