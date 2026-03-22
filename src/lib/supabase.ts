import { createClient } from '@supabase/supabase-js';

// Initialize with empty strings if missing to avoid immediate crash, 
// but handle the missing URL gracefully in the client.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
