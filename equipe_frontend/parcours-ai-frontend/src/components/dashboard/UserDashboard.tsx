import React, { useState, useEffect } from 'react';
import { 
  History, 
  Activity, 
  Sparkles, 
  Share2, 
  Bookmark, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  ChevronRight, 
  ArrowUpRight, 
  Award, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  User, 
  Clock, 
  ShieldCheck, 
  Waypoints, 
  MessageSquare,
  Plus,
  RefreshCw,
  Share,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DiagnosticRecord, SkillProgress, RoadmapProgress, RecommendationItem, Career } from '../../types';
import { CAREERS_DATA } from '../../data/careersData';
import { loadUserDashboard, saveUserDashboard, addDiagnosticToUserDashboard, UserDashboardData } from '../../utils/dashboardStorage';
import { SITUATIONS_MAP } from '../profile/UserProfileModal';

interface UserDashboardProps {
  onStartNewDiagnostic: () => void;
  onExploreCareer: (career: Career) => void;
  onNavigateToTab?: (tab: string) => void;
  onRequireAuth?: (mode?: 'login' | 'signup') => void;
  onOpenProfile?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onStartNewDiagnostic,
  onExploreCareer,
  onNavigateToTab,
  onRequireAuth,
  onOpenProfile
}) => {
  const { user, isAuthenticated } = useAuth();
  
  // Onglet actif du dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'activity' | 'recommendations' | 'share' | 'favorites'>('overview');
  
  // Données isolées par utilisateur
  const [dashboardData, setDashboardData] = useState<UserDashboardData>(() => 
    loadUserDashboard(user?.id, user?.role, user?.name)
  );

  const [aiStatus, setAiStatus] = useState<{ active: boolean; modelName: string } | null>(null);
  const [isRefreshingAi, setIsRefreshingAi] = useState(false);
  const [aiInsights, setAiInsights] = useState<{ title: string; detail: string; priority: string }[]>([]);

  // Recharger les données quand l'utilisateur change de compte
  useEffect(() => {
    const data = loadUserDashboard(user?.id, user?.role, user?.name);
    setDashboardData(data);
    setSelectedDiagnostic(data.diagnostics[0] || null);
  }, [user?.id, user?.role, user?.name]);

  // Vérification de la disponibilité du moteur Gemini
  useEffect(() => {
    fetch('/api/ai-status')
      .then(res => res.json())
      .then(data => setAiStatus(data))
      .catch(() => setAiStatus({ active: false, modelName: 'Moteur Local' }));
  }, []);

  const diagnostics = dashboardData.diagnostics;
  const skills = dashboardData.skills;
  const recommendations = dashboardData.recommendations;

  const [favorites, setFavorites] = useState<string[]>(() => {
    const key = `parcours_user_favorites_${user?.id || 'guest'}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : ['fullstack-dev', 'data-scientist'];
  });

  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticRecord | null>(diagnostics[0] || null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [shareCustomName, setShareCustomName] = useState(user?.name || 'Talent Béninois');

  // Synchronisation des favoris isolés
  useEffect(() => {
    const key = `parcours_user_favorites_${user?.id || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(favorites));
  }, [favorites, user?.id]);

  const toggleFavorite = (careerId: string) => {
    if (favorites.includes(careerId)) {
      setFavorites(favorites.filter(id => id !== careerId));
    } else {
      setFavorites([...favorites, careerId]);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const newSkill: SkillProgress = {
      id: 'skill-' + Date.now(),
      name: newSkillName.trim(),
      category: 'Compétence clé',
      level: 'En cours',
      percentage: 25,
      lastPracticed: 'Aujourd\'hui'
    };
    const updatedSkills = [newSkill, ...skills];
    const updatedData = { ...dashboardData, skills: updatedSkills };
    setDashboardData(updatedData);
    saveUserDashboard(user?.id, updatedData);
    setNewSkillName('');
  };

  const handleRefreshAiInsights = async () => {
    setIsRefreshingAi(true);
    try {
      const topRole = diagnostics[0]?.roleSuggested || 'Développeur Full-Stack Web & Cloud';
      const skillNames = skills.map(s => s.name);
      const res = await fetch('/api/dashboard-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userRole: user?.role || 'student',
          targetCareer: topRole,
          completedSkills: skillNames
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.insights) {
          setAiInsights(json.data.insights);
        }
      }
    } catch (e) {
      console.warn('Erreur refresh AI insights', e);
    } finally {
      setIsRefreshingAi(false);
    }
  };

  const handleCopyShareLink = () => {
    const link = `${window.location.origin}/#/share/bilan-${user?.id || 'public-benin'}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadDiagnosticText = (diag: DiagnosticRecord) => {
    const content = `================================================
PARCOURS AI · BILAN OFFICIEL D'ORIENTATION
Plateforme Numérique Nationale & Internationale (Bénin)
================================================
Date: ${diag.date}
Candidat: ${user?.name || 'Utilisateur Parcours AI'}
Filière recommandée: ${diag.roleSuggested}
Score d'adéquation: ${diag.matchScore}%
Domaine: ${diag.domain}

RÉSUMÉ DU DIAGNOSTIC:
${diag.summary}

POINTS FORTS DÉTECTÉS:
${diag.topStrengths.map(s => `- ${s}`).join('\n')}

RECOMMANDATIONS PRIORITAIRES:
${diag.keyRecommendations.map(r => `• ${r}`).join('\n')}

Vérifié et généré par Parcours AI (https://parcoursai.bj)
================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bilan_ParcoursAI_${diag.roleSuggested.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const favoriteCareers = CAREERS_DATA.filter(c => favorites.includes(c.id));

  // Écran de protection d'accès : Connexion requise avant d'accéder au dashboard
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-in fade-in duration-300">
        <div className="rounded-3xl p-8 sm:p-14 dark:bg-[#02040c] bg-white border dark:border-cyan-500/30 border-slate-200 shadow-2xl text-center relative overflow-hidden">
          {/* Halos subtils */}
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full dark:bg-cyan-500/10 bg-cyan-100/50 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full dark:bg-indigo-600/10 bg-blue-100/50 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] mx-auto mb-6 shadow-xl shadow-cyan-500/25">
              <div className="w-full h-full rounded-[14px] dark:bg-[#010105] bg-white flex items-center justify-center text-cyan-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 mb-4 inline-block">
              Espace Personnel Sécurisé
            </span>

            <h1 className="text-2xl sm:text-4xl font-black font-display dark:text-white text-slate-900 mb-4 tracking-tight">
              Connectez-vous avant d'accéder à votre dashboard
            </h1>

            <p className="text-sm sm:text-base dark:text-slate-300 text-slate-600 mb-8 leading-relaxed">
              Pour consulter l'historique complet de vos bilans d'orientation, suivre vos compétences validées, retrouver vos fiches métiers favorites et accéder au programme ambassadeur, veuillez vous identifier.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 mb-10 w-full max-w-md mx-auto sm:max-w-none">
              <button
                onClick={() => onRequireAuth?.('login')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[44px] text-center"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onRequireAuth?.('signup')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm dark:bg-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.14] dark:text-white text-slate-800 border dark:border-white/10 border-slate-300 transition-all cursor-pointer min-h-[44px] flex items-center justify-center text-center"
              >
                Créer un compte gratuit
              </button>
            </div>

            {/* Aperçu des 3 fonctionnalités exclusives de l'espace membre */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-6 border-t dark:border-white/10 border-slate-200">
              <div className="p-3.5 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/05 border-slate-200">
                <p className="font-bold text-xs dark:text-white text-slate-900 mb-1">Historique des Bilans</p>
                <p className="text-[11px] dark:text-slate-400 text-slate-600">Téléchargez vos rapports certifiés en format texte.</p>
              </div>
              <div className="p-3.5 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/05 border-slate-200">
                <p className="font-bold text-xs dark:text-white text-slate-900 mb-1">Suivi de Progression</p>
                <p className="text-[11px] dark:text-slate-400 text-slate-600">Pilotez vos compétences validées étape par étape.</p>
              </div>
              <div className="p-3.5 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/05 border-slate-200">
                <p className="font-bold text-xs dark:text-white text-slate-900 mb-1">Réseau & Parrainage</p>
                <p className="text-[11px] dark:text-slate-400 text-slate-600">Partagez votre profil auprès des recruteurs tech.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      
      {/* En-tête du Dashboard Utilisateur */}
      <div className="relative rounded-3xl p-6 sm:p-8 mb-8 border dark:border-cyan-500/20 border-slate-200 dark:bg-gradient-to-r dark:from-[#02040c] dark:via-[#050a1a] dark:to-[#02040c] bg-white shadow-xl dark:shadow-cyan-950/40 shadow-slate-200/60 overflow-hidden">
        
        {/* Décoration de fond subtile */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full dark:bg-cyan-500/10 bg-sky-100/60 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 w-64 h-64 rounded-full dark:bg-indigo-600/10 bg-blue-100/40 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <button 
              onClick={onOpenProfile}
              title="Cliquez pour modifier votre profil"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20 shrink-0 overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-[14px] dark:bg-[#010105] bg-sky-50 flex items-center justify-center font-bold text-xl sm:text-2xl text-cyan-500 dark:text-cyan-400 font-display overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.charAt(0).toUpperCase() : 'P'
                )}
              </div>
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black font-display dark:text-white text-slate-900 tracking-tight">
                  {user?.name ? `Espace de ${user.name}` : 'Mon Tableau de Bord d\'Orientation'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  Profil Actif
                </span>
                {user?.situation && SITUATIONS_MAP[user.situation] && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                    {SITUATIONS_MAP[user.situation].label}
                  </span>
                )}
                {user?.phone && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium dark:bg-white/5 bg-slate-100 dark:text-slate-300 text-slate-600 border dark:border-white/10 border-slate-200">
                    {user.phone}
                  </span>
                )}
              </div>
              <p className="text-sm dark:text-slate-400 text-slate-600 max-w-2xl">
                Suivez vos bilans d'adéquation IA, pilotez votre montée en compétences et partagez votre profil tech au Bénin et à l'international.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenProfile}
              className="w-full sm:w-auto justify-center px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm dark:bg-white/[0.08] bg-slate-100 dark:hover:bg-white/[0.14] hover:bg-slate-200 dark:text-white text-slate-800 border dark:border-white/10 border-slate-200 transition-all flex items-center gap-2 cursor-pointer min-h-[44px] sm:min-h-0 text-center"
            >
              <User className="w-4 h-4 text-cyan-500" />
              <span>Mon Profil</span>
            </button>

            <button
              onClick={onStartNewDiagnostic}
              className="w-full sm:w-auto justify-center px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer min-h-[44px] sm:min-h-0 text-center"
            >
              <Sparkles className="w-4 h-4 text-cyan-200 animate-spin-slow" />
              <span>Nouveau Bilan IA</span>
            </button>

            <button
              onClick={() => setActiveTab('share')}
              className="w-full sm:w-auto justify-center px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm dark:bg-white/[0.08] bg-slate-100 dark:hover:bg-white/[0.14] hover:bg-slate-200 dark:text-white text-slate-800 border dark:border-white/10 border-slate-200 transition-all flex items-center gap-2 cursor-pointer min-h-[44px] sm:min-h-0 text-center"
            >
              <Share2 className="w-4 h-4 text-cyan-500" />
              <span>Partager Bilan</span>
            </button>
          </div>
        </div>

        {/* Métriques d'impact en ligne */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t dark:border-white/10 border-slate-200">
          <div className="p-3 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200">
            <div className="text-xs dark:text-slate-400 text-slate-500 font-medium">Bilans Réalisés</div>
            <div className="text-xl font-bold dark:text-white text-slate-900 mt-0.5">{diagnostics.length}</div>
          </div>
          <div className="p-3 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200">
            <div className="text-xs dark:text-slate-400 text-slate-500 font-medium">Meilleur Matching</div>
            <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">92%</div>
          </div>
          <div className="p-3 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200">
            <div className="text-xs dark:text-slate-400 text-slate-500 font-medium">Compétences Clés</div>
            <div className="text-xl font-bold dark:text-white text-slate-900 mt-0.5">{skills.length}</div>
          </div>
          <div className="p-3 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200">
            <div className="text-xs dark:text-slate-400 text-slate-500 font-medium">Métiers Favoris</div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{favorites.length}</div>
          </div>
        </div>
      </div>

      {/* Barre de navigation des onglets du Dashboard */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar border-b dark:border-white/10 border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
              : 'dark:text-slate-300 text-slate-600 dark:hover:bg-white/[0.06] hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Vue d'ensemble</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
              : 'dark:text-slate-300 text-slate-600 dark:hover:bg-white/[0.06] hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Historique des Bilans ({diagnostics.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'activity'
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
              : 'dark:text-slate-300 text-slate-600 dark:hover:bg-white/[0.06] hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Mon Activité & Compétences</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'recommendations'
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
              : 'dark:text-slate-300 text-slate-600 dark:hover:bg-white/[0.06] hover:bg-slate-100'
          }`}
        >
          <Waypoints className="w-4 h-4" />
          <span>Recommandations & Formations</span>
        </button>

        <button
          onClick={() => setActiveTab('share')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'share'
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
              : 'dark:text-slate-300 text-slate-600 dark:hover:bg-white/[0.06] hover:bg-slate-100'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Partager & Recommander</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
              : 'dark:text-slate-300 text-slate-600 dark:hover:bg-white/[0.06] hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Favoris ({favorites.length})</span>
        </button>
      </div>

      {/* =========================================================================
          CONTENU DE L'ONGLET : VUE D'ENSEMBLE
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Bandeau d'Automatisation & Synchronisation IA Gemini */}
          <div className="rounded-2xl p-4 sm:p-5 dark:bg-gradient-to-r dark:from-[#04081a] dark:to-[#060c26] bg-gradient-to-r from-sky-50 to-blue-50 border dark:border-cyan-500/30 border-sky-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                    {aiStatus?.active ? 'Moteur IA Gemini 3.8 Flash Actif' : 'Moteur d\'Orientation Automatisé'}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${aiStatus?.active ? 'bg-emerald-500 animate-ping' : 'bg-cyan-500'}`} />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {aiStatus?.active
                    ? 'Synchronisation en temps réel activée avec recherche web et évaluation personnalisée des compétences.'
                    : 'Prêt pour l\'IA. Dès que vous ajoutez votre clé API Gemini, l\'évaluation en direct s\'active automatiquement.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleRefreshAiInsights}
              disabled={isRefreshingAi}
              className="w-full sm:w-auto justify-center px-3.5 py-2.5 sm:py-2 rounded-xl text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-sm disabled:opacity-50 min-h-[44px] sm:min-h-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-500 ${isRefreshingAi ? 'animate-spin' : ''}`} />
              <span>{isRefreshingAi ? 'Génération...' : 'Actualiser l\'Analyse IA'}</span>
            </button>
          </div>

          {/* Insights personnalisés générés par l'IA si disponibles */}
          {aiInsights.length > 0 && (
            <div className="rounded-2xl p-5 dark:bg-[#020512] bg-white border border-cyan-500/30 shadow-md">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-600 dark:text-cyan-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Conseils Stratégiques Personnalisés IA
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs dark:text-white text-slate-900">{insight.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-semibold">{insight.priority}</span>
                    </div>
                    <p className="text-[11px] dark:text-slate-300 text-slate-600">{insight.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bloc d'adéquation majeure */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Carte Bilan Actuel en vedette */}
            <div className="lg:col-span-2 rounded-2xl p-6 dark:bg-[#02040c] bg-white border dark:border-cyan-500/20 border-slate-200 shadow-lg dark:shadow-cyan-950/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Orientation Recommandée Principale
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  92% d'adéquation
                </span>
              </div>

              <h2 className="text-2xl font-bold font-display dark:text-white text-slate-900 mb-2">
                Développeur Full-Stack Web & Cloud
              </h2>
              <p className="text-sm dark:text-slate-400 text-slate-600 mb-6 leading-relaxed">
                Votre appétence pour la construction logicielle et la résolution de problèmes complexes correspond aux besoins urgents des startups à Cotonou et des entreprises internationales en remote.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200">
                  <div className="text-xs dark:text-slate-400 text-slate-500 mb-1">Rémunération Moyenne Bénin</div>
                  <div className="text-base font-bold dark:text-white text-slate-900">450.000 - 1.200.000 FCFA/m</div>
                </div>
                <div className="p-4 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200">
                  <div className="text-xs dark:text-slate-400 text-slate-500 mb-1">Rémunération Remote International</div>
                  <div className="text-base font-bold text-cyan-600 dark:text-cyan-400">35.000€ - 75.000€/an</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t dark:border-white/10 border-slate-200">
                <div className="flex items-center gap-2 text-xs dark:text-slate-400 text-slate-600">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <span>Dernière évaluation IA : il y a 24h</span>
                </div>
                <button
                  onClick={() => {
                    const c = CAREERS_DATA.find(x => x.id === 'fullstack-dev');
                    if (c) onExploreCareer(c);
                  }}
                  className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Ouvrir la feuille de route complète</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Carte Actions rapides & Conseils personnalisés */}
            <div className="space-y-4">
              <div className="rounded-2xl p-6 dark:bg-[#02040c] bg-white border dark:border-cyan-500/20 border-slate-200 shadow-lg">
                <h3 className="font-bold text-base dark:text-white text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  Actions Prioritaires
                </h3>
                <ul className="space-y-2.5 text-xs">
                  <li className="p-2.5 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold dark:text-white text-slate-900 block">Finaliser le module TypeScript</span>
                      <span className="dark:text-slate-400 text-slate-500">Augmente votre employabilité de +35%</span>
                    </div>
                  </li>
                  <li className="p-2.5 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold dark:text-white text-slate-900 block">Créer un Portfolio GitHub</span>
                      <span className="dark:text-slate-400 text-slate-500">Indispensable pour les recruteurs en remote</span>
                    </div>
                  </li>
                  <li className="p-2.5 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold dark:text-white text-slate-900 block">Partager votre bilan certifié</span>
                      <span className="dark:text-slate-400 text-slate-500">Obtenez les retours de la communauté tech</span>
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold dark:bg-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.12] dark:text-white text-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Voir toutes les recommandations</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Parrainage rapide */}
              <div className="rounded-2xl p-5 dark:bg-gradient-to-br dark:from-cyan-950/40 dark:to-blue-950/40 bg-sky-50/80 border dark:border-cyan-500/30 border-sky-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300 mb-1">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Recommander Parcours AI</span>
                </div>
                <p className="text-xs dark:text-slate-300 text-slate-700 mb-3">
                  Aidez un camarade ou collègue à trouver sa vocation dans la tech africaine.
                </p>
                <button
                  onClick={() => setActiveTab('share')}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors shadow-sm cursor-pointer"
                >
                  Obtenir mon lien d'invitation
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          CONTENU DE L'ONGLET : HISTORIQUE DES BILANS
          ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold dark:text-white text-slate-900 font-display">
                Historique de vos Diagnostics & Bilans
              </h2>
              <p className="text-xs dark:text-slate-400 text-slate-600">
                Consultez, réévaluez et téléchargez l'ensemble de vos synthèses d'orientation.
              </p>
            </div>

            <button
              onClick={onStartNewDiagnostic}
              className="w-full sm:w-auto justify-center px-4 py-3 sm:py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-1.5 cursor-pointer shadow-md min-h-[44px] sm:min-h-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Diagnostic</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Liste des bilans passés */}
            <div className="space-y-3">
              {diagnostics.map((diag) => (
                <div
                  key={diag.id}
                  onClick={() => setSelectedDiagnostic(diag)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedDiagnostic?.id === diag.id
                      ? 'dark:bg-cyan-500/15 bg-sky-50 dark:border-cyan-500/50 border-cyan-400 shadow-md'
                      : 'dark:bg-[#0a122c] bg-white dark:border-white/10 border-slate-200 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs dark:text-slate-400 text-slate-500 mb-1.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                      {diag.date}
                    </span>
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      {diag.matchScore}% Match
                    </span>
                  </div>

                  <h3 className="font-bold text-sm dark:text-white text-slate-900 mb-1 line-clamp-1">
                    {diag.roleSuggested}
                  </h3>
                  <p className="text-xs dark:text-slate-400 text-slate-600 line-clamp-2 mb-2">
                    {diag.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                    <span>{diag.domain}</span>
                    <span className="flex items-center gap-0.5">
                      Détails <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Vue détaillée du bilan sélectionné */}
            {selectedDiagnostic && (
              <div className="lg:col-span-2 rounded-2xl p-6 dark:bg-[#0a122c] bg-white border dark:border-cyan-500/30 border-slate-200 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b dark:border-white/10 border-slate-200 mb-6">
                  <div>
                    <span className="text-xs font-mono dark:text-slate-400 text-slate-500">
                      Bilan certifié #{selectedDiagnostic.id} · {selectedDiagnostic.date}
                    </span>
                    <h3 className="text-xl font-bold dark:text-white text-slate-900 font-display mt-0.5">
                      {selectedDiagnostic.roleSuggested}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleDownloadDiagnosticText(selectedDiagnostic)}
                      className="flex-1 sm:flex-none justify-center px-3 py-2.5 sm:py-1.5 rounded-xl text-xs font-semibold dark:bg-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.14] dark:text-white text-slate-800 border dark:border-white/10 border-slate-200 flex items-center gap-1.5 cursor-pointer min-h-[40px] sm:min-h-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('share')}
                      className="flex-1 sm:flex-none justify-center px-3 py-2.5 sm:py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-1.5 cursor-pointer min-h-[40px] sm:min-h-0"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Partager</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
                      Synthèse de l'Orientation
                    </h4>
                    <p className="text-sm dark:text-slate-300 text-slate-700 leading-relaxed dark:bg-white/[0.02] bg-slate-50 p-4 rounded-xl border dark:border-white/5 border-slate-200">
                      {selectedDiagnostic.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
                      Vos Principaux Atouts Détectés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDiagnostic.topStrengths.map((str, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold dark:bg-white/[0.05] bg-sky-50 dark:text-slate-200 text-slate-800 border dark:border-cyan-500/20 border-sky-200 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {str}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
                      Plan d'Action Recommandé par l'IA
                    </h4>
                    <ul className="space-y-2">
                      {selectedDiagnostic.keyRecommendations.map((rec, idx) => (
                        <li 
                          key={idx}
                          className="p-3 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200 text-xs dark:text-slate-300 text-slate-700 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          CONTENU DE L'ONGLET : MON ACTIVITÉ & COMPÉTENCES
          ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold dark:text-white text-slate-900 font-display">
                Mon Activité & Suivi des Compétences
              </h2>
              <p className="text-xs dark:text-slate-400 text-slate-600">
                Gérez vos apprentissages en direct et validez vos compétences clés.
              </p>
            </div>

            <form onSubmit={handleAddSkill} className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Ajouter une compétence (ex: Python, Docker)"
                className="px-3.5 py-2 rounded-xl text-xs dark:bg-white/[0.06] bg-white border dark:border-white/15 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-cyan-500 w-56 sm:w-64"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </form>
          </div>

          {/* Grille des compétences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div 
                key={skill.id}
                className="p-4 rounded-2xl dark:bg-[#0a122c] bg-white border dark:border-white/10 border-slate-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono dark:text-slate-400 text-slate-500">
                    {skill.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    skill.level === 'Acquis' 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    {skill.level}
                  </span>
                </div>

                <h3 className="font-bold text-sm dark:text-white text-slate-900 mb-3">
                  {skill.name}
                </h3>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="dark:text-slate-400 text-slate-500">Niveau de maîtrise</span>
                    <span className="font-bold dark:text-slate-200 text-slate-700">{skill.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full dark:bg-white/[0.08] bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t dark:border-white/10 border-slate-100 flex items-center justify-between text-[11px] dark:text-slate-400 text-slate-500">
                  <span>Pratiqué : {skill.lastPracticed}</span>
                  <button 
                    onClick={() => {
                      const updatedSkills = skills.map(s => s.id === skill.id ? { ...s, percentage: Math.min(100, s.percentage + 10), level: s.percentage >= 70 ? ('Acquis' as const) : ('En cours' as const) } : s);
                      const updatedData = { ...dashboardData, skills: updatedSkills };
                      setDashboardData(updatedData);
                      saveUserDashboard(user?.id, updatedData);
                    }}
                    className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
                  >
                    + Progresser
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Feuille de route en cours */}
          <div className="rounded-2xl p-6 dark:bg-[#0a122c] bg-white border dark:border-cyan-500/20 border-slate-200 shadow-md">
            <h3 className="font-bold text-base dark:text-white text-slate-900 mb-4 flex items-center gap-2 font-display">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              Roadmap Active : Développeur Full-Stack Web & Mobile
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm dark:text-white text-slate-900">Étape 1 : Fondations Web & TypeScript</span>
                    <span className="text-xs text-emerald-600 font-semibold">Validé</span>
                  </div>
                  <p className="text-xs dark:text-slate-400 text-slate-500">HTML5 sémantique, CSS moderne, ECMAScript 6+, TypeScript strict.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 font-bold flex items-center justify-center shrink-0 animate-pulse">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm dark:text-white text-slate-900">Étape 2 : Écosystème Frontend & React</span>
                    <span className="text-xs text-cyan-600 font-semibold">En cours (70%)</span>
                  </div>
                  <p className="text-xs dark:text-slate-400 text-slate-500">Hooks avancés, state management, intégration d'API, Tailwind CSS.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full dark:bg-white/[0.05] bg-slate-100 text-slate-400 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm dark:text-slate-400 text-slate-500">Étape 3 : Backend Node & Bases de Données</span>
                    <span className="text-xs text-slate-400">À venir</span>
                  </div>
                  <p className="text-xs dark:text-slate-500 text-slate-400">Express/Fastify, PostgreSQL, Authentification JWT/OAuth.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          CONTENU DE L'ONGLET : RECOMMANDATIONS & FORMATIONS
          ========================================================================= */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 font-display">
              Recommandations Personnalisées de Formations & Opportunités
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-600">
              Sélection rigoureuse des meilleures écoles béninoises, certifications internationales et offres tech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div 
                key={rec.id}
                className="p-5 rounded-2xl dark:bg-[#0a122c] bg-white border dark:border-white/10 border-slate-200 shadow-md hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {rec.badge}
                    </span>
                    <span className="text-xs font-mono dark:text-slate-400 text-slate-500">
                      {rec.durationOrSalary}
                    </span>
                  </div>

                  <h3 className="font-bold text-base dark:text-white text-slate-900 mb-1">
                    {rec.title}
                  </h3>

                  <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2">
                    {rec.provider} · <span className="dark:text-slate-400 text-slate-500">{rec.location}</span>
                  </p>

                  <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed mb-4">
                    {rec.matchReason}
                  </p>
                </div>

                <div className="pt-3 border-t dark:border-white/10 border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] dark:text-slate-400 text-slate-500">Vérifié par Parcours AI</span>
                  {rec.link ? (
                    <a
                      href={rec.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Consulter le site officiel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button 
                      onClick={() => alert('Postulation directe bientôt ouverte via nos entreprises partenaires à Cotonou !')}
                      className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      Postuler avec mon profil →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          CONTENU DE L'ONGLET : PARTAGER & PARRAINAGE
          ========================================================================= */}
      {activeTab === 'share' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 font-display">
              Partager & Recommander Parcours AI
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-600">
              Valorisez vos résultats d'orientation auprès des recruteurs et recommandez la plateforme à vos proches.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Carte Visuelle de Partage style Badging Bénin */}
            <div className="rounded-3xl p-6 sm:p-8 dark:bg-gradient-to-br dark:from-[#0b1433] dark:via-[#090f26] dark:to-[#040815] bg-white border dark:border-cyan-500/40 border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center font-bold">
                    <Waypoints className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-lg tracking-tight font-display dark:text-white text-slate-900">
                    Parcours<span className="text-cyan-500">AI</span>
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  Bilan Officiel 2026
                </span>
              </div>

              <div className="mb-6">
                <div className="text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-1">Candidat Certifié</div>
                <h3 className="text-2xl font-black dark:text-white text-slate-900 font-display">
                  {user?.name || shareCustomName}
                </h3>
                <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                  {diagnostics[0]?.roleSuggested || 'Développeur Full-Stack Web & Cloud'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl dark:bg-white/[0.04] bg-slate-50 border dark:border-white/10 border-slate-200">
                  <div className="text-[11px] dark:text-slate-400 text-slate-500">Score de Concordance</div>
                  <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">92% Match</div>
                </div>
                <div className="p-3 rounded-xl dark:bg-white/[0.04] bg-slate-50 border dark:border-white/10 border-slate-200">
                  <div className="text-[11px] dark:text-slate-400 text-slate-500">Écosystème Cible</div>
                  <div className="text-lg font-bold dark:text-white text-slate-900">Bénin & Remote</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t dark:border-white/10 border-slate-200 text-xs text-slate-500">
                <span>Vérifiable sur parcoursai.bj</span>
                <span className="font-mono">ID: BJ-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>

            {/* Actions de partage & Parrainage */}
            <div className="space-y-6">
              
              <div className="p-6 rounded-2xl dark:bg-[#0a122c] bg-white border dark:border-white/10 border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-base dark:text-white text-slate-900">
                  Lien de Partage de votre Profil
                </h3>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/#/u/${user?.id || 'talents-benin'}`}
                    className="flex-1 px-3.5 py-2.5 rounded-xl text-xs dark:bg-white/[0.05] bg-slate-50 border dark:border-white/10 border-slate-300 dark:text-slate-300 text-slate-700 font-mono"
                  />
                  <button
                    onClick={handleCopyShareLink}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row flex-wrap gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Découvrez mon bilan d'orientation tech sur Parcours AI : ${window.location.origin}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto justify-center px-3.5 py-3 sm:py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition-colors cursor-pointer min-h-[44px] sm:min-h-0 text-center"
                  >
                    <span>Partager sur WhatsApp</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto justify-center px-3.5 py-3 sm:py-2 rounded-xl text-xs font-semibold bg-[#0a66c2] hover:bg-[#084e96] text-white flex items-center gap-2 transition-colors cursor-pointer min-h-[44px] sm:min-h-0 text-center"
                  >
                    <span>Partager sur LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Programme de Parrainage */}
              <div className="p-6 rounded-2xl dark:bg-[#0a122c] bg-white border dark:border-cyan-500/30 border-slate-200 shadow-md space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-bold text-base dark:text-white text-slate-900">
                    Programme Ambassadeur & Parrainage
                  </h3>
                </div>
                <p className="text-xs dark:text-slate-300 text-slate-700 leading-relaxed">
                  Chaque fois qu'un ami réalise son premier diagnostic grâce à votre code <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30">BENIN-AI-2026</span>, vous débloquez un accès prioritaire aux ateliers d'insertion pro.
                </p>
                <div className="flex items-center gap-3 pt-2 text-xs font-semibold dark:text-slate-200 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>3 amis ont déjà utilisé votre recommandation ce mois-ci</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          CONTENU DE L'ONGLET : FAVORIS
          ========================================================================= */}
      {activeTab === 'favorites' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 font-display">
              Vos Métiers Favoris & Fiches Sauvegardées
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-600">
              Retrouvez directement les fiches métiers que vous avez épinglées.
            </p>
          </div>

          {favoriteCareers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl dark:bg-[#0a122c] bg-white border dark:border-white/10 border-slate-200">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-50" />
              <p className="text-sm dark:text-slate-300 text-slate-700 font-semibold mb-1">Aucun métier en favoris pour le moment</p>
              <p className="text-xs dark:text-slate-400 text-slate-500">Parcourez notre catalogue des filières d'avenir pour en épingler.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteCareers.map((career) => (
                <div
                  key={career.id}
                  className="p-5 rounded-2xl dark:bg-[#0a122c] bg-white border dark:border-white/10 border-slate-200 shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                        {career.categoryLabel}
                      </span>
                      <button
                        onClick={() => toggleFavorite(career.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Retirer des favoris"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <h3 className="font-bold text-base dark:text-white text-slate-900 mb-2">
                      {career.title}
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-slate-600 line-clamp-3 mb-4">
                      {career.shortDescription}
                    </p>

                    <div className="space-y-1.5 p-3 rounded-xl dark:bg-white/[0.03] bg-slate-50 text-xs border dark:border-white/5 border-slate-100 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bénin :</span>
                        <span className="font-bold dark:text-white text-slate-800">{career.salaryLocal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Remote :</span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">{career.salaryRemote}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onExploreCareer(career)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500 text-cyan-600 dark:text-cyan-400 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Consulter la Roadmap</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
