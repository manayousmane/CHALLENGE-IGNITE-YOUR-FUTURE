import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { syncDashboardWithCloud } from '../utils/dashboardStorage';

export interface AuthUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: 'student' | 'career_changer' | 'professional' | 'tech_enthusiast';
  situation?: string;
  createdAt: string;
  completedRoadmapsCount: number;
  authProvider?: 'google' | 'email' | 'phone';
}

interface AuthResult {
  success: boolean;
  error?: string;
  needsEmailConfirmation?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<AuthResult>;
  signupWithEmail: (
    name: string,
    email: string,
    pass: string,
    phone?: string,
    firstName?: string,
    lastName?: string
  ) => Promise<AuthResult>;
  requestPhoneOtp: (phone: string, channel?: 'sms' | 'whatsapp') => Promise<AuthResult>;
  loginWithPhone: (phone: string, otpCode: string) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  updateProfile: (updatedData: {
    firstName?: string;
    lastName?: string;
    name?: string;
    phone?: string;
    avatar?: string;
    role?: AuthUser['role'];
    situation?: string;
  }) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// role/situation ne sont pas encore stockés côté base (la table `profiles`
// ne les inclut pas) — conservés uniquement en mémoire côté client pour
// l'instant. À migrer vers une vraie colonne si le produit en a besoin
// durablement.
const LOCAL_ROLE_KEY = 'parcours_user_role';

function readLocalRole(): { role: AuthUser['role']; situation?: string } {
  try {
    const raw = localStorage.getItem(LOCAL_ROLE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { role: 'student' };
}

function writeLocalRole(role: AuthUser['role'], situation?: string) {
  try {
    localStorage.setItem(LOCAL_ROLE_KEY, JSON.stringify({ role, situation }));
  } catch {
    /* ignore */
  }
}

interface BackendProfile {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  phone?: string | null;
  photo_url?: string | null;
}

async function fetchBackendProfile(accessToken: string): Promise<BackendProfile | null> {
  try {
    const res = await fetch('/api/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Impossible de récupérer le profil enrichi depuis le backend:', err);
    return null;
  }
}

async function pushBackendProfile(
  accessToken: string,
  patch: Partial<{ first_name: string; last_name: string; display_name: string; phone: string }>
): Promise<BackendProfile | null> {
  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Échec de la mise à jour du profil backend:', err);
    return null;
  }
}

function buildAuthUser(supabaseUser: SupabaseUser, backendProfile: BackendProfile | null): AuthUser {
  const meta = supabaseUser.user_metadata || {};
  const provider = supabaseUser.app_metadata?.provider as string | undefined;
  const { role, situation } = readLocalRole();

  const firstName = backendProfile?.first_name || meta.given_name || undefined;
  const lastName = backendProfile?.last_name || meta.family_name || undefined;
  const displayName =
    backendProfile?.display_name ||
    meta.full_name ||
    meta.name ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    supabaseUser.email?.split('@')[0] ||
    'Utilisateur';

  return {
    id: supabaseUser.id,
    name: displayName,
    firstName,
    lastName,
    email: supabaseUser.email ?? undefined,
    phone: backendProfile?.phone || supabaseUser.phone || undefined,
    avatar: backendProfile?.photo_url || meta.avatar_url || undefined,
    role,
    situation,
    createdAt: supabaseUser.created_at,
    completedRoadmapsCount: 0,
    authProvider: provider === 'google' ? 'google' : supabaseUser.phone ? 'phone' : 'email',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Évite une double reconstruction du profil pour la même session
  // (onAuthStateChange se déclenche aussi bien au chargement qu'à chaque
  // rafraîchissement de token).
  const lastSyncedUserId = useRef<string | null>(null);

  const syncFromSession = async (session: Session | null) => {
    if (!session?.user) {
      lastSyncedUserId.current = null;
      setUser(null);
      return;
    }

    if (lastSyncedUserId.current === session.user.id) {
      return; // déjà synchronisé, on évite un appel réseau superflu
    }
    lastSyncedUserId.current = session.user.id;

    const backendProfile = await fetchBackendProfile(session.access_token);
    setUser(buildAuthUser(session.user, backendProfile));
    // Synchro du dashboard en tâche de fond (fusionne les données déjà
    // présentes côté backend avec celles en localStorage, utile en cas de
    // connexion depuis un nouvel appareil/navigateur).
    syncDashboardWithCloud(session.user.id);
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      syncFromSession(data.session).finally(() => setIsLoading(false));
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      syncFromSession(session);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  // --- 1. Email + mot de passe ---
  const loginWithEmail = async (email: string, pass: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const signupWithEmail = async (
    name: string,
    email: string,
    pass: string,
    phone?: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
          given_name: firstName,
          family_name: lastName,
        },
      },
    });
    if (error) return { success: false, error: error.message };

    // Le téléphone n'est pas géré par le trigger Postgres (qui ne lit que
    // les métadonnées Google) — on le pousse explicitement si une session
    // a été établie (c-à-d si la confirmation email n'est pas obligatoire).
    if (phone && data.session) {
      await pushBackendProfile(data.session.access_token, { phone });
    }

    if (!data.session) {
      // Confirmation email requise avant de pouvoir se connecter.
      return { success: true, needsEmailConfirmation: true };
    }
    return { success: true };
  };

  // --- 2. Téléphone (SMS ou WhatsApp) ---
  const requestPhoneOtp = async (phone: string, channel: 'sms' | 'whatsapp' = 'whatsapp'): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOtp({ phone, options: { channel } });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const loginWithPhone = async (phone: string, otpCode: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.verifyOtp({ phone, token: otpCode, type: 'sms' });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  // --- 3. Google (redirection OAuth gérée entièrement par Supabase) ---
  const loginWithGoogle = async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    // En cas de succès, le navigateur est redirigé vers Google avant même
    // que cette fonction ne retourne — il n'y a donc rien d'autre à faire
    // ici. La session sera récupérée automatiquement au retour sur le site
    // via onAuthStateChange (detectSessionInUrl: true).
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  // --- 4. Profil ---
  const updateProfile = async (updatedData: {
    firstName?: string;
    lastName?: string;
    name?: string;
    phone?: string;
    avatar?: string;
    role?: AuthUser['role'];
    situation?: string;
  }): Promise<AuthResult> => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return { success: false, error: 'Non connecté.' };

    if (updatedData.role || updatedData.situation) {
      writeLocalRole(updatedData.role || readLocalRole().role, updatedData.situation);
    }

    const patch: Record<string, string> = {};
    if (updatedData.firstName !== undefined) patch.first_name = updatedData.firstName;
    if (updatedData.lastName !== undefined) patch.last_name = updatedData.lastName;
    if (updatedData.name !== undefined) patch.display_name = updatedData.name;
    if (updatedData.phone !== undefined) patch.phone = updatedData.phone;

    const backendProfile = Object.keys(patch).length
      ? await pushBackendProfile(data.session.access_token, patch)
      : await fetchBackendProfile(data.session.access_token);

    setUser(buildAuthUser(data.session.user, backendProfile));
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithEmail,
        signupWithEmail,
        requestPhoneOtp,
        loginWithPhone,
        loginWithGoogle,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  return ctx;
};
