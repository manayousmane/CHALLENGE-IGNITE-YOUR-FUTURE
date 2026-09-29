import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'reset';
  reasonMessage?: string;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  reasonMessage,
  onSuccess
}) => {
  const { loginWithEmail, signupWithEmail, requestPhoneOtp, loginWithPhone, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(initialMode);

  // Le composant reste monté même quand isOpen=false (voir `if (!isOpen)
  // return null` plus bas), donc le state `mode` ne se réinitialise pas
  // tout seul quand App.tsx change `initialMode` après coup — notamment
  // pour ouvrir directement en mode "reset" au retour du lien de
  // réinitialisation de mot de passe envoyé par email.
  useEffect(() => {
    if (isOpen) setMode(initialMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMode]);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+229'); // Bénin par défaut
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Status & errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const validatePhone = (p: string, cc: string) => {
    const cleanP = p.replace(/\s+/g, ''); // enlever les espaces pour la vérification
    if (!/^\d+$/.test(cleanP)) return "Le numéro ne doit contenir que des chiffres.";
    
    if (cc === '+229') {
      if (!cleanP.startsWith('01')) return "Les numéros du Bénin doivent obligatoirement commencer par 01.";
      if (cleanP.length !== 10) return "Les numéros du Bénin doivent comporter exactement 10 chiffres.";
    } else {
      if (cleanP.length < 8) return "Le numéro doit comporter au moins 8 chiffres.";
    }
    return null;
  };

  const validateEmailFormat = (val: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(val.trim())) return "L'adresse email n'est pas au format valide.";
    return null;
  };

  const validatePasswordStrength = (val: string) => {
    if (val.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
    if (!/[A-Z]/.test(val)) return "Le mot de passe doit contenir au moins une majuscule.";
    if (!/[0-9]/.test(val)) return "Le mot de passe doit contenir au moins un chiffre.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) return "Le mot de passe doit contenir au moins un caractère spécial.";
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d\s]/g, '');
    setPhone(val);
    if (val.replace(/\s+/g, '').length > 0) {
      setError(validatePhone(val, countryCode));
    } else {
      setError(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (mode === 'signup' && val.length > 0) {
      setError(validateEmailFormat(val));
    } else {
      setError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (mode === 'signup' && val.length > 0) {
      setError(validatePasswordStrength(val));
      if (confirmPassword && val !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
      }
    } else {
      setError(null);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (mode === 'signup' && val.length > 0) {
      if (val !== password) setError('Les mots de passe ne correspondent pas.');
      else setError(null);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authMethod === 'email') {
        if (mode === 'signup') {
          // Validation stricte du mot de passe
          if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            setLoading(false);
            return;
          }
          if (!/[A-Z]/.test(password)) {
            setError('Le mot de passe doit contenir au moins une majuscule.');
            setLoading(false);
            return;
          }
          if (!/[0-9]/.test(password)) {
            setError('Le mot de passe doit contenir au moins un chiffre.');
            setLoading(false);
            return;
          }
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setError('Le mot de passe doit contenir au moins un caractère spécial.');
            setLoading(false);
            return;
          }
          if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
          }
          if (phone) {
             const phoneErr = validatePhone(phone, countryCode);
             if (phoneErr) {
               setError(phoneErr);
               setLoading(false);
               return;
             }
          }
        }

        if (mode === 'login') {
          const res = await loginWithEmail(email, password);
          if (!res.success) {
            setError(res.error || 'Identifiants invalides');
            setLoading(false);
            return;
          }
        } else if (mode === 'forgot') {
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
          });
          if (resetError) {
            setError(resetError.message);
          } else {
            setSuccessNotice('Un lien de réinitialisation a été envoyé à ton adresse email. Clique dessus pour choisir un nouveau mot de passe.');
          }
          setLoading(false);
          return;
        } else if (mode === 'reset') {
          if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
          }
          if (password.length < 8) {
            setError('Le mot de passe est trop court.');
            setLoading(false);
            return;
          }
          // La session de récupération a déjà été établie automatiquement
          // par Supabase au clic sur le lien reçu par email (voir l'écoute
          // de l'événement PASSWORD_RECOVERY dans App.tsx) — il suffit de
          // définir le nouveau mot de passe sur cette session.
          const { error: updateError } = await supabase.auth.updateUser({ password });
          if (updateError) {
            setError(updateError.message || 'Lien invalide ou expiré.');
          } else {
            setSuccessNotice('Mot de passe réinitialisé. Vous pouvez vous connecter.');
            setTimeout(() => {
               setMode('login');
               setSuccessNotice(null);
               setPassword('');
               setConfirmPassword('');
            }, 2500);
          }
          setLoading(false);
          return;
        } else {
          const finalName = fullName.trim() || `${firstName.trim()} ${lastName.trim()}`.trim();
          if (!finalName) {
            setError('Veuillez renseigner votre prénom et votre nom.');
            setLoading(false);
            return;
          }
          const phoneToSend = phone.trim() ? `${countryCode} ${phone.trim()}` : undefined;
          const res = await signupWithEmail(finalName, email, password, phoneToSend, firstName.trim(), lastName.trim());
          if (!res.success) {
            setError(res.error || 'Erreur lors de la création du compte');
            setLoading(false);
            return;
          }
          if (res.needsEmailConfirmation) {
            setSuccessNotice('Compte créé ! Vérifie ta boîte mail et clique sur le lien de confirmation pour activer ton compte.');
            setLoading(false);
            return;
          }
        }
      } else {
        // Phone method (SMS ou WhatsApp, géré nativement par Supabase Auth)
        if (!otpSent) {
          // Étape 1 : demande d'envoi du code
          const phoneErr = validatePhone(phone, countryCode);
          if (phoneErr) {
            setError(phoneErr);
            setLoading(false);
            return;
          }
          const fullPhone = `${countryCode}${phone.trim()}`;
          const res = await requestPhoneOtp(fullPhone, 'whatsapp');
          if (!res.success) {
            setError(res.error || "Échec de l'envoi du code. Réessaie ou utilise l'email.");
            setLoading(false);
            return;
          }
          setOtpSent(true);
          setSuccessNotice(`Code de vérification envoyé au ${countryCode} ${phone}`);
          setLoading(false);
          return;
        }

        const fullPhone = `${countryCode}${phone.trim()}`;
        const res = await loginWithPhone(fullPhone, otpCode);
        if (!res.success) {
          setError(res.error || 'Code de confirmation invalide');
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue');
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      setLoading(false);
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || 'Erreur lors de la connexion Google');
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la connexion Google');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#080d22] border border-slate-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 my-auto text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2.5 sm:p-1.5 rounded-xl sm:rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Orientation IA Personnalisée</span>
          </div>

          <h3 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            {mode === 'signup' && 'Créez votre compte gratuit'}
            {mode === 'login' && 'Bon retour sur Parcours AI'}
            {mode === 'forgot' && 'Mot de passe oublié'}
            {mode === 'reset' && 'Nouveau mot de passe'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
            {reasonMessage || (mode === 'signup' 
              ? 'Rejoignez plus de 2 400 étudiants & professionnels au Bénin et débloquez votre feuille de route de carrière complète.' 
              : mode === 'login'
              ? 'Accédez à vos bilans d\'orientation, vos roadmaps et poursuivez vos discussions avec l\'IA.'
              : mode === 'forgot'
              ? 'Entrez votre adresse email pour recevoir un lien de réinitialisation sécurisé.'
              : 'Définissez un nouveau mot de passe fort pour protéger votre compte.')
            }
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`py-2.5 sm:py-2 rounded-xl transition-all cursor-pointer min-h-[42px] sm:min-h-0 flex items-center justify-center text-center ${
                mode === 'signup' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Créer un compte
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`py-2.5 sm:py-2 rounded-xl transition-all cursor-pointer min-h-[42px] sm:min-h-0 flex items-center justify-center text-center ${
                mode === 'login' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Se connecter
            </button>
          </div>
        )}

        {/* Google One-Click CTA (High Conversion) */}
        {(mode === 'login' || mode === 'signup') && (
          <>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-3.5 sm:py-3 px-4 rounded-xl bg-slate-100 dark:bg-white hover:bg-slate-200 dark:hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm mb-4 border border-slate-200 dark:border-transparent cursor-pointer min-h-[48px] sm:min-h-0 text-center"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuer en 1 clic avec Google</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 dark:border-white/10 w-full" />
              <span className="bg-white dark:bg-[#080d22] px-3 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono shrink-0">
                ou avec vos coordonnées
              </span>
              <div className="border-t border-slate-200 dark:border-white/10 w-full" />
            </div>

            {/* Method Switch: Email vs Téléphone */}
            <div className="flex items-center justify-center gap-4 mb-4 text-xs">
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setError(null); }}
                className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
                  authMethod === 'email' 
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-300 font-semibold' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMethod('phone'); setError(null); }}
                className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
                  authMethod === 'phone' 
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-300 font-semibold' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Numéro de téléphone</span>
              </button>
            </div>
          </>
        )}

        {/* Error / Notice message */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && authMethod === 'email' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Prénom</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setFullName(`${e.target.value} ${lastName}`.trim());
                      }}
                      placeholder="Ex: Narcisse"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setFullName(`${firstName} ${e.target.value}`.trim());
                      }}
                      placeholder="Ex: AVLESSI"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Numéro de téléphone <span className="text-[10px] text-slate-400 font-normal">(optionnel)</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-28 py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-[#091024] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="+229">+229 (Bénin)</option>
                    <option value="+228">+228 (Togo)</option>
                    <option value="+225">+225 (CI)</option>
                    <option value="+221">+221 (Sénégal)</option>
                    <option value="+237">+237 (Cameroun)</option>
                    <option value="+33">+33 (France)</option>
                    <option value="+1">+1 (USA)</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder={countryCode === '+229' ? "01 XX XX XX XX" : "XX XX XX XX"}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {authMethod === 'email' ? (
            <>
              {(mode === 'signup' || mode === 'login' || mode === 'forgot') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Adresse Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="votre.email@exemple.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              {(mode === 'signup' || mode === 'login' || mode === 'reset') && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Mot de passe</label>
                    {mode === 'login' && (
                      <button 
                        type="button" 
                        onClick={() => { setMode('forgot'); setError(null); setSuccessNotice(null); }}
                        className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder={mode === 'signup' || mode === 'reset' ? "8 caractères, majuscule, chiffre..." : "Votre mot de passe"}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {(mode === 'signup' || mode === 'reset') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Répétez le mot de passe"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            // Phone / WhatsApp Form
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Numéro Mobile (Bénin & International)</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      if (phone) {
                        const err = validatePhone(phone, e.target.value);
                        setError(err);
                      }
                    }}
                    className="w-28 py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-[#091024] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="+229">+229 (Bénin)</option>
                    <option value="+228">+228 (Togo)</option>
                    <option value="+225">+225 (CI)</option>
                    <option value="+221">+221 (Sénégal)</option>
                    <option value="+237">+237 (Cameroun)</option>
                    <option value="+33">+33 (France)</option>
                    <option value="+1">+1 (USA)</option>
                  </select>

                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder={countryCode === '+229' ? "01 XX XX XX XX" : "XX XX XX XX"}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none transition-colors ${
                        error && error.includes('numéro') ? 'border-red-400 dark:border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-white/10 focus:border-cyan-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Code de confirmation (4 chiffres)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-cyan-500/40 text-slate-900 dark:text-white text-center tracking-widest text-base font-mono focus:outline-none"
                  />
                  <p className="text-[10px] text-cyan-600 dark:text-cyan-300 mt-1 font-medium">Code pré-rempli pour test immédiat : 1234</p>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/30 active:scale-95 flex items-center justify-center gap-2 mt-4 cursor-pointer min-h-[48px] sm:min-h-0 text-center"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {authMethod === 'phone' && !otpSent
                    ? 'Recevoir le code SMS / WhatsApp'
                    : mode === 'signup'
                    ? 'Débloquer mon orientation gratuite'
                    : mode === 'forgot'
                    ? 'Recevoir le lien'
                    : mode === 'reset'
                    ? 'Mettre à jour le mot de passe'
                    : 'Accéder à mon espace'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          
          {(mode === 'forgot' || mode === 'reset') && (
            <div className="mt-4 text-center">
              <button 
                type="button" 
                onClick={() => { setMode('login'); setError(null); setSuccessNotice(null); }}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </form>

        {/* Value Reassurance */}
        <div className="pt-5 mt-5 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>100% Gratuit & Sans engagement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0" />
            <span>Données protégées (APDP Bénin)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
