import React, { useState } from 'react';
import { Career } from '../../types';
import { generateCareerRoadmapPDF } from '../../utils/pdfGenerator';
import { 
  X, 
  Printer, 
  Share2, 
  Waypoints, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  BookOpen, 
  FolderGit2, 
  Award,
  Sparkles,
  Download,
  Check
} from 'lucide-react';

interface InteractiveRoadmapModalProps {
  career: Career;
  onClose: () => void;
}

export const InteractiveRoadmapModal: React.FC<InteractiveRoadmapModalProps> = ({
  career,
  onClose
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportSuccess, setIsExportSuccess] = useState(false);

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const phases = career.roadmap.map((step, idx) => ({
        step: idx + 1,
        title: `${step.phase} : ${step.title}`,
        duration: step.duration,
        description: step.description,
        skills: step.skillsAcquired,
        milestone: step.milestoneCheck
      }));

      await generateCareerRoadmapPDF({
        career,
        roadmapPhases: phases
      });
      setIsExportSuccess(true);
      setTimeout(() => setIsExportSuccess(false), 2500);
    } catch (e) {
      console.error('Erreur export PDF', e);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Roadmap Parcours AI : ${career.title}`,
        text: `Découvrez la feuille de route complète pour devenir ${career.title} sur Parcours AI !`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien de la roadmap copié dans le presse-papiers !');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#02050f]/80 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/20 flex flex-col shadow-2xl bg-white dark:bg-[#080d22]/95 text-slate-900 dark:text-slate-100">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-[#060a1c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-white dark:bg-[#050814] rounded-[11px] flex items-center justify-center">
                <Waypoints className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                  {career.categoryLabel}
                </span>
                {career.matchScore && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{career.matchScore}% Match</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display">
                {career.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="p-2 sm:px-3 sm:py-2.5 rounded-xl bg-cyan-50 dark:glass-ios-pill border border-cyan-200 dark:border-white/10 text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-white hover:border-cyan-400/60 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer min-h-[40px] min-w-[40px]"
              title="Télécharger la feuille de route au format PDF officiel"
            >
              {isExportSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">PDF Téléchargé</span>
                </>
              ) : (
                <>
                  <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                  <span className="hidden sm:inline">{isExporting ? 'Génération...' : 'Télécharger PDF'}</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:glass-ios-pill border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400/40 transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Imprimer la page"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:glass-ios-pill border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400/40 transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:glass-ios-pill border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 bg-slate-50/50 dark:bg-transparent">
          
          {/* Overview Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:glass-ios border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              {career.fullDescription}
            </p>

            {/* Compensation & Market Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  <span>Rémunération Bénin & UEMOA :</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {career.salaryLocal}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Profil débutant à confirmé selon la structure (Fintech, Banque, Agence)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <TrendingUp className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span>Télétravail International (Remote) :</span>
                </div>
                <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300 font-display">
                  {career.salaryRemote}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Contrats internationaux, plateformes de freelance ou scale-ups européennes/US
                </p>
              </div>
            </div>

            {/* Prerequisites & Tools */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Prérequis conseillés :</span>
                <span>{career.prerequisites}</span>
              </div>
            </div>
          </div>

          {/* Timeline Phases Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                <span>Feuille de route pas à pas</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                4 phases progressives conçues pour vous amener du niveau débutant à l'insertion professionnelle
              </p>
            </div>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-indigo-600/20">
            {career.roadmap.map((step, idx) => (
              <div key={step.id} className="relative flex items-start gap-4 sm:gap-6 pl-2">
                
                {/* Step Circle Number */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shrink-0 z-10 shadow-lg shadow-cyan-500/20">
                  <div className="w-full h-full bg-white dark:bg-[#080d22] rounded-[10px] flex items-center justify-center font-bold text-xs sm:text-sm text-cyan-700 dark:text-cyan-300">
                    {idx + 1}
                  </div>
                </div>

                {/* Step Card Content */}
                <div className="flex-1 p-5 sm:p-6 rounded-2xl bg-white dark:glass-ios border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/[0.06] pb-3">
                    <div>
                      <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                        {step.phase}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display mt-0.5">
                        {step.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] shrink-0 font-medium">
                      <Clock className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                      <span>{step.duration}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>

                  {/* Skills tags */}
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">
                      Compétences acquises :
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.skillsAcquired.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] inline-flex items-center gap-1.5"
                        >
                          <Check className="w-3 h-3 text-cyan-500 shrink-0" />
                          <span>{s}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended courses */}
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                      <span>Ressources & Formations recommandées :</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.recommendedCourses.map((course) => (
                        <div
                          key={course.name}
                          className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{course.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{course.platform}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            course.type === 'Gratuit' 
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20' 
                              : 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20'
                          }`}>
                            {course.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practical Project to build */}
                  <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/25 border border-cyan-200 dark:border-cyan-500/30 flex items-start gap-3">
                    <FolderGit2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-cyan-800 dark:text-cyan-300">
                        Projet concret à réaliser pour votre portfolio :
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 font-normal">
                        {step.practicalProject}
                      </p>
                    </div>
                  </div>

                  {/* Milestone Validation */}
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1 font-normal">
                    <Award className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-slate-900 dark:text-white font-semibold">Validation du palier :</strong> {step.milestoneCheck}
                    </span>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:px-6 sm:py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060a1c] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Vous pouvez imprimer ou exporter cette feuille de route à tout moment.
          </p>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
            <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl bg-white dark:glass-ios-pill border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer shadow-xs text-center flex items-center justify-center min-h-[44px] sm:min-h-0"
              >
                Fermer
              </button>
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:glass-ios-pill border border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs text-center min-h-[44px] sm:min-h-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/25 cursor-pointer text-center min-h-[44px] sm:min-h-0"
            >
              <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'Création du PDF...' : 'Télécharger le PDF Officiel'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
