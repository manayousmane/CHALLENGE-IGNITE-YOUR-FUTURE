import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Waypoints, 
  Briefcase, 
  Sparkles, 
  LayoutDashboard, 
  Layers, 
  Users, 
  HelpCircle, 
  Code2, 
  Database, 
  Palette, 
  Shield, 
  Moon, 
  Sun,
  Laptop,
  CornerDownLeft
} from 'lucide-react';
import { CAREERS_DATA } from '../../data/careersData';
import { UNIVERSITY_FORMATIONS } from '../../data/formationsData';
import { Career } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onSelectCareer: (career: Career) => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: 'Pages' | 'Métiers' | 'Filières & Universités' | 'Thème & Paramètres' | 'Actions';
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectCareer
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useTheme();

  // Focus automatique lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Construction de tous les éléments recherchables
  const allItems: SearchItem[] = [
    // 1. Pages
    {
      id: 'page-home',
      title: 'Accueil',
      category: 'Pages',
      description: 'Page principale et présentation de Parcours AI',
      icon: <Waypoints className="w-4 h-4 text-cyan-500" />,
      action: () => onNavigate('home')
    },
    {
      id: 'page-dashboard',
      title: 'Mon Dashboard Personnel',
      category: 'Pages',
      description: 'Historique des bilans, compétences, recommandations et parrainage',
      icon: <LayoutDashboard className="w-4 h-4 text-cyan-500" />,
      action: () => onNavigate('dashboard'),
      badge: 'Espace Membre'
    },
    {
      id: 'page-chat',
      title: 'Conseiller d\'Orientation IA',
      category: 'Pages',
      description: 'Dialogue interactif avec l\'IA pour identifier votre filière tech idéale',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => onNavigate('chat-advisor'),
      badge: 'IA'
    },
    {
      id: 'page-metiers',
      title: 'Catalogue des Fiches Métiers',
      category: 'Pages',
      description: 'Explorer les filières d\'avenir et grilles de salaires',
      icon: <Briefcase className="w-4 h-4 text-indigo-500" />,
      action: () => onNavigate('metiers')
    },
    {
      id: 'page-method',
      title: 'Méthodologie Scientifique',
      category: 'Pages',
      description: 'Processus en 4 étapes de notre algorithme d\'adéquation',
      icon: <Layers className="w-4 h-4 text-sky-500" />,
      action: () => onNavigate('method')
    },
    {
      id: 'page-team',
      title: 'L\'Équipe Fondatrice',
      category: 'Pages',
      description: 'Les 5 experts béninois à l\'origine du projet',
      icon: <Users className="w-4 h-4 text-teal-500" />,
      action: () => onNavigate('team')
    },
    {
      id: 'page-faq',
      title: 'Foire Aux Questions (FAQ)',
      category: 'Pages',
      description: 'Réponses à vos questions sur l\'orientation, les salaires et la sécurité',
      icon: <HelpCircle className="w-4 h-4 text-slate-400" />,
      action: () => onNavigate('faq')
    },

    // 2. Métiers d'avenir
    ...CAREERS_DATA.map((c) => ({
      id: `career-${c.id}`,
      title: c.title,
      category: 'Métiers' as const,
      description: `${c.salaryLocal} · ${c.demandLocation}`,
      icon: (
        <div className="w-5 h-5 rounded bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
          {c.category === 'tech' ? <Code2 className="w-3.5 h-3.5" /> : 
           c.category === 'data_ai' ? <Database className="w-3.5 h-3.5" /> : 
           c.category === 'design' ? <Palette className="w-3.5 h-3.5" /> : 
           <Shield className="w-3.5 h-3.5" />}
        </div>
      ),
      action: () => onSelectCareer(c),
      badge: c.categoryLabel
    })),

    // 3. Filières Universitaires & Grandes Écoles (400+ filières)
    ...UNIVERSITY_FORMATIONS.map((f) => ({
      id: `formation-${f.id}`,
      title: f.title,
      category: 'Filières & Universités' as const,
      description: `${f.institution} · ${f.degree} (${f.duration})`,
      icon: (
        <div className="w-5 h-5 rounded bg-amber-500/15 text-amber-500 flex items-center justify-center text-xs font-bold font-mono">
          U
        </div>
      ),
      action: () => onNavigate('metiers'),
      badge: f.domainLabel
    })),

    // 4. Actions directes
    {
      id: 'action-theme-light',
      title: 'Activer le Mode Clair',
      category: 'Thème & Paramètres',
      description: 'Passer à l\'affichage lumineux et épuré',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      action: () => setTheme('light')
    },
    {
      id: 'action-theme-system',
      title: 'Activer le Mode Système',
      category: 'Thème & Paramètres',
      description: 'Suivre automatiquement les préférences de votre système',
      icon: <Laptop className="w-4 h-4 text-slate-400" />,
      action: () => setTheme('system')
    },
    {
      id: 'action-theme-dark',
      title: 'Activer le Mode Sombre',
      category: 'Thème & Paramètres',
      description: 'Passer à l\'affichage nuit immersif',
      icon: <Moon className="w-4 h-4 text-cyan-400" />,
      action: () => setTheme('dark')
    }
  ];

  // Filtrage par texte
  const filteredItems = allItems.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  // Navigation clavier : Flèches HAUT / BAS, Entrée pour valider, Echap pour fermer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  // Défilement automatique pour garder l'élément sélectionné visible
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl dark:bg-[#010105] bg-white border dark:border-cyan-500/30 border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Champ de recherche */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b dark:border-white/10 border-slate-200">
          <Search className="w-5 h-5 text-cyan-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Rechercher un métier, une page, un outil... (↑ ↓ pour naviguer, Entrée)"
            className="flex-1 text-sm dark:bg-transparent bg-transparent dark:text-white text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="px-2 py-0.5 rounded text-[11px] font-mono dark:bg-white/10 bg-slate-100 dark:text-slate-400 text-slate-500 border dark:border-white/10 border-slate-200">
            ESC
          </span>
        </div>

        {/* Liste des résultats */}
        <div 
          ref={listRef}
          className="max-h-96 overflow-y-auto p-2 divide-y divide-transparent space-y-1"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs dark:text-slate-400 text-slate-500">
              Aucun résultat trouvé pour « <span className="font-semibold">{query}</span> »
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'dark:bg-cyan-500/20 bg-sky-50 dark:text-white text-slate-900 border dark:border-cyan-500/40 border-sky-300'
                      : 'dark:text-slate-300 text-slate-700 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0">{item.icon}</div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate dark:text-white text-slate-900">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs dark:text-slate-400 text-slate-500 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-mono dark:text-slate-400 text-slate-500">
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-cyan-500" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pied de la palette avec touches indicatives */}
        <div className="px-4 py-2.5 dark:bg-white/[0.02] bg-slate-50 border-t dark:border-white/10 border-slate-200 flex items-center justify-between text-[11px] dark:text-slate-400 text-slate-500">
          <div className="flex items-center gap-3">
            <span><strong className="font-mono">↑↓</strong> Naviguer</span>
            <span><strong className="font-mono">↵</strong> Sélectionner</span>
            <span><strong className="font-mono">ESC</strong> Fermer</span>
          </div>
          <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400">
            Parcours AI Quick Search
          </span>
        </div>
      </div>
    </div>
  );
};
