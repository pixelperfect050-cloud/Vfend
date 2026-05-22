-- Create workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alter profiles table to add new columns (since 001_initial_schema created it)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;

-- Backfill user_id from id for existing records
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;

-- Enable RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for workspaces
DROP POLICY IF EXISTS "Users can view their own workspaces" ON public.workspaces;
CREATE POLICY "Users can view their own workspaces"
  ON public.workspaces
  FOR SELECT
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert their own workspaces" ON public.workspaces;
CREATE POLICY "Users can insert their own workspaces"
  ON public.workspaces
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update their own workspaces" ON public.workspaces;
CREATE POLICY "Users can update their own workspaces"
  ON public.workspaces
  FOR UPDATE
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete their own workspaces" ON public.workspaces;
CREATE POLICY "Users can delete their own workspaces"
  ON public.workspaces
  FOR DELETE
  USING (auth.uid() = owner_id);

-- Policies for profiles
-- (Note: 001_initial_schema already has some policies, but we ensure these are present or updated)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
