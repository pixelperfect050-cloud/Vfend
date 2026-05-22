-- 003_ai_workflows.sql
-- Phase 6: AI Workflow Engine and Agents

-- ---------------------------------------------------------------------------
-- AI WORKFLOWS
-- ---------------------------------------------------------------------------
create table public.ai_workflows (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  name text not null,
  description text,
  trigger_config jsonb not null default '{}'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  is_active boolean default true,
  execution_count integer default 0,
  last_executed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_workflows enable row level security;

create policy "Team members can view workflows."
  on ai_workflows for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_workflows.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can create workflows."
  on ai_workflows for insert
  with check (
    exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_workflows.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Workflow creators can update."
  on ai_workflows for update
  using ( created_by = auth.uid() );

create policy "Workflow creators can delete."
  on ai_workflows for delete
  using ( created_by = auth.uid() );

-- ---------------------------------------------------------------------------
-- WORKFLOW EXECUTIONS
-- ---------------------------------------------------------------------------
create table public.workflow_executions (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references public.ai_workflows(id) on delete cascade,
  trigger_data jsonb default '{}'::jsonb,
  status text default 'running' not null,
  steps jsonb default '[]'::jsonb,
  result jsonb,
  error_message text,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table public.workflow_executions enable row level security;

create index idx_workflow_executions_workflow on public.workflow_executions(workflow_id);
create index idx_workflow_executions_status on public.workflow_executions(status);

create policy "Team members can view execution logs."
  on workflow_executions for select
  using (
    exists (
      select 1 from public.ai_workflows w
      where w.id = workflow_executions.workflow_id
      and w.team_id is not null
      and exists (
        select 1 from public.team_members tm
        where tm.team_id = w.team_id
        and tm.user_id = auth.uid()
      )
    )
  );

-- ---------------------------------------------------------------------------
-- AI AGENTS
-- ---------------------------------------------------------------------------
create table public.ai_agents (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  name text not null,
  agent_type text not null,
  description text,
  system_prompt text,
  tools jsonb default '[]'::jsonb,
  is_active boolean default true,
  config jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_agents enable row level security;

create policy "Team members can view agents."
  on ai_agents for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_agents.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can create agents."
  on ai_agents for insert
  with check (
    exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_agents.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Agent creators can update."
  on ai_agents for update
  using ( created_by = auth.uid() );

create policy "Agent creators can delete."
  on ai_agents for delete
  using ( created_by = auth.uid() );

-- ---------------------------------------------------------------------------
-- COMPETITOR TRACKING
-- ---------------------------------------------------------------------------
create table public.competitors (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  name text not null,
  website text not null,
  industry text,
  tracking_enabled boolean default true,
  last_analyzed_at timestamp with time zone,
  analysis_data jsonb default '{}'::jsonb,
  alerts jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.competitors enable row level security;

create policy "Team members can view competitors."
  on competitors for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = competitors.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can add competitors."
  on competitors for insert
  with check (
    exists (
      select 1 from public.team_members tm
      where tm.team_id = competitors.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can update competitors."
  on competitors for update
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = competitors.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can delete competitors."
  on competitors for delete
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = competitors.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- CAMPAIGN ORCHESTRATIONS
-- ---------------------------------------------------------------------------
create table public.campaign_orchestrations (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  name text not null,
  goal text not null,
  campaign_type text not null,
  status text default 'draft' not null,
  steps jsonb not null default '[]'::jsonb,
  current_step integer default 0,
  context jsonb default '{}'::jsonb,
  result jsonb,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.campaign_orchestrations enable row level security;

create index idx_orchestrations_status on public.campaign_orchestrations(status);

create policy "Team members can view orchestrations."
  on campaign_orchestrations for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = campaign_orchestrations.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can create orchestrations."
  on campaign_orchestrations for insert
  with check (
    exists (
      select 1 from public.team_members tm
      where tm.team_id = campaign_orchestrations.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Orchestration creators can update."
  on campaign_orchestrations for update
  using ( created_by = auth.uid() );

-- ---------------------------------------------------------------------------
-- AI CREATIVES (Generated assets)
-- ---------------------------------------------------------------------------
create table public.ai_creatives (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  name text not null,
  creative_type text not null,
  prompt text,
  variants jsonb default '[]'::jsonb,
  selected_variant integer,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_creatives enable row level security;

create policy "Team members can view creatives."
  on ai_creatives for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_creatives.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can create creatives."
  on ai_creatives for insert
  with check (
    exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_creatives.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- GROWTH METRICS (Daily analytics snapshot)
-- ---------------------------------------------------------------------------
create table public.growth_metrics (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  date date not null,
  metrics jsonb not null default '{}'::jsonb,
  ai_insights jsonb default '[]'::jsonb,
  recommendations jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, date)
);

alter table public.growth_metrics enable row level security;

create index idx_growth_metrics_team_date on public.growth_metrics(team_id, date desc);

create policy "Team members can view growth metrics."
  on growth_metrics for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = growth_metrics.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- ANALYTICS CACHE (For fast dashboard loading)
-- ---------------------------------------------------------------------------
create table public.analytics_cache (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  cache_key text not null,
  data jsonb not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, cache_key)
);

alter table public.analytics_cache enable row level security;

create index idx_analytics_cache_expires on public.analytics_cache(expires_at);

create policy "Team members can view cache."
  on analytics_cache for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = analytics_cache.team_id
      and tm.user_id = auth.uid()
    )
  );

-- Trigger to auto-delete expired cache
create or replace function public.clean_expired_cache()
returns void as $$
begin
  delete from public.analytics_cache where expires_at < now();
end;
$$ language plpgsql security definer;