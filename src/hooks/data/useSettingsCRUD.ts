import { supabase } from '../../lib/supabase';
import { TelegramSetting, ScalevSetting, WhatsappButtonSetting } from './useDataFetching';

export const useSettingsCRUD = (
  setTelegramSettings: React.Dispatch<React.SetStateAction<TelegramSetting[]>>,
  setScalevSettings: React.Dispatch<React.SetStateAction<ScalevSetting[]>>,
  setWhatsappButtonSettings: React.Dispatch<React.SetStateAction<WhatsappButtonSetting[]>>
) => {
  const updateTelegramSetting = async (key: string, value: string) => {
    try {
      const { data, error } = await supabase
        .from('telegram_settings')
        .upsert([{
          key: key,
          value: value
        }], {
          onConflict: 'key'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setTelegramSettings(prev => {
        const existing = prev.find(s => s.key === key);
        if (existing) {
          return prev.map(s => s.key === key ? {
            id: data.id,
            key: data.key,
            value: data.value,
            updated_at: new Date(data.updated_at)
          } : s);
        } else {
          return [...prev, {
            id: data.id,
            key: data.key,
            value: data.value,
            updated_at: new Date(data.updated_at)
          }];
        }
      });
    } catch (error) {
      console.error('Error updating telegram setting:', error);
      throw error;
    }
  };

  const updateScalevSetting = async (key: string, value: string) => {
    try {
      const { data, error } = await supabase
        .from('scalev_settings')
        .upsert([{
          key: key,
          value: value
        }], {
          onConflict: 'key'
        })
        .select()
        .single();

      if (error) throw error;

      setScalevSettings(prev => {
        const existing = prev.find(s => s.key === key);
        if (existing) {
          return prev.map(s => s.key === key ? {
            id: data.id,
            key: data.key,
            value: data.value,
            updated_at: new Date(data.updated_at)
          } : s);
        } else {
          return [...prev, {
            id: data.id,
            key: data.key,
            value: data.value,
            updated_at: new Date(data.updated_at)
          }];
        }
      });
    } catch (error) {
      console.error('Error updating Scalev setting:', error);
      throw error;
    }
  };

  const updateWhatsappButtonSetting = async (key: string, value: string) => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_button_settings')
        .upsert([{
          key: key,
          value: value
        }], {
          onConflict: 'key'
        })
        .select()
        .single();

      if (error) throw error;

      setWhatsappButtonSettings(prev => {
        const existing = prev.find(s => s.key === key);
        if (existing) {
          return prev.map(s => s.key === key ? {
            id: data.id,
            key: data.key,
            value: data.value,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at)
          } : s);
        } else {
          return [...prev, {
            id: data.id,
            key: data.key,
            value: data.value,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at)
          }];
        }
      });
    } catch (error) {
      console.error('Error updating WhatsApp button setting:', error);
      throw error;
    }
  };

  return {
    updateTelegramSetting,
    updateScalevSetting,
    updateWhatsappButtonSetting
  };
};