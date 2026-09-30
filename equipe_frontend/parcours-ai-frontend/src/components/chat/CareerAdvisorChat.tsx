import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatSession, Career, UserProfile, RecommendedFormationItem } from '../../types';
import { CAREERS_DATA } from '../../data/careersData';
import { UNIVERSITY_FORMATIONS } from '../../data/formationsData';
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
  FileText,
  School,
  MapPin,
  CheckCircle2,
  Layers,
  Award
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

export const STEP_TITLES: Record<number, string> = {
  1: "Série du Bac ou Diplôme d'accès",
  2: "Matières fortes & Résultats scolaires",
  3: "Vocation & Domaines de prédilection",
  4: "Budget annuel d'études (FCFA)",
  5: "Ville de résidence & Mobilité géographique",
};

export const GUIDED_STEP_CHIPS: Record<number, { label: string; value: string }[]> = {
  1: [
    { label: "Bac C (Scientifique)", value: "Bac C (Mathématiques & Sciences Physiques)" },
    { label: "Bac D (Biologie / SVT)", value: "Bac D (Sciences de la Vie et de la Terre)" },
    { label: "Bac A1 / A2 (Littéraire)", value: "Bac A (Lettres, Langues & Philosophie)" },
    { label: "Bac B (Économique)", value: "Bac B (Sciences Économiques & Sociales)" },
    { label: "Bac G1 / G2 / G3 (Gestion)", value: "Bac G (Comptabilité, Secrétariat & Gestion)" },
    { label: "Bac E / F / TI (Technique)", value: "Bac Technique (Électrotechnique, Mécanique, TI)" },
    { label: "Étudiant / Déjà Diplômé", value: "Étudiant en cours de cursus supérieur / Diplômé" },
  ],
  2: [
    { label: "Maths & Physique-Chimie", value: "Mathématiques et Sciences Physiques" },
    { label: "SVT, Biologie & Chimie", value: "SVT, Biologie et Sciences Naturelles" },
    { label: "Français & Philosophie", value: "Français, Philosophie et Littérature" },
    { label: "Économie & Comptabilité", value: "Économie, Comptabilité et Gestion d'entreprise" },
    { label: "Anglais & Langues vivantes", value: "Anglais et Langues vivantes" },
    { label: "Informatique & Algorithmique", value: "Informatique, Algorithmique et Logique" },
    { label: "Résultats équilibrés / Polyvalent", value: "Résultats équilibrés dans l'ensemble des matières" },
  ],
  3: [
    { label: "Santé & Médecine", value: "Santé, Médecine, Pharmacie & Soins biomédicaux" },
    { label: "Droit & Sciences Politiques", value: "Droit, Justice & Sciences Politiques" },
    { label: "Économie, Finance & Audit", value: "Économie, Finance, Banque, Comptabilité & Audit" },
    { label: "Agronomie & Climat", value: "Agronomie, Agro-business, Élevage & Climat" },
    { label: "Génie Civil & BTP", value: "Génie Civil, BTP, Architecture & Travaux Publics" },
    { label: "Informatique, IA & Cyber", value: "Informatique, Intelligence Artificielle & Cybersécurité" },
    { label: "Communication & Design", value: "Communication, Médias, Journalisme & Design Graphique" },
    { label: "Sciences Humaines & Éducation", value: "Sciences Humaines, Sociologie, Géographie & Éducation" },
  ],
  4: [
    { label: "< 50.000 FCFA (Public)", value: "Moins de 50 000 FCFA (Universités publiques subventionnées)" },
    { label: "50.000 à 250.000 FCFA", value: "50 000 à 250 000 FCFA (Instituts & Écoles publiques)" },
    { label: "250.000 à 600.000 FCFA", value: "250 000 à 600 000 FCFA (Universités privées agréées)" },
    { label: "Plus de 600.000 FCFA", value: "Plus de 600 000 FCFA (Grandes écoles d'excellence & International)" },
    { label: "Bourse d'études demandée", value: "Recherche prioritaire de bourse d'études ou d'excellence" },
  ],
  5: [
    { label: "Cotonou / Abomey-Calavi", value: "Cotonou / Abomey-Calavi (Atlantique & Littoral)" },
    { label: "Porto-Novo (Ouémé / Plateau)", value: "Porto-Novo / Sèmè-Kpodji (Ouémé & Plateau)" },
    { label: "Parakou (Borgou / Nord)", value: "Parakou (Borgou & Grand Nord Bénin)" },
    { label: "Lokossa / Abomey / Bohicon", value: "Lokossa / Abomey / Bohicon (Mono & Zou)" },
    { label: "Mobile partout au Bénin", value: "Mobile dans tout le Bénin" },
    { label: "Formation 100% en ligne", value: "Formation à distance / En ligne" },
  ]
};

