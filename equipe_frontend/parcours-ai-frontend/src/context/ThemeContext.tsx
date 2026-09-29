import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookies';

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_COOKIE_KEY = 'parcours_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Récupérer le thème depuis le cookie, ou par défaut 'light'
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = getCookie(THEME_COOKIE_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      return saved as ThemeMode;
    }
    return 'light';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('light');

  // Met à jour la classe CSS sur <html> en fonction du thème sélectionné
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode: 'dark' | 'light') => {
      root.classList.remove('dark', 'light');
      root.classList.add(mode);
      setEffectiveTheme(mode);
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // Fonction pour changer le thème et persister dans le cookie réel
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    setCookie(THEME_COOKIE_KEY, newTheme, { days: 365, path: '/' });
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
