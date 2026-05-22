-- 004_integrations_and_memory.sql
-- Phase 7: Real Integrations & AI Memory System

-- ---------------------------------------------------------------------------
-- API INTEGRATIONS (Meta, Google, LinkedIn, etc.)
-- ---------------------------------------------------------------------------
create table public.integrations (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  provider text not null,
  access_token text,
  refresh_token text,
  token_expires_at timestamp with time zone,
  account_id text,
  account_name text,
  is_active boolean default true,
  last_synced_at timestamp with time zone,
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, provider)
);

alter table public.integrations enable row level security;

create policy "Team members can view integrations."
  on integrations for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = integrations.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can manage integrations."
  on integrations for all
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = integrations.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- AD ACCOUNTS (From integrated platforms)
-- ---------------------------------------------------------------------------
create table public.ad_accounts (
  id uuid default uuid_generate_v4() primary key,
  integration_id uuid references public.integrations(id) on delete cascade,
  platform_account_id text not null,
  name text not null,
  currency text,
  timezone text,
  stats jsonb default '{}'::jsonb,
  last_fetched_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ad_accounts enable row level security;

create policy "Team members can view ad accounts."
  on ad_accounts for select
  using (
    exists (
      select 1 from public.integrations i
      where i.id = ad_accounts.integration_id
      and i.team_id is not null
      and exists (
        select 1 from public.team_members tm
        where tm.team_id = i.team_id
        and tm.user_id = auth.uid()
      )
    )
  );

-- ---------------------------------------------------------------------------
-- AI MEMORY (Context retention for agents)
-- ---------------------------------------------------------------------------
create table public.ai_memory (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  memory_type text not null,
  key text not null,
  value jsonb not null,
  importance float default 0.5,
  last_accessed_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, memory_type, key)
);

alter table public.ai_memory enable row level security;

create index idx_ai_memory_team_type on public.ai_memory(team_id, memory_type);

create policy "Team members can view AI memory."
  on ai_memory for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_memory.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can manage AI memory."
  on ai_memory for all
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_memory.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- BRAND VOICE PROFILE
-- ---------------------------------------------------------------------------
create table public.brand_voices (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  name text not null,
  tone text[],
  personality text[],
  values text[],
  vocabulary jsonb default '{}'::jsonb,
  examples jsonb default '[]'::jsonb,
  forbidden_words text[],
  guidelines text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.brand_voices enable row level security;

create policy "Team members can view brand voices."
  on brand_voices for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = brand_voices.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can manage brand voices."
  on brand_voices for all
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = brand_voices.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- AUTONOMOUS TRIGGERS
-- ---------------------------------------------------------------------------
create table public.autonomous_triggers (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  name text not null,
  trigger_type text not null,
  conditions jsonb not null,
  actions jsonb not null,
  is_active boolean default true,
  cooldown_minutes integer default 60,
  last_triggered_at timestamp with time zone,
  trigger_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.autonomous_triggers enable row level security;

create policy "Team members can view triggers."
  on autonomous_triggers for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = autonomous_triggers.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can manage triggers."
  on autonomous_triggers for all
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = autonomous_triggers.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- AI DECISION LOG
-- ---------------------------------------------------------------------------
create table public.ai_decisions (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  agent_type text not null,
  decision_type text not null,
  context jsonb default '{}'::jsonb,
  recommendation text not null,
  action_taken boolean default false,
  action_result jsonb,
  feedback_score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_decisions enable row level security;

create index idx_ai_decisions_team on public.ai_decisions(team_id, created_at desc);

create policy "Team members can view AI decisions."
  on ai_decisions for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_decisions.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- AI REPORTS (Weekly executive reports)
-- ---------------------------------------------------------------------------
create table public.ai_reports (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  report_type text not null,
  period text not null,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  insights jsonb default '[]'::jsonb,
  opportunities jsonb default '[]'::jsonb,
  competitor_movement jsonb default '[]'::jsonb,
  recommendations jsonb default '[]'::jsonb,
  metrics_summary jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_reports enable row level security;

create index idx_ai_reports_team on public.ai_reports(team_id, generated_at desc);

create policy "Team members can view AI reports."
  on ai_reports for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = ai_reports.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- CONTENT GAPS (Identified content opportunities)
-- ---------------------------------------------------------------------------
create table public.content_gaps (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  topic text not null,
  keyword text,
  search_volume integer,
  difficulty integer,
  content_type text,
  priority text default 'medium',
  status text default 'identified',
  suggested_title text,
  ai_outline jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.content_gaps enable row level security;

create index idx_content_gaps_team_priority on public.content_gaps(team_id, priority);

create policy "Team members can view content gaps."
  on content_gaps for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = content_gaps.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can manage content gaps."
  on content_gaps for all
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = content_gaps.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- PERFORMANCE ANOMALIES (Detected issues)
-- ---------------------------------------------------------------------------
create table public.performance_anomalies (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  metric_type text not null,
  metric_name text not null,
  previous_value float,
  current_value float,
  change_percent float,
  severity text default 'warning',
  detected_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone,
  resolution jsonb,
  unique(team_id, metric_type, detected_at::date)
);

alter table public.performance_anomalies enable row level security;

create policy "Team members can view anomalies."
  on performance_anomalies for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = performance_anomalies.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- FUNCTIONS
-- ---------------------------------------------------------------------------

-- Store AI memory with expiration
create or replace function public.store_ai_memory(
  p_team_id uuid,
  p_memory_type text,
  p_key text,
  p_value jsonb,
  p_importance float default 0.5,
  p_ttl_days integer default 30
)
returns void as $$
begin
  insert into public.ai_memory (team_id, memory_type, key, value, importance, expires_at)
  values (p_team_id, p_memory_type, p_key, p_value, p_importance, now() + (p_ttl_days || ' days')::interval)
  on conflict (team_id, memory_type, key)
  do update set 
    value = p_value,
    importance = p_importance,
    last_accessed_at = now(),
    expires_at = now() + (p_ttl_days || ' days')::interval;
end;
$$ language plpgsql security definer;

-- Get relevant memories for AI context
create or replace function public.get_ai_memories(
  p_team_id uuid,
  p_memory_types text[],
  p_limit integer default 10
)
returns setof ai_memory as $$
begin
  return query select *
  from public.ai_memory
  where team_id = p_team_id
    and memory_type = any(p_memory_types)
    and (expires_at is null or expires_at > now())
  order by importance desc, last_accessed_at desc
  limit p_limit;
end;
$$ language plpgsql security definer;