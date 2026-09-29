import React, { useState } from 'react';
import { TEAM_MEMBERS } from '../../data/teamData';
import { TiltCard3D } from '../3d/TiltCard3D';
import { 
  Sparkles, 
  Linkedin, 
  Github, 
  Globe,
  Award, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  BrainCircuit,
  Workflow,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/* 
  Composant TeamSection :
  Affiche la grille de l'équipe fondatrice avec un système de filtrage par pôle 
  (Web & Logiciel ou IA & Données) et un affichage détaillé des réalisations.
*/
export const TeamSection: React.FC = () => {
  /* État pour filtrer les membres selon leur pôle d'expertise */
  const [selectedPole, setSelectedPole] = useState<'all' | 'web' | 'ai'>('all');
  /* État pour gérer l'ouverture ou la fermeture des détails d'un membre spécifique */
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  /* Filtrage intelligent des membres de l'équipe */
  const filteredMembers = TEAM_MEMBERS.filter((member) => {
    if (selectedPole === 'web') return member.pole.includes('Web');
    if (selectedPole === 'ai') return member.pole.includes('Intelligence');
    return true;
  });

  /* Fonction pour basculer l'affichage des détails d'un membre */
  const toggleExpand = (name: string) => {
    setExpandedMember(expandedMember === name ? null : name);
  };

  return (
    <section id="team" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Éclairage d'ambiance lumineux en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* En-tête de la section Équipe */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full dark:glass-ios-pill bg-cyan-50 dark:bg-white/[0.06] text-xs font-semibold dark:text-cyan-300 text-cyan-800 mb-4 border border-cyan-200 dark:border-cyan-500/30 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>L'Équipe & Rôles Clés</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          Les esprits derrière <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-500">Parcours AI</span>
        </h2>
        
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          Une synergie d'expertises complémentaires réparties entre le <strong>Pôle Web & Logiciel</strong> et le <strong>Pôle IA, Données & Algorithmique</strong>.
        </p>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setSelectedPole('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedPole === 'all'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            Tous les membres (5)
          </button>
          <button
            onClick={() => setSelectedPole('web')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedPole === 'web'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Pôle Web & Logiciel (3)</span>
          </button>
          <button
            onClick={() => setSelectedPole('ai')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedPole === 'ai'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Pôle IA & Données (2)</span>
          </button>
        </div>
      </div>

      {/* Team Cards Grid (Ordered: 1. Narcisse, 2. Vertueux, 3. Aïmane, 4. Ramziat, 5. Yousra) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredMembers.map((member, idx) => {
          const originalIndex = TEAM_MEMBERS.findIndex((m) => m.name === member.name) + 1;
          const isExpanded = expandedMember === member.name;
          const isWeb = member.pole.includes('Web');

          return (
            <TiltCard3D
              key={member.name}
              className="p-6 sm:p-7 flex flex-col justify-between h-full relative group transition-all duration-300"
            >
              <div>
                {/* Header: Number Badge & Pole Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs flex items-center justify-center shadow-xs">
                      {originalIndex}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        isWeb
                          ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                      }`}
                    >
                      {isWeb ? 'Pôle Web & Logiciel' : 'Pôle IA & Données'}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    #{originalIndex}/5
                  </span>
                </div>

                {/* Avatar & Identité */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${member.gradient} p-0.5 shadow-md shrink-0`}>
                    <div className="w-full h-full bg-slate-900 dark:bg-[#010208] rounded-[14px] flex items-center justify-center">
                      <span className="font-display font-extrabold text-lg text-white tracking-tight">
                        {member.initials}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display tracking-tight leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5 leading-snug">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Bio synthétique */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-4">
                  {member.bio}
                </p>

                {/* Bloc Rôle & Responsabilités */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 mb-4 text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
                    <Workflow className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Rôle & Responsabilités :</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {member.responsibilities}
                  </p>
                </div>

                {/* Section Dépliante : Tâches Techniques & Rôles Transverses */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-sky-500" />
                        <span>Réalisations techniques clés :</span>
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {member.technicalTasks.slice(0, isExpanded ? undefined : 2).map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isExpanded && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 mt-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Rôles transverses & Pitch :</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        {member.transversalRoles.map((trole, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5">
                            <ArrowRight className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{trole}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bouton pour afficher plus/moins */}
                  <button
                    onClick={() => toggleExpand(member.name)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/60 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Masquer les détails transverses' : 'Voir toutes les réalisations & rôles'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Skills Tags & Footer */}
              <div className="mt-2 pt-4 border-t border-slate-200 dark:border-white/[0.08]">
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/[0.06] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                    <Award className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                    <span>Cotonou · Bénin</span>
                  </span>
                  
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {member.portfolio ? (
                      <a
                        href={member.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer"
                        aria-label={`Portfolio personnel de ${member.name}`}
                        title={`Consulter le portfolio de ${member.name}`}
                      >
                        <Globe className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      </a>
                    ) : (
                      <span
                        className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40"
                        aria-label="Portfolio en cours de configuration"
                        title="Portfolio bientôt disponible"
                      >
                        <Globe className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      </span>
                    )}
                    <a
                      href={member.linkedin || "https://linkedin.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-[#0a66c2] dark:hover:text-[#0a66c2] transition-colors cursor-pointer"
                      aria-label={`LinkedIn de ${member.name}`}
                      title={`LinkedIn de ${member.name}`}
                    >
                      <Linkedin className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </a>
                    <a
                      href={member.github || "https://github.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      aria-label={`GitHub de ${member.name}`}
                      title={`GitHub de ${member.name}`}
                    >
                      <Github className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </TiltCard3D>
          );
        })}
      </div>

      {/* Recap Banner */}
      <div className="mt-14 p-6 sm:p-8 rounded-2xl dark:glass-ios bg-slate-900 dark:bg-[#01020c] text-white border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Synergie & Vision d'Équipe
            </span>
            <p className="mt-1.5 text-base sm:text-lg font-medium text-slate-100 italic font-display">
              « Lier l'excellence du développement web aux capacités des modèles d'IA pour offrir à chaque jeune d'Afrique et d'ailleurs une trajectoire d'avenir claire et concrète. »
            </p>
            <p className="mt-2 text-xs text-slate-400">
              5 spécialistes · 2 pôles clés (Web & IA) · 100% engagés pour l'orientation et l'employabilité.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex -space-x-2">
              {TEAM_MEMBERS.map((m) => (
                <div
                  key={m.name}
                  className={`w-9 h-9 rounded-full bg-gradient-to-tr ${m.gradient} p-0.5 border-2 border-slate-900`}
                  title={m.name}
                >
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    {m.initials}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
