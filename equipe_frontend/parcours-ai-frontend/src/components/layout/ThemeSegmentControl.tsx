import React from 'react';
import { Moon, Sun, Laptop, Zap } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

export const ThemeSegmentControl: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Système au milieu, comme demandé expressément par l'utilisateur
  const options: { mode: ThemeMode; title: string; icon: React.ReactNode }[] = [
    { mode: 'light', title: 'Mode Clair', icon: <Sun className="w-4 h-4" /> },
    { mode: 'system', title: 'Mode Système', icon: <Laptop className="w-4 h-4" /> },
    { mode: 'dark', title: 'Mode Sombre', icon: <Moon className="w-4 h-4" /> },
  ];

  return (
    <div 
      className="inline-flex items-center p-1 rounded-xl dark:bg-white/[0.06] bg-slate-100 border dark:border-white/10 border-slate-200"
      role="group"
      aria-label="Sélecteur de mode d'affichage"
    >
      {options.map((opt) => {
        const isActive = theme === opt.mode;
        return (
          <button
            key={opt.mode}
            onClick={() => setTheme(opt.mode)}
            title={opt.title}
            aria-label={opt.title}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              isActive
                ? 'dark:bg-cyan-500/25 bg-white dark:text-cyan-400 text-cyan-600 shadow-sm border dark:border-cyan-500/40 border-slate-200 scale-105'
                : 'dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
};
