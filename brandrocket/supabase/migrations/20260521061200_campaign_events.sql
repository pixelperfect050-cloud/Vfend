-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Draft', -- Draft, Planning, Orchestrating, Executing, Monitoring, Optimizing, Completed
    goal TEXT,
    budget TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create campaign_events table for the real-time timeline
CREATE TABLE IF NOT EXISTS public.campaign_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    agent_id TEXT NOT NULL, -- e.g., 'seo', 'ads', 'orchestrator'
    event_type TEXT NOT NULL, -- 'status_update', 'action_completed', 'insight_found'
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_events ENABLE ROW LEVEL SECURITY;

-- Policies for campaigns
CREATE POLICY "Users can view their own campaigns" ON public.campaigns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaigns" ON public.campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" ON public.campaigns
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for campaign_events
CREATE POLICY "Users can view events for their campaigns" ON public.campaign_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE campaigns.id = campaign_events.campaign_id 
            AND campaigns.user_id = auth.uid()
        )
    );

-- Trigger for updated_at on campaigns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaigns_modtime
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Enable replication for realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
