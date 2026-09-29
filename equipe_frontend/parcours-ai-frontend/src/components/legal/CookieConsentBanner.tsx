import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import { getCookie, setCookie } from '../../utils/cookies';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si le consentement a déjà été enregistré via cookie ou localStorage
    const consent = getCookie('parcours_cookies_consent') || localStorage.getItem('parcours_cookies_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookie('parcours_cookies_consent', 'accepted', { days: 365, path: '/' });
    localStorage.setItem('parcours_cookies_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setCookie('parcours_cookies_consent', 'essential_only', { days: 365, path: '/' });
    localStorage.setItem('parcours_cookies_consent', 'essential_only');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-5 inset-x-0 z-50 flex items-center justify-center px-4 pointer-events-none">
          <motion.aside
            initial={{ y: 24, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Consentement aux cookies"
            className="pointer-events-auto w-full max-w-xl p-3 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-900/15 dark:shadow-black/70 text-slate-800 dark:text-slate-200"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2.5 w-full sm:w-auto sm:flex-1">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Cookie className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Cookies essentiels pour vos préférences et la sauvegarde de votre orientation.
                </p>
              </div>

              <div className="flex items-center justify-end gap-1.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                <button
                  onClick={handleDecline}
                  className="px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Refuser
                </button>

                <button
                  onClick={handleAccept}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  Accepter
                </button>

                <button
                  onClick={handleDecline}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md transition-colors cursor-pointer ml-1"
                  aria-label="Fermer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