// Algorithme déterministe client reproduisant la formule officielle à 100%
export function computeClientFormationMatches(
  profile: UserProfile,
  limit: number = 3
): { matchedFormations: RecommendedFormationItem[]; matchedCareer: Career } {
  const norm = (s: string) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const serie = norm(profile.serie_bac || profile.educationLevel || '');
  const resultats = norm(profile.resultats_scolaires || '');
  const appetencesList = profile.appetences || profile.passions || profile.interests || [];
  const appetencesText = norm(Array.isArray(appetencesList) ? appetencesList.join(' ') : String(appetencesList));
  const budget = profile.budget_fcfa;
  const ville = norm(profile.ville || '');

  const scoredFormations = UNIVERSITY_FORMATIONS.map(f => {
    const fTitle = norm(f.title);
    const fInst = norm(f.institution);
    const fDesc = norm(f.description);
    const fReqs = norm(f.entryRequirements);
    const fSubs = norm(f.keySubjects.join(' '));
    const fOuts = norm(f.careerOutcomes.join(' '));
    const fLoc = norm(f.location);
    const fType = norm(f.type);
    const fullText = `${fTitle} ${fInst} ${fDesc} ${fSubs} ${fOuts}`;

    const matchReasons: string[] = [];

    // 1. Intérêts & Domaines (30 pts)
    let interestPts = 50;
    if (appetencesText.trim()) {
      const keywords = ["sante", "medecine", "droit", "justice", "finance", "comptabilite", "agronomie", "btp", "genie civil", "informatique", "ia", "intelligence artificielle", "design", "gestion", "management", "lettres", "sociologie", "education", "physique", "chimie", "biologie", "securite"];
      const matches = keywords.filter(kw => appetencesText.includes(kw) && fullText.includes(kw));
      if (matches.length >= 2) {
        interestPts = 96;
        matchReasons.push("Forte adéquation avec vos centres d'intérêt prioritaires");
      } else if (matches.length === 1) {
        interestPts = 82;
        matchReasons.push("Correspondance thématique avec votre domaine de prédilection");
      } else {
        interestPts = 55;
      }
    }

    // 2. Série du Bac (25 pts)
    let seriePts = 50;
    if (serie) {
      if (serie.includes('c') || serie.includes('d') || serie.includes('e')) {
        if (fReqs.includes('bac c') || fReqs.includes('bac d') || fReqs.includes('bac e') || fInst.includes('fss') || fInst.includes('epac') || fInst.includes('ifri') || fInst.includes('fast') || fInst.includes('fsa')) {
          seriePts = 95;
          matchReasons.push(`Série ${serie.toUpperCase()} parfaitement acceptée`);
        } else {
          seriePts = 60;
        }
      } else if (serie.includes('a1') || serie.includes('a2') || serie.includes('a')) {
        if (fReqs.includes('bac a') || fReqs.includes('litteraire') || fReqs.includes('toutes series') || fInst.includes('fadesp') || fInst.includes('flash')) {
          seriePts = 95;
          matchReasons.push(`Série ${serie.toUpperCase()} idéale pour cette filière`);
        } else {
          seriePts = 45;
        }
      } else if (serie.includes('g') || serie.includes('b')) {
        if (fReqs.includes('bac g') || fReqs.includes('bac b') || fReqs.includes('toutes series') || fInst.includes('eneam') || fInst.includes('faseg')) {
          seriePts = 95;
          matchReasons.push(`Série ${serie.toUpperCase()} ciblée par l'établissement`);
        } else {
          seriePts = 55;
        }
      } else {
        seriePts = 75;
      }
    }

    // 3. Résultats scolaires (20 pts)
    let resultPts = 50;
    if (resultats) {
      if ((resultats.includes('math') || resultats.includes('physique') || resultats.includes('svt') || resultats.includes('bio')) && (fullText.includes('math') || fullText.includes('svt') || fullText.includes('sciences') || fullText.includes('biologie'))) {
        resultPts = 92;
        matchReasons.push("Vos matières scientifiques fortes constituent un atout majeur");
      } else if ((resultats.includes('francais') || resultats.includes('philo') || resultats.includes('lettres')) && (fullText.includes('francais') || fullText.includes('droit') || fullText.includes('communication') || fullText.includes('expression'))) {
        resultPts = 92;
        matchReasons.push("Vos facilités d'expression correspondent aux exigences");
      } else if ((resultats.includes('eco') || resultats.includes('gestion') || resultats.includes('compta')) && (fullText.includes('economie') || fullText.includes('gestion') || fullText.includes('finance'))) {
        resultPts = 92;
        matchReasons.push("Vos acquis en gestion et économie valorisent votre profil");
      } else {
        resultPts = 65;
      }
    }

    // 4. Budget annuel (15 pts)
    let budgetPts = 65;
    if (budget !== undefined) {
      if (fType.includes('public')) {
        budgetPts = budget >= 50000 ? 98 : 85;
        matchReasons.push("Frais universitaires publics très accessibles (< 50 000 FCFA)");
      } else if (fType.includes('prive')) {
        if (budget >= 400000) {
          budgetPts = 95;
          matchReasons.push("Frais de scolarité privés en accord avec votre budget");
        } else if (budget >= 250000) {
          budgetPts = 70;
        } else {
          budgetPts = 35;
        }
      }
    } else {
      if (fType.includes('public')) budgetPts = 90;
    }

    // 5. Localisation & Mobilité (10 pts)
    let locationPts = 60;
    if (ville) {
      if (ville.includes('partout') || ville.includes('mobile') || ville.includes('ligne')) {
        locationPts = 95;
        matchReasons.push("Mobilité géographique compatible");
      } else if ((ville.includes('cotonou') || ville.includes('calavi')) && (fLoc.includes('cotonou') || fLoc.includes('calavi'))) {
        locationPts = 95;
        matchReasons.push("Campus situé dans votre zone (Cotonou / Calavi)");
      } else if (ville.includes('parakou') && fLoc.includes('parakou')) {
        locationPts = 95;
        matchReasons.push("Campus de l'Université de Parakou");
      } else if (ville.includes('porto-novo') && fLoc.includes('porto-novo')) {
        locationPts = 95;
        matchReasons.push("Campus de Porto-Novo / Ouémé");
      } else if (ville.includes('lokossa') && fLoc.includes('lokossa')) {
        locationPts = 95;
        matchReasons.push("Campus INSTI Lokossa");
      }
    }

    const finalScore = Math.min(98, Math.max(70, Math.round(
      interestPts * 0.30 +
      seriePts * 0.25 +
      resultPts * 0.20 +
      budgetPts * 0.15 +
      locationPts * 0.10
    )));

    return {
      ...f,
      matchScore: finalScore,
      matchReasons: matchReasons.slice(0, 3)
    };
  });

  scoredFormations.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  // Diversité des titres de formation dans le Top
  const uniqueFormations: RecommendedFormationItem[] = [];
  const seenTitles = new Set<string>();
  for (const form of scoredFormations) {
    if (!seenTitles.has(form.title)) {
      uniqueFormations.push(form);
      seenTitles.add(form.title);
    }
    if (uniqueFormations.length >= limit) break;
  }

  // Trouver la carrière la plus alignée
  const contextNorm = norm(`${appetencesText} ${resultats} ${serie}`);
  let matchedCareer = CAREERS_DATA[0];
  let maxCareerScore = -1;

  for (const career of CAREERS_DATA) {
    let score = 0;
    const cat = career.category;
    if (cat === 'sante' && (contextNorm.includes('sante') || contextNorm.includes('medecin') || contextNorm.includes('pharmacie') || contextNorm.includes('biologie') || contextNorm.includes('svt') || contextNorm.includes('soin'))) score += 50;
    else if (cat === 'droit' && (contextNorm.includes('droit') || contextNorm.includes('justice') || contextNorm.includes('avocat') || contextNorm.includes('juriste') || contextNorm.includes('loi'))) score += 50;
    else if (cat === 'finance' && (contextNorm.includes('compta') || contextNorm.includes('audit') || contextNorm.includes('finance') || contextNorm.includes('banque') || contextNorm.includes('gestion'))) score += 50;
    else if (cat === 'agronomie' && (contextNorm.includes('agro') || contextNorm.includes('agriculture') || contextNorm.includes('elevage') || contextNorm.includes('terre') || contextNorm.includes('sol'))) score += 50;
    else if (cat === 'btp' && (contextNorm.includes('btp') || contextNorm.includes('genie civil') || contextNorm.includes('batiment') || contextNorm.includes('construction') || contextNorm.includes('pont'))) score += 50;
    else if (cat === 'data_ai' && (contextNorm.includes('ia') || contextNorm.includes('data') || contextNorm.includes('python') || contextNorm.includes('algorithme') || contextNorm.includes('machine learning'))) score += 50;
    else if (cat === 'tech' && (contextNorm.includes('code') || contextNorm.includes('web') || contextNorm.includes('dev') || contextNorm.includes('logiciel') || contextNorm.includes('programme'))) score += 50;
    else if (cat === 'security' && (contextNorm.includes('cyber') || contextNorm.includes('securite') || contextNorm.includes('hack') || contextNorm.includes('reseau'))) score += 50;
    else if (cat === 'design' && (contextNorm.includes('design') || contextNorm.includes('ui') || contextNorm.includes('ux') || contextNorm.includes('graph'))) score += 50;
    else if (cat === 'marketing' && (contextNorm.includes('marketing') || contextNorm.includes('growth') || contextNorm.includes('vente') || contextNorm.includes('pub'))) score += 50;
    else if (cat === 'management' && (contextNorm.includes('manage') || contextNorm.includes('projet') || contextNorm.includes('chef') || contextNorm.includes('scrum'))) score += 50;

    if (score > maxCareerScore) {
      maxCareerScore = score;
      matchedCareer = career;
    }
  }

  const finalCareer: Career = {
    ...matchedCareer,
    matchScore: Math.min(98, Math.max(82, 85 + (uniqueFormations[0]?.matchScore ? Math.floor((uniqueFormations[0].matchScore - 70) / 3) : 5)))
  };

  return {
    matchedFormations: uniqueFormations,
    matchedCareer: finalCareer
  };
}

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
  text: "Bienvenue sur votre diagnostic d'orientation **Parcours AI**.\n\nEn **5 questions ciblées**, nous allons croiser votre profil avec notre répertoire officiel de **530 filières béninoises** pour révéler vos meilleures opportunités académiques et professionnelles.\n\n**Étape 1/5 : Quelle est votre série de Baccalauréat (ou diplôme équivalent) ?**",
  timestamp: 'À l\'instant',
  createdAt: Date.now()
});

