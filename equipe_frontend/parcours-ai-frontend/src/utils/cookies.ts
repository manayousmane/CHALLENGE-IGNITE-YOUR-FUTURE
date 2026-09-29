/**
 * Utilitaires de gestion des Cookies pour Parcours AI
 * Conforme RGPD / APDP Bénin - Gestion native avec document.cookie
 */

export interface CookieOptions {
  days?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Définit un cookie de manière sécurisée
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  const {
    days = 365,
    path = '/',
    domain,
    secure = window.location.protocol === 'https:',
    sameSite = 'Lax'
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}; max-age=${days * 24 * 60 * 60}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;
}

/**
 * Récupère la valeur d'un cookie par son nom
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Supprime un cookie
 */
export function deleteCookie(name: string, path: string = '/'): void {
  setCookie(name, '', { days: -1, path });
}
