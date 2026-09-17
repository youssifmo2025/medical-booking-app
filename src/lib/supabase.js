import { createClient } from '@supabase/supabase-js';

const rawUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://yvpqizzngpulrwhotjdb.supabase.co';
const supabaseUrl = rawUrl.trim().replace(/\.supabase\.com\/?$/, '.supabase.co');

const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_5EhtALmUjvOlVY8LAZJtJw_8LCQk3z3'
).trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
