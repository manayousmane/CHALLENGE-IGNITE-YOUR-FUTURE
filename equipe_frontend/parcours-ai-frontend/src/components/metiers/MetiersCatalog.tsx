import React, { useState } from 'react';
import { CAREERS_DATA, CAREER_CATEGORIES } from '../../data/careersData';
import { UNIVERSITY_FORMATIONS, FORMATION_DOMAINS } from '../../data/formationsData';
import { Career, CareerCategory, UniversityFormation, FormationDomain } from '../../types';
import { TiltCard3D } from '../3d/TiltCard3D';
import { 
  Search, Waypoints, ArrowRight, ShieldCheck, MapPin, Sparkles, TrendingUp, 
  GraduationCap, BookOpen, Building2, CheckCircle2, Award, ExternalLink, X, Filter 
} from 'lucide-react';

interface MetiersCatalogProps {
  onSelectCareer: (career: Career) => void;
}

export const MetiersCatalog: React.FC<MetiersCatalogProps> = ({ onSelectCareer }) => {
  const [activeView, setActiveView] = useState<'careers' | 'formations'>('careers');
  
  // Filtres métiers
  const [selectedCategory, setSelectedCategory] = useState<CareerCategory | 'cloud' | 'fintech'>('all');
  const [careerSearchQuery, setCareerSearchQuery] = useState('');

  // Filtres filières universitaires (400+ filières)
  const [formationDomain, setFormationDomain] = useState<FormationDomain | 'all'>('all');
  const [formationDegree, setFormationDegree] = useState<string>('all');
  const [formationType, setFormationType] = useState<string>('all');
  const [formationSearch, setFormationSearch] = useState('');
  const [selectedFormation, setSelectedFormation] = useState<UniversityFormation | null>(null);

  // Filtrage Métiers
  const filteredCareers = CAREERS_DATA.filter((c) => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      c.category === selectedCategory ||
      (selectedCategory === 'cloud' && (c.title.toLowerCase().includes('cloud') || c.title.toLowerCase().includes('devops') || c.keySkills.some(s => s.toLowerCase().includes('cloud') || s.toLowerCase().includes('devops')))) ||
      (selectedCategory === 'fintech' && (c.title.toLowerCase().includes('finance') || c.title.toLowerCase().includes('fintech') || c.keySkills.some(s => s.toLowerCase().includes('finance') || s.toLowerCase().includes('fintech'))));
    const matchesSearch =
      c.title.toLowerCase().includes(careerSearchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(careerSearchQuery.toLowerCase()) ||
      c.keySkills.some((s) => s.toLowerCase().includes(careerSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtrage 400+ Filières Universitaires
  const filteredFormations = UNIVERSITY_FORMATIONS.filter((f) => {
    const matchesDomain = formationDomain === 'all' || f.domain === formationDomain;
    const matchesDegree = formationDegree === 'all' || f.degree === formationDegree;
    const matchesType = formationType === 'all' || f.type.toLowerCase().includes(formationType.toLowerCase());
    const matchesSearch =
      f.title.toLowerCase().includes(formationSearch.toLowerCase()) ||
      f.institution.toLowerCase().includes(formationSearch.toLowerCase()) ||
      f.description.toLowerCase().includes(formationSearch.toLowerCase()) ||
      f.keySubjects.some((s) => s.toLowerCase().includes(formationSearch.toLowerCase())) ||
      f.careerOutcomes.some((o) => o.toLowerCase().includes(formationSearch.toLowerCase()));
    return matchesDomain && matchesDegree && matchesType && matchesSearch;
  });

  return (
    <section id="metiers" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-cyan-600/10 dark:bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full dark:glass-ios-pill bg-cyan-50 dark:bg-white/[0.06] text-xs font-semibold dark:text-cyan-300 text-cyan-800 mb-4 border border-cyan-200 dark:border-cyan-500/30 shadow-xs">
          <Waypoints className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Référentiel Carrières & Formations Nationales</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          Explorez les métiers &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-500">
            les 400+ filières universitaires
          </span>
        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          Base complète des filières accréditées (UAC, Parakou, UNA, UNSTIM, Sèmè City, Écoles privées) et grille salariale en Afrique de l'Ouest & Remote international.
        </p>

        {/* Double Onglet Principal : Métiers vs 400+ Filières */}
        <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-white/[0.06] border border-slate-300/80 dark:border-white/10 shadow-inner">
          <button
            onClick={() => setActiveView('careers')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'careers'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Métiers d'Avenir & Feuilles de Route</span>
          </button>

          <button
            onClick={() => setActiveView('formations')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
              activeView === 'formations'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Répertoire des 400+ Filières</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
              100
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VUE 1 : MÉTIERS D'AVENIR (FEUILLES DE ROUTE & SALAIRES)
          ========================================================================= */}
      {activeView === 'careers' && (
        <div className="animate-in fade-in duration-300">
          {/* Search & Category Filter Bar */}
          <div className="space-y-4 mb-10 max-w-4xl mx-auto">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={careerSearchQuery}
                onChange={(e) => setCareerSearchQuery(e.target.value)}
                placeholder="Rechercher un métier, une compétence (ex: React, Python, Pentest, Figma, SEO)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl dark:glass-ios bg-white dark:bg-[#080d22]/80 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-sm transition-all shadow-md dark:shadow-lg"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 py-1">
              {CAREER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Career Grid with 3D Tilt Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCareers.map((career) => (
              <TiltCard3D
                key={career.id}
                onClick={() => onSelectCareer(career)}
                className="p-6 sm:p-7 flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-white/[0.05] text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-white/10">
                      {career.categoryLabel}
                    </span>

                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      <span>Demande {career.marketDemand}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    {career.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {career.shortDescription}
                  </p>

                  <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                        <span>Bénin / UEMOA :</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{career.salaryLocal}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-white/[0.05]">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                        <span>Remote International :</span>
                      </span>
                      <span className="font-bold text-cyan-700 dark:text-cyan-300">{career.salaryRemote}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-medium">
                      Compétences clés :
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {career.keySkills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.07]"
                        >
                          {skill}
                        </span>
                      ))}
                      {career.keySkills.length > 4 && (
                        <span className="text-[11px] px-1.5 py-0.5 text-slate-500 dark:text-slate-400">
                          +{career.keySkills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                    {career.roadmap.length} phases d'apprentissage
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 group-hover:translate-x-1 transition-all">
                    <span>Voir la feuille de route</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </TiltCard3D>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VUE 2 : RÉPERTOIRE DES 100 FILIÈRES UNIVERSITAIRES
          ========================================================================= */}
      {activeView === 'formations' && (
        <div className="animate-in fade-in duration-300 space-y-8">
          
          {/* Barre de Recherche & Multi-Filtres */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#070c20] border border-slate-200 dark:border-white/10 shadow-lg space-y-5 max-w-5xl mx-auto">
            {/* Champ de recherche */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
              <input
                type="text"
                value={formationSearch}
                onChange={(e) => setFormationSearch(e.target.value)}
                placeholder="Rechercher parmi les 400+ filières (ex: Génie Logiciel, Médecine, Agronomie, IFRI, EPAC, Epitech, Finance)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-sm font-medium"
              />
            </div>

            {/* Sélecteurs de Domaines & Critères */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Domaine académique
                </label>
                <select
                  value={formationDomain}
                  onChange={(e) => setFormationDomain(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                >
                  {FORMATION_DOMAINS.map((dom) => (
                    <option key={dom.id} value={dom.id} className="dark:bg-[#091129] bg-white text-slate-900 dark:text-white">
                      {dom.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Niveau / Diplôme
                </label>
                <select
                  value={formationDegree}
                  onChange={(e) => setFormationDegree(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="all" className="dark:bg-[#091129] bg-white">Tous les diplômes</option>
                  <option value="Licence" className="dark:bg-[#091129] bg-white">Licence (Bac+3)</option>
                  <option value="Master" className="dark:bg-[#091129] bg-white">Master (Bac+5)</option>
                  <option value="Ingénieur" className="dark:bg-[#091129] bg-white">Diplôme d'Ingénieur (Bac+5)</option>
                  <option value="Doctorat" className="dark:bg-[#091129] bg-white">Doctorat (Bac+6 à Bac+8)</option>
                  <option value="BTS" className="dark:bg-[#091129] bg-white">BTS (Bac+2)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Type d'établissement
                </label>
                <select
                  value={formationType}
                  onChange={(e) => setFormationType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="all" className="dark:bg-[#091129] bg-white">Tous les types</option>
                  <option value="public" className="dark:bg-[#091129] bg-white">Universités Publiques (UAC, UP, UNA, UNSTIM)</option>
                  <option value="sèmè" className="dark:bg-[#091129] bg-white">Sèmè City & Écoles d'Excellence</option>
                  <option value="privé" className="dark:bg-[#091129] bg-white">Établissements Privés Agréés</option>
                </select>
              </div>
            </div>

            {/* Statistiques en direct */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-white/10">
              <span>{filteredFormations.length} filière(s) trouvée(s) sur plus de 400 disponibles</span>
              <button
                onClick={() => {
                  setFormationSearch('');
                  setFormationDomain('all');
                  setFormationDegree('all');
                  setFormationType('all');
                }}
                className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Grille des 400+ Filières */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFormations.map((formation) => (
              <div
                key={formation.id}
                onClick={() => setSelectedFormation(formation)}
                className="p-6 rounded-3xl dark:bg-[#080e24] bg-white border dark:border-white/10 border-slate-200 shadow-md hover:shadow-xl hover:border-cyan-500/50 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20">
                      {formation.domainLabel}
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                      {formation.degree} • {formation.duration}
                    </span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {formation.title}
                  </h3>

                  {/* Établissement & Lieu */}
                  <div className="mt-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{formation.institution}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{formation.location}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {formation.description}
                  </p>

                  {/* Débouchés */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Débouchés professionnels :
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {formation.careerOutcomes.slice(0, 3).map((job, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                          {job}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer card */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formation.salaryEstimate.split('(')[0]}
                  </span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Fiche complète</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredFormations.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-white/[0.03] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-sm">
              <p className="text-slate-600 dark:text-slate-300 text-lg">Aucune filière ne correspond à vos critères de recherche.</p>
              <button
                onClick={() => {
                  setFormationSearch('');
                  setFormationDomain('all');
                  setFormationDegree('all');
                  setFormationType('all');
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-sm font-semibold hover:bg-cyan-500/25 transition-all cursor-pointer"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL DE DÉTAIL D'UNE FILIÈRE UNIVERSITAIRE (FICHE COMPLÈTE)
          ========================================================================= */}
      {selectedFormation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl dark:bg-[#0a122e] bg-white border dark:border-white/15 border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Bouton fermer */}
            <button
              onClick={() => setSelectedFormation(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Modal */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300">
                  {selectedFormation.domainLabel}
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                  {selectedFormation.degree} • {selectedFormation.duration}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  {selectedFormation.type}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
                {selectedFormation.title}
              </h2>

              <div className="mt-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>{selectedFormation.institution} ({selectedFormation.location})</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Objectif de la formation
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {selectedFormation.description}
              </p>
            </div>

            {/* Conditions d'admission & Matières */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Conditions d'accès
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {selectedFormation.entryRequirements}
                </p>
              </div>

              <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Matières & Modules clés
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFormation.keySubjects.map((subject, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Débouchés & Salaires */}
            <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/5 border-slate-200 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Débouchés & Rémunérations estimées
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedFormation.careerOutcomes.map((career, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-semibold border border-cyan-500/20">
                    {career}
                  </span>
                ))}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-2 border-t border-slate-200 dark:border-white/5">
                Fourchette salariale indicative : {selectedFormation.salaryEstimate}
              </p>
            </div>

            {/* Actions Modal */}
            <div className="flex items-center justify-between pt-2">
              {selectedFormation.websiteUrl && (
                <a
                  href={selectedFormation.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  <span>Consulter le site officiel de l'école</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setSelectedFormation(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md cursor-pointer ml-auto"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
