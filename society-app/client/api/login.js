import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sasldvwxuegvuwlwolmu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhc2xkdnd4dWVndnV3bHdvbG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjUwNjcsImV4cCI6MjA5NDcwMTA2N30.YNEHQt-Zb9Rw31P8VYxtn4Do-2K1CrTha4Ob4GpJeWw';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
