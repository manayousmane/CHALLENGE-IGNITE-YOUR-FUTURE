-- ============================================================
-- PARCOURS-AI : Schéma PostgreSQL pour Supabase
-- Exécutez ce script dans : Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    phone TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des tableaux de bord utilisateurs
CREATE TABLE IF NOT EXISTS public.user_dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    readiness_score INT DEFAULT 75,
    target_specialty TEXT DEFAULT 'Orientation en cours',
    diagnostics_data JSONB DEFAULT '[]'::jsonb,
    skills_data JSONB DEFAULT '[]'::jsonb,
    saved_formations_data JSONB DEFAULT '[]'::jsonb,
    notes TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des feedbacks
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table des métiers de référence
CREATE TABLE IF NOT EXISTS public.metiers (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    secteur TEXT,
    description TEXT,
    competences_requises JSONB DEFAULT '[]'::jsonb,
    series_bac_recommandees JSONB DEFAULT '[]'::jsonb,
    debouches_locaux JSONB DEFAULT '[]'::jsonb
);

-- 5. Table des établissements
CREATE TABLE IF NOT EXISTS public.etablissements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    ville TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'Public',
    site_web TEXT
);

-- 6. Table des formations
CREATE TABLE IF NOT EXISTS public.formations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etablissement_id UUID REFERENCES public.etablissements(id) ON DELETE CASCADE,
    metier_id TEXT REFERENCES public.metiers(id) ON DELETE CASCADE,
    frais_annuels_fcfa INT,
    duree_ans INT,
    niveau_requis TEXT
);

-- Activer les permissions de lecture pour le public (anon) et les connectés (authenticated)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etablissements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;

-- Politiques RLS permissives pour la démo
CREATE POLICY "Lecture publique metiers" ON public.metiers FOR SELECT USING (true);
CREATE POLICY "Lecture publique etablissements" ON public.etablissements FOR SELECT USING (true);
CREATE POLICY "Lecture publique formations" ON public.formations FOR SELECT USING (true);
CREATE POLICY "Utilisateurs gèrent leur dashboard" ON public.user_dashboards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Utilisateurs gèrent leur profil" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Tout le monde peut envoyer un feedback" ON public.feedbacks FOR INSERT WITH CHECK (true);

-- Permissions explicites
GRANT SELECT ON public.metiers TO anon, authenticated;
GRANT SELECT ON public.etablissements TO anon, authenticated;
GRANT SELECT ON public.formations TO anon, authenticated;
GRANT ALL ON public.feedbacks TO anon, authenticated;
