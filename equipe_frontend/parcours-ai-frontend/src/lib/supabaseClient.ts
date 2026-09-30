import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://phwypevnafzpkitlixvg.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBod3lwZXZuYWZ6cGtpdGxpeHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MTY4MDQsImV4cCI6MjEwNTI5MjgwNH0.MDfAJXxoys8Jof80lEUuCIXU0IWMx4HMBSyRym9fLy4';

// Client unique, partagé dans toute l'app. persistSession + autoRefreshToken
// gèrent automatiquement le stockage de la session (localStorage) et le
// renouvellement du token.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
});
