-- 005_intelligence_system.sql
-- Phase 8: Growth Intelligence & Cross-Agent System

-- ---------------------------------------------------------------------------
-- GROWTH SCORES (Campaign scoring system)
-- ---------------------------------------------------------------------------
create table public.growth_scores (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  entity_type text not null,
  entity_id text not null,
  overall_score float,
  growth_score float,
  risk_score float,
  opportunity_score float,
  execution_score float,
  factors jsonb default '{}'::jsonb,
  calculated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, entity_type, entity_id)
);

alter table public.growth_scores enable row level security;

create index idx_growth_scores_team on public.growth_scores(team_id);

create policy "Team members can view growth scores."
  on growth_scores for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = growth_scores.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- AI RECOMMENDATIONS FEED
-- ---------------------------------------------------------------------------
create table public.ai_recommendations (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  type text not null,
  priority text default 'medium',
  title text not null,
  description text,
  context jsonb default '{}'::jsonb,
  action_url text,
  dismissed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone
);

alter table public.ai_recommendations enable row level security;

create index idx_recommendations_team_priority on public.ai_recommendations(team_id, priority, created_at desc);

create policy "Team members can view recommendations."
  on ai_recommendations for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_recommendations.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can manage recommendations."
  on ai_recommendations for all
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_recommendations.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- ACTIVITY TIMELINE
-- ---------------------------------------------------------------------------
create table public.activity_timeline (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  actor_type text not null,
  actor_name text not null,
  action_type text not null,
  entity_type text,
  entity_id text,
  description text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.activity_timeline enable row level security;

create index idx_activity_team_created on public.activity_timeline(team_id, created_at desc);

create policy "Team members can view activity."
  on activity_timeline for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = activity_timeline.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- AGENT TASKS (Cross-agent collaboration)
-- ---------------------------------------------------------------------------
create table public.agent_tasks (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  from_agent text not null,
  to_agent text not null,
  task_type text not null,
  description text not null,
  context jsonb default '{}'::jsonb,
  status text default 'pending' not null,
  result jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table public.agent_tasks enable row level security;

create index idx_agent_tasks_status on public.agent_tasks(status);

create policy "Team members can view agent tasks."
  on agent_tasks for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = agent_tasks.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- OPPORTUNITY SCORING
-- ---------------------------------------------------------------------------
create table public.opportunities (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  opportunity_type text not null,
  title text not null,
  description text,
  impact_score float,
  effort_score float,
  roi_estimate float,
  status text default 'identified' not null,
  source text,
  context jsonb default '{}'::jsonb,
  identified_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone
);

alter table public.opportunities enable row level security;

create index idx_opportunities_team_score on public.growth_scores(team_id, overall_score desc);

create policy "Team members can view opportunities."
  on opportunities for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = opportunities.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- BRAND MEMORY ENHANCED (Tone, voice, style)
-- ---------------------------------------------------------------------------
alter table public.brand_voices add column if not exists audience_persona jsonb;
alter table public.brand_voices add column if not exists successful_patterns jsonb default '[]'::jsonb;
alter table public.brand_voices add column if not exists content_history jsonb default '[]'::jsonb;

-- Add interaction patterns to ai_memory
alter table public.ai_memory add column if not exists embedding vector(1536);
alter table public.ai_memory add column if not exists interaction_count integer default 1;

-- ---------------------------------------------------------------------------
-- FUNCTIONS
-- ---------------------------------------------------------------------------

-- Log activity to timeline
create or replace function public.log_activity(
  p_team_id uuid,
  p_actor_type text,
  p_actor_name text,
  p_action_type text,
  p_entity_type text,
  p_entity_id text,
  p_description text,
  p_metadata jsonb default '{}'::jsonb
)
returns void as $$
begin
  insert into public.activity_timeline (team_id, actor_type, actor_name, action_type, entity_type, entity_id, description, metadata)
  values (p_team_id, p_actor_type, p_actor_name, p_action_type, p_entity_type, p_entity_id, p_description, p_metadata);
end;
$$ language plpgsql security definer;

-- Calculate growth score
create or replace function public.calculate_growth_score(
  p_team_id uuid,
  p_entity_type text,
  p_entity_id text
)
returns void as $$
declare
  v_growth_score float;
  v_risk_score float;
  v_opportunity_score float;
  v_execution_score float;
  v_overall float;
begin
  -- Simplified scoring algorithm (in production, use ML model)
  v_growth_score := 70 + (random() * 30)::float;
  v_risk_score := (random() * 40)::float;
  v_opportunity_score := 50 + (random() * 50)::float;
  v_execution_score := 60 + (random() * 40)::float;
  v_overall := (v_growth_score * 0.3 + (100 - v_risk_score) * 0.2 + v_opportunity_score * 0.3 + v_execution_score * 0.2);

  insert into public.growth_scores (team_id, entity_type, entity_id, overall_score, growth_score, risk_score, opportunity_score, execution_score, factors)
  values (p_team_id, p_entity_type, p_entity_id, v_overall, v_growth_score, v_risk_score, v_opportunity_score, v_execution_score, '{}'::jsonb)
  on conflict (team_id, entity_type, entity_id)
  do update set 
    overall_score = v_overall,
    growth_score = v_growth_score,
    risk_score = v_risk_score,
    opportunity_score = v_opportunity_score,
    execution_score = v_execution_score,
    calculated_at = now();
end;
$$ language plpgsql security definer;

-- Generate AI recommendation
create or replace function public.create_recommendation(
  p_team_id uuid,
  p_type text,
  p_priority text,
  p_title text,
  p_description text,
  p_context jsonb default '{}'::jsonb,
  p_action_url text
)
returns void as $$
begin
  insert into public.ai_recommendations (team_id, type, priority, title, description, context, action_url)
  values (p_team_id, p_type, p_priority, p_title, p_description, p_context, p_action_url);
end;
$$ language plpgsql security definer;