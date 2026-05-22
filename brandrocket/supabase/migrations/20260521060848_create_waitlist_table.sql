-- Create waitlists table
CREATE TABLE IF NOT EXISTS public.waitlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, invited, joined
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.waitlists ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can join the waitlist)
CREATE POLICY "Enable insert for anonymous users" ON public.waitlists
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Only authenticated users (admins) can view waitlists
CREATE POLICY "Enable read for authenticated users" ON public.waitlists
    FOR SELECT
    TO authenticated
    USING (true);
