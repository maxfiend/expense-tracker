import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nawsqkywxqhrodduubyw.supabase.co'; // замени на свой URL из панели Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hd3Nxa3l3eHFocm9kZHV1Ynl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzM5NTAsImV4cCI6MjA2ODI0OTk1MH0.l-KvPXrZRjgDeSnKx4weB8Ni0ZSsBnWagGquBfORR_A'; // замени на свой публичный анонимный ключ

export const supabase = createClient(supabaseUrl, supabaseAnonKey);