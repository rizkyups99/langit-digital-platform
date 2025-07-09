import React, { createContext, useContext, ReactNode } from 'react';
import { useDataFetching } from '../hooks/data/useDataFetching';
import { useCategoryCRUD } from '../hooks/data/useCategoryCRUD';
import { useAudioCRUD } from '../hooks/data/useAudioCRUD';
import { usePDFCRUD } from '../hooks/data/usePDFCRUD';
import { usePDFCloudCRUD } from '../hooks/data/usePDFCloudCRUD';
import { useAudioCloudCRUD } from '../hooks/data/useAudioCloudCRUD';
import { useVideoCRUD } from '../hooks/data/useVideoCRUD';
import { useOtherFileCRUD } from '../hooks/data/useOtherFileCRUD';
import { useUserAccountCRUD } from '../hooks/data/useUserAccountCRUD';
import { useAdminAccountCRUD } from '../hooks/data/useAdminAccountCRUD';
import { useUserAccessCRUD } from '../hooks/data/useUserAccessCRUD';
import { useSettingsCRUD } from '../hooks/data/useSettingsCRUD';

import type {
  Category,
  AudioFile,
  PDFFile,
  VideoFile,
  OtherFile,
  UserAccount,
  AdminAccount,
  UserAccess,
  TelegramLog,
  TelegramMessage,
  TelegramSetting,
  ScalevSetting,
  WhatsappButtonSetting
} from '../hooks/data/useDataFetching';

interface DataContextType {
  // Data
  categories: Category[];
  audioFiles: AudioFile[];
  pdfFiles: PDFFile[];
  pdfCloudFiles: PDFFile[];
  audioCloudFiles: AudioFile[];
  videoFiles: VideoFile[];
  otherFiles: OtherFile[];
  userAccounts: UserAccount[];
  adminAccounts: AdminAccount[];
  userAudioAccess: UserAccess[];
  userPdfAccess: UserAccess[];
  userVideoAccess: UserAccess[];
  userAudioCloudAccess: UserAccess[];
  userPdfCloudAccess: UserAccess[];
  userFileCloudAccess: UserAccess[];
  telegramLogs: TelegramLog[];
  telegramMessages: TelegramMessage[];
  telegramSettings: TelegramSetting[];
  scalevSettings: ScalevSetting[];
  whatsappButtonSettings: WhatsappButtonSetting[];
  loading: boolean;
  
  // CRUD operations
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  
  addAudioFile: (file: Omit<AudioFile, 'id'>) => Promise<void>;
  updateAudioFile: (id: number, file: Partial<AudioFile>) => Promise<void>;
  deleteAudioFile: (id: number) => Promise<void>;
  
  addPDFFile: (file: Omit<PDFFile, 'id'>) => Promise<void>;
  updatePDFFile: (id: number, file: Partial<PDFFile>) => Promise<void>;
  deletePDFFile: (id: number) => Promise<void>;
  
  addPDFCloudFile: (file: Omit<PDFFile, 'id'>) => Promise<void>;
  updatePDFCloudFile: (id: number, file: Partial<PDFFile>) => Promise<void>;
  deletePDFCloudFile: (id: number) => Promise<void>;
  
  addAudioCloudFile: (file: Omit<AudioFile, 'id'>) => Promise<void>;
  updateAudioCloudFile: (id: number, file: Partial<AudioFile>) => Promise<void>;
  deleteAudioCloudFile: (id: number) => Promise<void>;
  
  addVideoFile: (file: Omit<VideoFile, 'id'>) => Promise<void>;
  updateVideoFile: (id: number, file: Partial<VideoFile>) => Promise<void>;
  deleteVideoFile: (id: number) => Promise<void>;
  
  addOtherFile: (file: Omit<OtherFile, 'id'>) => Promise<void>;
  updateOtherFile: (id: number, file: Partial<OtherFile>) => Promise<void>;
  deleteOtherFile: (id: number) => Promise<void>;
  
  addUserAccount: (user: Omit<UserAccount, 'id' | 'created_at'>) => Promise<void>;
  updateUserAccount: (id: number, user: Partial<UserAccount>) => Promise<void>;
  deleteUserAccount: (id: number) => Promise<void>;
  
