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
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
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
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return await res.json();
  } catch (err) {
    console.warn('Échec de la mise à jour du profil backend:', err);
    return null;
  }
}

function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch (err) {
    console.warn('[Auth] Échec du décodage JWT:', err);
    return null;
  }
}

function parseOAuthTokensFromUrl(): {
  accessToken: string;
  refreshToken: string;
} | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash || '';
  const search = window.location.search || '';
  let params: URLSearchParams | null = null;

  if (hash.includes('access_token=') || hash.includes('refresh_token=')) {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    params = new URLSearchParams(raw);
  } else if (search.includes('access_token=') || search.includes('refresh_token=')) {
    const raw = search.startsWith('?') ? search.slice(1) : search;
    params = new URLSearchParams(raw);
  }

  if (!params) return null;
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}

function buildUserFromJwt(payload: any): AuthUser {
  const meta = payload?.user_metadata || {};
  const appMeta = payload?.app_metadata || {};
  const provider = appMeta.provider || (payload?.amr?.[0]?.method === 'oauth' ? 'google' : 'email');
  const { role, situation } = readLocalRole();

  const firstName = meta.given_name || undefined;
  const lastName = meta.family_name || undefined;
  const displayName =
    meta.full_name ||
    meta.name ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    payload?.email?.split('@')[0] ||
    'Utilisateur';

  return {
    id: payload?.sub || 'user-' + Date.now(),
    name: displayName,
    firstName,
    lastName,
    email: payload?.email || undefined,
    phone: payload?.phone || undefined,
    avatar: meta.avatar_url || meta.picture || undefined,
    role,
    situation,
    createdAt: new Date((payload?.iat || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    completedRoadmapsCount: 0,
    authProvider: provider === 'google' ? 'google' : 'email',
  };
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
  // Initialisation synchrone : si des jetons OAuth sont présents dans l'URL, l'utilisateur
  // est immédiatement authentifié dès le PREMIER rendu (0 ms de délai, aucun clignotement)
  const [user, setUser] = useState<AuthUser | null>(() => {
    const oauth = parseOAuthTokensFromUrl();
    if (oauth) {
      const payload = decodeJwtPayload(oauth.accessToken);
      if (payload) {
        return buildUserFromJwt(payload);
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return !parseOAuthTokensFromUrl();
  });
  // Évite une double reconstruction du profil pour la même session
  const lastSyncedUserId = useRef<string | null>(null);

  const syncFromSession = async (session: Session | null) => {
    if (!session?.user) {
      lastSyncedUserId.current = null;
      setUser(null);
      return;
    }

    if (lastSyncedUserId.current === session.user.id) {
      return; // déjà synchronisé
    }
    lastSyncedUserId.current = session.user.id;

    // Rendu UI instantané : construire immédiatement l'utilisateur depuis les métadonnées Supabase/Google
    setUser(buildAuthUser(session.user, null));

    // Récupérer le profil enrichi backend s'il existe et synchroniser
    const backendProfile = await fetchBackendProfile(session.access_token);
    if (backendProfile) {
      setUser(buildAuthUser(session.user, backendProfile));
    }
    syncDashboardWithCloud(session.user.id);
  };

  useEffect(() => {
    let mounted = true;

    // 1. Détection prioritaire des jetons OAuth (Google) dans l'URL
    const oauth = parseOAuthTokensFromUrl();
    if (oauth) {
      // Nettoyer immédiatement l'URL pour supprimer le hash technique #access_token=...
      window.history.replaceState(null, '', window.location.pathname + '#/dashboard');

      // Établir la session officielle dans Supabase pour la persistance et le rafraîchissement de token
      supabase.auth.setSession({
        access_token: oauth.accessToken,
        refresh_token: oauth.refreshToken,
      }).then(({ data, error }) => {
        if (!mounted) return;
        if (data?.session) {
          syncFromSession(data.session);
        }
        if (error) {
          console.warn('[Auth] Avertissement setSession OAuth:', error);
        }
      }).catch((err) => {
        console.warn('[Auth] Exception setSession OAuth:', err);
      }).finally(() => {
        if (mounted) setIsLoading(false);
      });
    } else {
      // 2. Chargement classique de la session depuis le stockage local
      supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return;
        syncFromSession(data.session).finally(() => setIsLoading(false));
      });
    }

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (session) {
        syncFromSession(session);
      } else if (event === 'SIGNED_OUT') {
        lastSyncedUserId.current = null;
        setUser(null);
      }
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
