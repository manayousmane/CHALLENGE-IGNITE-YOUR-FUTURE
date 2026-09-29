import { Career } from '../types';

export const CAREERS_DATA: Career[] = [
  {
    id: "fullstack-dev",
    title: "Ingénieur Full-Stack Web & Cloud",
    category: "tech",
    categoryLabel: "Développement & Cloud",
    shortDescription: "Conçoit et développe des applications web scalables de bout en bout, du front-end interactif aux APIs et infrastructures cloud.",
    fullDescription: "Le développeur Full-Stack moderne maîtrise aussi bien l'ergonomie front-end (React, Next.js, Vue) que la robustesse back-end (Node.js, Python, PostgreSQL) et le déploiement cloud. C'est l'un des profils les plus recherchés aussi bien par les entreprises au Bénin que par les recruteurs internationaux en télétravail.",
    salaryLocal: "450 000 - 1 300 000 FCFA / mois",
    salaryRemote: "35 000€ - 75 000€ / an",
    marketDemand: "Très forte",
    demandLocation: "Bénin, Sénégal, Côte d'Ivoire & Marché Remote (US/Europe)",
    keySkills: ["TypeScript / JavaScript", "React / Next.js", "Node.js / Express", "PostgreSQL / Prisma", "Docker & CI/CD", "Architecture REST & GraphQL"],
    tools: ["VS Code", "GitHub", "Vercel", "Docker", "PostgreSQL", "Postman"],
    prerequisites: "Logique algorithmique de base, curiosité pour la résolution de problèmes et sens du détail.",
    accentColor: "from-blue-500 to-cyan-500",
    iconName: "Code2",
    roadmap: [
      {
        id: "fs-p1",
        phase: "Phase 1 : Fondations Web Modernes",
        duration: "6 à 8 semaines",
        title: "HTML5, CSS Moderne, JavaScript ES6+ & Git",
        description: "Maîtriser les fondations indispensables du web : structure sémantique, Tailwind CSS, manipulation du DOM, asynchronisme (Promises, async/await) et gestion de versions avec Git.",
        skillsAcquired: ["JavaScript moderne", "Tailwind CSS", "Flexbox & Grid responsive", "Git & GitHub workflows"],
        recommendedCourses: [
          { name: "The Odin Project - Full Stack JavaScript", platform: "The Odin Project", type: "Gratuit" },
          { name: "CS50's Web Programming with Python and JS", platform: "edX / Harvard", type: "Certifiant" },
          { name: "JavaScript Moderne de A à Z", platform: "Grafikart", type: "Pratique" }
        ],
        practicalProject: "Développer une application de tableau de bord responsive avec mode sombre et stockage local.",
        milestoneCheck: "Capacité à créer une interface responsive sans framework et à déployer sur GitHub Pages / Vercel."
      },
      {
        id: "fs-p2",
        phase: "Phase 2 : Écosystème Frontend Avancé",
        duration: "8 à 10 semaines",
        title: "React 19, TypeScript & Gestion d'État",
        description: "Construire des interfaces complexes, modulaires et performantes avec React, TypeScript strict, hooks personnalisés et gestion d'état serveur (React Query / Zustand).",
        skillsAcquired: ["React 19", "TypeScript", "Zustand & TanStack Query", "Animations fluides (Motion)"],
        recommendedCourses: [
          { name: "Full Stack Open (React & TS)", platform: "Université d'Helsinki", type: "Gratuit" },
          { name: "React - The Complete Guide", platform: "Udemy", type: "Certifiant" }
        ],
        practicalProject: "Construire une plateforme e-commerce ou un réseau social interactif avec panier en temps réel.",
        milestoneCheck: "Maîtrise complète des types TypeScript et des composants réutilisables."
      },
      {
        id: "fs-p3",
        phase: "Phase 3 : Architecture Backend & Données",
        duration: "8 à 10 semaines",
        title: "Node.js / Express, PostgreSQL, Sécurité & Auth",
        description: "Créer des APIs RESTful sécurisées, modéliser des bases relationnelles avec PostgreSQL, gérer l'authentification JWT/OAuth et les permissions.",
        skillsAcquired: ["APIs REST", "Modélisation SQL & Drizzle/Prisma", "Auth OAuth2 / JWT", "Tests unitaires"],
        recommendedCourses: [
          { name: "Node.js & Express API Mastery", platform: "FreeCodeCamp", type: "Gratuit" },
          { name: "PostgreSQL & Database Design Course", platform: "freeCodeCamp", type: "Gratuit" }
        ],
        practicalProject: "Créer une API complète de gestion de candidatures et d'emplois avec filtres avancés et upload de fichiers.",
        milestoneCheck: "API sécurisée, documentée avec Swagger/Postman et connectée à une base de données cloud."
      },
      {
        id: "fs-p4",
        phase: "Phase 4 : DevOps, Déploiement & Insertion",
        duration: "6 semaines",
        title: "Docker, CI/CD, Portfolio d'Élite & Recrutement Remote",
        description: "Conteneurisation avec Docker, mise en place de pipelines GitHub Actions, optimisation des performances (Lighthouse 95+), constitution d'un portfolio à fort impact et préparation aux entretiens techniques.",
        skillsAcquired: ["Docker", "GitHub Actions", "Optimisation SEO & Web Vitals", "Préparation Entretiens Tech"],
        recommendedCourses: [
          { name: "Docker for Developers", platform: "Coursera", type: "Certifiant" },
          { name: "Cracking the Coding Interview & LeetCode", platform: "LeetCode", type: "Pratique" }
        ],
        practicalProject: "Projet Capstone : Plateforme SaaS complète déployée avec nom de domaine, monitoring et paiements intégrés (MoMo/Stripe).",
        milestoneCheck: "Portfolio en ligne avec 3 projets d'envergure, profil LinkedIn et CV optimisés pour le marché international."
      }
    ]
  },
  {
    id: "data-ai-engineer",
    title: "Data Scientist & Ingénieur IA",
    category: "data_ai",
    categoryLabel: "Intelligence Artificielle & Data",
    shortDescription: "Exploite les données massives et conçoit des algorithmes d'apprentissage automatique et des systèmes LLM pour automatiser la prise de décision.",
    fullDescription: "Spécialiste de la valorisation de la donnée, le Data Scientist / Ingénieur IA conçoit des pipelines de traitement, entraîne des modèles prédictifs et intègre les modèles d'IA générative (LLM, RAG, Vision). En Afrique, c'est un métier clé pour la fintech, l'agritech, la santé et les télécoms.",
    salaryLocal: "500 000 - 1 500 000 FCFA / mois",
    salaryRemote: "45 000€ - 90 000€ / an",
    marketDemand: "Très forte",
    demandLocation: "Cotonou (Fintechs/Banques), Hubs africains & Entreprises d'IA globales",
    keySkills: ["Python (NumPy, Pandas)", "Machine Learning (Scikit-Learn)", "Deep Learning (PyTorch)", "Prompt Engineering & RAG", "SQL & Big Data", "Data Visualization"],
    tools: ["Jupyter", "PyTorch", "Hugging Face", "LangChain / LlamaIndex", "PostgreSQL / DuckDB", "Streamlit"],
    prerequisites: "Aisance avec les mathématiques (statistiques, probabilités, algèbre linéaire) et esprit analytique.",
    accentColor: "from-cyan-500 to-teal-500",
    iconName: "BrainCircuit",
    roadmap: [
      {
        id: "ai-p1",
        phase: "Phase 1 : Python & Analyse Exploratoire de Données",
        duration: "6 à 8 semaines",
        title: "Python pour la Data, Statistiques & SQL",
        description: "Maîtriser Python appliqué à la science des données : Pandas, NumPy, calcul matriciel, statistiques descriptives et requêtes SQL avancées.",
        skillsAcquired: ["Python scientifique", "SQL avancé", "Nettoyage de données", "Data Storytelling"],
        recommendedCourses: [
          { name: "Python for Data Science and Machine Learning", platform: "Coursera (IBM)", type: "Certifiant" },
          { name: "SQL for Data Science", platform: "Khan Academy", type: "Gratuit" }
        ],
        practicalProject: "Analyse exploratoire et tableau de bord interactif sur les transactions de microfinance ou données démographiques ouest-africaines.",
        milestoneCheck: "Capacité à nettoyer un dataset bruité et en tirer des insights actionnables."
      },
      {
        id: "ai-p2",
        phase: "Phase 2 : Machine Learning Classique",
        duration: "8 semaines",
        title: "Algorithmes Prédictifs, Validation & Optimisation",
        description: "Régression linéaire, classification (Random Forest, XGBoost), clustering (K-Means), métriques d'évaluation (AUC-ROC, F1-Score) et cross-validation.",
        skillsAcquired: ["Scikit-Learn", "Feature Engineering", "Prévention de l'overfitting", "MLflow basics"],
        recommendedCourses: [
          { name: "Machine Learning Specialization", platform: "DeepLearning.AI / Andrew Ng", type: "Certifiant" }
        ],
        practicalProject: "Modèle de scoring de crédit pour prédire le risque de défaut sur des prêts bancaires locaux.",
        milestoneCheck: "Modèle entraîné avec pipeline Scikit-Learn et sauvegardé au format ONNX / joblib."
      },
      {
        id: "ai-p3",
        phase: "Phase 3 : Deep Learning & IA Générative (LLM / RAG)",
        duration: "8 à 10 semaines",
        title: "Réseaux de Neurones, Transformers & Agents IA",
        description: "Réseaux de neurones avec PyTorch, architectures Transformers, utilisation d'APIs LLM (Gemini, OpenAI), vector databases (Chroma, Pinecone) et systèmes RAG.",
        skillsAcquired: ["PyTorch", "Hugging Face Transformers", "Pipelines RAG", "Vector Databases"],
        recommendedCourses: [
          { name: "Deep Learning Specialization", platform: "DeepLearning.AI", type: "Certifiant" },
          { name: "Generative AI with LLMs", platform: "AWS / DeepLearning.AI", type: "Certifiant" }
        ],
        practicalProject: "Assistant juridique ou éducatif intelligent spécialisé dans le droit ou le cursus béninois avec RAG.",
        milestoneCheck: "Application déployée avec interface Streamlit connectée à un vector store."
      },
      {
        id: "ai-p4",
        phase: "Phase 4 : MLOps & Déploiement en Production",
        duration: "6 semaines",
        title: "APIs FastAPI, Conteneurisation & Monitoring",
        description: "Servir des modèles via des APIs haute cadence (FastAPI), conteneuriser avec Docker, surveiller la dérive de données (data drift) et publier sur Hugging Face Spaces.",
        skillsAcquired: ["FastAPI", "Docker for ML", "CI/CD pour modèles IA", "Éthique et biais IA"],
        recommendedCourses: [
          { name: "Made With ML (MLOps)", platform: "Goku Mohandas", type: "Gratuit" }
        ],
        practicalProject: "Système de recommandation en temps réel servi via API conteneurisée.",
        milestoneCheck: "Modèle en production avec tests de charge et documentation API OpenAPI."
      }
    ]
  },
  {
    id: "product-designer",
    title: "Product Designer & Spécialiste UX/UI",
    category: "design",
    categoryLabel: "Design & Expérience Utilisateur",
    shortDescription: "Conçoit des expériences digitales intuitives, centrées sur l'humain, alliant esthétique raffinée, ergonomie et design systems pérennes.",
    fullDescription: "Le Product Designer combine recherche utilisateur, psychologie cognitive et création visuelle de haute voltige (Figma, micro-interactions, responsive design). Très convoité par les startups et agences digitales comme GemmaS, il transforme des idées complexes en produits d'une clarté absolue.",
    salaryLocal: "350 000 - 1 100 000 FCFA / mois",
    salaryRemote: "30 000€ - 65 000€ / an",
    marketDemand: "Forte",
    demandLocation: "Agences numériques, Startups Tech Cotonou/Lagos/Abidjan & Remote",
    keySkills: ["Figma & Prototypage avancé", "Design Systems (Tokens, Variables)", "Recherche Utilisateur & Tests", "Wireframing & UI Haute Fidélité", "Design Responsive & Mobile-First", "Accessibilité WCAG"],
    tools: ["Figma", "FigJam", "Framer", "Protopie", "Lottie", "Notion"],
    prerequisites: "Sensibilité visuelle, empathie pour les utilisateurs et esprit de synthèse.",
    accentColor: "from-purple-500 to-indigo-500",
    iconName: "Palette",
    roadmap: [
      {
        id: "ux-p1",
        phase: "Phase 1 : Principes fondamentaux du Design & Figma",
        duration: "6 semaines",
        title: "Théorie visuelle, typographie, hiérarchie & Figma",
        description: "Apprentissage des règles d'or du design graphique : loi de Gestalt, grille de mise en page 8pt, contrastes, typographie pairing et maîtrise d'Auto-Layout sur Figma.",
        skillsAcquired: ["Auto-Layout Figma", "Hiérarchie visuelle", "Systèmes de couleurs HSB", "Règles d'ergonomie"],
        recommendedCourses: [
          { name: "Google UX Design Professional Certificate", platform: "Coursera", type: "Certifiant" },
          { name: "Figma Masterclass", platform: "Designership", type: "Pratique" }
        ],
        practicalProject: "Refonte d'une application bancaire mobile ou d'un service public béninois.",
        milestoneCheck: "Maquette haute fidélité entièrement conçue en Auto-Layout avec styles typographiques liés."
      },
      {
        id: "ux-p2",
        phase: "Phase 2 : Recherche Utilisateur & Architecture de l'Information",
        duration: "6 semaines",
        title: "Interviews, User Personas, User Journeys & Wireframes",
        description: "Mener des interviews utilisateurs, cartographier les parcours d'utilisation (Customer Journey Maps), créer des wireframes lo-fi et structurer les flux de navigation.",
        skillsAcquired: ["Interviews utilisateurs", "User Flow Mapping", "Tests d'utilisabilité", "Wireframing"],
        recommendedCourses: [
          { name: "Interaction Design Foundation (IxDF)", platform: "IxDF", type: "Certifiant" }
        ],
        practicalProject: "Étude de cas UX complète sur l'accès aux soins de santé ou aux transports urbains.",
        milestoneCheck: "Dossier de recherche complet avec persona, parcours et tests de validation avec 5 utilisateurs réels."
      },
      {
        id: "ux-p3",
        phase: "Phase 3 : Design Systems & Prototypage Avancé",
        duration: "8 semaines",
        title: "Design Tokens, Variables Figma, Micro-Interactions",
        description: "Construction d'un Design System complet : tokens d'espacement, couleurs, composants variants dynamiques, micro-interactions et transitions fluides.",
        skillsAcquired: ["Design Systems modulaires", "Variables & Component Sets Figma", "Micro-interactions 60fps", "Hand-off développeurs"],
        recommendedCourses: [
          { name: "Design Systems with Figma", platform: "Figma Academy", type: "Pratique" }
        ],
        practicalProject: "Création d'un Design System complet et d'un prototype interactif d'une application multi-plateforme.",
        milestoneCheck: "Prototype interactif testable sur smartphone avec transitions et variables."
      },
      {
        id: "ux-p4",
        phase: "Phase 4 : Portfolio Framer & Présentation d'Études de Cas",
        duration: "6 semaines",
        title: "Portfolio d'Élite, Rédaction d'Études de Cas & Pitch",
        description: "Mise en ligne de son portfolio sur Framer ou Webflow avec 3 études de cas détaillées racontant le problème, le processus et le résultat chiffré.",
        skillsAcquired: ["Framer no-code", "Storytelling d'étude de cas", "Préparation aux revues de portfolio"],
        recommendedCourses: [
          { name: "Building High-Converting Portfolios", platform: "YouTube / Dive Club", type: "Gratuit" }
        ],
        practicalProject: "Site portfolio personnel interactif présentant 3 études de cas professionnelles.",
        milestoneCheck: "Portfolio publié avec domaine personnalisé et partagé sur LinkedIn et Dribbble."
      }
    ]
  },
  {
    id: "cybersecurity-expert",
    title: "Expert en Cybersécurité & Pentesting",
    category: "security",
    categoryLabel: "Sécurité des Systèmes d'Information",
    shortDescription: "Protège les infrastructures numériques, audite les vulnérabilités et garantit la conformité et la souveraineté des données sensibles.",
    fullDescription: "Face à la montée en flèche des cybermenaces en Afrique et dans le monde, l'expert en cybersécurité audite les failles applicatives (pentest), configure les défenses réseau et sensibilise les organisations. C'est l'un des métiers aux salaires les plus élevés.",
    salaryLocal: "600 000 - 1 800 000 FCFA / mois",
    salaryRemote: "45 000€ - 95 000€ / an",
    marketDemand: "Très forte",
    demandLocation: "Banques, Opérateurs Télécoms, Agences d'État (ASIN Bénin) & International",
    keySkills: ["Réseaux & Protocoles (TCP/IP, DNS, SSL)", "Linux & Bash scripting", "Tests d'intrusion (Pentest Web/Réseau)", "OWASP Top 10", "Cryptographie & PKI", "Sécurité Cloud"],
    tools: ["Kali Linux", "Wireshark", "Burp Suite", "Metasploit", "Nmap", "Splunk"],
    prerequisites: "Bonne compréhension des réseaux informatiques et curiosité technique pour le fonctionnement interne des protocoles.",
    accentColor: "from-emerald-500 to-teal-600",
    iconName: "ShieldCheck",
    roadmap: [
      {
        id: "sec-p1",
        phase: "Phase 1 : Fondations Réseau & Administration Linux",
        duration: "8 semaines",
        title: "Protocoles Réseau, Architecture OSI, Linux & Sécurité de base",
        description: "Comprendre en profondeur le modèle OSI, l'analyse de paquets avec Wireshark, les commandes Linux avancées et l'automatisation en Bash/Python.",
        skillsAcquired: ["Analyse de trafic Wireshark", "Administration Kali/Debian", "Scripting d'automatisation Bash", "Sécurisation SSH/Firewall"],
        recommendedCourses: [
          { name: "Cisco Networking Basics", platform: "Skills for All (Cisco)", type: "Gratuit" },
          { name: "Linux+ Preparation", platform: "CompTIA", type: "Certifiant" }
        ],
        practicalProject: "Conception et sécurisation d'une infrastructure réseau virtualisée avec pare-feu iptables et DMZ.",
        milestoneCheck: "Réussite des challenges débutants sur OverTheWire (Bandit) et TryHackMe."
      },
      {
        id: "sec-p2",
        phase: "Phase 2 : Sécurité des Applications Web & OWASP",
        duration: "8 semaines",
        title: "Audits de failles web, Injections SQL, XSS & CSRF",
        description: "Maîtriser l'utilisation de Burp Suite, identifier les vulnérabilités de l'OWASP Top 10, analyser le code source et rédiger des rapports d'audit éthique.",
        skillsAcquired: ["Burp Suite Pro", "Exploitation et remédiation OWASP", "Pentest d'APIs REST", "Rapports de vulnérabilité"],
        recommendedCourses: [
          { name: "PortSwigger Web Security Academy", platform: "PortSwigger", type: "Gratuit" },
          { name: "Practical Web Hacking", platform: "TCM Security", type: "Certifiant" }
        ],
        practicalProject: "Audit de sécurité complet et rapport de pénétration d'une application web de test (DVWA/Juice Shop).",
        milestoneCheck: "Validation de 30+ labs sur la Web Security Academy de PortSwigger."
      },
      {
        id: "sec-p3",
        phase: "Phase 3 : Pentest Réseau & Sécurité Active Directory",
        duration: "10 semaines",
        title: "Élévation de privilèges, Pivoting & Active Directory",
        description: "Attaques sur environnements d'entreprise (Kerberoasting, Pass-the-Hash), élévation de privilèges Windows/Linux, analyse forensic post-incident.",
        skillsAcquired: ["Active Directory Attacks", "Metasploit avancé", "Post-exploitation", "Forensic basics"],
        recommendedCourses: [
          { name: "Practical Ethical Hacker (PEH)", platform: "TCM Security", type: "Certifiant" },
          { name: "Hack The Box Academy", platform: "Hack The Box", type: "Pratique" }
        ],
        practicalProject: "Compromission éthique et sécurisation d'un domaine Windows multi-serveurs en environnement de laboratoire.",
        milestoneCheck: "Atteinte du rang Pro Hacker sur Hack The Box ou TryHackMe."
      },
      {
        id: "sec-p4",
        phase: "Phase 4 : Certifications & Conformité Internationale",
        duration: "8 semaines",
        title: "Préparation CEH / OSCP / eJPT & Normes ISO 27001",
        description: "Préparation intensive d'une certification reconnue mondialement (eJPTv2 ou OSCP), compréhension du cadre réglementaire de l'APDP/ASIN au Bénin et conformité RGPD.",
        skillsAcquired: ["Certification technique reconnue", "Norme ISO 27001 / NIST", "Audit de conformité données personnelles", "Simulation Blue/Red Team"],
        recommendedCourses: [
          { name: "eJPTv2 - Junior Penetration Tester", platform: "INE Security", type: "Certifiant" }
        ],
        practicalProject: "Élaboration d'une politique de sécurité des systèmes d'information (PSSI) complète pour une organisation.",
        milestoneCheck: "Obtention de la certification eJPT ou CEH et publication d'articles techniques sur Medium/LinkedIn."
      }
    ]
  },
  {
    id: "product-manager",
    title: "Product Manager & Chef de Projet Digital",
    category: "management",
    categoryLabel: "Management & Stratégie Produit",
    shortDescription: "Pilote le cycle de vie des produits technologiques, aligne la vision business avec les équipes tech et maximise la valeur livrée aux utilisateurs.",
    fullDescription: "Le Product Manager est le chef d'orchestre de l'innovation tech. Il traduit la stratégie d'entreprise en fonctionnalités concrètes, priorise le backlog, manage les sprints agiles et suit les indicateurs de rétention et de croissance.",
    salaryLocal: "500 000 - 1 600 000 FCFA / mois",
    salaryRemote: "40 000€ - 85 000€ / an",
    marketDemand: "En plein essor",
    demandLocation: "Scale-ups tech, Fintechs africaines, Cabinets de conseil & Télétravail",
    keySkills: ["Méthodologies Agiles (Scrum, Kanban)", "Product Discovery & PRD", "Analytics Produit (Mixpanel, GA4)", "Priorisation (RICE, MoSCoW)", "Communication transverse", "Go-To-Market Strategy"],
    tools: ["Jira", "Notion", "Mixpanel", "Linear", "Miro", "Loom"],
    prerequisites: "Sens du leadership, esprit d'organisation irréprochable et passion pour les produits digitaux.",
    accentColor: "from-amber-500 to-orange-500",
    iconName: "Briefcase",
    roadmap: [
      {
        id: "pm-p1",
        phase: "Phase 1 : Fondations du Product Management & Agilité",
        duration: "6 semaines",
        title: "Culture Produit, Rôles Scrum & Cycle de vie",
        description: "Comprendre la différence entre projet et produit, maîtriser les cérémonies Scrum (Daily, Sprint Planning, Retro), écrire des User Stories et critères d'acceptation précis.",
        skillsAcquired: ["Scrum & Agile", "Rédaction de User Stories", "Gestion de backlog", "Outils Jira / Linear"],
        recommendedCourses: [
          { name: "Professional Scrum Product Owner (PSPO I)", platform: "Scrum.org", type: "Certifiant" },
          { name: "Product Management First Steps", platform: "LinkedIn Learning", type: "Gratuit" }
        ],
        practicalProject: "Rédaction d'un Product Requirement Document (PRD) pour une nouvelle fonctionnalité d'une fintech africaine.",
        milestoneCheck: "Backlog priorisé sur Jira avec critères INVEST respectés."
      },
      {
        id: "pm-p2",
        phase: "Phase 2 : Product Discovery & Études de Marché",
        duration: "6 semaines",
        title: "Interviews clients, Hypothèses, Prototypage rapide & MVP",
        description: "Identifier les vrais problèmes utilisateurs, valider des hypothèses avec des tests rapides, définir la proposition de valeur unique et concevoir un MVP minimal.",
        skillsAcquired: ["Continuous Discovery", "Design Thinking", "Définition de MVP", "Tests d'opportunités"],
        recommendedCourses: [
          { name: "Continuous Discovery Habits", platform: "Teresa Torres Academy", type: "Pratique" }
        ],
        practicalProject: "Lancement d'une expérience MVP no-code avec landing page et validation d'intérêt par pré-commandes.",
        milestoneCheck: "Démonstration chiffrée de la validation d'un besoin marché."
      },
      {
        id: "pm-p3",
        phase: "Phase 3 : Data-Driven Product Management & Métriques",
        duration: "6 semaines",
        title: "KPIs Produit, A/B Testing, Rétention & North Star Metric",
        description: "Définir la North Star Metric, analyser les entonnoirs de conversion, mesurer le churn, le NPS et comprendre les bases techniques d'APIs pour dialoguer avec les ingénieurs.",
        skillsAcquired: ["Métriques Pirate (AARRR)", "Analyse de cohorte", "Compréhension des APIs & bases de données", "Tests A/B"],
        recommendedCourses: [
          { name: "Product Analytics Certification", platform: "Mixpanel / Pendo", type: "Certifiant" }
        ],
        practicalProject: "Conception d'un tableau de bord de métriques produit avec recommandations stratégiques d'optimisation.",
        milestoneCheck: "Capacité à défendre une décision produit basée sur des données chiffrées."
      },
      {
        id: "pm-p4",
        phase: "Phase 4 : Go-To-Market & Leadership Transversal",
        duration: "6 semaines",
        title: "Stratégie de lancement, Pricing & Positionnement de Carrière",
        description: "Élaborer une stratégie Go-To-Market avec le marketing et les ventes, gérer les parties prenantes exigeantes et réussir les études de cas d'entretiens PM.",
        skillsAcquired: ["Go-To-Market (GTM)", "Gestion des stakeholders", "Résolution d'études de cas produit", "Pitching"],
        recommendedCourses: [
          { name: "Cracking the PM Interview", platform: "Livre / Cours en ligne", type: "Pratique" }
        ],
        practicalProject: "Présentation vidéo d'un dossier de lancement produit complet devant un jury de pairs.",
        milestoneCheck: "Certification PSPO I obtenue et portfolio de 2 études de cas produit complètes."
      }
    ]
  },
  {
    id: "growth-marketer",
    title: "Growth Marketer & Spécialiste Acquisition Digital",
    category: "marketing",
    categoryLabel: "Marketing Digital & Croissance",
    shortDescription: "Génère de la traction, optimise les canaux d'acquisition payants et organiques et met en place des tunnels d'automatisation ultra-rentables.",
    fullDescription: "À l'intersection du marketing, de la data et de la créativité, le Growth Marketer teste des boucles de croissance rapides, configure les campagnes publicitaires (Meta, Google, TikTok), optimise le SEO et met en place du marketing automation via email et WhatsApp.",
    salaryLocal: "300 000 - 950 000 FCFA / mois",
    salaryRemote: "28 000€ - 60 000€ / an",
    marketDemand: "Forte",
    demandLocation: "PME en transformation digitale, E-commerces, Startups & Agences",
    keySkills: ["Publicité Digitale (Meta Ads, Google Ads)", "SEO technique & Content Strategy", "Marketing Automation & CRM (HubSpot)", "Tracking (GA4, GTM, Pixel)", "Copywriting persuasif", "Growth Loops"],
    tools: ["Meta Business Suite", "Google Analytics 4", "Make / Zapier", "HubSpot / Brevo", "Ahrefs", "Canva Pro"],
    prerequisites: "Curiosité commerciale, esprit d'expérimentation rapide et sens de la persuasion.",
    accentColor: "from-rose-500 to-pink-600",
    iconName: "TrendingUp",
    roadmap: [
      {
        id: "gm-p1",
        phase: "Phase 1 : Fondations Marketing, Copywriting & Tracking",
        duration: "6 semaines",
        title: "Psychologie d'achat, Copywriting, Google Tag Manager & GA4",
        description: "Comprendre les leviers psychologiques de conversion, rédiger des textes captivants et installer un tracking infaillible avec GTM et GA4.",
        skillsAcquired: ["Copywriting persuasif", "Configuration GTM & GA4", "Analyse de tunnels de conversion", "Création de Landing Pages"],
        recommendedCourses: [
          { name: "Google Analytics 4 Certification", platform: "Google Skillshop", type: "Certifiant" },
          { name: "Copywriting Secrets", platform: "HubSpot Academy", type: "Gratuit" }
        ],
        practicalProject: "Création d'une page de capture optimisée pour la conversion avec tracking des clics et soumissions.",
        milestoneCheck: "Tracking validé sur Google Tag Assistant sans erreurs."
      },
      {
        id: "gm-p2",
        phase: "Phase 2 : Publicité Payante (Media Buying)",
        duration: "6 semaines",
        title: "Campagnes Meta Ads, TikTok Ads & Google Search",
        description: "Structure de compte publicitaire moderne, ciblage d'audiences, création d'itérations créatives (UGC, vidéos), calcul du ROAS et gestion du budget.",
        skillsAcquired: ["Meta Ads Manager", "Google Search Ads", "Création de briefs publicitaires", "Optimisation du CAC et LTV"],
        recommendedCourses: [
          { name: "Meta Certified Digital Marketing Associate", platform: "Meta Blueprint", type: "Certifiant" }
        ],
        practicalProject: "Gestion d'une campagne réelle à budget contrôlé avec optimisation du coût par prospect.",
        milestoneCheck: "Atteinte d'un coût par acquisition inférieur au seuil fixé."
      },
      {
        id: "gm-p3",
        phase: "Phase 3 : Marketing Automation & CRM WhatsApp/Email",
        duration: "6 semaines",
        title: "Automatisation Make/Zapier, Séquences Brevo & Bots WhatsApp",
        description: "Créer des tunnels automatisés reliant les formulaires web, les bases CRM (HubSpot/Brevo), et l'envoi de messages de relance automatiques sur WhatsApp et email.",
        skillsAcquired: ["Make.com / Zapier", "Automatisation WhatsApp Business API", "Lead Nurturing", "Segmentation de base"],
        recommendedCourses: [
          { name: "Make Academy Basics & Intermediate", platform: "Make.com", type: "Gratuit" }
        ],
        practicalProject: "Système complet de relance automatisée de paniers abandonnés ou de rendez-vous confirmés.",
        milestoneCheck: "Scénario Make fonctionnel avec gestion des erreurs et alertes Slack/Telegram."
      },
      {
        id: "gm-p4",
        phase: "Phase 4 : SEO & Stratégie de Croissance Organique",
        duration: "6 semaines",
        title: "SEO On-Page/Off-Page, Content Marketing & Viralité",
        description: "Positionner des mots-clés stratégiques sur Google, optimiser la vitesse du site, structurer une stratégie éditoriale LinkedIn/YouTube et créer des boucles virales de parrainage.",
        skillsAcquired: ["Recherche de mots-clés (Semrush/Ahrefs)", "SEO technique", "Programmes de parrainage", "Personal Branding"],
        recommendedCourses: [
          { name: "SEO Certification", platform: "HubSpot Academy", type: "Certifiant" }
        ],
        practicalProject: "Audit SEO d'un site web local et élaboration d'un plan d'action d'acquisition organique sur 6 mois.",
        milestoneCheck: "Rapport d'audit professionnel prêt à être vendu à un client ou une entreprise."
      }
    ]
  }
];

export const CAREER_CATEGORIES: { id: Career['category'] | 'cloud' | 'fintech' | 'all'; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'tech', label: 'Tech & Dev' },
  { id: 'data_ai', label: 'IA & Data' },
  { id: 'design', label: 'Design' },
  { id: 'security', label: 'Sécurité' },
  { id: 'cloud', label: 'Cloud & DevOps' },
  { id: 'fintech', label: 'Finance & Fintech' },
  { id: 'management', label: 'Management' },
  { id: 'marketing', label: 'Marketing' }
];
