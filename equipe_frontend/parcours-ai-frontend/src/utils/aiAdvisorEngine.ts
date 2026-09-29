import { Career, ChatMessage, UserProfile } from '../types';
import { CAREERS_DATA } from '../data/careersData';

/**
 * Moteur conversationnel pour le Conseiller IA de Parcours AI
 * Gère la discussion libre en langage naturel ainsi que le diagnostic d'orientation structuré.
 * Rendu professionnel, rigoureux, sans émoticônes/émojis superflus.
 */

export interface AIResponseOutput {
  text: string;
  suggestedReplies?: string[];
  recommendedCareers?: Career[];
  isComplete?: boolean;
}

export function generateFreeChatResponse(
  userQuery: string,
  history: ChatMessage[],
  profile?: UserProfile
): AIResponseOutput {
  const query = userQuery.toLowerCase().trim();

  // 1. Détection Métier Spécifique
  const matchedCareer = CAREERS_DATA.find(c => 
    query.includes(c.title.toLowerCase()) || 
    c.keySkills.some(skill => query.includes(skill.toLowerCase())) ||
    (c.category === 'data_ai' && (query.includes('ia') || query.includes('intelligence artificielle') || query.includes('data') || query.includes('python') || query.includes('machine learning'))) ||
    (c.category === 'security' && (query.includes('cyber') || query.includes('sécurité') || query.includes('hacking') || query.includes('pentest'))) ||
    (c.category === 'design' && (query.includes('design') || query.includes('ui/ux') || query.includes('figma') || query.includes('ux'))) ||
    (c.category === 'tech' && (query.includes('fullstack') || query.includes('web') || query.includes('développeur') || query.includes('react') || query.includes('frontend') || query.includes('backend')))
  );

  // 2. Salaires & Rémunérations
  if (query.includes('salaire') || query.includes('gagne') || query.includes('rémunération') || query.includes('combien') || query.includes('argent') || query.includes('tarifs')) {
    if (matchedCareer) {
      return {
        text: `**Rémunérations pour le métier de ${matchedCareer.title}** :\n\n- **Marché Local (Bénin / Afrique de l'Ouest)** : environ **${matchedCareer.salaryLocal}** selon le niveau d'expérience et la structure.\n- **Marché International (Télétravail / Remote UE & USA)** : entre **${matchedCareer.salaryRemote}**.\n\n**Recommandation stratégique** : Pour accéder à la tranche supérieure des grilles internationales, consolidez votre anglais technique professionnel, développez 2 à 3 projets open-source documentés sur GitHub, et préparez une certification reconnue par l'industrie.`,
        suggestedReplies: [
          `Voir la feuille de route pour ${matchedCareer.title}`,
          `Quelles sont les compétences clés pour ${matchedCareer.title} ?`,
          `Comment décrocher un premier contrat en télétravail international ?`
        ],
        recommendedCareers: [matchedCareer]
      };
    }

    return {
      text: `**Grilles de rémunération dans les filières numériques** :\n\n1. **Data & Ingénierie IA** : 500.000 à 1.500.000 FCFA/mois localement | 45.000€ à 90.000€/an en remote.\n2. **Cybersécurité & Cloud** : 600.000 à 1.800.000 FCFA/mois localement | 50.000€ à 95.000€/an en remote.\n3. **Développement Full-Stack & Mobile** : 400.000 à 1.200.000 FCFA/mois localement | 35.000€ à 75.000€/an en remote.\n4. **Product Management** : 500.000 à 1.300.000 FCFA/mois localement | 40.000€ à 80.000€/an en remote.\n5. **Product Design (UI/UX)** : 350.000 à 900.000 FCFA/mois localement | 30.000€ à 60.000€/an en remote.\n\nQuel domaine correspond le mieux à vos objectifs professionnels ?`,
      suggestedReplies: [
        "Ingénieur IA & Data Scientist",
        "Expert en Cybersécurité",
        "Développeur Full-Stack Web",
        "Product Designer (UI/UX)"
      ]
    };
  }

  // 3. Reconversion professionnelle
  if (query.includes('reconversion') || query.includes('reconvertir') || query.includes('changer de voie') || query.includes('commencer de zéro') || query.includes('débuter')) {
    return {
      text: `**Méthodologie pour réussir une reconversion dans la tech** :\n\n1. **Valoriser vos acquis transversaux** : Rigueur analytique, gestion de projet, communication ou compréhension métier constituent des atouts majeurs.\n2. **Sélectionner une spécialité cohérente** :\n   - *Profil visuel et sensible à l'usage* : **Product Design (UI/UX)**\n   - *Profil logique et orienté construction* : **Développement Full-Stack**\n   - *Profil quantitatif et mathématique* : **Data & Intelligence Artificielle**\n3. **Pratiquer par projets appliqués** : Constituer un portfolio de 3 réalisations concrètes et vérifiables.\n4. **Adopter un rythme de formation structuré** sur 6 à 9 mois d'apprentissage assidu.\n\nSouhaitez-vous lancer un diagnostic guidé pour valider l'adéquation de votre profil ?`,
      suggestedReplies: [
        "Lancer le diagnostic d'orientation complet",
        "Quels sont les métiers les plus accessibles aux débutants ?",
        "Comment financer ou sélectionner une formation en ligne ?"
      ]
    };
  }

  // 4. Décrocher un job en télétravail international (Remote)
  if (query.includes('remote') || query.includes('télétravail') || query.includes('international') || query.includes('trouver un job') || query.includes('freelance')) {
    return {
      text: `**Critères clés pour décrocher un contrat en télétravail international (Remote)** :\n\n- **Maîtrise de l'anglais professionnel** : La communication écrite et les réunions des entreprises internationales se déroulent intégralement en anglais.\n- **Portfolio vérifiable** : Des projets déployés en production, avec un code source clair et documenté sur GitHub ou Dribbble.\n- **Canaux de recrutement ciblés** : Plateformes spécialisées (Wellfound, RemoteOK, We Work Remotely, Turing, Toptal) et réseau professionnel LinkedIn.\n- **Compétences en travail asynchrone** : Autonomie, gestion du temps, rigueur dans le reporting et utilisation des outils collaboratifs (Slack, Notion, Jira).\n\nPour quelle spécialité souhaitez-vous préparer votre candidature ?`,
      suggestedReplies: [
        "Développeur Full-Stack React & Node",
        "Ingénieur IA / Data Scientist",
        "Product Designer UI/UX"
      ]
    };
  }

  // 5. Questions relatives à l'Intelligence Artificielle & Data
  if (query.includes('ia') || query.includes('intelligence artificielle') || query.includes('machine learning') || query.includes('deep learning') || query.includes('prompt')) {
    const aiCareer = CAREERS_DATA.find(c => c.category === 'data_ai') || CAREERS_DATA[1];
    return {
      text: `**Le secteur de l'Intelligence Artificielle & de la Data** :\n\nCe domaine connaît une forte demande liée au déploiement de modèles prédictifs et de solutions génératives en entreprise.\n\n- **Compétences fondamentales** : Python, SQL, frameworks de Machine Learning (PyTorch, Scikit-Learn), APIs de grands modèles de langage (LLMs) et principes MLOps.\n- **Débouchés sectoriels** : Banques, fintechs, télécoms, cabinets de conseil et entreprises technologiques internationales.\n- **Durée d'apprentissage estimée** : 6 à 12 mois pour atteindre un niveau opérationnel solide à partir d'une base logique ou scientifique.\n\nSouhaitez-vous consulter la feuille de route détaillée pour cette filière ?`,
      suggestedReplies: [
        "Voir la feuille de route Ingénieur IA & Data",
        "Quel niveau préalable en mathématiques est requis ?",
        "Quels types de projets valoriser dans son portfolio ?"
      ],
      recommendedCareers: [aiCareer]
    };
  }

  // 6. Questions relatives à la Cybersécurité
  if (query.includes('cyber') || query.includes('sécurité') || query.includes('hacking') || query.includes('piratage') || query.includes('réseau')) {
    const secCareer = CAREERS_DATA.find(c => c.category === 'security') || CAREERS_DATA[3];
    return {
      text: `**Le secteur de la Cybersécurité et de la Protection des Systèmes** :\n\nLa numérisation des organisations renforce la nécessité d'auditer et de sécuriser les infrastructures critiques.\n\n- **Piliers techniques** : Protocoles réseaux (TCP/IP, DNS), administration Linux avancée, sécurité Cloud, tests d'intrusion éthiques et conformité réglementaire.\n- **Certifications reconnues** : CompTIA Security+, CEH (Certified Ethical Hacker), OSCP, CISSP.\n- **Tension sur le marché** : Forte pénurie de profils qualifiés, garantissant d'importantes opportunités d'insertion.\n\nSouhaitez-vous explorer le parcours de certification recommandé ?`,
      suggestedReplies: [
        "Consulter la feuille de route Cybersécurité",
        "Par quoi commencer pour débuter en Cybersécurité ?",
        "Quelle différence entre Blue Team et Red Team ?"
      ],
      recommendedCareers: [secCareer]
    };
  }

  // 7. Si un métier a été ciblé
  if (matchedCareer) {
    return {
      text: `**Fiche synthétique : ${matchedCareer.title}**\n\n${matchedCareer.fullDescription}\n\n**Éléments clés :**\n- **Niveau de demande** : ${matchedCareer.marketDemand} (${matchedCareer.demandLocation})\n- **Rémunération estimée** : ${matchedCareer.salaryLocal} (local) / ${matchedCareer.salaryRemote} (remote)\n- **Technologies et outils** : ${matchedCareer.tools.join(', ')}\n- **Compétences prioritaires** : ${matchedCareer.keySkills.join(', ')}\n\nQue souhaitez-vous approfondir concernant ce métier ?`,
      suggestedReplies: [
        `Ouvrir la feuille de route détaillée (${matchedCareer.title})`,
        `Quelles ressources gratuites permettent de démarrer ?`,
        `Comment évaluer mon niveau actuel ?`
      ],
      recommendedCareers: [matchedCareer]
    };
  }

  // 8. Salutations / Débuts de conversation
  if (query === 'bonjour' || query === 'salut' || query === 'hello' || query === 'bonsoir' || query === 'hey') {
    return {
      text: `Bonjour. Bienvenue sur l'espace d'orientation **Parcours AI**.\n\nJe suis votre conseiller carrière. Je peux vous accompagner pour :\n- **Analyser votre profil** et définir vos axes d'orientation prioritaires\n- **Découvrir les métiers numériques porteurs** (IA, Cybersécurité, Développement Full-Stack, UI/UX Design, Cloud)\n- **Consulter les grilles de rémunération réelles** au niveau local et en télétravail international\n- **Identifier les formations et certifications recommandées**\n\nQuel sujet souhaitez-vous aborder ?`,
      suggestedReplies: [
        "Lancer un diagnostic d'orientation complet",
        "Quels sont les métiers tech les mieux rémunérés ?",
        "Comment débuter la programmation sans diplôme préalable ?",
        "Quels métiers recrutent le plus actuellement ?"
      ]
    };
  }

  // 9. Réponse par défaut
  return {
    text: `Votre demande est bien prise en compte.\n\nPour affiner ma recommandation, vous pouvez préciser :\n- Votre domaine d'études ou votre niveau d'expérience actuel\n- Vos objectifs prioritaires (insertion locale, freelancing, télétravail international)\n\nVous pouvez également démarrer un diagnostic complet ou explorer directement les fiches métiers.`,
    suggestedReplies: [
      "Lancer le bilan d'orientation guidé",
      "Consulter l'ensemble des fiches métiers",
      "Quelles sont les compétences les plus demandées en 2026 ?"
    ],
    recommendedCareers: [CAREERS_DATA[0], CAREERS_DATA[1]]
  };
}
