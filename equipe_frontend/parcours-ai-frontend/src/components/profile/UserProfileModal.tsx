import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  Laptop, 
  Camera,
  Check,
  Upload,
  Image as ImageIcon,
  Trash2,
  Info
} from 'lucide-react';
import { useAuth, AuthUser } from '../../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDashboard?: () => void;
}

// Avatars géométriques vectoriels stylisés (autonomes, sans aucun emoji)
const VECTOR_AVATARS = [
  {
    id: 'cyber_cyan',
    name: 'Prisme Cyan',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%232563eb"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g1)"/><polygon points="50,22 76,37 76,67 50,82 24,67 24,37" fill="none" stroke="white" stroke-width="5" stroke-linejoin="round"/><circle cx="50" cy="52" r="10" fill="white"/></svg>'
  },
  {
    id: 'matrix_indigo',
    name: 'Matrice Indigo',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236366f1"/><stop offset="100%" stop-color="%239333ea"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g2)"/><path d="M30 40 L50 25 L70 40 L70 65 L50 80 L30 65 Z" fill="none" stroke="white" stroke-width="5" stroke-linejoin="round"/><path d="M50 25 L50 80 M30 40 L70 65 M30 65 L70 40" stroke="white" stroke-width="2" opacity="0.6"/></svg>'
  },
  {
    id: 'emerald_core',
    name: 'Noyau Émeraude',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310b981"/><stop offset="100%" stop-color="%23047857"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g3)"/><circle cx="50" cy="50" r="26" fill="none" stroke="white" stroke-width="4"/><circle cx="50" cy="50" r="14" fill="white"/><line x1="50" y1="12" x2="50" y2="24" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="76" x2="50" y2="88" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="12" y1="50" x2="24" y2="50" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="76" y1="50" x2="88" y2="50" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>'
  },
  {
    id: 'amber_flare',
    name: 'Orbite Ambre',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g4)"/><ellipse cx="50" cy="50" rx="34" ry="15" fill="none" stroke="white" stroke-width="4" transform="rotate(-30 50 50)"/><circle cx="50" cy="50" r="12" fill="white"/></svg>'
  },
  {
    id: 'sapphire_node',
    name: 'Réseau Saphir',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230284c7"/><stop offset="100%" stop-color="%231e3a8a"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g5)"/><circle cx="32" cy="36" r="7" fill="white"/><circle cx="68" cy="36" r="7" fill="white"/><circle cx="50" cy="68" r="7" fill="white"/><line x1="32" y1="36" x2="68" y2="36" stroke="white" stroke-width="3"/><line x1="32" y1="36" x2="50" y2="68" stroke="white" stroke-width="3"/><line x1="68" y1="36" x2="50" y2="68" stroke="white" stroke-width="3"/></svg>'
  },
  {
    id: 'violet_pulse',
    name: 'Onde Violette',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%238b5cf6"/><stop offset="100%" stop-color="%234c1d95"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g6)"/><path d="M22 52 L36 52 L44 32 L56 70 L64 52 L78 52" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  {
    id: 'ruby_circuit',
    name: 'Circuit Rubis',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ef4444"/><stop offset="100%" stop-color="%23991b1b"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g7)"/><rect x="32" y="32" width="36" height="36" rx="8" fill="none" stroke="white" stroke-width="4"/><circle cx="50" cy="50" r="6" fill="white"/><line x1="50" y1="20" x2="50" y2="32" stroke="white" stroke-width="4"/><line x1="50" y1="68" x2="50" y2="80" stroke="white" stroke-width="4"/><line x1="20" y1="50" x2="32" y2="50" stroke="white" stroke-width="4"/><line x1="68" y1="50" x2="80" y2="50" stroke="white" stroke-width="4"/></svg>'
  },
  {
    id: 'teal_shield',
    name: 'Égide Turquoise',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g8" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2314b8a6"/><stop offset="100%" stop-color="%230f766e"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g8)"/><path d="M50 22 L72 32 C72 56 50 76 50 76 C50 76 28 56 28 32 Z" fill="none" stroke="white" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="45" r="7" fill="white"/></svg>'
  }
];

