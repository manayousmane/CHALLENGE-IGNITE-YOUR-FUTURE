import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Scale, 
  Map, 
  ExternalLink, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin,
  Building, 
  AlertCircle,
  HelpCircle,
  Compass,
  ArrowRight
} from 'lucide-react';

export type LegalTab = 'apdp' | 'mentions' | 'privacy' | 'cgu' | 'sitemap';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  onNavigateToPage?: (page: string) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'apdp',
  onNavigateToPage
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Fermer sur touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs: { id: LegalTab; label: string; icon: any }[] = [
    { id: 'apdp', label: 'Conformité APDP Bénin', icon: ShieldCheck },
    { id: 'mentions', label: 'Mentions Légales', icon: Building },
    { id: 'privacy', label: 'Politique de Confidentialité', icon: Lock },
    { id: 'cgu', label: 'Conditions Générales (CGU)', icon: Scale },
    { id: 'sitemap', label: 'Plan du Site (Sitemap)', icon: Map },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl dark:bg-[#070b18] bg-white border dark:border-white/10 border-slate-200 shadow-2xl overflow-hidden"
      >
        {/* En-tête */}
        <div className="p-4 sm:p-6 border-b dark:border-white/10 border-slate-200 flex items-center justify-between gap-4 dark:bg-[#040712] bg-slate-50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full rounded-[14px] dark:bg-[#070b18] bg-white flex items-center justify-center text-cyan-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="min-w-0">
              <h2 id="legal-modal-title" className="text-base sm:text-lg font-bold dark:text-white text-slate-900 truncate font-display">
                Espace Juridique & Conformité Réglementaire
              </h2>
              <p className="text-xs dark:text-slate-400 text-slate-500 truncate">
                Loi N° 2017-20 portant Code du Numérique en République du Bénin · APDP
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 sm:p-2 rounded-xl dark:bg-white/5 bg-slate-200/70 hover:bg-slate-300 dark:hover:bg-white/10 dark:text-slate-400 text-slate-600 transition-colors cursor-pointer shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre d'onglets défilante */}
        <div className="flex items-center gap-1.5 px-3 sm:px-6 py-2.5 border-b dark:border-white/10 border-slate-200 dark:bg-black/20 bg-slate-100/60 overflow-x-auto scrollbar-none shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-3.5 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer min-h-[40px] ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25'
                    : 'dark:text-slate-300 text-slate-600 dark:hover:bg-white/5 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenu textuel avec défilement */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          
          {/* =========================================================================
              1. APDP BÉNIN (Protection des Données Personnelles)
             ========================================================================= */}
          {activeTab === 'apdp' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Badge officiel de déclaration */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5 w-full sm:w-auto">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <ShieldCheck className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2">
                      <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 inline-block leading-relaxed">
                        Conformité Nationale Béninoise
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold dark:text-white text-slate-900 font-display leading-snug">
                      Déclaration auprès de l'APDP (Autorité de Protection des Données Personnelles)
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
                      Récépissé de conformité N° : <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300">APDP-BJ/2026/DEC-0142</span>
                    </p>
                  </div>
                </div>

                <a
                  href="https://apdp.bj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition-colors flex items-center justify-center gap-2 shrink-0 text-center shadow-xs cursor-pointer min-h-[44px] sm:min-h-0"
                >
                  <span>Portail APDP Bénin</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              {/* Cadre Légal Fondamental */}
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-500" />
                  <span>1. Cadre Juridique Applicable</span>
                </h4>
                <p>
                  La plateforme <strong>Parcours AI</strong> s'engage à respecter scrupuleusement les dispositions de la{' '}
                  <strong className="text-slate-900 dark:text-white">Loi N° 2017-20 du 20 avril 2018 portant Code du Numérique en République du Bénin</strong>, 
                  notamment en son <em>Livre V (Articles 378 à 474)</em> relatif à la protection des données à caractère personnel, ainsi que les directives réglementaires édictées par l'<strong>Autorité de Protection des Données Personnelles (APDP)</strong>.
                </p>
              </div>

              {/* Responsable de Traitement & DPO */}
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-cyan-500" />
                  <span>2. Responsable de Traitement & Délégué à la Protection des Données (DPO)</span>
                </h4>
                <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-100 border dark:border-white/5 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Responsable de Traitement</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">Parcours AI Bénin</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Siège social : Cotonou, République du Bénin</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Contact : contact@parcoursai.bj</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Délégué aux Données (DPO)</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">Cabinet DPO & Conformité Tech</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Email dédié : dpo@parcoursai.bj</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Assistance directe : +229 01 52 35 23 09</p>
                  </div>
                </div>
              </div>

              {/* Finalités Légitimes */}
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                  <span>3. Finalités Légitimes et Proportions de la Collecte</span>
                </h4>
                <p>
                  Les traitements opérés sur Parcours AI répondent à des finalités déterminées, explicites et légitimes :
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
                  <li><strong>Diagnostic d'orientation personnalisé :</strong> Analyse automatisée par intelligence artificielle des aptitudes, notes et aspirations de l'apprenant.</li>
                  <li><strong>Recommandation de filières d'avenir :</strong> Rapprochement algorithmique avec le référentiel des métiers technologiques en Afrique et à l'international.</li>
                  <li><strong>Génération de Feuilles de Route (Roadmaps) :</strong> Fourniture de parcours d'apprentissage séquentiels, ressources et repères salariaux.</li>
                  <li><strong>Gestion de l'Espace Membre :</strong> Sauvegarde sécurisée de la progression sur Cloud SQL et tableau de bord multi-écrans.</li>
                </ul>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Principe de non-commercialisation : Vos données personnelles ne sont JAMAIS vendues, louées ni cédées à des tiers publicitaires.</span>
                </p>
              </div>

              {/* Droits des Personnes Concernées (Code du Numérique) */}
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-cyan-500" />
                  <span>4. Vos Droits Fondamentaux Garantis par le Code du Numérique</span>
                </h4>
                <p>
                  Conformément aux Articles 393 et suivants du Code du Numérique béninois, chaque utilisateur bénéficie des droits inaliénables suivants :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border dark:border-white/5 border-slate-200 dark:bg-white/[0.02] bg-slate-50">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Droit d'accès (Art. 394)</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Obtenir communication intégrale de toutes les données personnelles enregistrées vous concernant.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border dark:border-white/5 border-slate-200 dark:bg-white/[0.02] bg-slate-50">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Droit de rectification (Art. 396)</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Mettre à jour directement vos coordonnées, nom, téléphone et filière dans « Mon Profil ».
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border dark:border-white/5 border-slate-200 dark:bg-white/[0.02] bg-slate-50">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Droit à l'effacement / Oubli (Art. 397)</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Exiger la suppression immédiate et définitive de votre compte et de l'historique d'échange IA.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border dark:border-white/5 border-slate-200 dark:bg-white/[0.02] bg-slate-50">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Droit d'opposition & Portabilité</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Refuser tout traitement optionnel et exporter votre bilan au format structuré (PDF/JSON).
                    </p>
                  </div>
                </div>
              </div>

              {/* Saisie de l'APDP Bénin */}
              <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Voies de Recours auprès de l'APDP Bénin</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Si vous estimez après nous avoir contacté à <strong>dpo@parcoursai.bj</strong> que vos droits ne sont pas respectés, vous pouvez introduire une réclamation formelle auprès de l'<strong>Autorité de Protection des Données Personnelles du Bénin</strong> :
                </p>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 space-y-1.5 font-mono">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Adresse : Boulevard Saint-Michel, Rue 4.072 Ouando, Cotonou - Bénin</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Téléphone : (+229) 21 32 57 88 / 21 32 57 89</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Email : contact@apdp.bj · Site Web : www.apdp.bj</span>
                  </p>
                </div>
              </div>

              {/* Sécurité des Traitements IA */}
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-500" />
                  <span>5. Chiffrement et Confidentialité des Modèles IA</span>
                </h4>
                <p>
                  Toutes les communications vers nos serveurs sont protégées par le protocole <strong>HTTPS / TLS 1.3</strong>. Les requêtes traitées par nos modèles d'IA générative sont exécutées dans un bac à sable (sandbox) isolé côté serveur, sans persistance d'empreinte personnelle chez les prestataires d'IA et sans réentraînement de modèles tiers sur vos données privées.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              2. MENTIONS LÉGALES
             ========================================================================= */}
          {activeTab === 'mentions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold dark:text-white text-slate-900 font-display">
                  Mentions Légales & Édition du Service
                </h3>
                <p>
                  Conformément aux dispositions de l'Article 256 de la Loi N° 2017-20 portant Code du Numérique en République du Bénin, les mentions légales régissant l'accès et l'utilisation de la plateforme Parcours AI sont portées à la connaissance des usagers :
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-100 border dark:border-white/10 border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-500">Éditeur du Site</h4>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Parcours AI Bénin</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Initiative d'orientation technologique propulsée pour l'Afrique et les talents internationaux.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400"><strong>Siège social :</strong> Cotonou, Département du Littoral, Bénin</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400"><strong>Directeur de publication :</strong> Narcisse AVLESSI</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400"><strong>Email :</strong> contact@parcoursai.bj</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400"><strong>Assistance WhatsApp :</strong> +229 01 52 35 23 09</p>
                </div>

                <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-100 border dark:border-white/10 border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-500">Hébergement & Infrastructure Cloud</h4>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Google Cloud Platform (GCP)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Services Cloud Run & PostgreSQL géré (Cloud SQL).</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400"><strong>Région d'hébergement :</strong> europe-west2 (Normes strictes de sécurité et de conformité).</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400"><strong>Certifications d'infrastructure :</strong> ISO/IEC 27001, SOC 1/2/3, PCI-DSS.</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold dark:text-white text-slate-900">Propriété Intellectuelle</h4>
                <p>
                  L'ensemble des éléments graphiques, marques, logos, identités visuelles, bases de données, fiches métiers, algorithmes d'adéquation et feuilles de route interactives présents sur le site sont la propriété exclusive de <strong>Parcours AI</strong> ou font l'objet d'une autorisation d'exploitation. Toute reproduction, diffusion, modification ou extraction sans autorisation écrite préalable est rigoureusement prohibée.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              3. POLITIQUE DE CONFIDENTIALITÉ & COOKIES
             ========================================================================= */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold dark:text-white text-slate-900 font-display">
                  Politique de Confidentialité et Gestion des Témoins (Cookies)
                </h3>
                <p>
                  La présente politique explique de quelle façon Parcours AI recueille, utilise, protège et conserve vos données personnelles lorsque vous naviguez sur notre plateforme web et mobile progressive (PWA).
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold dark:text-white text-slate-900">Données collectées lors de l'utilisation</h4>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li><strong>Données de compte :</strong> Nom, prénom, adresse email, numéro de téléphone WhatsApp (facultatif ou indicatif béninois +229), avatar sélectionné ou importé.</li>
                  <li><strong>Données d'orientation :</strong> Réponses fournies au conseiller IA, notes académiques soumises pour qualification de profil, intérêts technologiques sélectionnés.</li>
                  <li><strong>Données de progression :</strong> Fiches métiers consultées, roadmaps épinglées et jalons validés dans le dashboard.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold dark:text-white text-slate-900">Politique relative aux Cookies</h4>
                <p>
                  Parcours AI utilise exclusivement des cookies fonctionnels et techniques essentiels :
                </p>
                <div className="p-3.5 rounded-xl dark:bg-white/[0.03] bg-slate-100 border dark:border-white/10 border-slate-200 space-y-2 text-xs">
                  <p>• <strong>parcours_auth_token :</strong> Maintien sécurisé de votre session de connexion.</p>
                  <p>• <strong>parcours_theme_preference :</strong> Sauvegarde de votre préférence d'affichage (mode sombre / mode clair).</p>
                  <p>• <strong>parcours_cookies_consent :</strong> Enregistrement de votre choix d'acceptation du bandeau conforme APDP.</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aucun cookie tiers intrusif à visée publicitaire n'est déposé sur votre terminal.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold dark:text-white text-slate-900">Durée de Conservation</h4>
                <p>
                  Vos données de profil sont conservées pendant toute la durée d'activité de votre compte. En cas d'inactivité prolongée de 24 mois sans connexion, une notification vous est adressée avant purge définitive ou anonymisation statistique irréversible.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              4. CONDITIONS GÉNÉRALES D'UTILISATION (CGU)
             ========================================================================= */}
          {activeTab === 'cgu' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold dark:text-white text-slate-900 font-display">
                  Conditions Générales d'Utilisation (CGU)
                </h3>
                <p>
                  En accédant au service <strong>Parcours AI</strong>, l'utilisateur accepte sans réserve les présentes Conditions Générales d'Utilisation, régies par le droit de la République du Bénin.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold dark:text-white text-slate-900">Article 1 : Description du Service</h4>
                <p>
                  Parcours AI est un outil numérique gratuit d'aide à la décision et d'orientation académique et professionnelle axé sur les métiers de l'informatique, de l'intelligence artificielle et du numérique. Il met à disposition un conseiller IA interactif, un catalogue de fiches métiers détaillées, des feuilles de route d'apprentissage et un tableau de bord de progression.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold dark:text-white text-slate-900">Article 2 : Nature des Recommandations de l'IA</h4>
                <p>
                  Les bilans d'adéquation, scores de compatibilité et suggestions formulés par l'intelligence artificielle constituent une aide indicative et prospective basée sur les données du marché de l'emploi (Bénin, Afrique de l'Ouest et télétravail international). Ils ne constituent en aucun cas une garantie d'embauche ni ne remplacent les décisions formelles des jurys d'admission universitaires.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold dark:text-white text-slate-900">Article 3 : Obligations de l'Utilisateur</h4>
                <p>
                  L'utilisateur s'engage à fournir des informations loyales et sincères lors de ses diagnostics et à préserver la confidentialité de ses identifiants. Il s'interdit toute utilisation détournée du service visant à surcharger, compromettre ou aspirer les contenus de la plateforme.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold dark:text-white text-slate-900">Article 4 : Règlement des Différends</h4>
                <p>
                  Les présentes conditions sont soumises à la législation béninoise. En cas de différend relatif à la validité, l'interprétation ou l'exécution des présentes, les parties privilégieront une résolution amiable. À défaut, compétence expresse est attribuée aux tribunaux compétents de <strong>Cotonou (République du Bénin)</strong>.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              5. PLAN DU SITE (SITEMAP) INTERACTIF
             ========================================================================= */}
          {activeTab === 'sitemap' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold dark:text-white text-slate-900 font-display">
                  Plan du Site & Cartographie des Modules
                </h3>
                <p>
                  Accédez instantanément à n'importe quelle section ou fonctionnalité de la plateforme en un simple clic :
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* Section Principale */}
                <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-100 border dark:border-white/5 border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-500">Navigation Principale</h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToPage?.('home');
                        }}
                        className="text-left font-medium hover:text-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 text-cyan-500" />
                        <span>Page d'Accueil & Diagnostic Express</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToPage?.('chat-advisor');
                        }}
                        className="text-left font-medium hover:text-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 text-cyan-500" />
                        <span>Conseiller IA Conversationnel</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToPage?.('dashboard');
                        }}
                        className="text-left font-medium hover:text-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 text-cyan-500" />
                        <span>Mon Tableau de Bord (Dashboard)</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToPage?.('metiers');
                        }}
                        className="text-left font-medium hover:text-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 text-cyan-500" />
                        <span>Catalogue des Fiches Métiers</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Méthode & Équipe */}
                <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-100 border dark:border-white/5 border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-500">Méthodologie & Maison</h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToPage?.('method');
                        }}
                        className="text-left font-medium hover:text-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 text-indigo-500" />
                        <span>Méthodologie & Algorithme d'Adéquation</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToPage?.('team');
                        }}
                        className="text-left font-medium hover:text-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 text-indigo-500" />
                        <span>L'Équipe Fondatrice</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToPage?.('faq');
                        }}
                        className="text-left font-medium hover:text-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 text-indigo-500" />
                        <span>Foire aux Questions (FAQ)</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Liens Juridiques & Contact */}
                <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-100 border dark:border-white/5 border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500">Conformité & Contact</h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <button
                        onClick={() => setActiveTab('apdp')}
                        className="text-left font-medium hover:text-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                        <span>Protection des Données (APDP)</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('mentions')}
                        className="text-left font-medium hover:text-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                        <span>Mentions Légales</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('privacy')}
                        className="text-left font-medium hover:text-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                        <span>Politique de Confidentialité</span>
                      </button>
                    </li>
                    <li>
                      <a
                        href="https://wa.me/2290152352309?text=Bonjour%20Parcours%20AI%2C%20je%20vous%20contacte%20depuis%20le%20plan%20du%20site."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-left font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Assistance WhatsApp (+229 01 52 35 23 09)</span>
                      </a>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Pied de page du modal */}
        <div className="p-4 border-t dark:border-white/10 border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 dark:bg-[#040712] bg-slate-50 shrink-0">
          <div className="flex items-center gap-2 text-xs dark:text-slate-400 text-slate-500 justify-center sm:justify-start">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Plateforme Numérique Conforme Bénin</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-200 dark:bg-white/10 dark:text-white text-slate-800 hover:bg-slate-300 dark:hover:bg-white/20 transition-all cursor-pointer text-center min-h-[44px] sm:min-h-0 flex items-center justify-center"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
