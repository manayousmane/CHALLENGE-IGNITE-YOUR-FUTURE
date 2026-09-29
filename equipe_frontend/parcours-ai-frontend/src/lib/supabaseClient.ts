import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définis dans ton fichier .env ' +
      '(voir .env.example). Ce sont les mêmes valeurs que celles utilisées côté backend Python, ' +
      "à l'exception de la clé service_role qui ne doit jamais apparaître côté frontend."
  );
}

// Client unique, partagé dans toute l'app. persistSession + autoRefreshToken
// gèrent automatiquement le stockage de la session (localStorage) et le
// renouvellement du token — plus besoin de notre ancien système de cookie
// maison (utils/cookies.ts, toujours utilisé ailleurs pour le thème/RGPD,
// mais plus pour l'authentification).
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // nécessaire pour récupérer la session après le redirect OAuth Google
  },
});
