import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatSession, Career, UserProfile } from '../../types';
import { CAREERS_DATA } from '../../data/careersData';
import { generateCareerRoadmapPDF } from '../../utils/pdfGenerator';
import { 
  Sparkles, 
  Send, 
  User, 
  ArrowRight, 
  RotateCcw, 
  Waypoints, 
  Zap, 
  Lock, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Search, 
  Download, 
  PanelLeft, 
  Copy, 
  Check, 
  Briefcase,
  Globe,
  ExternalLink,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { addDiagnosticToUserDashboard } from '../../utils/dashboardStorage';

interface CareerAdvisorChatProps {
  onSelectCareerRoadmap: (career: Career) => void;
  onRequireAuth: () => void;
}

const STORAGE_KEY = 'parcours_ai_chat_sessions_v2';
const ACTIVE_SESSION_KEY = 'parcours_ai_active_session_id';

// Calculateur de temps relatif dynamique (ex: À l'instant, Il y a 2 min, etc.)
function formatMessageRelativeTime(timestamp?: string | number, createdAt?: number): string {
  const timeMs = createdAt || (typeof timestamp === 'number' ? timestamp : (typeof timestamp === 'string' && !isNaN(Number(timestamp)) ? Number(timestamp) : null));
  if (!timeMs) {
    if (typeof timestamp === 'string' && timestamp !== "À l'instant") return timestamp;
    return "À l'instant";
  }
  const now = Date.now();
  const diffSec = Math.floor((now - timeMs) / 1000);

  if (diffSec < 45) return "À l'instant";
  if (diffSec < 120) return "Il y a 1 min";
  if (diffSec < 3600) return `Il y a ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) {
    const d = new Date(timeMs);
    return `Aujourd'hui à ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  const d = new Date(timeMs);
  return `${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

const createInitialGuidedMessage = (): ChatMessage => ({
  id: `welcome-guided-${Date.now()}`,
  sender: 'ai',
  text: "Bonjour. Je suis votre conseiller d'orientation chez **Parcours AI**.\n\nEn quelques questions ciblées, je vais analyser votre profil, vos compétences et vos ambitions pour vous proposer les **carrières numériques les plus adaptées** avec votre feuille de route personnalisée.\n\nPour commencer : **quelle est votre situation actuelle ?**",
  timestamp: 'À l\'instant',
  createdAt: Date.now()
});

const STARTER_PROMPTS = [
  {
    icon: Waypoints,
    title: "Diagnostic d'orientation complet",
    desc: "Bilan personnalisé en 4 questions pour trouver votre filière idéale",
    prompt: "Je souhaite démarrer mon diagnostic complet d'orientation professionnelle.",
    mode: 'orientation_guide' as const
  },
  {
    icon: Zap,
    title: "Grille des Salaires & Remote",
    desc: "Salaires réels locaux (Bénin / Afrique) et télétravail international en € / $",
    prompt: "Quels sont les salaires réels des métiers tech au Bénin et en télétravail international ?",
    mode: 'free_chat' as const
  },
  {
    icon: Sparkles,
    title: "Intelligence Artificielle & Data",
    desc: "Roadmap complète pour devenir Ingénieur IA ou Data Scientist",
    prompt: "Comment me former efficacement pour devenir Ingénieur IA et Machine Learning en 2026 ?",
    mode: 'free_chat' as const
  },
  {
    icon: Briefcase,
    title: "Reconversion Web sans diplôme",
    desc: "Parcours d'apprentissage accéléré pour débuter de zéro",
    prompt: "Je souhaite me reconvertir dans le développement web sans diplôme préalable, par quoi commencer ?",
    mode: 'free_chat' as const
  }
];

export const CareerAdvisorChat: React.FC<CareerAdvisorChatProps> = ({
  onSelectCareerRoadmap,
  onRequireAuth
}) => {
  const { isAuthenticated, user } = useAuth();
  
  // Rendu réactif toutes les 20 secondes pour actualiser les "Il y a X min"
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // État des sessions de discussion
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Erreur de chargement des sessions", e);
    }
    
    // Session initiale par défaut
    const defaultSession: ChatSession = {
      id: 'session-default-1',
      title: "Bilan d'Orientation Initial",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: 'orientation_guide',
      step: 1,
      messages: [createInitialGuidedMessage()]
    };
    return [defaultSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (savedId) return savedId;
    } catch (e) {}
    return 'session-default-1';
  });

  // États de l'interface utilisateur
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');
  const [isLockedByAuth, setIsLockedByAuth] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Session active actuelle
  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Sauvegarde dans le LocalStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
    } catch (e) {
      console.error("Erreur sauvegarde sessions", e);
    }
  }, [sessions, activeSessionId]);

  // Scroll automatique au bas des messages
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isThinking]);

  // Déblocage automatique si l'utilisateur s'authentifie
  useEffect(() => {
    if (isLockedByAuth && isAuthenticated) {
      setIsLockedByAuth(false);
      setIsThinking(true);
      setTimeout(() => {
        const unlockedMessage: ChatMessage = {
          id: `ai-unlocked-${Date.now()}`,
          sender: 'ai',
          text: "Bienvenue et merci pour votre connexion. Votre accès est désormais illimité.\n\nPoursuivons votre échange : quel type d'objectif professionnel visez-vous en priorité ?",
          timestamp: 'À l\'instant',
          createdAt: Date.now()
        };
        addMessageToCurrentSession(unlockedMessage, { step: 3 });
        setIsThinking(false);
      }, 600);
    }
  }, [isAuthenticated, isLockedByAuth]);

  // Création d'une nouvelle conversation
  const handleCreateNewSession = (mode: 'orientation_guide' | 'free_chat' = 'free_chat') => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: mode === 'orientation_guide' ? `Bilan d'orientation #${sessions.length + 1}` : `Discussion #${sessions.length + 1}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode,
      step: 1,
      messages: mode === 'orientation_guide' ? [createInitialGuidedMessage()] : [
        {
          id: `welcome-free-${Date.now()}`,
          sender: 'ai',
          text: "Bonjour. Je suis votre conseiller carrière Parcours AI, doté d'un moteur d'analyse et de recherche web en temps réel.\n\nPosez-moi vos questions sur **les métiers tech, les salaires réels au Bénin et à l'international, les formations, les certifications ou le télétravail (remote)**.\n\nQue souhaitez-vous explorer aujourd'hui ?",
          timestamp: 'À l\'instant',
          createdAt: Date.now()
        }
      ]
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setInputVal('');
    
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Suppression d'une conversation
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (updated.length > 0) {
      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id);
      }
    } else {
      setActiveSessionId('');
    }
  };

  // Renommer une conversation
  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleInput(session.title);
  };

  const handleSaveRename = (sessionId: string) => {
    if (!editTitleInput.trim()) return;
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: editTitleInput.trim() } : s));
    setEditingSessionId(null);
  };

  // Ajout d'un message à la session active
  const addMessageToCurrentSession = (
    msg: ChatMessage, 
    extraUpdates?: Partial<ChatSession>
  ) => {
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        let newTitle = session.title;
        if (msg.sender === 'user' && session.messages.filter(m => m.sender === 'user').length === 0) {
          newTitle = msg.text.slice(0, 32) + (msg.text.length > 32 ? '...' : '');
        }

        return {
          ...session,
          title: newTitle,
          updatedAt: Date.now(),
          messages: [...session.messages, msg],
          ...extraUpdates
        };
      }
      return session;
    }));
  };

  // Envoi d'un message
  const handleSendMessage = (textToSend?: string) => {
    if (isLockedByAuth && !isAuthenticated) {
      onRequireAuth();
      return;
    }

    const messageText = (textToSend || inputVal).trim();
    if (!messageText || isThinking) return;

    // Si aucune session active n'existe, en créer une immédiatement
    if (!currentSession || sessions.length === 0) {
      const newId = `session-${Date.now()}`;
      const newSession: ChatSession = {
        id: newId,
        title: messageText.slice(0, 32) + (messageText.length > 32 ? '...' : ''),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mode: 'free_chat',
        step: 1,
        messages: [{
          id: `user-${Date.now()}`,
          sender: 'user',
          text: messageText,
          timestamp: 'À l\'instant',
          createdAt: Date.now()
        }]
      };
      setSessions([newSession]);
      setActiveSessionId(newId);
      setInputVal('');
      setIsThinking(true);
      processFreeChatWithAPI(messageText, newSession);
      return;
    }

    // 1. Ajouter le message utilisateur
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: 'À l\'instant',
      createdAt: Date.now()
    };

    addMessageToCurrentSession(userMsg);
    setInputVal('');
    setIsThinking(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // 2. Traiter la réponse IA selon le mode de la session
    if (currentSession.mode === 'orientation_guide') {
      setTimeout(() => {
        processGuidedStep(messageText, currentSession.step || 1, currentSession.userProfile || {});
      }, 400);
    } else {
      processFreeChatWithAPI(messageText, currentSession);
    }
  };

  // Logique du Mode Bilan Guidé sans émojis
  const processGuidedStep = (userAnswer: string, currentStep: number, profile: UserProfile) => {
    let nextAiMessage: ChatMessage;
    let nextStep = currentStep + 1;
    let updatedProfile = { ...profile };

    if (currentStep === 1) {
      updatedProfile.educationLevel = userAnswer;
      nextAiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "C'est bien noté.\n\n**Qu'est-ce qui vous intéresse le plus naturellement dans l'univers numérique ?**",
        timestamp: 'À l\'instant',
        createdAt: Date.now()
      };
    } else if (currentStep === 2) {
      updatedProfile.passions = [userAnswer];

      // Règle de démo : 2 questions pour les visiteurs non connectés
      if (!isAuthenticated) {
        setIsLockedByAuth(true);
        nextAiMessage = {
          id: `ai-gated-${Date.now()}`,
          sender: 'ai',
          text: "Votre profil présente un potentiel intéressant.\n\nConformément aux modalités de la plateforme, vous avez utilisé vos **2 questions gratuites** en mode invité.\n\nPour poursuivre le diagnostic, affiner vos compétences et générer votre feuille de route complète téléchargeable en PDF, veuillez vous connecter ou créer votre compte gratuit.",
          timestamp: 'À l\'instant',
          createdAt: Date.now()
        };
        addMessageToCurrentSession(nextAiMessage, { userProfile: updatedProfile });
        setIsThinking(false);
        return;
      }

      nextAiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "C'est noté. Quel type d'**objectif professionnel** visez-vous en priorité ?",
        timestamp: 'À l\'instant',
        createdAt: Date.now()
      };
    } else if (currentStep === 3) {
      updatedProfile.targetGoals = userAnswer;
      nextAiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Dernière étape pour finaliser le diagnostic : **quel est votre niveau technique actuel en informatique ou programmation ?**",
        timestamp: 'À l\'instant',
        createdAt: Date.now()
      };
    } else {
      // Étape finale : Recommandation personnalisée
      nextStep = 5;
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      const passionsLower = ((updatedProfile.passions?.[0] || '') + ' ' + userAnswer).toLowerCase();
      let primaryCareer = CAREERS_DATA[0];
      let secondaryCareer = CAREERS_DATA[1];

      if (passionsLower.includes('données') || passionsLower.includes('ia') || passionsLower.includes('algorithmes') || passionsLower.includes('math')) {
        primaryCareer = { ...CAREERS_DATA[1], matchScore: 98 };
        secondaryCareer = { ...CAREERS_DATA[0], matchScore: 89 };
      } else if (passionsLower.includes('design') || passionsLower.includes('ergonomie') || passionsLower.includes('visuel')) {
        primaryCareer = { ...CAREERS_DATA[2], matchScore: 96 };
        secondaryCareer = { ...CAREERS_DATA[0], matchScore: 85 };
      } else if (passionsLower.includes('sécurité') || passionsLower.includes('hacking') || passionsLower.includes('réseaux')) {
        primaryCareer = { ...CAREERS_DATA[3], matchScore: 97 };
        secondaryCareer = { ...CAREERS_DATA[0], matchScore: 84 };
      } else if (passionsLower.includes('gestion') || passionsLower.includes('stratégie') || passionsLower.includes('leadership')) {
        primaryCareer = { ...CAREERS_DATA[4], matchScore: 95 };
        secondaryCareer = { ...CAREERS_DATA[2], matchScore: 86 };
      } else {
        primaryCareer = { ...CAREERS_DATA[0], matchScore: 96 };
        secondaryCareer = { ...CAREERS_DATA[1], matchScore: 90 };
      }

      // Enregistrement automatique dans le Dashboard personnel de l'utilisateur
      try {
        addDiagnosticToUserDashboard(user?.id, {
          id: `diag-${Date.now()}`,
          date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          roleSuggested: primaryCareer.title,
          matchScore: primaryCareer.matchScore || 94,
          domain: primaryCareer.categoryLabel || 'Numérique & Tech',
          summary: `Bilan d'orientation IA généré. Profil à fort potentiel détecté pour la filière ${primaryCareer.title}. Forte concordance avec les débouchés locaux et internationaux.`,
          topStrengths: primaryCareer.keySkills.slice(0, 3),
          keyRecommendations: [
            `Suivre la feuille de route 4 phases de ${primaryCareer.title}`,
            'Construire un portfolio de projets concrets vérifiables',
            'Préparer les certifications requises pour le marché du télétravail'
          ],
          status: 'completed'
        });
      } catch (err) {
        console.warn('Erreur sauvegarde automatique dashboard', err);
      }

      nextAiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Diagnostic complété avec succès et enregistré dans votre Dashboard personnel.\n\nAu vu de vos réponses et de vos motivations, votre profil présente une forte adéquation avec la filière **${primaryCareer.title}** (Indice de concordance estimé : **${primaryCareer.matchScore}%**).\n\nVoici les carrières identifiées pour vous avec leurs débouchés et votre feuille de route prête à être téléchargée en PDF :`,
        timestamp: 'À l\'instant',
        createdAt: Date.now(),
        searchSources: [
          { title: "Ministère de l'Enseignement Supérieur (Bénin)", uri: "https://enseignementsuperieur.gouv.bj" },
          { title: "IFRI - Université d'Abomey-Calavi", uri: "https://ifri-uac.bj" },
          { title: "Sèmè City - Cité de l'Innovation", uri: "https://semecity.bj" }
        ],
        recommendedCareers: [primaryCareer, secondaryCareer],
        isComplete: true
      };
    }

    addMessageToCurrentSession(nextAiMessage, {
      step: nextStep,
      userProfile: updatedProfile,
      isComplete: nextStep >= 5
    });
    setIsThinking(false);
  };

  // Traitement Free Chat via l'API sécurisée avec recherche web
  const processFreeChatWithAPI = async (userQuery: string, sessionContext: ChatSession) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userQuery,
          history: sessionContext.messages,
          userProfile: sessionContext.userProfile,
          mode: sessionContext.mode,
          useSearch: webSearchEnabled,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const qLower = userQuery.toLowerCase();
        const matchedCareer = CAREERS_DATA.find(c => 
          qLower.includes(c.title.toLowerCase()) || 
          c.keySkills.some(skill => qLower.includes(skill.toLowerCase())) ||
          (c.category === 'data_ai' && (qLower.includes('ia') || qLower.includes('data') || qLower.includes('python'))) ||
          (c.category === 'security' && (qLower.includes('cyber') || qLower.includes('sécurité') || qLower.includes('hacking'))) ||
          (c.category === 'design' && (qLower.includes('design') || qLower.includes('ui/ux') || qLower.includes('figma'))) ||
          (c.category === 'tech' && (qLower.includes('fullstack') || qLower.includes('web') || qLower.includes('développeur') || qLower.includes('react')))
        );

        const finalRecommended = (data.recommendedCareers && data.recommendedCareers.length > 0)
          ? data.recommendedCareers
          : (matchedCareer ? [matchedCareer] : undefined);

        const nextAiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text,
          timestamp: 'À l\'instant',
          createdAt: Date.now(),
          searchSources: data.searchSources,
          recommendedCareers: finalRecommended
        };

        addMessageToCurrentSession(nextAiMessage);
      } else {
        const errorData = await response.json();
        const nextAiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Désolé, une erreur est survenue : ${errorData.error || 'Erreur inconnue'}.`,
          timestamp: 'À l\'instant',
          createdAt: Date.now()
        };

        addMessageToCurrentSession(nextAiMessage);
      }
    } catch (e) {
      const nextAiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Désolé, une erreur technique est survenue lors de la communication avec le moteur IA.",
        timestamp: 'À l\'instant',
        createdAt: Date.now()
      };

      addMessageToCurrentSession(nextAiMessage);
    } finally {
      setIsThinking(false);
    }
  };

  // Télécharger le PDF officiel de la carrière ou du diagnostic
  const handleDownloadPDF = async (career: Career) => {
    setIsGeneratingPdf(true);
    try {
      const phases = career.roadmap.map((step, idx) => ({
        step: idx + 1,
        title: `${step.phase} : ${step.title}`,
        duration: step.duration,
        description: step.description,
        skills: step.skillsAcquired,
        milestone: step.milestoneCheck
      }));

      await generateCareerRoadmapPDF({
        career,
        candidateName: isAuthenticated ? user?.name : 'Candidat Parcours AI',
        userProfile: currentSession?.userProfile,
        roadmapPhases: phases
      });
    } catch (e) {
      console.error('Erreur téléchargement PDF :', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Copier le texte d'un message
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Export de la conversation
  const handleExportChat = () => {
    if (!currentSession) return;
    const chatContent = currentSession.messages
      .map(m => `[${m.sender === 'user' ? 'UTILISATEUR' : 'CONSEILLER PARCOURS AI'}] (${formatMessageRelativeTime(m.timestamp, m.createdAt)})\n${m.text}\n`)
      .join('\n----------------------------------------\n\n');
    
    const blob = new Blob([`CONVERSATION PARCOURS AI - ${currentSession.title}\nDate : ${new Date().toLocaleDateString('fr-FR')}\n\n` + chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `parcours-ai-chat-${currentSession.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtrage des conversations
  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.messages.some(m => m.text.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const hasNoSessions = sessions.length === 0 || !currentSession;

  return (
    <div className="h-full w-full flex bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 overflow-hidden relative">
      
      {/* ========================================================================= */}
      {/* SIDEBAR GAUCHE (Historique & Gestion des sessions) */}
      {/* ========================================================================= */}
      <aside 
        className={`
          ${isSidebarOpen ? 'w-72 sm:w-80 translate-x-0' : 'w-0 -translate-x-full'} 
          transition-all duration-300 ease-in-out flex flex-col border-r border-slate-200 dark:border-slate-800/80 
          bg-white dark:bg-[#090e1f] z-30 absolute md:relative inset-y-0 left-0 overflow-hidden shadow-xl md:shadow-none
        `}
      >
        {/* Haut de la sidebar avec le logo officiel Parcours AI */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-sm shadow-cyan-500/20 shrink-0">
                <div className="w-full h-full dark:bg-[#070b1a] bg-white rounded-[10px] flex items-center justify-center">
                  <Waypoints className="w-3.5 h-3.5 text-cyan-500" />
                </div>
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                Conversations
              </span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fermer la barre latérale"
            >
              <PanelLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Boutons Nouvelle conversation */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => handleCreateNewSession('orientation_guide')}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all text-center cursor-pointer"
            >
              <Waypoints className="w-3.5 h-3.5 shrink-0" />
              <span>Nouveau Bilan</span>
            </button>

            <button
              onClick={() => handleCreateNewSession('free_chat')}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-all text-center cursor-pointer border border-slate-200 dark:border-slate-700/60"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Discussion Libre</span>
            </button>
          </div>

          {/* Barre de recherche dans l'historique */}
          <div className="relative pt-0.5">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une discussion..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-10 px-4 text-xs text-slate-400">
              Aucune discussion enregistrée.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`
                    group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all
                    ${isActive 
                      ? 'bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 text-cyan-900 dark:text-cyan-200 font-medium shadow-xs' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {session.mode === 'orientation_guide' ? (
                      <Waypoints className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-500' : 'text-slate-400'}`} />
                    ) : (
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-500' : 'text-slate-400'}`} />
                    )}

                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitleInput}
                        onChange={(e) => setEditTitleInput(e.target.value)}
                        onBlur={() => handleSaveRename(session.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(session.id)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white dark:bg-slate-900 border border-cyan-500 rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-white"
                      />
                    ) : (
                      <span className="truncate block">{session.title}</span>
                    )}
                  </div>

                  {/* Actions au survol (Bureau) / Toujours visibles (Mobile/Tablette) */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(session, e)}
                        className="p-1 hover:text-cyan-500 text-slate-400 rounded cursor-pointer"
                        title="Renommer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="p-1 hover:text-red-500 text-slate-400 rounded cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pied de la barre latérale */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate font-medium">{isAuthenticated ? user?.name : "Mode Invité (2 questions)"}</span>
          </div>
          {!isAuthenticated && (
            <button
              onClick={onRequireAuth}
              className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline shrink-0 text-xs cursor-pointer"
            >
              Débloquer
            </button>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* ZONE DE CHAT CENTRALE PLEINE PAGE */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#060913] relative h-full">
        
        {/* Header de la discussion active */}
        <header className="h-14 px-2.5 sm:px-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-3 bg-white/80 dark:bg-[#060913]/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Ouvrir l'historique et les sessions"
                aria-label="Ouvrir la barre latérale"
              >
                <PanelLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}

            {/* Logo officiel Parcours AI */}
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-sm shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full dark:bg-[#070b1a] bg-white rounded-[11px] flex items-center justify-center">
                <Waypoints className="w-4 h-4 text-cyan-500" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                {currentSession ? currentSession.title : "Orientation Professionnelle & Carrières Tech"}
              </h1>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">
                  <span className="hidden sm:inline">Parcours AI • </span>
                  {webSearchEnabled ? 'Recherche active' : 'Conseiller IA'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions supérieures (Toggle Recherche Web, Export, Nouveau Diagnostic) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                webSearchEnabled 
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30' 
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={webSearchEnabled ? "Recherche Web en direct activée" : "Recherche Web désactivée"}
              aria-label="Basculer la recherche Web"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden md:inline">{webSearchEnabled ? "Recherche Web ON" : "Recherche Web OFF"}</span>
            </button>

            {currentSession && (
              <button
                onClick={handleExportChat}
                className="p-1.5 sm:p-2 text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1.5 cursor-pointer font-medium shrink-0"
                title="Exporter cette conversation en texte"
                aria-label="Exporter la discussion"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Exporter</span>
              </button>
            )}

            <button
              onClick={() => handleCreateNewSession('orientation_guide')}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Démarrer un nouveau diagnostic"
              aria-label="Nouveau diagnostic"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </header>

        {/* Zone de défilement des messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* ÉCRAN D'ACCUEIL INCITATIF SI AUCUNE CONVERSATION OU SI CONVERSATION VIDE */}
            {(hasNoSessions || (currentSession?.mode === 'free_chat' && currentSession?.messages.length <= 1)) && (
              <div className="my-8 max-w-2xl mx-auto animate-in fade-in duration-300">
                <div className="text-center mb-8">
                  {/* Logo officiel Parcours AI */}
                  <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] mx-auto mb-4 shadow-xl shadow-cyan-500/20">
                    <div className="w-full h-full dark:bg-[#070b1a] bg-white rounded-[22px] flex items-center justify-center">
                      <Waypoints className="w-8 h-8 text-cyan-500" />
                    </div>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Par quoi souhaitez-vous commencer aujourd'hui ?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                    Démarrez un diagnostic d'orientation complet ou posez vos questions sur les salaires tech, les compétences recherchées et le télétravail international.
                  </p>
                </div>

                {/* Cartes de démarrage rapide */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {STARTER_PROMPTS.map((starter, idx) => {
                    const Icon = starter.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (starter.mode === 'orientation_guide') {
                            handleCreateNewSession('orientation_guide');
                          } else {
                            handleSendMessage(starter.prompt);
                          }
                        }}
                        className="text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800/90 hover:border-cyan-500/50 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/20 transition-all group cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 mb-1.5 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span>{starter.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {starter.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Actions principales si toutes les conversations ont été effacées */}
                {hasNoSessions && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleCreateNewSession('orientation_guide')}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Waypoints className="w-4 h-4" />
                      <span>Lancer le Bilan d'Orientation</span>
                    </button>
                    <button
                      onClick={() => handleCreateNewSession('free_chat')}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm font-bold transition-all border border-slate-200 dark:border-slate-700/80 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Poser une Question Libre</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Liste des messages de la session active */}
            {currentSession?.messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              const displayTime = formatMessageRelativeTime(msg.timestamp, msg.createdAt);
              const hasRichContent = (msg.recommendedCareers && msg.recommendedCareers.length > 0) || (msg.searchSources && msg.searchSources.length > 0);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 sm:gap-3 w-full group ${
                    isAi 
                      ? 'items-start justify-start' 
                      : 'items-end justify-end'
                  }`}
                >
                  {/* Avatar AI (à gauche) */}
                  {isAi && (
                    <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-sm shadow-cyan-500/20 shrink-0 mt-0.5">
                      <div className="w-full h-full dark:bg-[#070b1a] bg-white rounded-[11px] flex items-center justify-center">
                        <Waypoints className="w-4 h-4 text-cyan-500" />
                      </div>
                    </div>
                  )}

                  {/* Conteneur Bulle + Actions avec marges latérales naturelles de chat */}
                  <div className={`flex flex-col space-y-1.5 ${
                    isAi 
                      ? hasRichContent 
                        ? 'max-w-[95%] sm:max-w-[88%] items-start' 
                        : 'max-w-[85%] sm:max-w-[78%] items-start'
                      : 'max-w-[85%] sm:max-w-[75%] items-end ml-auto'
                  }`}>
                    
                    {/* Bulle de message proprement dimensionnée */}
                    <div className={`
                      p-3.5 sm:p-4.5 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all break-words
                      ${isAi 
                        ? `bg-slate-100/95 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-xs shadow-xs ${hasRichContent ? 'w-full' : 'w-fit max-w-full'}` 
                        : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-cyan-500/15 w-fit max-w-full font-normal'
                      }
                    `}>
                      {/* Rendu Markdown textuel propre */}
                      <div className="space-y-2 whitespace-pre-wrap font-normal">
                        {msg.text.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx} className="leading-relaxed">
                            {paragraph.split('**').map((part, bIdx) => 
                              bIdx % 2 === 1 ? <strong key={bIdx} className={isAi ? "font-bold text-cyan-600 dark:text-cyan-300" : "font-bold text-white underline decoration-white/30"}>{part}</strong> : part
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Sources de recherche réelles */}
                      {msg.searchSources && msg.searchSources.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            <Globe className="w-3.5 h-3.5 text-cyan-500" />
                            <span>Données vérifiées via Recherche Web en direct :</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.searchSources.map((source, sIdx) => (
                              <a
                                key={sIdx}
                                href={source.uri}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-[11px] text-slate-700 dark:text-slate-300 hover:text-cyan-500 transition-colors"
                              >
                                <span className="truncate max-w-[200px]">{source.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommandations de carrières générées par l'IA avec bouton PDF */}
                      {msg.recommendedCareers && msg.recommendedCareers.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-700/80 space-y-3">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                            Recommandations Personnalisées & Feuilles de Route
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {msg.recommendedCareers.map((career) => (
                              <div
                                key={career.id}
                                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:border-cyan-500 transition-colors group"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-1.5">
                                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                      {career.title}
                                    </h4>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                      {career.matchScore || 95}% Match
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                                    {career.shortDescription}
                                  </p>
                                </div>

                                <div className="space-y-1.5">
                                  <button
                                    onClick={() => onSelectCareerRoadmap(career)}
                                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500/15 to-blue-500/15 hover:from-cyan-500 hover:to-blue-600 text-cyan-700 dark:text-cyan-300 hover:text-white text-xs font-bold transition-all cursor-pointer group"
                                  >
                                    <span>Ouvrir la Feuille de Route</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                  </button>

                                  <button
                                    onClick={() => handleDownloadPDF(career)}
                                    disabled={isGeneratingPdf}
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                                  >
                                    <Download className={`w-3 h-3 ${isGeneratingPdf ? 'animate-bounce text-cyan-500' : ''}`} />
                                    <span>{isGeneratingPdf ? 'Génération du PDF...' : 'Télécharger le PDF'}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                     {/* Footer du message (Horodatage dynamique & Copie) */}
                    <div className={`flex items-center gap-2 text-[10px] text-slate-400 ${isAi ? 'pl-1 justify-start' : 'pr-1 justify-end'}`}>
                      <span className="font-medium">{displayTime}</span>
                      {isAi && (
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 opacity-100"
                          title="Copier le message"
                        >
                          {copiedMessageId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Avatar Utilisateur (à droite) */}
                  {!isAi && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm mb-5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Indicateur de réflexion IA avec logo Parcours AI */}
            {isThinking && (
              <div className="flex items-start gap-2.5 sm:gap-3 justify-start w-full animate-in fade-in duration-200">
                <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-sm shadow-cyan-500/20 shrink-0 animate-pulse mt-0.5">
                  <div className="w-full h-full dark:bg-[#070b1a] bg-white rounded-[11px] flex items-center justify-center">
                    <Waypoints className="w-4 h-4 text-cyan-500" />
                  </div>
                </div>
                <div className="p-3.5 px-4 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 w-fit">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Recherche en temps réel & analyse en cours...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BARRE D'ENVOI INFÉRIEURE FIXE */}
        {/* ========================================================================= */}
        <footer className="p-3 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#060913]/90 backdrop-blur-md shrink-0">
          <div className="max-w-3xl mx-auto">
            
            {/* Si verrouillé par la limite invité */}
            {isLockedByAuth && !isAuthenticated ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-300 text-center sm:text-left">
                  <Lock className="w-5 h-5 shrink-0 text-amber-500" />
                  <span>Vous avez répondu à vos **2 questions gratuites** en mode invité. Créez votre compte pour continuer sans limite et exporter vos PDF.</span>
                </div>
                <button
                  onClick={onRequireAuth}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shrink-0 hover:opacity-95 shadow-md cursor-pointer text-center min-h-[44px] sm:min-h-0 flex items-center justify-center"
                >
                  Débloquer l'accès complet
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 rounded-2xl p-2 shadow-sm transition-all"
              >
                <textarea
                  ref={textareaRef}
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    !currentSession || currentSession.mode === 'free_chat'
                      ? "Posez votre question..."
                      : "Votre réponse ou message..."
                  }
                  rows={1}
                  className="w-full resize-none min-h-[38px] max-h-36 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white bg-transparent placeholder-slate-400 focus:outline-none overflow-y-auto leading-normal [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                />

                <button
                  type="submit"
                  disabled={!inputVal.trim() || isThinking}
                  className={`
                    p-2.5 sm:p-3 rounded-xl shrink-0 transition-all flex items-center justify-center cursor-pointer
                    ${inputVal.trim() && !isThinking
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25 hover:scale-105 active:scale-95'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }
                  `}
                  title="Envoyer (Entrée)"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Note d'information sous le champ d'envoi */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1.5 pt-2">
              <span className="flex items-center gap-1.5">
                <Waypoints className="w-3.5 h-3.5 text-cyan-500" />
                <span>Conseiller IA Parcours AI avec Outils de Recherche & Analyse en direct</span>
              </span>
              <span className="hidden sm:inline">Touche <strong>Entrée</strong> pour envoyer</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
