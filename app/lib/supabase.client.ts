import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = (supabaseUrl: string, supabaseAnonKey: string) => {
  if (typeof window === 'undefined') return null;
  
  if (!supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials are not configured');
      return null;
    }
    
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return supabase;
};
