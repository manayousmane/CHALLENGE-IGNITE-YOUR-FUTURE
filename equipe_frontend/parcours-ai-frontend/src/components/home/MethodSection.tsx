import React from 'react';
import { Sparkles, BrainCircuit, Target, Rocket, Award, CheckCircle } from 'lucide-react';
import { TiltCard3D } from '../3d/TiltCard3D';

export const MethodSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Diagnostic Conversationnel IA",
      desc: "Notre modèle dialogue avec vous pour cerner vos aptitudes naturelles, vos centres d'intérêt, votre bagage académique et vos contraintes de temps.",
      icon: BrainCircuit,
      color: "from-cyan-500 to-blue-500"
    },
    {
      num: "02",
      title: "Matrice d'Adéquation & Matching",
      desc: "L'algorithme croise votre profil avec le référentiel des métiers en tension au Bénin, en Afrique de l'Ouest et sur les marchés de télétravail international.",
      icon: Target,
      color: "from-blue-500 to-indigo-500"
    },
    {
      num: "03",
      title: "Génération de Roadmap Sur-Mesure",
      desc: "Une feuille de route personnalisée découpée en 4 phases claires, avec cours gratuits/certifiants sélectionnés, projets réels et jalons d'évaluation.",
      icon: Rocket,
      color: "from-indigo-500 to-teal-500"
    },
    {
      num: "04",
      title: "Portfolio d'Élite & Recrutement",
      desc: "Vous construisez 3 projets concrets déployés, optimisez votre profil LinkedIn/GitHub et postulez aux opportunités locales ou aux contrats en devises.",
      icon: Award,
      color: "from-teal-500 to-emerald-500"
    }
  ];

  return (
    <section id="method" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Ambient background light */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full dark:glass-ios-pill bg-cyan-50 dark:bg-white/[0.06] text-xs font-semibold dark:text-cyan-300 text-cyan-800 mb-4 border border-cyan-200 dark:border-cyan-500/30 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>La Méthodologie</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          Comment fonctionne <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-500">Parcours AI</span> ?
        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          Un accompagnement scientifique et méthodique qui transforme vos ambitions en compétences concrètes et recherchées par les entreprises.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <TiltCard3D key={step.num} className="p-6 sm:p-7 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-black text-cyan-500/40 dark:text-cyan-400/40">
                    {step.num}
                  </span>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${step.color} p-[1px] shadow-lg`}>
                    <div className="w-full h-full bg-white dark:bg-[#080d22] rounded-[11px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-300" />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.08] flex items-center gap-2 text-xs text-cyan-700 dark:text-cyan-300 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Objectif garanti</span>
              </div>
            </TiltCard3D>
          );
        })}
      </div>
    </section>
  );
};
