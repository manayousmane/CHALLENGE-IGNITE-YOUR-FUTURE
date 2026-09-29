import { TeamMember } from '../types';

/* 
  =============================================================================
  RÉFÉRENTIEL DES MEMBRES DE L'ÉQUIPE FONDATEUR - PARCOURSAI
  Chaque membre apporte une expertise pointue répartie entre le pôle Web & Logiciel
  et le pôle IA, Données & Algorithmique.
  =============================================================================
*/

export const TEAM_MEMBERS: TeamMember[] = [
  /* 1. Narcisse AVLESSI - Lead Frontend & Architecture */
  {
    name: "Narcisse AVLESSI",
    pole: "Développement Web & Logiciel",
    role: "Lead Architect Frontend & Integration Specialist",
    shortTitle: "Lead Frontend & Architecture",
    bio: "Pilote l'architecture globale de l'interface utilisateur, la structure applicative, le parcours de diagnostic conversationnel et la gestion centralisée des données.",
    responsibilities: "Conception de l'architecture générale, supervision de l'expérience interactive de guidage, coordination des flux d'utilisateurs et co-animation de la présentation du projet.",
    technicalTasks: [
      "Conception de l'architecture modulaire et de l'arborescence globale de l'application",
      "Direction du développement du module de dialogue et d'orientation interactive",
      "Supervision de la gestion d'état réactive et de la persistance multi-appareils",
      "Orchestration des transitions fluides entre les différentes phases d'évaluation"
    ],
    transversalRoles: [
      "Validation bout-en-bout (E2E) du parcours (chat, diagnostic, restitution & export)",
      "Structuration du pitch jury, répétitions de démonstration en direct et FAQ"
    ],
    specialty: "Architecture Applicative, Expérience Utilisateur & Lead Pitch",
    initials: "NA",
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    skills: ["Architecture Web", "Expérience Utilisateur", "Coordination", "Validation E2E", "Pitch & Démo"],
    portfolio: "https://narcisse-avlessi.rf.gd",
    github: "https://github.com/narcisseavlessi-gb",
    linkedin: "https://www.linkedin.com/in/gbenagnon-narcisse-59b9b2241?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
  },
  /* 2. Vertueux NOUKPO - Fullstack & DevOps Cloud */
  {
    name: "Vertueux NOUKPO",
    pole: "Développement Web & Logiciel",
    role: "Fullstack Integration Engineer & DevOps Specialist",
    shortTitle: "Fullstack & DevOps Cloud",
    bio: "Assure la passerelle entre l'interface utilisateur et les services backend, la restitution visuelle des feuilles de route et le déploiement en production.",
    responsibilities: "Liaison interface/serveur, mise en forme dynamique des recommandations de carrière et gestion de la mise en ligne des services.",
    technicalTasks: [
      "Conception des modules de restitution et d'export des feuilles de route de carrière",
      "Connexion et intégration des services et flux de données sécurisés",
      "Mise en place de la validation stricte des données et des formulaires",
      "Configuration des connexions de base de données pour l'affichage dynamique"
    ],
    transversalRoles: [
      "Intégration continue : contrôle de la cohérence entre les données et l'interface",
      "Déploiement Cloud et gestion sécurisée des environnements de production"
    ],
    specialty: "Intégration Systèmes, Sécurité & Déploiement Continu",
    initials: "VN",
    gradient: "from-blue-600 via-indigo-600 to-violet-700",
    skills: ["Intégration Systèmes", "Sécurité & Validation", "DevOps & Cloud", "Gestion des Données", "Export & Rapports"],
    portfolio: "https://vertueuxnoukpo.infinityfreeapp.com",
    github: "https://github.com/VertueuxNkp"
  },
  /* 3. Aïmane OUSMANE - Data Engineer & Sécurité IA */
  {
    name: "Aïmane OUSMANE",
    pole: "Intelligence Artificielle, Données et Algorithmique",
    role: "Data Engineer & AI Security Architect",
    shortTitle: "Data Engineer & Sécurité IA",
    bio: "Conçoit les référentiels de données adaptés au contexte africain et béninois, les algorithmes de correspondance métiers et la protection des flux.",
    responsibilities: "Modélisation des bases de données métiers et établissements, développement de l'algorithme d'orientation prédictive et sécurité des accès.",
    technicalTasks: [
      "Modélisation des tables de données métiers et des établissements d'enseignement",
      "Développement du moteur de matching et calcul des indices de correspondance",
      "Constitution du référentiel fiches métiers et mécanisme de secours (fallback)",
      "Mise en place des mesures de protection et de limitation des flux"
    ],
    transversalRoles: [
      "Tests d'intégration et validation des scénarios d'orientation",
      "Support technique de l'infrastructure et assistance lors des démonstrations"
    ],
    specialty: "Ingénierie des Données, Algorithmique & Sécurité",
    initials: "AO",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    skills: ["Modélisation Données", "Algorithmes de Matching", "Sécurité des Flux", "Bases de Données", "Architecture Données"]
  },
  /* 4. Ramziath ZAKARI - Lead Prompt IA & Gouvernance */
  {
    name: "Ramziath ZAKARI",
    pole: "Intelligence Artificielle, Données et Algorithmique",
    role: "Lead AI Prompt Engineer & Data Governance Specialist",
    shortTitle: "Lead Prompt IA & Gouvernance",
    bio: "Pilote le comportement conversationnel des modèles d'intelligence artificielle, la structuration des échanges et la gouvernance des données.",
    responsibilities: "Ingénierie des instructions conversationnelles, structuration des contrats d'échange avec l'IA et modération rigoureuse des contenus.",
    technicalTasks: [
      "Conception et optimisation des instructions système pour l'analyse de profil",
      "Définition des schémas d'échange structurés entre l'IA et le système",
      "Validation des réponses générées et gestion intelligente des cas atypiques",
      "Conduite des tests de robustesse du dialogue sur différents profils"
    ],
    transversalRoles: [
      "Suivi de la qualité et de la pertinence des informations restituées",
      "Mise en place des garde-fous éthiques et filtrage des requêtes hors-sujet"
    ],
    specialty: "Ingénierie Conversationnelle, Schémas de Données & Modération",
    initials: "RZ",
    gradient: "from-amber-500 via-orange-500 to-rose-600",
    skills: ["Ingénierie Conversationnelle", "Modèles d'IA", "Gouvernance Données", "Modération & Éthique", "Tests de Robustesse"]
  },
  /* 5. Yousra DAMALA - UI/UX & Design Système */
  {
    name: "Yousra DAMALA",
    pole: "Développement Web & Logiciel",
    role: "UI/UX Frontend Developer & Responsive Design Specialist",
    shortTitle: "UI/UX & Design Système",
    bio: "Garante de la signature visuelle de l'application, du design système, de l'ergonomie mobile-first et du confort d'utilisation.",
    responsibilities: "Direction artistique, cohérence de la charte graphique, intégration des éléments visuels et expérience utilisateur fluide sur tous supports.",
    technicalTasks: [
      "Mise en place de la charte graphique et développement des composants visuels",
      "Intégration ergonomique des interfaces de restitution pour les utilisateurs",
      "Conception des animations de chargement et retours visuels interactifs",
      "Recette et optimisation ergonomique Mobile-First sur tous formats d'écrans"
    ],
    transversalRoles: [
      "Contrôle qualité ergonomique, accessibilité visuelle et fluidité d'interaction",
      "Harmonisation de la charte graphique pour les supports de présentation"
    ],
    specialty: "Design UI/UX, Ergonomie Web & Mobile-First",
    initials: "YD",
    gradient: "from-pink-500 via-rose-500 to-purple-600",
    skills: ["Design System", "Ergonomie Web", "Mobile-First", "Animations & Retours", "Intégration Visuelle"]
  }
];
