import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sasldvwxuegvuwlwolmu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhc2xkdnd4dWVndnV3bHdvbG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjUwNjcsImV4cCI6MjA5NDcwMTA2N30.YNEHQt-Zb9Rw31P8VYxtn4Do-2K1CrTha4Ob4GpJeWw';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export default supabase;
