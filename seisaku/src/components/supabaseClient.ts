import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://arwbkhcbmkexhvnskwog.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyd2JraGNibWtleGh2bnNrd29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDUxMzAsImV4cCI6MjA2MjgyMTEzMH0.aZHtIBkXPIZRaoy0AwB22ZZ2DO_uNZyqT0SHxBPuz5c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