  addAdminAccount: (admin: Omit<AdminAccount, 'id' | 'created_at'>) => Promise<void>;
  updateAdminAccount: (id: number, admin: Partial<AdminAccount>) => Promise<void>;
  deleteAdminAccount: (id: number) => Promise<void>;
  
  addUserAccess: (access: Omit<UserAccess, 'id'>, type: string) => Promise<void>;
  deleteUserAccess: (id: number, type: string) => Promise<void>;
  deleteAllUserAccessForType: (userId: number, type: string) => Promise<void>;
  deleteAllUserAccessForType: (userId: number, type: string) => Promise<void>;
  
  updateTelegramSetting: (key: string, value: string) => Promise<void>;
  updateScalevSetting: (key: string, value: string) => Promise<void>;
  updateWhatsappButtonSetting: (key: string, value: string) => Promise<void>;
  
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the main data fetching hook
  const dataFetching = useDataFetching();

  // Initialize CRUD hooks
  const categoryCRUD = useCategoryCRUD(dataFetching.categories, dataFetching.setCategories);
  const audioCRUD = useAudioCRUD(dataFetching.audioFiles, dataFetching.setAudioFiles);
  const pdfCRUD = usePDFCRUD(dataFetching.pdfFiles, dataFetching.setPdfFiles);
  const pdfCloudCRUD = usePDFCloudCRUD(dataFetching.pdfCloudFiles, dataFetching.setPdfCloudFiles);
  const audioCloudCRUD = useAudioCloudCRUD(dataFetching.audioCloudFiles, dataFetching.setAudioCloudFiles);
  const videoCRUD = useVideoCRUD(dataFetching.videoFiles, dataFetching.setVideoFiles);
  const otherFileCRUD = useOtherFileCRUD(dataFetching.otherFiles, dataFetching.setOtherFiles);
  const userAccountCRUD = useUserAccountCRUD(dataFetching.userAccounts, dataFetching.setUserAccounts);
  const adminAccountCRUD = useAdminAccountCRUD(dataFetching.adminAccounts, dataFetching.setAdminAccounts);
  const userAccessCRUD = useUserAccessCRUD(
    dataFetching.setUserAudioAccess,
    dataFetching.setUserPdfAccess,
    dataFetching.setUserVideoAccess,
    dataFetching.setUserAudioCloudAccess,
    dataFetching.setUserPdfCloudAccess,
    dataFetching.setUserFileCloudAccess
  );
  const settingsCRUD = useSettingsCRUD(
    dataFetching.setTelegramSettings,
    dataFetching.setScalevSettings,
    dataFetching.setWhatsappButtonSettings
  );

  // Combine all functionality into the context value
  const contextValue: DataContextType = {
    // Data from useDataFetching
    categories: dataFetching.categories,
    audioFiles: dataFetching.audioFiles,
    pdfFiles: dataFetching.pdfFiles,
    pdfCloudFiles: dataFetching.pdfCloudFiles,
    audioCloudFiles: dataFetching.audioCloudFiles,
    videoFiles: dataFetching.videoFiles,
    otherFiles: dataFetching.otherFiles,
    userAccounts: dataFetching.userAccounts,
    adminAccounts: dataFetching.adminAccounts,
    userAudioAccess: dataFetching.userAudioAccess,
    userPdfAccess: dataFetching.userPdfAccess,
    userVideoAccess: dataFetching.userVideoAccess,
    userAudioCloudAccess: dataFetching.userAudioCloudAccess,
    userPdfCloudAccess: dataFetching.userPdfCloudAccess,
    userFileCloudAccess: dataFetching.userFileCloudAccess,
    telegramLogs: dataFetching.telegramLogs,
    telegramMessages: dataFetching.telegramMessages,
    telegramSettings: dataFetching.telegramSettings,
    scalevSettings: dataFetching.scalevSettings,
    whatsappButtonSettings: dataFetching.whatsappButtonSettings,
    loading: dataFetching.loading,
    
    // CRUD operations from individual hooks
    ...categoryCRUD,
    ...audioCRUD,
    ...pdfCRUD,
    ...pdfCloudCRUD,
    ...audioCloudCRUD,
    ...videoCRUD,
    ...otherFileCRUD,
    ...userAccountCRUD,
    ...adminAccountCRUD,
    ...userAccessCRUD,
    ...settingsCRUD,
    
    // Utility functions
    refreshData: dataFetching.refreshData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};