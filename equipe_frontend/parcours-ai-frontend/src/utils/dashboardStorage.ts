import { DiagnosticRecord, SkillProgress, RoadmapProgress, RecommendationItem } from '../types';
import { supabase } from '../lib/supabaseClient';

export interface UserDashboardData {
  diagnostics: DiagnosticRecord[];
  skills: SkillProgress[];
  savedRoadmaps: RoadmapProgress[];
  recommendations: RecommendationItem[];
  weeklyTargetHours: number;
  streakDays: number;
  lastUpdated: string;
}

const DEFAULT_SKILLS_FOR_ROLE: Record<string, SkillProgress[]> = {
  default: [
    { id: 's1', name: 'Logique Algorithmique & Résolution de Problèmes', category: 'Fondations', level: 'Acquis', percentage: 80, lastPracticed: 'Hier' },
    { id: 's2', name: 'JavaScript & TypeScript Moderne', category: 'Développement', level: 'En cours', percentage: 65, lastPracticed: 'Aujourd\'hui' },
    { id: 's3', name: 'Bases de Données & SQL / PostgreSQL', category: 'Data', level: 'En cours', percentage: 70, lastPracticed: 'Aujourd\'hui' },
    { id: 's4', name: 'Outils IA & Prompt Engineering', category: 'IA & Outils', level: 'Acquis', percentage: 75, lastPracticed: 'Hier' },
  ],
  student: [
    { id: 's1', name: 'Algorithmes & Structures de données', category: 'Fondations', level: 'En cours', percentage: 60, lastPracticed: 'Aujourd\'hui' },
    { id: 's2', name: 'Git & Collaboration GitHub', category: 'Outils', level: 'Acquis', percentage: 70, lastPracticed: 'Hier' },
    { id: 's3', name: 'HTML5, CSS3 & Tailwind CSS', category: 'Frontend', level: 'Acquis', percentage: 85, lastPracticed: 'Hier' },
    { id: 's4', name: 'Anglais Professionnel & Tech', category: 'Soft Skills', level: 'En cours', percentage: 55, lastPracticed: 'Il y a 2 jours' },
  ],
  professional: [
    { id: 's1', name: 'Architecture Logicielle & Microservices', category: 'Backend', level: 'Acquis', percentage: 90, lastPracticed: 'Aujourd\'hui' },
    { id: 's2', name: 'Déploiement Cloud (GCP / AWS / Docker)', category: 'DevOps', level: 'Acquis', percentage: 85, lastPracticed: 'Hier' },
    { id: 's3', name: 'Intégration d\'APIs LLM & MLOps', category: 'IA', level: 'En cours', percentage: 70, lastPracticed: 'Aujourd\'hui' },
    { id: 's4', name: 'Négociation de Contrats Internationaux (Remote)', category: 'Carrière', level: 'Acquis', percentage: 80, lastPracticed: 'Il y a 4 jours' },
  ]
};

export function getDashboardStorageKey(userId?: string | null): string {
  if (!userId) return 'parcours_dashboard_guest';
  const safeId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `parcours_dashboard_${safeId}`;
}

export function loadUserDashboard(userId?: string | null, userRole?: string, userName?: string): UserDashboardData {
  const key = getDashboardStorageKey(userId);
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.diagnostics)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erreur chargement dashboard utilisateur', e);
  }

  const initialSkills = DEFAULT_SKILLS_FOR_ROLE[userRole || ''] || DEFAULT_SKILLS_FOR_ROLE.default;
  
  const initialData: UserDashboardData = {
    diagnostics: userId && userId.includes('google') ? [
      {
        id: `diag-init-${Date.now()}`,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        roleSuggested: 'Ingénieur IA & Full-Stack Cloud',
        matchScore: 94,
        domain: 'Intelligence Artificielle & Cloud',
        summary: `Profil à fort potentiel détecté pour ${userName || 'le candidat'}. Excellente capacité d'apprentissage avec appétence marquée pour les architectures modernes et le télétravail international.`,
        topStrengths: ['Architecture logicielle', 'Prompt Engineering avancé', 'Autonomie'],
        keyRecommendations: [
          'Créer un projet open-source intégrant l\'API Gemini et Docker',
          'Préparer une certification Cloud certifiante (Google Cloud ou AWS)',
          'Positionner son profil LinkedIn pour les opportunités en devises (€/$)'
        ],
        status: 'completed'
      }
    ] : [],
    skills: initialSkills,
    savedRoadmaps: [
      {
        careerId: 'fullstack-dev',
        careerTitle: 'Développeur Full-Stack Web & Cloud',
        totalSteps: 4,
        completedSteps: 2,
        currentStepTitle: 'Étape 2 : Écosystème Frontend & React',
        startedAt: '14 Septembre 2026',
        lastUpdated: 'Aujourd\'hui'
      }
    ],
    recommendations: [
      {
        id: 'rec-epitech',
        title: 'Programme Expert Tech & Entrepreneuriat',
        type: 'school',
        provider: 'Epitech Bénin / Sèmè City',
        location: 'Cotonou, Bénin',
        badge: 'Excellence & Projets',
        matchReason: 'Pratique intensive en mode projet et connexion directe avec les entreprises internationales.',
        durationOrSalary: '2 à 5 ans',
        link: 'https://epitech.bj'
      },
      {
        id: 'rec-google-cloud',
        title: 'Certification Google Cloud Professional Architect',
        type: 'certification',
        provider: 'Google Cloud & Coursera',
        location: '100% En ligne (Certifiant)',
        badge: 'Reconnaissance Mondiale',
        matchReason: 'Augmente de 40% les chances de décrocher des contrats en télétravail international.',
        durationOrSalary: '3 à 4 mois',
        link: 'https://grow.google'
      },
      {
        id: 'rec-ifri',
        title: 'Master Informatique & Systèmes d\'Information',
        type: 'school',
        provider: 'IFRI - Université d\'Abomey-Calavi',
        location: 'Abomey-Calavi, Bénin',
        badge: 'Diplôme d\'État',
        matchReason: 'Fondation académique réputée en Afrique de l\'Ouest.',
        durationOrSalary: 'Bac+3 à Bac+5',
        link: 'https://ifri.uac.bj'
      }
    ],
    weeklyTargetHours: 12,
    streakDays: 4,
    lastUpdated: new Date().toISOString()
  };

  saveUserDashboard(userId, initialData);
  return initialData;
}

