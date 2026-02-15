import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { HistoryItem } from '../types';

const STORAGE_KEY = 'idea_validator_history';
const CREDENTIALS_KEY = 'aegis_cloud_credentials';

export interface CloudCredentials {
  url: string;
  key: string;
}

let supabase: SupabaseClient | null = null;

// Initialize Supabase if credentials exist
const storedCreds = localStorage.getItem(CREDENTIALS_KEY);
if (storedCreds) {
  try {
    const { url, key } = JSON.parse(storedCreds);
    if (url && key) {
      supabase = createClient(url, key);
    }
  } catch (e) {
    console.error("Failed to init cloud client", e);
  }
}

export const StorageService = {
  
  isCloudEnabled: (): boolean => {
    return !!supabase;
  },

  setCredentials: (creds: CloudCredentials | null) => {
    if (creds) {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
      supabase = createClient(creds.url, creds.key);
    } else {
      localStorage.removeItem(CREDENTIALS_KEY);
      supabase = null;
    }
    // Reload to reset state clean
    window.location.reload();
  },

  getCredentials: (): CloudCredentials | null => {
    const s = localStorage.getItem(CREDENTIALS_KEY);
    return s ? JSON.parse(s) : null;
  },

  // --- Data Operations ---

  saveItem: async (item: HistoryItem): Promise<void> => {
    // Always save to local for offline redundancy
    const local = StorageService.getLocalHistory();
    const updated = [item, ...local].slice(0, 50); // Keep last 50 locally
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // If Cloud is enabled, save to DB
    if (supabase) {
      try {
        const { error } = await supabase
          .from('simulations')
          .insert([
            {
              id: item.id,
              title: item.title,
              domain: item.result.domain,
              result: item.result, // Stores the full JSON result
              created_at: new Date(item.timestamp).toISOString()
            }
          ]);
        
        if (error) throw error;
      } catch (e) {
        console.error("Cloud Save Failed:", e);
        // We don't block the UI, just log the error. Local save succeeded.
      }
    }
  },

  getHistory: async (): Promise<HistoryItem[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('simulations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        // Map Cloud DB format back to App format
        return data.map((row: any) => ({
          id: row.id,
          timestamp: new Date(row.created_at).getTime(),
          title: row.title,
          result: row.result
        }));

      } catch (e) {
        console.error("Cloud Fetch Failed, falling back to local:", e);
        return StorageService.getLocalHistory();
      }
    }
    return StorageService.getLocalHistory();
  },

  getLocalHistory: (): HistoryItem[] => {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  },

  clearHistory: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
    if (supabase) {
        // Warning: This deletes everything in the table for this anon user context
        // In a real app, you'd filter by user_id
        // For this demo, we just clear local to be safe, or user specific if RLS is on.
        // We will skip deleting cloud data for safety in this demo.
    }
  }
};