import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  Waypoints, 
  Briefcase, 
  Users, 
  HelpCircle, 
  Menu, 
  X, 
  Layers,
  Home,
  ChevronDown,
  LayoutDashboard,
  Search,
  Code2,
  Database,
  Palette,
  Shield,
  ArrowRight,
  LogOut,
  Lock,
  BookOpen,
  User,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeSegmentControl } from './ThemeSegmentControl';

interface SiteHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onStartChat: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenSearch: () => void;
  onOpenProfile?: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentPage,
  onNavigate,
  onStartChat,
  onOpenAuth,
  onOpenSearch,
  onOpenProfile
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [metiersDropdownOpen, setMetiersDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const metiersRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const metiersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMetiersMouseEnter = () => {
    if (metiersTimeoutRef.current) clearTimeout(metiersTimeoutRef.current);
    setMetiersDropdownOpen(true);
    setResourcesDropdownOpen(false);
  };

  const handleMetiersMouseLeave = () => {
    if (metiersTimeoutRef.current) clearTimeout(metiersTimeoutRef.current);
    metiersTimeoutRef.current = setTimeout(() => {
      setMetiersDropdownOpen(false);
    }, 150);
  };

  const handleResourcesMouseEnter = () => {
    if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current);
    setResourcesDropdownOpen(true);
    setMetiersDropdownOpen(false);
  };

  const handleResourcesMouseLeave = () => {
    if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current);
    resourcesTimeoutRef.current = setTimeout(() => {
      setResourcesDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (metiersTimeoutRef.current) clearTimeout(metiersTimeoutRef.current);
      if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current);
    };
  }, []);

  // Verrouillage STRICT du défilement du site entier quand le menu mobile est ouvert (comme gemmasbj.com)
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  // Détection du scroll pour effet de barre flottante
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermeture des dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (metiersRef.current && !metiersRef.current.contains(e.target as Node)) {
        setMetiersDropdownOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setMetiersDropdownOpen(false);
    setResourcesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled 
          ? 'glass-header py-2 shadow-lg shadow-black/10' 
          : 'glass-header py-2.5 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo de la plateforme avec nom stylisé */}
        <button 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-2.5 group text-left focus:outline-none shrink-0 cursor-pointer"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full dark:bg-[#070b1a] bg-white rounded-[11px] flex items-center justify-center">
              <Waypoints className="w-4.5 h-4.5 text-cyan-500 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight font-display dark:text-white text-slate-900">
              Parcours<span className="text-cyan-500">AI</span>
            </span>
          </div>
        </button>

        {/* Navigation Bureau Aérée et Allégée : 3 Grandes Rubriques Réunies */}
        <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold dark:text-slate-300 text-slate-700 shrink-0">
          
          {/* 0. ACCUEIL */}
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              currentPage === 'home'
                ? 'dark:bg-cyan-500/15 bg-cyan-50 dark:text-cyan-400 text-cyan-700 font-bold border dark:border-cyan-500/30 border-cyan-200' 
                : 'dark:hover:text-white hover:text-slate-900 dark:hover:bg-white/[0.06] hover:bg-slate-100'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-cyan-500" />
            <span>Accueil</span>
          </button>

          {/* 1. GROUPE RÉUNI : Orientation & Métiers (Conseiller IA + Filières Tech + Méthodologie) avec affichage au survol */}
          <div 
            className="relative shrink-0" 
            ref={metiersRef}
            onMouseEnter={handleMetiersMouseEnter}
            onMouseLeave={handleMetiersMouseLeave}
          >
            <button
              onClick={() => {
                setMetiersDropdownOpen(!metiersDropdownOpen);
                setResourcesDropdownOpen(false);
              }}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                ['chat-advisor', 'metiers', 'method'].includes(currentPage) || metiersDropdownOpen
                  ? 'dark:bg-cyan-500/15 bg-cyan-50 dark:text-cyan-400 text-cyan-700 font-bold border dark:border-cyan-500/30 border-cyan-200' 
                  : 'dark:hover:text-white hover:text-slate-900 dark:hover:bg-white/[0.06] hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Orientation & Métiers</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${metiersDropdownOpen ? 'rotate-180 text-cyan-500' : ''}`} />
            </button>

            {metiersDropdownOpen && (
              <div 
                className="absolute top-full left-0 pt-2 w-84 z-50 animate-in fade-in slide-in-from-top-1.5 duration-150"
              >
                <div className="glass-ios-menu rounded-2xl p-2.5 shadow-2xl">
                  <div className="px-3 py-2 border-b border-white/10 dark:border-white/10 mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Orientation Intelligente</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold shadow-xs">
                      IA & Bénin
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {/* Conseiller IA */}
                    <button
                      onClick={() => handleNavClick('chat-advisor')}
                      className="glass-ios-btn w-full p-2.5 rounded-xl flex items-center gap-3 text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/25 to-blue-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">Conseiller IA Interactif</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Live</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-300/85 truncate font-normal">Diagnostic profil & recommandation en direct</p>
                      </div>
                    </button>

                    {/* Filières Tech */}
                    <button
                      onClick={() => handleNavClick('metiers')}
                      className="glass-ios-btn w-full p-2.5 rounded-xl flex items-center gap-3 text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500/25 to-purple-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors">Filières Tech & Salaires</p>
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/10 dark:bg-white/10 text-slate-400 border border-white/10">Fiches</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-300/85 truncate font-normal">Débouchés, compétences & grilles de salaires</p>
                      </div>
                    </button>

                    {/* Méthodologie */}
                    <button
                      onClick={() => handleNavClick('method')}
                      className="glass-ios-btn w-full p-2.5 rounded-xl flex items-center gap-3 text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500/25 to-cyan-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">Méthodologie Scientifique</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-300/85 truncate font-normal">L'algorithme en 4 étapes clés</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. ACCÈS DIRECT : Mon Dashboard */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              currentPage === 'dashboard'
                ? 'dark:bg-cyan-500/15 bg-cyan-50 dark:text-cyan-400 text-cyan-700 font-bold border dark:border-cyan-500/30 border-cyan-200'
                : 'dark:hover:text-white hover:text-slate-900 dark:hover:bg-white/[0.06] hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-500" />
            <span>Mon Dashboard</span>
            {!isAuthenticated && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Connexion requise" />
            )}
          </button>

          {/* 3. GROUPE RÉUNI : À propos & FAQ (Équipe + FAQ) avec affichage au survol */}
          <div 
            className="relative shrink-0" 
            ref={resourcesRef}
            onMouseEnter={handleResourcesMouseEnter}
            onMouseLeave={handleResourcesMouseLeave}
          >
            <button
              onClick={() => {
                setResourcesDropdownOpen(!resourcesDropdownOpen);
                setMetiersDropdownOpen(false);
              }}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                ['team', 'faq'].includes(currentPage) || resourcesDropdownOpen
                  ? 'dark:bg-cyan-500/15 bg-cyan-50 dark:text-cyan-400 text-cyan-700 font-bold border dark:border-cyan-500/30 border-cyan-200' 
                  : 'dark:hover:text-white hover:text-slate-900 dark:hover:bg-white/[0.06] hover:bg-slate-100'
              }`}
            >
              <span>À propos</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180 text-cyan-500' : ''}`} />
            </button>

            {resourcesDropdownOpen && (
              <div 
                className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1.5 duration-150"
              >
                <div className="glass-ios-menu rounded-2xl p-2.5 shadow-2xl text-xs">
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleNavClick('team')}
                      className="glass-ios-btn w-full p-2.5 rounded-xl flex items-center gap-3 text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500/25 to-emerald-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-teal-400 transition-colors">L'Équipe Fondatrice</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-300/85 font-normal">5 experts nationaux</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavClick('faq')}
                      className="glass-ios-btn w-full p-2.5 rounded-xl flex items-center gap-3 text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500/25 to-blue-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors">Questions Fréquentes</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-300/85 font-normal">FAQ & Centre d'aide</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Partie Droite : 
            Desktop = Recherche Win+K + Thème (3 icônes) + Auth 
            Mobile = Loupe compacte + Bouton 3 traits UNIQUEMENT */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* BOUTON RECHERCHE RAPIDE : Touche Windows + K refait de manière haut de gamme */}
          <button
            onClick={onOpenSearch}
            title="Recherche globale (Touche Windows + K)"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl dark:bg-white/[0.06] bg-slate-100 hover:bg-slate-200/80 dark:hover:bg-white/[0.12] border dark:border-white/10 border-slate-200 text-xs transition-all cursor-pointer shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-cyan-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden sm:inline-block text-[11px] font-medium dark:text-slate-300 text-slate-600">
              Rechercher
            </span>
            <div className="hidden sm:flex items-center gap-1">
              <kbd className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md dark:bg-white/10 bg-white border dark:border-white/10 border-slate-300/80 text-[10px] font-semibold text-slate-600 dark:text-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <svg className="w-2.5 h-2.5 text-cyan-500" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M0 2.222L6.5 1.333v6.222H0V2.222zm7.5-.138L16 0v7.556H7.5V2.084zM0 8.444h6.5v6.223L0 13.778V8.444zm7.5 0H16V16l-8.5-1.194V8.444z"/>
                </svg>
                <span>Win</span>
              </kbd>
              <span className="text-[10px] text-slate-400 font-bold leading-none">+</span>
              <kbd className="px-1.5 py-0.5 rounded-md dark:bg-white/10 bg-white border dark:border-white/10 border-slate-300/80 text-[10px] font-bold text-slate-700 dark:text-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                K
              </kbd>
            </div>
          </button>

          {/* SÉLECTEUR DE THÈME : STRICTEMENT SUR DESKTOP */}
          <div className="hidden lg:block">
            <ThemeSegmentControl />
          </div>

          {/* AUTHENTIFICATION : BOÎTIER INTERRUPTEUR (SEGMENTED SWITCH) ÉLÉGANT */}
          <div className="hidden lg:flex items-center">
            {isAuthenticated && user ? (
              <div className="relative shrink-0" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl dark:bg-white/[0.06] bg-slate-100 border dark:border-cyan-500/30 border-slate-200 text-xs dark:text-white text-slate-900 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-[10px] text-white shrink-0 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <span className="font-medium max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-ios-menu p-2 shadow-2xl z-50 text-xs animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="font-semibold dark:text-white text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-cyan-500 dark:text-cyan-400 truncate">{user.email || user.phone}</p>
                    </div>
                    <button
                      onClick={() => { handleNavClick('dashboard'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg glass-ios-btn text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer mb-1"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Mon Dashboard</span>
                    </button>
                    <button
                      onClick={() => { onOpenProfile?.(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg glass-ios-btn text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer mb-1"
                    >
                      <User className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Mon Profil</span>
                    </button>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-500/15 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Boîtier interrupteur (Switch segmented) unifié */
              <div 
                className="inline-flex items-center p-1 rounded-xl dark:bg-white/[0.06] bg-slate-100 border dark:border-white/10 border-slate-200 shadow-sm"
                role="group"
                aria-label="Accès compte utilisateur"
              >
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold dark:text-slate-300 text-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.08] transition-all cursor-pointer"
                >
                  Connexion
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-sm shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>

          {/* AVATAR UTILISATEUR COMPACT SUR MOBILE (si connecté) */}
          {isAuthenticated && user && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="lg:hidden flex items-center justify-center p-0.5 rounded-full border-2 border-cyan-500/50 hover:border-cyan-400 shadow-sm cursor-pointer"
              title={`Mon Dashboard (${user.name})`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-[11px] text-white overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
            </button>
          )}

          {/* BOUTON DES 3 TRAITS SUR MOBILE (HAMBURGER) : Ultra épuré & accessible */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl dark:bg-white/[0.08] bg-slate-100 dark:text-white text-slate-800 border dark:border-white/10 border-slate-200 shadow-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu className="w-5 h-5 text-cyan-500" />
          </button>

        </div>

      </div>

      {/* =========================================================================
          MENU MOBILE PLEIN ÉCRAN TYPE GEMMASBJ.COM
          Quand ce menu est ouvert : tout le reste du site est totalement gelé !
          Monté via createPortal pour être 100% insensible aux filtres backdrop de l'en-tête
          ========================================================================= */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] dark:bg-[#010208]/98 bg-white/98 backdrop-blur-2xl flex flex-col animate-in fade-in slide-in-from-top-4 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Barre d'en-tête du menu mobile figé */}
          <div className="px-5 py-4 border-b dark:border-white/10 border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
                <div className="w-full h-full dark:bg-[#070b1a] bg-white rounded-[11px] flex items-center justify-center">
                  <Waypoints className="w-4 h-4 text-cyan-500" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight font-display dark:text-white text-slate-900">
                Parcours<span className="text-cyan-500">AI</span>
              </span>
            </div>

            {/* Bouton X de fermeture */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl dark:bg-white/10 bg-slate-100 dark:text-white text-slate-800 hover:bg-rose-500/20 hover:text-rose-500 transition-all cursor-pointer"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corps défilant du menu avec compartiments soignés */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

            {/* 1. Recherche Mobile Instantanée */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl dark:bg-white/[0.06] bg-slate-100 border dark:border-white/10 border-slate-200 text-xs dark:text-slate-300 text-slate-700 shadow-sm text-left active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-cyan-500 shrink-0" />
                <span className="font-medium">Rechercher une filière, un métier...</span>
              </div>
              <kbd className="px-2 py-0.5 rounded text-[10px] font-mono dark:bg-white/10 bg-slate-200 text-slate-700 dark:text-slate-300">
                ⊞ Win + K
              </kbd>
            </button>

            {/* 2. Catégorie : Orientation & Carrières */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                Orientation & Carrières
              </p>
              <div className="space-y-1 rounded-2xl dark:bg-white/[0.03] bg-slate-50/90 p-1.5 border dark:border-white/5 border-slate-100">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    currentPage === 'home'
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'dark:text-slate-200 text-slate-700 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Waypoints className="w-4 h-4 text-cyan-500" />
                    <span>Accueil</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => handleNavClick('chat-advisor')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    currentPage === 'chat-advisor'
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'dark:text-slate-200 text-slate-700 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                    <span>Conseiller IA</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    Recommandé
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('metiers')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    currentPage === 'metiers'
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'dark:text-slate-200 text-slate-700 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    <span>Filières Tech & Salaires</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Consulter</span>
                </button>

                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    currentPage === 'dashboard'
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'dark:text-slate-200 text-slate-700 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 text-cyan-500" />
                    <span>Mon Dashboard</span>
                  </div>
                  {!isAuthenticated ? (
                    <span className="flex items-center gap-1 text-[10px] text-amber-500 font-normal">
                      <Lock className="w-3 h-3" /> Requis
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 3. Catégorie : Ressources & Écosystème */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                Ressources & Écosystème
              </p>
              <div className="space-y-1 rounded-2xl dark:bg-white/[0.03] bg-slate-50/90 p-1.5 border dark:border-white/5 border-slate-100">
                <button
                  onClick={() => handleNavClick('method')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-sky-500" />
                    <span>Méthodologie Scientifique</span>
                  </div>
                  <span className="text-[10px] text-slate-400">4 Étapes</span>
                </button>

                <button
                  onClick={() => handleNavClick('team')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-teal-500" />
                    <span>L'Équipe Fondatrice</span>
                  </div>
                  <span className="text-[10px] text-slate-400">5 Experts</span>
                </button>

                <button
                  onClick={() => handleNavClick('faq')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <span>Foire Aux Questions (FAQ)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Aide</span>
                </button>
              </div>
            </div>

            {/* 4. Sélecteur de Thème (3 icônes avec Système au milieu) */}
            <div className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold dark:text-white text-slate-900">Mode d'affichage</p>
                <p className="text-[10px] text-slate-500">Clair · Système · Sombre</p>
              </div>
              <ThemeSegmentControl />
            </div>

            {/* 5. Section Compte & Authentification Mobile */}
            <div className="pt-2">
              {isAuthenticated && user ? (
                <div className="p-4 rounded-2xl dark:bg-[#0b1430] bg-slate-100 border dark:border-cyan-500/30 border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white overflow-hidden shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs dark:text-white text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-cyan-600 dark:text-cyan-400 truncate">{user.email || user.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenProfile?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Mon Profil</span>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-500 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('signup');
                    }}
                    className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Créer un compte gratuit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="w-full py-3 rounded-xl text-xs font-bold dark:text-slate-200 text-slate-700 dark:bg-white/[0.05] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.1] border dark:border-white/10 border-slate-200 flex items-center justify-center cursor-pointer"
                  >
                    Se connecter à mon espace
                  </button>
                </div>
              )}
            </div>

            {/* Assistance WhatsApp Direct Bénin */}
            <div className="pt-2 text-center pb-6">
              <a
                href="https://wa.me/2290152352309?text=Bonjour%20Parcours%20AI%2C%20j%27aimerais%20un%20accompagnement%20pour%20mon%20orientation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline p-2 rounded-xl hover:bg-emerald-500/10 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>Assistance WhatsApp directe : 01 52 35 23 09</span>
              </a>
            </div>

          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
