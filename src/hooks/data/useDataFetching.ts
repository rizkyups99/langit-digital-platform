import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export interface Category {
  id: number;
  name: string;
  description: string;
  filter?: string;
}

export interface AudioFile {
  id: number;
  title: string;
  file_url: string;
  categoryId: number;
}

export interface PDFFile {
  id: number;
  title: string;
  cover_url: string;
  file_url: string;
  categoryId: number;
}

export interface VideoFile {
  id: number;
  title: string;
  video_url: string;
  categoryId: number;
}

export interface OtherFile {
  id: number;
  title: string;
  cover_url: string;
  file_url: string;
  file_type?: string;
  categoryId: number;
}

export interface UserAccount {
  id: number;
  username: string;
  access_code: string;
  name?: string;
  is_active: boolean;
  created_at: Date;
}

export interface AdminAccount {
  id: number;
  email: string;
  access_code: string;
  created_at: Date;
}

export interface UserAccess {
  id: number;
  user_id: number;
  category_id: number;
  user?: UserAccount;
  category?: Category;
}

export interface TelegramLog {
  id: number;
  message_id: string;
  content: string;
  timestamp: Date;
  forwarded: boolean;
  keyword?: string;
  error?: string;
}

export interface TelegramMessage {
  id: number;
  message_id: string;
  content: string;
  phone_number?: string;
  customer_name?: string;
  processed: boolean;
  created_at: Date;
}

export interface TelegramSetting {
  id: number;
  key: string;
  value?: string;
  updated_at: Date;
}

export interface ScalevSetting {
  id: number;
  key: string;
  value?: string;
  updated_at: Date;
}

export interface WhatsappButtonSetting {
  id: number;
  key: string;
  value?: string;
  created_at: Date;
  updated_at: Date;
}

