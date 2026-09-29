import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { supabase } from './lib/supabaseClient';
import { SiteHeader } from './components/layout/SiteHeader';
import { HeroSection } from './components/home/HeroSection';
import { CareerAdvisorChat } from './components/chat/CareerAdvisorChat';
import { MetiersCatalog } from './components/metiers/MetiersCatalog';
import { MethodSection } from './components/home/MethodSection';
import { TeamSection } from './components/team/TeamSection';
import { FAQSection } from './components/faq/FAQSection';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { SiteFooter } from './components/layout/SiteFooter';
import { InteractiveRoadmapModal } from './components/roadmap/InteractiveRoadmapModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { CommandPalette } from './components/search/CommandPalette';
import { CookieConsentBanner } from './components/legal/CookieConsentBanner';
import { LegalModal, LegalTab } from './components/legal/LegalModal';
import { FeedbackModal } from './components/ui/FeedbackModal';
import { Career } from './types';
import { useTheme } from './context/ThemeContext';
import { CAREERS_DATA } from './data/careersData';
import { Sparkles, ArrowRight, ShieldCheck, Waypoints, Briefcase, Award, Users, Star } from 'lucide-react';

export type AppPage = 'home' | 'metiers' | 'chat-advisor' | 'dashboard' | 'method' | 'team' | 'faq';

/**
 * Composant racine Parcours AI
 * Architecture MULTI-PAGES professionnelle avec Dashboard Utilisateur complet
 */
