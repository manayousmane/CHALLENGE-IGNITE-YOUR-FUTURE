import React from 'react';
import { HeroOrb3D } from '../3d/HeroOrb3D';
import { Sparkles, ArrowRight, Waypoints, ShieldCheck, MapPin, Zap } from 'lucide-react';

interface HeroSectionProps {
  onStartChat: () => void;
  onExploreCareers: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartChat,
  onExploreCareers
}) => {
  return (
    <section id="hero" className="relative pt-10 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
      {/* Background ambient lighting in deep midnight navy */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          <div className="px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold dark:text-cyan-300 text-cyan-800 bg-cyan-50 dark:bg-white/[0.04] border border-cyan-200 dark:border-cyan-500/30 shadow-xs dark:shadow-cyan-950/40">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Moteur d'Orientation Professionnelle par IA</span>
          </div>

          <div className="px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-xs hidden sm:flex font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            <span>Afrique de l'Ouest & International Remote</span>
          </div>
        </div>

        {/* Main Grid: Content + 3D Holographic Globe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle & CTAs (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.08]">
              Propulsez votre avenir avec une{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-500">
                roadmap de carrière
              </span>{' '}
              taillée par l'IA.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Ne laissez plus votre orientation au hasard. Évaluez vos compétences, découvrez les métiers tech les plus rémunérateurs au Bénin et en télétravail international, et suivez un plan d'action concret pas à pas.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={onStartChat}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all active:scale-95 flex items-center justify-center gap-2 group cursor-pointer min-h-[48px] text-center"
              >
                <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform shrink-0" />
                <span>Lancer mon diagnostic IA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <button
                onClick={onExploreCareers}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:text-cyan-600 dark:hover:text-white hover:border-cyan-400/40 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[48px] text-center"
              >
                <Waypoints className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0" />
                <span>Explorer les Métiers</span>
              </button>
            </div>

            {/* Trust Signals & Highlights */}
            <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Roadmap sur-mesure</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-display">Métiers</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Fiches & salaires réels</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display">FCFA & €/$</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Bénin & Remote Monde</p>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Holographic Career Sphere (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroOrb3D />
          </div>

        </div>

      </div>
    </section>
  );
};
