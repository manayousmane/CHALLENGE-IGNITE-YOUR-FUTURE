import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUid: user?.id || null,
          rating,
          comment
        })
      });

      if (res.ok) {
        setSubmitted(true);
        // On notifie le parent pour sauvegarder dans le localStorage
        onSubmit(rating, comment);
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur soumission feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white dark:bg-[#0b1329] p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 text-center max-w-sm w-full animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <Star className="w-8 h-8 fill-current" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-display">Merci beaucoup !</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">Votre avis nous aide énormément à améliorer Parcours AI.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0b1329] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md animate-in zoom-in-95 duration-300 overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">Votre avis compte</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Vous utilisez Parcours AI depuis quelques minutes. Comment évaluez-vous votre expérience jusqu'à présent ?
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-2 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      (hoverRating || rating) >= star 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'fill-slate-100 dark:fill-white/5 text-slate-300 dark:text-white/20'
                    }`} 
                  />
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label htmlFor="comment" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Dites-nous en plus (optionnel)
              </label>
              <textarea
                id="comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Qu'est-ce qui vous plaît ? Que pourrions-nous améliorer ?"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070d1e] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Envoyer mon avis'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
