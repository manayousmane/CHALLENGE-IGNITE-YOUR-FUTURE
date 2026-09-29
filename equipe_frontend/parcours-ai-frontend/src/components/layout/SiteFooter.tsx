import React, { useState } from 'react';
import { 
  Waypoints, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube, 
  ArrowUpRight, 
  Mail, 
  MapPin, 
  ChevronDown, 
  Phone, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { LegalTab } from '../legal/LegalModal';

interface SiteFooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenLegal?: (tab: LegalTab) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onNavigate,
  onOpenLegal
}) => {
  const [maskPos, setMaskPos] = useState({ x: 50, y: 50 });
  const [isHoveringWatermark, setIsHoveringWatermark] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleWatermarkMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMaskPos({ x, y });
  };

  return (
    <footer className="relative w-full overflow-hidden bg-slate-900 dark:bg-[#010103] text-slate-300 dark:text-slate-300 border-t border-slate-200 dark:border-white/[0.08] font-display transition-colors duration-300">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-40 bg-cyan-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-40 bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-16 sm:pt-20 lg:pt-24 pb-8 relative z-10">
        
        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-10">
          
          {/* Column 1: Brand & Location */}
          <div className="space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#050814] rounded-[11px] flex items-center justify-center">
                  <Waypoints className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
                </div>
              </div>
              <span className="font-display font-semibold tracking-tight text-[24px] sm:text-[26px] text-white">
                Parcours<span className="text-cyan-400">AI</span>
              </span>
            </button>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Plateforme d'intelligence d'orientation professionnelle, de cartographie des compétences et de feuilles de route pour propulser les talents d'Afrique et du monde.
            </p>

            <div className="pt-2 space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Cotonou, République du Bénin</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href="mailto:contact@parcoursai.bj"
                  title="Écrire à l'équipe Parcours AI"
                  className="text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  contact@parcoursai.bj
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/2290152352309?text=Bonjour%20Parcours%20AI%2C%20j%27aimerais%20des%20informations%20sur%20la%20plateforme."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-medium text-xs flex items-center gap-1"
                >
                  <span>WhatsApp : +229 01 52 35 23 09</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Services / Parcours */}
          <div>
            <p className="mb-5 text-[15px] font-semibold text-white tracking-wide flex items-center gap-2">
              <span>Services & Parcours</span>
            </p>
            <ul className="space-y-3.5 text-[15px]">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span>Mon Dashboard & Activité</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('chat-advisor')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span>Diagnostic IA sur-mesure</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('metiers')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span>Fiches Métiers d'avenir</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('chat-advisor')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span>Générateur de Roadmaps Tech</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Méthode */}
          <div>
            <p className="mb-5 text-[15px] font-semibold text-white tracking-wide">
              Méthode & Vision
            </p>
            <ul className="space-y-3.5 text-[15px]">
              <li>
                <button
                  onClick={() => onNavigate('method')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left cursor-pointer"
                >
                  Comment ça marche
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('method')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left cursor-pointer"
                >
                  Algorithme d'adéquation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('metiers')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left cursor-pointer"
                >
                  Marché Bénin & Remote Monde
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal ? onOpenLegal('apdp') : onNavigate('faq')}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors text-left font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Protection des données (APDP)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Maison & Équipe */}
          <div>
            <p className="mb-5 text-[15px] font-semibold text-white tracking-wide">
              Maison & Écosystème
            </p>
            <ul className="space-y-3.5 text-[15px]">
              <li>
                <button
                  onClick={() => onNavigate('team')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left cursor-pointer"
                >
                  L'Équipe Fondatrice
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left cursor-pointer"
                >
                  Foire aux questions (FAQ)
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/2290152352309?text=Bonjour%20Parcours%20AI%2C%20je%20souhaite%20discuter%20d%27un%20partenariat."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left flex items-center gap-1"
                >
                  <span>Contact partenariats</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Installation Guide / PWA Instruction Cards */}
        <div className="mt-14 pt-10 border-t border-white/[0.08]">
          <button 
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer"
          >
            <div className="flex-1">
              <h3 className="text-base font-bold text-white tracking-tight flex items-start gap-2.5 group-hover:text-cyan-400 transition-colors">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0 mt-1.5" />
                <span className="leading-tight">Installer Parcours AI sur tous vos appareils</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 pl-[18px]">
                Profitez d'une expérience fluide en mode application native, même hors-ligne.
              </p>
            </div>
            <div className={`shrink-0 p-2 rounded-full bg-white/[0.03] border border-white/[0.08] transition-transform duration-300 ${isGuideOpen ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </button>

          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden transition-all duration-500 ease-in-out ${isGuideOpen ? 'mt-6 opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'}`}
          >
            
            {/* iOS Guide */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-[11px] font-bold">iPhone / iPad (iOS)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Appuyez sur l'icône <strong className="text-white">Partager</strong> en bas de votre navigateur Safari, puis sélectionnez <strong className="text-cyan-400">"Sur l'écran d'accueil"</strong>.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.05] text-[11px] text-slate-400 font-mono">
                Safari &gt; Partager &gt; Sur l'écran d'accueil
              </div>
            </div>

            {/* Android Guide */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">Android (Chrome / Mobile)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Appuyez sur le menu <strong className="text-white">trois points (⋮)</strong> en haut à droite de Chrome, puis appuyez sur <strong className="text-cyan-400">"Installer l'application"</strong> ou "Ajouter à l'écran d'accueil".
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.05] text-[11px] text-slate-400 font-mono">
                Menu (⋮) &gt; Installer l'application
              </div>
            </div>

            {/* PC / Desktop Guide */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[11px] font-bold">Ordinateur (PC / Mac)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cliquez sur l'icône <strong className="text-white">d'installation (ordinateur avec flèche)</strong> dans la barre d'adresse de votre navigateur Chrome ou Edge.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.05] text-[11px] text-slate-400 font-mono">
                Barre d'adresse &gt; Icône d'installation &gt; Installer
              </div>
            </div>

          </div>
        </div>

        {/* Divider & Sub-footer avec liens juridiques et conformité réels */}
        <div className="mt-16 flex flex-col gap-6 border-t border-white/[0.08] pt-6 text-[13px] text-slate-400 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-slate-400 font-medium inline-flex items-center gap-2">
              <span>© 2026 ParcoursAI</span>
              <span className="text-slate-500 select-none text-xs">•</span>
              <span>Tous droits réservés</span>
            </span>
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('apdp') : onNavigate('faq')} 
              className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer font-medium"
            >
              Conformité APDP Bénin
            </button>
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('mentions') : onNavigate('faq')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Mentions légales
            </button>
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('privacy') : onNavigate('faq')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Politique de confidentialité
            </button>
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('cgu') : onNavigate('faq')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Conditions Générales (CGU)
            </button>
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('sitemap') : onNavigate('home')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Sitemap
            </button>
          </div>

          {/* Social and direct contact icons */}
          <ul className="flex items-center gap-4">
            <li>
              <a
                href="https://wa.me/2290152352309?text=Bonjour%20Parcours%20AI%2C%20je%20vous%20contacte%20depuis%20le%20site%20web."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp Direct (+229 01 52 35 23 09)"
                className="block text-emerald-400 hover:text-emerald-300 transition-colors p-1"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="block text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="block text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="block text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="block text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </li>
          </ul>
        </div>

        {/* Giant Watermark without enclosing rounded rectangle: interactive coloring active strictly on desktop (disabled on mobile) */}
        <div 
          className="mt-14 sm:mt-20 select-none relative w-full overflow-hidden py-6 sm:py-10 md:cursor-crosshair cursor-default group flex flex-col items-center justify-center"
          onMouseMove={(e) => {
            if (typeof window !== 'undefined' && window.innerWidth >= 768) {
              handleWatermarkMouseMove(e);
            }
          }}
          onMouseEnter={() => {
            if (typeof window !== 'undefined' && window.innerWidth >= 768) {
              setIsHoveringWatermark(true);
            }
          }}
          onMouseLeave={() => setIsHoveringWatermark(false)}
          onTouchStart={() => setIsHoveringWatermark(false)}
        >
          {/* Base watermark text layer (always clean and visible in muted refined tones) */}
          <div 
            className="w-full text-center font-black text-[clamp(2.5rem,12vw,10.5rem)] leading-none tracking-tighter text-transparent bg-clip-text dark:bg-gradient-to-b dark:from-white/15 dark:via-white/5 dark:to-transparent bg-gradient-to-b from-slate-900/20 via-slate-900/5 to-transparent uppercase font-display select-none transition-all duration-300"
            style={{
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.12)',
            }}
          >
            PARCOURS AI
          </div>

          {/* Illuminated Dynamic Coloring layer: Strictly HIDDEN on mobile (hidden md:flex), visible ONLY on desktop while cursor is hovering */}
          <div 
            className="hidden md:flex absolute inset-0 items-center justify-center text-center font-black text-[clamp(2.5rem,12vw,10.5rem)] leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 uppercase font-display select-none pointer-events-none transition-opacity duration-500 ease-out"
            style={{
              opacity: isHoveringWatermark ? 1 : 0,
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)',
              WebkitMaskImage: `radial-gradient(circle 360px at ${maskPos.x}% ${maskPos.y}%, black 0%, black 35%, transparent 75%)`,
              maskImage: `radial-gradient(circle 360px at ${maskPos.x}% ${maskPos.y}%, black 0%, black 35%, transparent 75%)`,
              filter: 'drop-shadow(0 0 35px rgba(56, 189, 248, 0.6))'
            }}
          >
            PARCOURS AI
          </div>

          {/* Subtitle tag beneath the watermark */}
          <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-widest uppercase font-mono text-slate-400/80 whitespace-nowrap">
            <span className="w-6 sm:w-8 h-[1px] bg-cyan-400/30" />
            <span>Plateforme Numérique Nationale</span>
            <span className="w-6 sm:w-8 h-[1px] bg-cyan-400/30" />
          </div>
        </div>

      </div>
    </footer>
  );
};