// Dictionnaire structuré des situations avec groupements
export const SITUATIONS_MAP: Record<string, { label: string; role: AuthUser['role']; desc: string; category: string }> = {
  // Études, Lycée & Universités
  'lyceen_bac': {
    category: 'Études, Lycée & Universités',
    label: 'Lycéen (Seconde, Première, Terminale C, D, A, E, TI)',
    role: 'student',
    desc: 'Choix de filière post-bac et préparation aux études supérieures technologiques'
  },
  'etudiant_licence': {
    category: 'Études, Lycée & Universités',
    label: 'Étudiant en Licence / BTS / DUT (Années 1 à 3)',
    role: 'student',
    desc: 'Spécialisation académique, projets d\'études et recherche de stages techniques'
  },
  'etudiant_master': {
    category: 'Études, Lycée & Universités',
    label: 'Étudiant en Master / Cycle Ingénieur (Années 4 et 5)',
    role: 'student',
    desc: 'Perfectionnement de haut niveau et préparation à l\'insertion professionnelle'
  },
  'doctorant': {
    category: 'Études, Lycée & Universités',
    label: 'Doctorant / Chercheur universitaire',
    role: 'student',
    desc: 'Recherche appliquée, R&D en informatique et publications scientifiques'
  },
  'jeune_diplome': {
    category: 'Études, Lycée & Universités',
    label: 'Jeune diplômé en quête d\'un premier emploi / stage',
    role: 'student',
    desc: 'Validation des compétences, préparation aux entretiens et opportunités juniors'
  },

  // Reconversion & Transition Professionnelle
  'reconversion_debut': {
    category: 'Reconversion & Transition Professionnelle',
    label: 'Début de reconversion vers la Tech & le Numérique',
    role: 'career_changer',
    desc: 'Exploration des opportunités, découverte du code, de l\'IA et du cloud'
  },
  'reconversion_formation': {
    category: 'Reconversion & Transition Professionnelle',
    label: 'En formation accélérée / Bootcamp / Certifications',
    role: 'career_changer',
    desc: 'Apprentissage intensif, construction de portfolio et projets concrets'
  },
  'pivot_non_tech': {
    category: 'Reconversion & Transition Professionnelle',
    label: 'Professionnel hors-tech souhaitant pivoter (Droit, Finance, Santé...)',
    role: 'career_changer',
    desc: 'Valorisation des acquis transversaux et montée en compétences numériques'
  },
  'demandeur_emploi': {
    category: 'Reconversion & Transition Professionnelle',
    label: 'Demandeur d\'emploi en repositionnement stratégique',
    role: 'career_changer',
    desc: 'Alignement rapide sur les métiers les plus recherchés au Bénin et en remote'
  },

  // Professionnels Tech en Activité
  'tech_junior': {
    category: 'Professionnels Tech en Activité',
    label: 'Développeur / Spécialiste Tech Junior (0 à 2 ans)',
    role: 'professional',
    desc: 'Consolidation des compétences, bonnes pratiques et autonomie'
  },
  'tech_intermediaire': {
    category: 'Professionnels Tech en Activité',
    label: 'Spécialiste Tech Confirmé / Mid-level (2 à 5 ans)',
    role: 'professional',
    desc: 'Évolution de carrière, nouvelles architectures et missions en télétravail international'
  },
  'tech_senior': {
    category: 'Professionnels Tech en Activité',
    label: 'Lead Tech / Développeur Senior / Architecte (+5 ans)',
    role: 'professional',
    desc: 'Leadership technique, conception de systèmes distribués et mentorat'
  },
  'tech_manager': {
    category: 'Professionnels Tech en Activité',
    label: 'Manager Tech / Product Owner / Chef de Projet Digital',
    role: 'professional',
    desc: 'Pilotage agile, cadrage de produits et coordination inter-équipes'
  },

  // Indépendants & Entrepreneuriat
  'freelance_tech': {
    category: 'Indépendants & Entrepreneuriat',
    label: 'Freelance / Consultant indépendant Tech & IA',
    role: 'professional',
    desc: 'Facturation internationale, négociation de TJM et prospection de clients'
  },
  'fondateur_startup': {
    category: 'Indépendants & Entrepreneuriat',
    label: 'Fondateur / Porteur de projet Startup ou Agence Digitale',
    role: 'professional',
    desc: 'Création de valeur, MVP, levée de fonds et recrutement de talents'
  },

  // Passionnés & Autodidactes
  'autodidacte': {
    category: 'Passionnés & Autodidactes',
    label: 'Autodidacte passionné (auto-formation, open-source)',
    role: 'tech_enthusiast',
    desc: 'Apprentissage continu guidé par la curiosité et projets personnels'
  },
  'curieux_ia': {
    category: 'Passionnés & Autodidactes',
    label: 'Curieux et explorateur d\'Intelligence Artificielle',
    role: 'tech_enthusiast',
    desc: 'Découverte des nouveaux outils, prompting et automatisation'
  }
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigateToDashboard,
}) => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États du formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+229');
  const [situation, setSituation] = useState('etudiant_licence');
  const [role, setRole] = useState<AuthUser['role']>('student');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  
  // États de rétroaction
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialisation à partir de l'utilisateur actuel
  useEffect(() => {
    if (user) {
      const initialFirst = user.firstName || (user.name ? user.name.split(' ')[0] : '');
      const initialLast = user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : '');
      
      setFirstName(initialFirst);
      setLastName(initialLast);
      setEmail(user.email || '');
      
      // Parser le téléphone pour extraire l'indicatif
      let rawPhone = user.phone || '';
      if (rawPhone.startsWith('+229')) {
        setCountryCode('+229');
        rawPhone = rawPhone.replace('+229', '').trim();
      } else if (rawPhone.startsWith('+228')) {
        setCountryCode('+228');
        rawPhone = rawPhone.replace('+228', '').trim();
      } else if (rawPhone.startsWith('+225')) {
        setCountryCode('+225');
        rawPhone = rawPhone.replace('+225', '').trim();
      } else if (rawPhone.startsWith('+33')) {
        setCountryCode('+33');
        rawPhone = rawPhone.replace('+33', '').trim();
      }
      setPhone(rawPhone);

      // Situation
      if (user.situation && SITUATIONS_MAP[user.situation]) {
        setSituation(user.situation);
        setRole(SITUATIONS_MAP[user.situation].role);
      } else if (user.role) {
        setRole(user.role);
        // Associer une situation par défaut correspondante
        if (user.role === 'student') setSituation('etudiant_licence');
        else if (user.role === 'career_changer') setSituation('reconversion_debut');
        else if (user.role === 'professional') setSituation('tech_junior');
        else if (user.role === 'tech_enthusiast') setSituation('autodidacte');
      }

      setSelectedAvatar(user.avatar || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // Calcul du taux de complétion
  const calculateCompletion = () => {
    let score = 0;
    if (firstName.trim()) score += 20;
    if (lastName.trim()) score += 20;
    if (email.trim()) score += 25;
    if (phone.trim()) score += 15;
    if (situation) score += 10;
    if (selectedAvatar) score += 10;
    return Math.min(100, score);
  };

  const completionRate = calculateCompletion();

  const handlePhoneInput = (val: string) => {
    const cleaned = val.replace(/[^\d\s]/g, '');
    setPhone(cleaned);
  };

  // Gestion du changement de situation via select optgroup
  const handleSituationChange = (newVal: string) => {
    setSituation(newVal);
    if (SITUATIONS_MAP[newVal]) {
      setRole(SITUATIONS_MAP[newVal].role);
    }
  };

  // Import / Upload d'une photo de profil depuis la galerie du téléphone ou l'ordinateur
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('La taille de l\'image ne doit pas dépasser 8 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Redimensionnement et compression automatique sur un Canvas carré de 256x256
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setSelectedAvatar(compressedDataUrl);
          setSuccessMessage('Photo importée depuis votre galerie avec succès ! Pensez à enregistrer.');
          setTimeout(() => setSuccessMessage(null), 3500);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!firstName.trim() && !lastName.trim()) {
      setErrorMessage('Veuillez renseigner au moins un prénom ou un nom.');
      setIsSubmitting(false);
      return;
    }

    if (phone.trim() && countryCode === '+229') {
      const digits = phone.replace(/\s+/g, '');
      if (digits.length !== 10 || !digits.startsWith('01')) {
        setErrorMessage('Pour le Bénin (+229), le numéro doit comporter 10 chiffres et commencer par 01.');
        setIsSubmitting(false);
        return;
      }
    }

    const fullPhone = phone.trim() ? `${countryCode} ${phone.trim()}` : '';
    const combinedName = `${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      const res = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: combinedName || user.name,
        email: email.trim(),
        phone: fullPhone,
        avatar: selectedAvatar,
        role: role,
        situation: situation,
      });

      if (res.success) {
        setSuccessMessage('Votre profil a été mis à jour avec succès et synchronisé dans le Cloud !');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 4000);
      } else {
        setErrorMessage(res.error || 'Erreur lors de la mise à jour.');
      }
    } catch (err: any) {
      setErrorMessage('Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCustomUploaded = selectedAvatar && selectedAvatar.startsWith('data:image/jpeg');
  const currentSituationInfo = SITUATIONS_MAP[situation];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl dark:bg-[#060a17] bg-white border dark:border-cyan-500/30 border-slate-200 shadow-2xl dark:shadow-cyan-950/50 text-slate-900 dark:text-white p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-profile-title"
      >
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 p-2.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer z-10 min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Fermer la fenêtre du profil"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête du profil avec Avatar et Badges */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b dark:border-white/10 border-slate-200">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-xl shadow-cyan-500/20 overflow-hidden">
              {selectedAvatar ? (
                <img 
                  src={selectedAvatar} 
                  alt={user.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              ) : (
                <div className="w-full h-full rounded-[14px] dark:bg-[#020512] bg-cyan-50 flex items-center justify-center font-display font-black text-3xl text-cyan-600 dark:text-cyan-400">
                  {firstName.charAt(0) || user.name.charAt(0) || 'U'}
                </div>
              )}
            </div>

            {/* Bouton déclencheur upload photo */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Importer une photo depuis votre galerie"
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white shadow-md transition-transform active:scale-90 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h2 id="user-profile-title" className="text-xl sm:text-2xl font-black font-display tracking-tight truncate">
                {firstName || lastName ? `${firstName} ${lastName}`.trim() : user.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                Membre Vérifié
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-3">
              {email || user.email || 'Aucune adresse renseignée'}
            </p>

            {/* Barre de complétion */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Complétion du profil</span>
                <span className="text-cyan-600 dark:text-cyan-400">{completionRate}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <X className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulaire d'édition */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Section 1 : Nom et Prénom */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-500" />
              <span>Identité de l'utilisateur</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prénom
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Narcisse"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom de famille
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: AVLESSI"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 : Coordonnées (Email & Téléphone) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-500" />
              <span>Coordonnées de contact</span>
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Numéro de Téléphone (Bénin & International)
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-36 py-2.5 px-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1228] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="+229">+229 (Bénin)</option>
                    <option value="+228">+228 (Togo)</option>
                    <option value="+225">+225 (CI)</option>
                    <option value="+221">+221 (Sénégal)</option>
                    <option value="+237">+237 (Cameroun)</option>
                    <option value="+33">+33 (France)</option>
                    <option value="+1">+1 (USA)</option>
                  </select>

                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneInput(e.target.value)}
                      placeholder={countryCode === '+229' ? "01 XX XX XX XX (10 chiffres)" : "Numéro de téléphone"}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>
                {countryCode === '+229' && (
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    Format réglementaire béninois : 10 chiffres débutant obligatoirement par <strong>01</strong>.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3 : Situation actuelle avec SELECT et OPTGROUP HTML */}
          <div>
            <div className="mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span>Situation actuelle</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              <select
                value={situation}
                onChange={(e) => handleSituationChange(e.target.value)}
                className="w-full py-3 px-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1228] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer shadow-sm"
              >
                <optgroup label="Études, Lycée & Universités" className="font-bold text-cyan-600 dark:text-cyan-400 bg-slate-100 dark:bg-[#070c1e]">
                  <option value="lyceen_bac" className="text-slate-900 dark:text-white font-normal py-1">
                    Lycéen (Seconde, Première, Terminale C, D, A, E, TI)
                  </option>
                  <option value="etudiant_licence" className="text-slate-900 dark:text-white font-normal py-1">
                    Étudiant en Licence / BTS / DUT (Années 1 à 3)
                  </option>
                  <option value="etudiant_master" className="text-slate-900 dark:text-white font-normal py-1">
                    Étudiant en Master / Cycle Ingénieur (Années 4 et 5)
                  </option>
                  <option value="doctorant" className="text-slate-900 dark:text-white font-normal py-1">
                    Doctorant / Chercheur universitaire en informatique
                  </option>
                  <option value="jeune_diplome" className="text-slate-900 dark:text-white font-normal py-1">
                    Jeune diplômé en quête d'un premier emploi / stage
                  </option>
                </optgroup>

                <optgroup label="Reconversion & Transition Professionnelle" className="font-bold text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-[#070c1e]">
                  <option value="reconversion_debut" className="text-slate-900 dark:text-white font-normal py-1">
                    Début de reconversion vers la Tech & l'IA
                  </option>
                  <option value="reconversion_formation" className="text-slate-900 dark:text-white font-normal py-1">
                    En formation accélérée / Bootcamp / Certifications
                  </option>
                  <option value="pivot_non_tech" className="text-slate-900 dark:text-white font-normal py-1">
                    Professionnel hors-tech souhaitant pivoter vers le numérique
                  </option>
                  <option value="demandeur_emploi" className="text-slate-900 dark:text-white font-normal py-1">
                    Demandeur d'emploi en repositionnement professionnel
                  </option>
                </optgroup>

                <optgroup label="Professionnels Tech en Activité" className="font-bold text-emerald-600 dark:text-emerald-400 bg-slate-100 dark:bg-[#070c1e]">
                  <option value="tech_junior" className="text-slate-900 dark:text-white font-normal py-1">
                    Développeur / Spécialiste Tech Junior (0 à 2 ans)
                  </option>
                  <option value="tech_intermediaire" className="text-slate-900 dark:text-white font-normal py-1">
                    Spécialiste Confirmé / Mid-level (2 à 5 ans)
                  </option>
                  <option value="tech_senior" className="text-slate-900 dark:text-white font-normal py-1">
                    Lead Tech / Développeur Senior / Architecte (+5 ans)
                  </option>
                  <option value="tech_manager" className="text-slate-900 dark:text-white font-normal py-1">
                    Manager Tech / Product Owner / Chef de Projet Digital
                  </option>
                </optgroup>

                <optgroup label="Indépendants & Entrepreneuriat" className="font-bold text-amber-600 dark:text-amber-400 bg-slate-100 dark:bg-[#070c1e]">
                  <option value="freelance_tech" className="text-slate-900 dark:text-white font-normal py-1">
                    Freelance / Consultant indépendant Tech & IA
                  </option>
                  <option value="fondateur_startup" className="text-slate-900 dark:text-white font-normal py-1">
                    Fondateur / Porteur de projet Startup ou Agence Digitale
                  </option>
                </optgroup>

                <optgroup label="Passionnés & Autodidactes" className="font-bold text-purple-600 dark:text-purple-400 bg-slate-100 dark:bg-[#070c1e]">
                  <option value="autodidacte" className="text-slate-900 dark:text-white font-normal py-1">
                    Autodidacte passionné (auto-formation continue, open-source)
                  </option>
                  <option value="curieux_ia" className="text-slate-900 dark:text-white font-normal py-1">
                    Curieux et explorateur d'outils d'Intelligence Artificielle
                  </option>
                </optgroup>
              </select>

              {/* Bloc descriptif dynamique de la situation sélectionnée */}
              {currentSituationInfo && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 animate-in fade-in">
                  <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {currentSituationInfo.label}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {currentSituationInfo.desc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4 : Photo de profil (Upload galerie + Avatars géométriques) */}
          <div>
            <div className="mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span>Photo de profil</span>
              </h3>
            </div>

            {/* Input fichier caché pour upload galerie */}
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Bouton d'upload galerie proéminent */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3.5 rounded-2xl border-2 border-dashed border-cyan-500/40 hover:border-cyan-500 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 group-hover:bg-cyan-500 text-cyan-500 group-hover:text-white flex items-center justify-center transition-colors">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                    Importer une photo depuis votre galerie / appareil
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sélectionnez un cliché personnel (JPG, PNG, WEBP). Recadrage automatique carré.
                  </p>
                </div>
              </button>
            </div>

            {/* Rangée des Avatars géométriques et Initiale */}
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2.5">
                Ou choisissez un avatar géométrique :
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Initiale */}
                <button
                  type="button"
                  onClick={() => setSelectedAvatar('')}
                  title="Initiale de votre prénom"
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                    !selectedAvatar 
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-500 scale-105 shadow-md ring-2 ring-cyan-500/30' 
                      : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:scale-105'
                  }`}
                >
                  {firstName.charAt(0) || user.name.charAt(0) || 'U'}
                </button>

                {/* Si une photo personnalisée a été importée, afficher le badge de sélection active */}
                {isCustomUploaded && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {}}
                      title="Photo personnalisée importée depuis votre galerie"
                      className="w-12 h-12 rounded-2xl border-2 border-cyan-500 ring-2 ring-cyan-500/40 overflow-hidden scale-105 shadow-md cursor-pointer"
                    >
                      <img 
                        src={selectedAvatar} 
                        alt="Photo importée" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedAvatar('')}
                      title="Supprimer la photo importée"
                      className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-500 text-white shadow hover:bg-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Avatars Vectoriels */}
                {VECTOR_AVATARS.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.url)}
                      title={`Avatar ${avatar.name}`}
                      className={`w-12 h-12 rounded-2xl border-2 overflow-hidden transition-all cursor-pointer relative ${
                        isSelected 
                          ? 'border-cyan-500 ring-2 ring-cyan-500/40 scale-105 shadow-md' 
                          : 'border-transparent opacity-85 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img 
                        src={avatar.url} 
                        alt={avatar.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-cyan-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions & Boutons */}
          <div className="pt-4 border-t dark:border-white/10 border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>Données chiffrées · Conformité APDP Bénin</span>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-center flex items-center justify-center min-h-[44px] sm:min-h-0"
              >
                Fermer
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-center min-h-[44px] sm:min-h-0"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer mon profil'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
