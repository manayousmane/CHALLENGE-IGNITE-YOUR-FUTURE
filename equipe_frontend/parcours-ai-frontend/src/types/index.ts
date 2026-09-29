export type CareerCategory = 'all' | 'tech' | 'data_ai' | 'design' | 'security' | 'management' | 'marketing';

export interface RoadmapStep {
  id: string;
  phase: string;
  duration: string;
  title: string;
  description: string;
  skillsAcquired: string[];
  recommendedCourses: {
    name: string;
    platform: string;
    type: 'Gratuit' | 'Certifiant' | 'Pratique';
    link?: string;
  }[];
  practicalProject: string;
  milestoneCheck: string;
}

export interface Career {
  id: string;
  title: string;
  category: CareerCategory;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  matchScore?: number;
  salaryLocal: string; // Ex: 400.000 - 1.200.000 FCFA/mois
  salaryRemote: string; // Ex: 35.000€ - 75.000€/an
  marketDemand: 'Très forte' | 'Forte' | 'En plein essor';
  demandLocation: string; // Bénin, Afrique de l'Ouest & International Remote
  keySkills: string[];
  tools: string[];
  certifications?: string[];
  prerequisites: string;
  accentColor: string;
  iconName: string;
  roadmap: RoadmapStep[];
}

export interface UserProfile {
  name?: string;
  educationLevel?: string;
  fieldOfStudy?: string;
  passions?: string[];
  interests?: string[];
  technicalLevel?: 'Débutant' | 'Intermédiaire' | 'Avancé';
  workPreference?: 'Local (Bénin / Afrique)' | 'Remote International' | 'Hybride';
  targetGoals?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  createdAt?: number;
  suggestedReplies?: string[];
  recommendedCareers?: Career[];
  isComplete?: boolean;
  searchSources?: Array<{ title: string; uri: string }>;
  isGeminiGrounded?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  mode: 'orientation_guide' | 'free_chat';
  messages: ChatMessage[];
  userProfile?: UserProfile;
  step?: number;
  isComplete?: boolean;
}

export interface TeamMember {
  name: string;
  pole: string;
  role: string;
  shortTitle?: string;
  bio: string;
  responsibilities?: string;
  technicalTasks: string[];
  transversalRoles: string[];
  specialty: string;
  initials: string;
  gradient: string;
  skills: string[];
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface DiagnosticRecord {
  id: string;
  date: string;
  roleSuggested: string;
  matchScore: number;
  domain: string;
  summary: string;
  topStrengths: string[];
  keyRecommendations: string[];
  status: 'completed' | 'in_progress';
}

export interface SkillProgress {
  id: string;
  name: string;
  category: string;
  level: 'Acquis' | 'En cours' | 'Objectif';
  percentage: number;
  lastPracticed: string;
}

export interface RoadmapProgress {
  careerId: string;
  careerTitle: string;
  totalSteps: number;
  completedSteps: number;
  currentStepTitle: string;
  startedAt: string;
  lastUpdated: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  type: 'school' | 'certification' | 'job_offer' | 'bootcamp';
  provider: string;
  location: string;
  badge: string;
  matchReason: string;
  durationOrSalary: string;
  link?: string;
}

export type FormationDomain = 
  | 'informatique_ia' 
  | 'genie_sciences' 
  | 'sante_biomedical' 
  | 'economie_gestion' 
  | 'agronomie_environnement' 
  | 'droit_politique' 
  | 'communication_art' 
  | 'sciences_humaines';

export interface UniversityFormation {
  id: string;
  title: string;
  domain: FormationDomain;
  domainLabel: string;
  degree: 'Licence' | 'Master' | 'Ingénieur' | 'Doctorat' | 'BTS' | 'Certificat';
  duration: string; // Ex: "3 ans (Bac+3)", "5 ans (Bac+5)"
  institution: string; // Ex: "IFRI - Université d'Abomey-Calavi (UAC)"
  location: string; // Ex: "Abomey-Calavi, Bénin"
  type: 'Public' | 'Privé' | 'International / Sèmè City';
  entryRequirements: string; // Ex: "Bac C, D, E ou équivalent avec bon niveau en mathématiques"
  description: string;
  keySubjects: string[];
  careerOutcomes: string[];
  salaryEstimate: string;
  isHighDemand: boolean;
  websiteUrl?: string;
}

