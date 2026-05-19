import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sasldvwxuegvuwlwolmu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhc2xkdnd4dWVndnV3bHdvbG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjUwNjcsImV4cCI6MjA5NDcwMTA2N30.YNEHQt-Zb9Rw31P8VYxtn4Do-2K1CrTha4Ob4GpJeWw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export default supabase;