export const useDataFetching = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [pdfCloudFiles, setPdfCloudFiles] = useState<PDFFile[]>([]);
  const [audioCloudFiles, setAudioCloudFiles] = useState<AudioFile[]>([]);
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [otherFiles, setOtherFiles] = useState<OtherFile[]>([]);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [userAudioAccess, setUserAudioAccess] = useState<UserAccess[]>([]);
  const [userPdfAccess, setUserPdfAccess] = useState<UserAccess[]>([]);
  const [userVideoAccess, setUserVideoAccess] = useState<UserAccess[]>([]);
  const [userAudioCloudAccess, setUserAudioCloudAccess] = useState<UserAccess[]>([]);
  const [userPdfCloudAccess, setUserPdfCloudAccess] = useState<UserAccess[]>([]);
  const [userFileCloudAccess, setUserFileCloudAccess] = useState<UserAccess[]>([]);
  const [telegramLogs, setTelegramLogs] = useState<TelegramLog[]>([]);
  const [telegramMessages, setTelegramMessages] = useState<TelegramMessage[]>([]);
  const [telegramSettings, setTelegramSettings] = useState<TelegramSetting[]>([]);
  const [scalevSettings, setScalevSettings] = useState<ScalevSetting[]>([]);
  const [whatsappButtonSettings, setWhatsappButtonSettings] = useState<WhatsappButtonSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [
        categoriesResult,
        audioResult,
        pdfResult,
        audioCloudResult,
        pdfCloudResult,
        videoResult,
        fileResult,
        usersResult,
        adminsResult,
        userAudioAccessResult,
        userPdfAccessResult,
        userVideoAccessResult,
        userAudioCloudAccessResult,
        userPdfCloudAccessResult,
        userFileCloudAccessResult,
        telegramLogsResult,
        telegramMessagesResult,
        telegramSettingsResult,
        scalevSettingsResult,
        whatsappButtonSettingsResult
      ] = await Promise.all([
        supabase.from('categories').select('*').order('created_at', { ascending: false }),
        supabase.from('audios').select('*').order('created_at', { ascending: false }),
        supabase.from('pdfs').select('*').order('created_at', { ascending: false }),
        supabase.from('audio_cloud_files').select('*').order('created_at', { ascending: false }),
        supabase.from('pdf_cloud_files').select('*').order('created_at', { ascending: false }),
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
        supabase.from('file_cloud_files').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('admins').select('*').order('created_at', { ascending: false }),
        supabase.from('user_audio_access').select('*, users(*), categories(*)').order('id', { ascending: true }),
        supabase.from('user_pdf_access').select('*, users(*), categories(*)').order('id', { ascending: true }),
        supabase.from('user_video_access').select('*, users(*), categories(*)').order('id', { ascending: true }),
        supabase.from('user_audio_cloud_access').select('*, users(*), categories(*)').order('id', { ascending: true }),
        supabase.from('user_pdf_cloud_access').select('*, users(*), categories(*)').order('id', { ascending: true }),
        supabase.from('user_file_cloud_access').select('*, users(*), categories(*)').order('id', { ascending: true }),
        supabase.from('telegram_logs').select('*').order('timestamp', { ascending: false }),
        supabase.from('telegram_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('telegram_settings').select('*').order('updated_at', { ascending: false }),
        supabase.from('scalev_settings').select('*').order('updated_at', { ascending: false }),
        supabase.from('whatsapp_button_settings').select('*').order('updated_at', { ascending: false })
      ]);

      if (categoriesResult.data) {
        setCategories(categoriesResult.data.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || '',
          filter: cat.filter
        })));
      }

      if (audioResult.data) {
        setAudioFiles(audioResult.data.map(audio => ({
          id: audio.id,
          title: audio.title,
          file_url: audio.file_url,
          categoryId: audio.category_id
        })));
      }

      if (pdfResult.data) {
        setPdfFiles(pdfResult.data.map(pdf => ({
          id: pdf.id,
          title: pdf.title,
          cover_url: pdf.cover_url,
          file_url: pdf.file_url,
          categoryId: pdf.category_id
        })));
      }

      if (audioCloudResult.data) {
        setAudioCloudFiles(audioCloudResult.data.map(audio => ({
          id: audio.id,
          title: audio.title,
          file_url: audio.file_url,
          categoryId: audio.category_id
        })));
      }

      if (pdfCloudResult.data) {
        setPdfCloudFiles(pdfCloudResult.data.map(pdf => ({
          id: pdf.id,
          title: pdf.title,
          cover_url: pdf.cover_url,
          file_url: pdf.file_url,
          categoryId: pdf.category_id
        })));
      }

      if (videoResult.data) {
        setVideoFiles(videoResult.data.map(video => ({
          id: video.id,
          title: video.title,
          video_url: video.video_url,
          categoryId: video.category_id
        })));
      }

      if (fileResult.data) {
        setOtherFiles(fileResult.data.map(file => ({
          id: file.id,
          title: file.title,
          cover_url: file.cover_url,
          file_url: file.file_url,
          file_type: file.file_type,
          categoryId: file.category_id
        })));
      }

      if (usersResult.data) {
        setUserAccounts(usersResult.data.map(user => ({
          id: user.id,
          username: user.username,
          access_code: user.access_code,
          name: user.name,
          is_active: user.is_active,
          created_at: new Date(user.created_at)
        })));
      }

      if (adminsResult.data) {
        setAdminAccounts(adminsResult.data.map(admin => ({
          id: admin.id,
          email: admin.email,
          access_code: admin.access_code,
          created_at: new Date(admin.created_at)
        })));
      }

      // Process user access data
      const processUserAccess = (data: any[]) => data.map(access => ({
        id: access.id,
        user_id: access.user_id,
        category_id: access.category_id,
        user: access.users ? {
          id: access.users.id,
          username: access.users.username,
          access_code: access.users.access_code,
          name: access.users.name,
          is_active: access.users.is_active,
          created_at: new Date(access.users.created_at)
        } : undefined,
        category: access.categories ? {
          id: access.categories.id,
          name: access.categories.name,
          description: access.categories.description,
          filter: access.categories.filter
        } : undefined
      }));

      if (userAudioAccessResult.data) {
        setUserAudioAccess(processUserAccess(userAudioAccessResult.data));
      }

      if (userPdfAccessResult.data) {
        setUserPdfAccess(processUserAccess(userPdfAccessResult.data));
      }

      if (userVideoAccessResult.data) {
        setUserVideoAccess(processUserAccess(userVideoAccessResult.data));
      }

      if (userAudioCloudAccessResult.data) {
        setUserAudioCloudAccess(processUserAccess(userAudioCloudAccessResult.data));
      }

      if (userPdfCloudAccessResult.data) {
        setUserPdfCloudAccess(processUserAccess(userPdfCloudAccessResult.data));
      }

      if (userFileCloudAccessResult.data) {
        setUserFileCloudAccess(processUserAccess(userFileCloudAccessResult.data));
      }

      if (telegramLogsResult.data) {
        setTelegramLogs(telegramLogsResult.data.map(log => ({
          id: log.id,
          message_id: log.message_id,
          content: log.content,
          timestamp: new Date(log.timestamp),
          forwarded: log.forwarded,
          keyword: log.keyword,
          error: log.error
        })));
      }

      if (telegramMessagesResult.data) {
        setTelegramMessages(telegramMessagesResult.data.map(msg => ({
          id: msg.id,
          message_id: msg.message_id,
          content: msg.content,
          phone_number: msg.phone_number,
          customer_name: msg.customer_name,
          processed: msg.processed,
          created_at: new Date(msg.created_at)
        })));
      }

      if (telegramSettingsResult.data) {
        setTelegramSettings(telegramSettingsResult.data.map(setting => ({
          id: setting.id,
          key: setting.key,
          value: setting.value,
          updated_at: new Date(setting.updated_at)
        })));
      }

      if (scalevSettingsResult.data) {
        setScalevSettings(scalevSettingsResult.data.map(setting => ({
          id: setting.id,
          key: setting.key,
          value: setting.value,
          updated_at: new Date(setting.updated_at)
        })));
      }

      if (whatsappButtonSettingsResult.data) {
        setWhatsappButtonSettings(whatsappButtonSettingsResult.data.map(setting => ({
          id: setting.id,
          key: setting.key,
          value: setting.value,
          created_at: new Date(setting.created_at),
          updated_at: new Date(setting.updated_at)
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    // State
    categories,
    audioFiles,
    pdfFiles,
    pdfCloudFiles,
    audioCloudFiles,
    videoFiles,
    otherFiles,
    userAccounts,
    adminAccounts,
    userAudioAccess,
    userPdfAccess,
    userVideoAccess,
    userAudioCloudAccess,
    userPdfCloudAccess,
    userFileCloudAccess,
    telegramLogs,
    telegramMessages,
    telegramSettings,
    scalevSettings,
    whatsappButtonSettings,
    loading,
    
    // Setters
    setCategories,
    setAudioFiles,
    setPdfFiles,
    setPdfCloudFiles,
    setAudioCloudFiles,
    setVideoFiles,
    setOtherFiles,
    setUserAccounts,
    setAdminAccounts,
    setUserAudioAccess,
    setUserPdfAccess,
    setUserVideoAccess,
    setUserAudioCloudAccess,
    setUserPdfCloudAccess,
    setUserFileCloudAccess,
    setTelegramLogs,
    setTelegramMessages,
    setTelegramSettings,
    setScalevSettings,
    setWhatsappButtonSettings,
    
    // Functions
    refreshData: fetchData
  };
};