export function saveUserDashboard(userId: string | null | undefined, data: UserDashboardData): void {
  const key = getDashboardStorageKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify({
      ...data,
      lastUpdated: new Date().toISOString()
    }));

    // Synchronisation en tâche de fond avec le backend Python (Supabase/Postgres)
    // si l'utilisateur est identifié et a une session Supabase active.
    if (userId && userId !== 'guest' && userId !== 'parcours_dashboard_guest') {
      const topDiag = data.diagnostics[0];
      supabase.auth.getSession().then(({ data: sessionData }) => {
        const token = sessionData.session?.access_token;
        if (!token) return; // pas connecté (ou session expirée) : on reste en local uniquement
        fetch('/api/profile/dashboard', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            readiness_score: topDiag ? topDiag.matchScore : 75,
            target_specialty: topDiag ? topDiag.roleSuggested : 'Orientation Tech',
            diagnostics_data: data.diagnostics,
            skills_data: data.skills,
            saved_formations_data: data.recommendations,
            notes: `Dernière synchro: ${new Date().toISOString()}`,
          }),
        }).catch((err) => {
          console.warn('Sync backend différée:', err);
        });
      });
    }
  } catch (e) {
    console.error('Erreur sauvegarde dashboard utilisateur', e);
  }
}

// Fonction pour récupérer et fusionner les données du backend (utile lors
// de la connexion sur un nouvel appareil).
export async function syncDashboardWithCloud(userId: string): Promise<UserDashboardData | null> {
  if (!userId || userId === 'guest') return null;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) return null;

    const res = await fetch('/api/profile/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    const dbDash = await res.json();

    const parsedDiagnostics = dbDash.diagnostics_data || [];
    const parsedSkills = dbDash.skills_data || [];
    const parsedSavedFormations = dbDash.saved_formations_data || [];

    if (parsedDiagnostics.length > 0 || parsedSkills.length > 0) {
      const local = loadUserDashboard(userId);
      const merged: UserDashboardData = {
        ...local,
        diagnostics: parsedDiagnostics.length > 0 ? parsedDiagnostics : local.diagnostics,
        skills: parsedSkills.length > 0 ? parsedSkills : local.skills,
        recommendations: parsedSavedFormations.length > 0 ? parsedSavedFormations : local.recommendations,
        lastUpdated: new Date().toISOString(),
      };
      const key = getDashboardStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(merged));
      return merged;
    }
  } catch (e) {
    console.warn('Erreur synchro cloud dashboard:', e);
  }
  return null;
}

export function addDiagnosticToUserDashboard(userId: string | null | undefined, diagnostic: DiagnosticRecord): void {
  const current = loadUserDashboard(userId);
  const updatedDiagnostics = [diagnostic, ...current.diagnostics.filter(d => d.id !== diagnostic.id)];
  
  const updatedData: UserDashboardData = {
    ...current,
    diagnostics: updatedDiagnostics,
    lastUpdated: new Date().toISOString()
  };

  saveUserDashboard(userId, updatedData);
}

export function updateSkillProgressInDashboard(userId: string | null | undefined, skillId: string, deltaPercentage: number): void {
  const current = loadUserDashboard(userId);
  const updatedSkills = current.skills.map(s => {
    if (s.id === skillId) {
      const newPct = Math.min(100, Math.max(0, s.percentage + deltaPercentage));
      return {
        ...s,
        percentage: newPct,
        level: newPct >= 80 ? ('Acquis' as const) : newPct >= 40 ? ('En cours' as const) : ('Objectif' as const),
        lastPracticed: 'À l\'instant'
      };
    }
    return s;
  });

  const updatedData: UserDashboardData = {
    ...current,
    skills: updatedSkills,
    lastUpdated: new Date().toISOString()
  };

  saveUserDashboard(userId, updatedData);
}
