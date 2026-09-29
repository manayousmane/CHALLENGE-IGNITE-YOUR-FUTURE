import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ_DATA } from '../../data/faqData';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full dark:glass-ios-pill bg-cyan-50 dark:bg-white/[0.06] text-xs font-semibold dark:text-cyan-300 text-cyan-800 mb-4 border border-cyan-200 dark:border-cyan-500/30 shadow-xs">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Questions Fréquentes</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          Tout ce que vous devez savoir
        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          Des réponses claires à vos interrogations sur la plateforme, l'algorithme d'orientation et les perspectives professionnelles.
        </p>
      </div>

      {/* Accordion Container */}
      <div className="space-y-4">
        {FAQ_DATA.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="glass-ios-card rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(item.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors focus:outline-none cursor-pointer group"
                aria-expanded={isOpen}
              >
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white font-display group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {item.question}
                </h3>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                  className="p-1 rounded-md text-slate-400 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 shrink-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="faq-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: 'auto', 
                      opacity: 1,
                      transition: {
                        height: { duration: 0.32, ease: [0.25, 1, 0.5, 1] },
                        opacity: { duration: 0.25, delay: 0.05 }
                      }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: {
                        height: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
                        opacity: { duration: 0.15 }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/70 dark:border-white/[0.05]">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Direct Contact Prompt */}
      <div className="mt-12 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Vous avez une question spécifique ou un projet de partenariat ?{' '}
          <a
            href="mailto:contact@parcoursai.bj"
            className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-semibold underline underline-offset-4"
          >
            Écrivez à notre équipe à contact@parcoursai.bj
          </a>
        </p>
      </div>
    </section>
  );
};