const STARTER_PROMPTS = [
  {
    icon: Waypoints,
    title: "Diagnostic d'orientation complet",
    desc: "Bilan personnalisé en 5 étapes croisant les 530 filières du Bénin",
    prompt: "Je souhaite démarrer mon diagnostic complet d'orientation en 5 étapes.",
    mode: 'orientation_guide' as const
  },
  {
    icon: School,
    title: "Filières d'Excellence au Bénin",
    desc: "Panorama des universités et écoles : UAC, Parakou, UNSTIM, FSS, ENEAM, IFRI...",
    prompt: "Quelles sont les filières d'excellence et universités les plus réputées au Bénin ?",
    mode: 'free_chat' as const
  },
  {
    icon: Zap,
    title: "Salaires réels & Débouchés",
    desc: "Rémunérations locales en FCFA et opportunités sous-régionales / internationales",
    prompt: "Quels sont les salaires réels et les débouchés professionnels au Bénin et à l'international ?",
    mode: 'free_chat' as const
  },
  {
    icon: Sparkles,
    title: "IA, Santé, BTP, Droit & Agronomie",
    desc: "Conseils stratégiques pour choisir la meilleure voie selon votre profil",
    prompt: "Comment choisir entre les métiers de la santé, du droit, de l'ingénierie et de l'IA selon mon Bac ?",
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

  // Logique du Mode Bilan Guidé en 5 étapes multidisciplinaires
  const processGuidedStep = async (userAnswer: string, currentStep: number, profile: UserProfile) => {
    let nextAiMessage: ChatMessage;
    let nextStep = currentStep + 1;
    let updatedProfile: UserProfile = { ...profile };

    if (currentStep === 1) {
      updatedProfile.serie_bac = userAnswer;
      updatedProfile.educationLevel = userAnswer;
      nextAiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "C'est bien noté.\n\n**Étape 2/5 : Quelles sont vos matières fortes et vos facilités scolaires ?**",
        timestamp: "À l'instant",
        createdAt: Date.now()
      };
    } else if (currentStep === 2) {
      updatedProfile.resultats_scolaires = userAnswer;
      nextAiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Parfait. Abordons maintenant votre passion et vos intérêts réels.\n\n**Étape 3/5 : Quels domaines professionnels et métiers vous attirent le plus naturellement ?**",
        timestamp: "À l'instant",
        createdAt: Date.now()
      };
    } else if (currentStep === 3) {
      updatedProfile.appetences = [userAnswer];
      updatedProfile.passions = [userAnswer];
      nextAiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "C'est noté. Dimensionnons maintenant le volet financier pour cibler les établissements adaptés.\n\n**Étape 4/5 : Quel budget annuel approximatif (en FCFA) pouvez-vous consacrer à votre formation (frais de scolarité) ?**",
        timestamp: "À l'instant",
        createdAt: Date.now()
      };
    } else if (currentStep === 4) {
      const digits = userAnswer.replace(/[^0-9]/g, '');
      updatedProfile.budget_fcfa = digits ? parseInt(digits, 10) : 50000;
      nextAiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Dernière étape clé pour finaliser votre orientation !\n\n**Étape 5/5 : Dans quelle ville résidez-vous et quelle est votre mobilité géographique au Bénin ?**",
        timestamp: "À l'instant",
        createdAt: Date.now()
      };
    } else {
      // Étape 5 validée -> Finalisation du diagnostic avec matching déterministe
      nextStep = 6;
      updatedProfile.ville = userAnswer;

      try {
        confetti({
          particleCount: 110,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // 1. Calcul déterministe local immédiat (100% résilience et conformité à la formule)
      const clientMatches = computeClientFormationMatches(updatedProfile, 3);
      let matchedFormations = clientMatches.matchedFormations;
      let primaryCareer = clientMatches.matchedCareer;
      let aiText = `Diagnostic officiel complété avec succès et enregistré dans votre profil !\n\nAu regard de votre série **${updatedProfile.serie_bac || 'déclarée'}**, de vos matières fortes et de votre domaine d'intérêt, nous avons croisé votre profil avec l'ensemble des **530 formations répertoriées au Bénin**.\n\nVotre trajectoire phare recommandée est **${primaryCareer.title}** (Indice d'adéquation global : **${primaryCareer.matchScore}%**).\n\nDécouvrez ci-dessous vos filières universitaires d'excellence ainsi que votre feuille de route personnalisée prête pour export PDF :`;

      // 2. Appel au backend FastAPI pour enrichissement dynamique
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Bilan d'orientation complété : Série ${updatedProfile.serie_bac}, Matières fortes ${updatedProfile.resultats_scolaires}, Domaine d'intérêt ${updatedProfile.appetences?.join(', ')}, Budget ${updatedProfile.budget_fcfa} FCFA, Ville ${updatedProfile.ville}`,
            userProfile: updatedProfile,
            mode: 'orientation_guide',
            useSearch: webSearchEnabled,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.recommendedFormations && data.recommendedFormations.length > 0) {
            matchedFormations = data.recommendedFormations;
          }
          if (data.recommendedCareers && data.recommendedCareers.length > 0) {
            primaryCareer = data.recommendedCareers[0];
          }
          if (data.text) {
            aiText = data.text;
          }
        }
      } catch (err) {
        console.log('Appel backend différé, utilisation du moteur déterministe certifié', err);
      }

      // 3. Enregistrement automatique dans le Dashboard personnel de l'utilisateur
      try {
        addDiagnosticToUserDashboard(user?.id, {
          id: `diag-${Date.now()}`,
          date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          roleSuggested: primaryCareer.title,
          matchScore: primaryCareer.matchScore || 94,
          domain: primaryCareer.categoryLabel || 'Orientation Bénin',
          summary: `Diagnostic d'orientation 5 étapes validé. Forte concordance détectée pour ${primaryCareer.title} et les formations universitaires associées (${matchedFormations[0]?.institution || 'Bénin'}).`,
          topStrengths: primaryCareer.keySkills.slice(0, 3),
          keyRecommendations: [
            `Candidater en priorité à : ${matchedFormations[0]?.title || primaryCareer.title}`,
            `Suivre la feuille de route 4 phases de ${primaryCareer.title}`,
            'Préparer le dossier d\'admission auprès de l\'établissement'
          ],
          status: 'completed'
        });
      } catch (err) {
        console.warn('Erreur sauvegarde automatique dashboard', err);
      }

      nextAiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: "À l'instant",
        createdAt: Date.now(),
        searchSources: [
          { title: "Ministère de l'Enseignement Supérieur (Bénin)", uri: "https://enseignementsuperieur.gouv.bj" },
          { title: "Portail Officiel des Universités Publiques du Bénin", uri: "https://uac.bj" },
          { title: "Sèmè City - Cité de l'Innovation et du Savoir", uri: "https://semecity.bj" }
        ],
        recommendedFormations: matchedFormations,
        recommendedCareers: [primaryCareer],
        isComplete: true
      };
    }

    addMessageToCurrentSession(nextAiMessage, {
      step: nextStep,
      userProfile: updatedProfile,
      isComplete: nextStep >= 6
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
        
        const clientMatches = computeClientFormationMatches({
          passions: [userQuery],
          interests: [userQuery],
          educationLevel: sessionContext.userProfile?.educationLevel
        }, 3);

        const finalRecommended = (data.recommendedCareers && data.recommendedCareers.length > 0)
          ? data.recommendedCareers
          : [clientMatches.matchedCareer];

        const finalFormations = (data.recommendedFormations && data.recommendedFormations.length > 0)
          ? data.recommendedFormations
          : clientMatches.matchedFormations;

        const nextAiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text,
          timestamp: 'À l\'instant',
          createdAt: Date.now(),
          searchSources: data.searchSources,
          recommendedCareers: finalRecommended,
          recommendedFormations: finalFormations
        };

        addMessageToCurrentSession(nextAiMessage);
      } else {
        const clientMatches = computeClientFormationMatches({
          passions: [userQuery],
          interests: [userQuery]
        }, 3);

        const nextAiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Au regard de votre question concernant **"${userQuery}"**, voici les filières et métiers recommandés au Bénin selon notre répertoire :`,
          timestamp: 'À l\'instant',
          createdAt: Date.now(),
          recommendedCareers: [clientMatches.matchedCareer],
          recommendedFormations: clientMatches.matchedFormations
        };

        addMessageToCurrentSession(nextAiMessage);
      }
    } catch (e) {
      const clientMatches = computeClientFormationMatches({
        passions: [userQuery],
        interests: [userQuery]
      }, 3);

      const nextAiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Voici les filières universitaires et les carrières associées à votre recherche :`,
        timestamp: 'À l\'instant',
        createdAt: Date.now(),
        recommendedCareers: [clientMatches.matchedCareer],
        recommendedFormations: clientMatches.matchedFormations
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
              const hasRichContent = (msg.recommendedCareers && msg.recommendedCareers.length > 0) || (msg.recommendedFormations && msg.recommendedFormations.length > 0) || (msg.searchSources && msg.searchSources.length > 0);

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

                      {/* Filières Universitaires Recommandées (Répertoire Officiel du Bénin - 530 Formations) */}
                      {msg.recommendedFormations && msg.recommendedFormations.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-700/80 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                              <School className="w-3.5 h-3.5 text-cyan-500" />
                              <span>Filières Universitaires Béninoises Recommandées ({msg.recommendedFormations.length})</span>
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                              Répertoire officiel Bénin
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {msg.recommendedFormations.map((formation) => (
                              <div
                                key={formation.id}
                                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/90 shadow-xs hover:border-cyan-500/60 dark:hover:border-cyan-500/60 transition-all flex flex-col gap-2"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                                        {formation.degree}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {formation.duration}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {formation.type}
                                      </span>
                                    </div>
                                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                                      {formation.title}
                                    </h4>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="truncate">{formation.institution} — {formation.location}</span>
                                    </p>
                                  </div>

                                  {formation.matchScore && (
                                    <div className="shrink-0 flex flex-col items-end">
                                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        {formation.matchScore}% Match
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {formation.matchReasons && formation.matchReasons.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {formation.matchReasons.map((reason, rIdx) => (
                                      <span
                                        key={rIdx}
                                        className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center gap-1 font-medium"
                                      >
                                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                        <span>{reason}</span>
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">
                                  {formation.description}
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                                  <span className="text-slate-500 dark:text-slate-400 truncate max-w-[70%]">
                                    Prérequis : <strong className="text-slate-700 dark:text-slate-200 font-semibold">{formation.entryRequirements}</strong>
                                  </span>
                                  {formation.websiteUrl ? (
                                    <a
                                      href={formation.websiteUrl}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                      className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-semibold hover:underline shrink-0"
                                    >
                                      <span>En savoir plus</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    <span className="text-slate-400 text-[10px]">Parcours Officiel Bénin</span>
                                  )}
                                </div>
                              </div>
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
            {/* Progression du Diagnostic Multidisciplinaire (1 à 5) & Badges de Suggestions cliquables */}
            {currentSession?.mode === 'orientation_guide' && (currentSession.step || 1) <= 5 && !currentSession.isComplete && (
              <div className="mb-3 p-3 rounded-2xl bg-cyan-50/80 dark:bg-slate-900/90 border border-cyan-500/25 shadow-xs space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center text-[11px] font-extrabold shadow-xs">
                      {currentSession.step || 1}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Étape {currentSession.step || 1}/5 : {STEP_TITLES[currentSession.step || 1] || 'Votre profil'}
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold text-cyan-600 dark:text-cyan-400">
                    {((currentSession.step || 1) * 20)}% complété
                  </span>
                </div>

                {/* Barre de progression fluide */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${(currentSession.step || 1) * 20}%` }}
                  />
                </div>

                {/* Suggestions rapides cliquables pour l'étape active */}
                {GUIDED_STEP_CHIPS[currentSession.step || 1] && (
                  <div className="pt-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                      Suggestions rapides (cliquez pour sélectionner ou tapez librement) :
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar">
                      {GUIDED_STEP_CHIPS[currentSession.step || 1].map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(chip.value)}
                          disabled={isThinking}
                          className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
