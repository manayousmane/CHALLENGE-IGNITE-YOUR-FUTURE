export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Général' | 'Orientation & IA' | 'Marché & Salaires' | 'Accompagnement & Carrières';
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "Orientation & IA",
    question: "Comment l'IA de Parcours AI évalue-t-elle mon profil pour me suggérer un métier ?",
    answer: "Notre moteur d'orientation analyse vos affinités, vos compétences actuelles, votre niveau d'études et vos préférences de travail (local en Afrique de l'Ouest ou télétravail international). Il croise ces données avec un référentiel dynamique des métiers d'avenir pour calculer un indice de correspondance (Match Score) et générer une roadmap sur-mesure étape par étape."
  },
  {
    id: "faq-2",
    category: "Général",
    question: "La plateforme est-elle adaptée aux débutants sans expérience préalable ?",
    answer: "Absolument. Chaque feuille de route débute par une Phase 1 dédiée aux fondamentaux indispensables (bases logiques, outils standards, cours certifiants gratuits ou accessibles). Vous progressez ensuite par paliers rythmés par des projets concrets jusqu'à l'insertion professionnelle."
  },
  {
    id: "faq-3",
    category: "Marché & Salaires",
    question: "D'où proviennent les estimations de salaires (FCFA et Remote) ?",
    answer: "Nos données salariales sont calibrées d'après les barèmes réels observés sur le marché d'Afrique francophone (Bénin, Sénégal, Côte d'Ivoire) auprès d'entreprises locales et de banques, ainsi que sur les grilles de rémunération des plateformes de travail à distance (Deel, Turing, Toptal, Upwork) pour les contrats internationaux."
  },
  {
    id: "faq-4",
    category: "Général",
    question: "L'accès à la plateforme et au diagnostic d'orientation est-il gratuit ?",
    answer: "Oui ! L'évaluation de votre profil par l'IA, l'exploration complète du référentiel des métiers, les estimations salariales et la génération détaillée de vos feuilles de route d'apprentissage sont 100% gratuites et sans engagement."
  },
  {
    id: "faq-5",
    category: "Accompagnement & Carrières",
    question: "Comment puis-je enregistrer ou imprimer ma feuille de route personnalisée ?",
    answer: "Dans la fenêtre de Roadmap, vous pouvez cliquer sur 'Imprimer / Exporter en PDF' pour générer un document propre, partageable avec vos mentors ou recruteurs, ou exporter le plan au format JSON pour l'intégrer dans vos outils de productivité (Notion, Trello)."
  },
  {
    id: "faq-6",
    category: "Marché & Salaires",
    question: "Quelles sont les opportunités d'emploi au Bénin et en Afrique de l'Ouest ?",
    answer: "Le secteur tech béninois est en forte expansion avec le développement du pôle numérique de Sèmè City, l'ASIN, les fintechs locales et les banques sous-régionales. Les compétences en développement web moderne, cybersécurité et intelligence artificielle sont en tension majeure."
  }
];
