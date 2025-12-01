import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://db.drqcxyefufbzqtngjfxl.supabase.co';
const supabaseAnonKey =
  '.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycWN4eWVmdWZienF0bmdqZnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg2NjgsImV4cCI6MjA4MDE2NDY2OH0.19CMdON8_OXm-SvunJpvi2DV9uMqtyQiJErXK4V7Uwk.';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