function MainApp() {
  const { theme, effectiveTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'reset'>('signup');
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Supabase redirige ici après un clic sur le lien "mot de passe oublié"
  // reçu par email, avec une session de type "recovery" déjà établie
  // (grâce à detectSessionInUrl: true dans supabaseClient.ts). On ouvre
  // alors directement le modal en mode "reset" pour que l'utilisateur
  // puisse choisir son nouveau mot de passe.
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthModalMode('reset');
        setIsAuthModalOpen(true);
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, []);
  
  // Modale Juridique & Conformité APDP Bénin
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState<LegalTab>('apdp');

  const handleOpenLegal = (tab: LegalTab = 'apdp') => {
    setLegalInitialTab(tab);
    setIsLegalModalOpen(true);
  };
  
  // Modal de Feedback
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Timer pour le Feedback (5 minutes = 300 000 ms)
  useEffect(() => {
    const feedbackSubmitted = localStorage.getItem('parcours_feedback_submitted');
    const feedbackDismissed = sessionStorage.getItem('parcours_feedback_dismissed');
    
    if (!feedbackSubmitted && !feedbackDismissed) {
      // 5 minutes = 5 * 60 * 1000 = 300000 ms
      const timer = setTimeout(() => {
        setIsFeedbackModalOpen(true);
      }, 300000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleFeedbackSubmit = () => {
    localStorage.setItem('parcours_feedback_submitted', 'true');
    // Le modal se ferme tout seul après quelques secondes via onSubmit
  };

  const handleCloseFeedback = () => {
    setIsFeedbackModalOpen(false);
    sessionStorage.setItem('parcours_feedback_dismissed', 'true');
  };

  // Synchronisation avec l'URL Hash pour navigation multi-pages réelle
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
      const validPages: AppPage[] = ['home', 'metiers', 'chat-advisor', 'dashboard', 'method', 'team', 'faq'];
      if (validPages.includes(hash as AppPage)) {
        setCurrentPage(hash as AppPage);
      }
    };

    // Lecture initiale du hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Écouteur pour le raccourci clavier global (Ctrl+K, Cmd+K, Win+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToPage = (page: string) => {
    const validPages: AppPage[] = ['home', 'metiers', 'chat-advisor', 'dashboard', 'method', 'team', 'faq'];
    const targetPage = validPages.includes(page as AppPage) ? (page as AppPage) : 'home';
    setCurrentPage(targetPage);
    window.location.hash = `#/${targetPage}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'signup', reason?: string) => {
    setAuthModalMode(mode);
    setAuthReason(reason);
    setIsAuthModalOpen(true);
  };

  return (
    <div className={`min-h-screen dark:text-slate-100 text-slate-800 dark:bg-[#010208] bg-[#f0f4f9] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200 relative overflow-x-hidden font-display transition-colors duration-300`}>
      
      {/* Fond d'ambiance dynamique selon le mode (Bleu nuit profond en sombre / Bleu-gris perlé doux e-freeshop en clair) */}
      <div className="fixed inset-0 pointer-events-none -z-20 dark:block hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#030614] via-[#010208] to-black" />
      <div className="fixed inset-0 pointer-events-none -z-20 dark:hidden block bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/50 via-[#f0f4f9] to-[#e8eff7]" />
      
      {/* Halos lumineux d'ambiance */}
      <div className="fixed top-[-10%] left-[15%] w-[600px] h-[600px] dark:bg-cyan-600/[0.07] bg-sky-300/[0.18] rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-[45%] right-[5%] w-[500px] h-[500px] dark:bg-indigo-600/[0.06] bg-blue-300/[0.15] rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* En-tête principal avec menu multi-pages et sélecteur de thème à 3 boutons explicites */}
      <SiteHeader
        currentPage={currentPage}
        onNavigate={navigateToPage}
        onStartChat={() => navigateToPage('chat-advisor')}
        onOpenAuth={(mode) => handleOpenAuth(mode || 'signup')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* =========================================================================
          ROUTAGE DU CONTENU MULTI-PAGES
          ========================================================================= */}
      <main className="flex-1">

        {/* 1. PAGE D'ACCUEIL */}
        {currentPage === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-300">
            {/* Hero avec la boussole 3D officielle animée */}
            <HeroSection
              onStartChat={() => navigateToPage('chat-advisor')}
              onExploreCareers={() => navigateToPage('metiers')}
            />

            {/* Accès rapide aux 3 grands piliers de la plateforme */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div 
                  onClick={() => navigateToPage('chat-advisor')}
                  className="p-6 rounded-2xl dark:bg-[#0a122c] bg-white border dark:border-cyan-500/25 border-slate-200 hover:border-cyan-500/50 transition-all cursor-pointer shadow-md group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    1. Diagnostic d'Orientation IA
                  </h3>
                  <p className="text-xs dark:text-slate-400 text-slate-600 mb-4 leading-relaxed">
                    Évaluez vos compétences et vos passions avec notre IA calibrée pour les réalités du marché béninois et international.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    <span>Lancer un échange</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div 
                  onClick={() => navigateToPage('metiers')}
                  className="p-6 rounded-2xl dark:bg-[#0a122c] bg-white border dark:border-indigo-500/25 border-slate-200 hover:border-indigo-500/50 transition-all cursor-pointer shadow-md group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    2. Fiches Métiers & Salaires
                  </h3>
                  <p className="text-xs dark:text-slate-400 text-slate-600 mb-4 leading-relaxed">
                    Explorez les 8 filières tech les plus demandées avec les grilles de rémunération réelles à Cotonou et en Remote.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>Explorer le catalogue</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div 
                  onClick={() => navigateToPage('dashboard')}
                  className="p-6 rounded-2xl dark:bg-[#0a122c] bg-white border dark:border-cyan-500/25 border-slate-200 hover:border-cyan-500/50 transition-all cursor-pointer shadow-md group"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    3. Votre Dashboard & Activité
                  </h3>
                  <p className="text-xs dark:text-slate-400 text-slate-600 mb-4 leading-relaxed">
                    Retrouvez vos bilans certifiés, suivez votre montée en compétences et partagez votre profil tech auprès des recruteurs.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    <span>Accéder à mon espace</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </section>

            {/* Section phare d'appel vers le Conseiller IA Dédié */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border dark:border-cyan-500/30 border-cyan-200 bg-gradient-to-br from-white via-cyan-50/50 to-blue-50/60 dark:from-[#0b1638] dark:via-[#070e24] dark:to-[#040817] shadow-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="max-w-2xl space-y-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                      <span>Le Cœur de Parcours AI</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Votre Conseiller d'Orientation IA Interactif
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      Accédez à notre espace de discussion conversationnel pleine page dédié. Analysez votre profil, comparez les salaires réels en Afrique et en télétravail international, et générez votre feuille de route étape par étape.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
                    <button
                      onClick={() => navigateToPage('chat-advisor')}
                      className="px-8 py-4 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                    >
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                      <span>Ouvrir l'Espace Chat IA</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Bannière d'appel vers le catalogue complet */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="rounded-3xl p-8 dark:bg-gradient-to-r dark:from-[#0b1638] dark:to-[#070e24] bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border dark:border-cyan-500/30 border-sky-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <h3 className="text-2xl font-bold font-display dark:text-white text-slate-900 mb-2">
                    Besoin de comparer les carrières tech ?
                  </h3>
                  <p className="text-sm dark:text-slate-300 text-slate-600 max-w-xl">
                    Consultez toutes nos fiches métiers détaillées : développement, intelligence artificielle, cybersécurité, design de produit et gestion de projet.
                  </p>
                </div>
                <button
                  onClick={() => navigateToPage('metiers')}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Ouvrir les Fiches Métiers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* 2. PAGE DÉDIÉE : MON TABLEAU DE BORD (DASHBOARD) */}
        {currentPage === 'dashboard' && (
          <UserDashboard
            onStartNewDiagnostic={() => navigateToPage('chat-advisor')}
            onExploreCareer={(career) => setSelectedCareer(career)}
            onRequireAuth={(mode) => handleOpenAuth(mode || 'login', 'Connectez-vous avant d\'accéder à votre dashboard')}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* 3. PAGE ENTIÈRE DÉDIÉE : CONSEILLER D'ORIENTATION IA (ESPACE CHAT PLEINE PAGE) */}
        {currentPage === 'chat-advisor' && (
          <div className="h-[calc(100vh-4.25rem)] w-full overflow-hidden animate-in fade-in duration-300">
            <CareerAdvisorChat
              onSelectCareerRoadmap={(career) => setSelectedCareer(career)}
              onRequireAuth={() => handleOpenAuth('signup', 'Créez votre compte gratuit pour continuer votre échange avec l\'IA et débloquer votre roadmap complète.')}
            />
          </div>
        )}

        {/* 4. PAGE DÉDIÉE : FICHES MÉTIERS & CATALOGUE */}
        {currentPage === 'metiers' && (
          <div className="py-8 animate-in fade-in duration-300">
            <MetiersCatalog
              onSelectCareer={(career) => setSelectedCareer(career)}
            />
          </div>
        )}

        {/* 5. PAGE DÉDIÉE : MÉTHODOLOGIE SCIENTIFIQUE */}
        {currentPage === 'method' && (
          <div className="py-8 animate-in fade-in duration-300">
            <MethodSection />
          </div>
        )}

        {/* 6. PAGE DÉDIÉE : L'ÉQUIPE FONDATRICE */}
        {currentPage === 'team' && (
          <div className="py-8 animate-in fade-in duration-300">
            <TeamSection />
          </div>
        )}

        {/* 7. PAGE DÉDIÉE : FAQ & ASSISTANCE */}
        {currentPage === 'faq' && (
          <div className="py-8 animate-in fade-in duration-300">
            <FAQSection />
          </div>
        )}

      </main>

      {/* Pied de page vitré multi-pages (masqué en mode chat pleine page pour une expérience applicative 100% immersive) */}
      {currentPage !== 'chat-advisor' && (
        <SiteFooter
          onNavigate={navigateToPage}
          onOpenLegal={handleOpenLegal}
        />
      )}

      {/* Modale Juridique & Conformité APDP Bénin */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalInitialTab}
        onNavigateToPage={navigateToPage}
      />

      {/* Modale de roadmap interactive détaillée */}
      {selectedCareer && (
        <InteractiveRoadmapModal
          career={selectedCareer}
          onClose={() => setSelectedCareer(null)}
        />
      )}

      {/* Modale d'authentification complète (Email, Téléphone/WhatsApp, Google) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        reasonMessage={authReason}
        onSuccess={() => setIsAuthModalOpen(false)}
      />

      {/* Modale de gestion et édition du profil utilisateur */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onNavigateToDashboard={() => {
          setIsProfileModalOpen(false);
          navigateToPage('dashboard');
        }}
      />

      {/* Palette de recherche globale (Ctrl+K ou ⌘K, navigation flèches Haut/Bas, Entrée, Echap) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigateToPage}
        onSelectCareer={(career) => {
          setSelectedCareer(career);
          setIsSearchOpen(false);
        }}
        onOpenAuth={(mode) => {
          setIsSearchOpen(false);
          handleOpenAuth(mode);
        }}
      />

      {/* Bannière de consentement aux cookies */}
      <CookieConsentBanner />

      {/* Modal de Feedback (5 minutes) */}
      {isFeedbackModalOpen && (
        <FeedbackModal
          onClose={handleCloseFeedback}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
