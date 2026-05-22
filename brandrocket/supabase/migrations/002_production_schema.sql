-- 002_production_schema.sql
-- Phase 5: Production-ready schema extensions

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- TEMPLATES (for template library)
-- ---------------------------------------------------------------------------
create table public.templates (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  category text not null,
  tags text[] default '{}',
  content jsonb not null default '{}'::jsonb,
  thumbnail_url text,
  is_premium boolean default false,
  usage_count integer default 0,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.templates enable row level security;

create policy "Public templates are viewable by everyone."
  on templates for select
  using ( is_public = true );

create policy "Team members can view team templates."
  on templates for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = templates.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can create templates."
  on templates for insert
  with check (
    exists (
      select 1 from public.team_members tm
      where tm.team_id = templates.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Template creators can update own templates."
  on templates for update
  using (
    created_by = auth.uid() or
    exists (
      select 1 from public.team_members tm
      where tm.team_id = templates.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  message text,
  data jsonb default '{}'::jsonb,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications."
  on notifications for select
  using ( auth.uid() = user_id );

create policy "Users can update own notifications."
  on notifications for update
  using ( auth.uid() = user_id );

create policy "Users can delete own notifications."
  on notifications for delete
  using ( auth.uid() = user_id );

-- ---------------------------------------------------------------------------
-- SCHEDULED POSTS (for social media scheduling)
-- ---------------------------------------------------------------------------
create table public.scheduled_posts (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  platform text not null,
  content text not null,
  media_urls text[] default '{}',
  scheduled_for timestamp with time zone not null,
  status text default 'pending' not null,
  published_at timestamp with time zone,
  error_message text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.scheduled_posts enable row level security;

create index idx_scheduled_posts_scheduled_for on public.scheduled_posts(scheduled_for);
create index idx_scheduled_posts_status on public.scheduled_posts(status);

create policy "Team members can view scheduled posts."
  on scheduled_posts for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = scheduled_posts.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can create scheduled posts."
  on scheduled_posts for insert
  with check (
    exists (
      select 1 from public.team_members tm
      where tm.team_id = scheduled_posts.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can update scheduled posts."
  on scheduled_posts for update
  using (
    exists (
      select 1 from public.team_members tm
      where tm.team_id = scheduled_posts.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can delete scheduled posts."
  on scheduled_posts for delete
  using (
    created_by = auth.uid() or
    exists (
      select 1 from public.team_members tm
      where tm.team_id = scheduled_posts.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- BACKGROUND JOBS (for async processing)
-- ---------------------------------------------------------------------------
create table public.background_jobs (
  id uuid default uuid_generate_v4() primary key,
  job_type text not null,
  payload jsonb default '{}'::jsonb,
  status text default 'pending' not null,
  attempts integer default 0,
  max_attempts integer default 3,
  scheduled_for timestamp with time zone,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  error_message text,
  result jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.background_jobs enable row level security;
create index idx_background_jobs_status on public.background_jobs(status);
create index idx_background_jobs_scheduled on public.background_jobs(scheduled_for) where status = 'pending';

-- Service role can manage all jobs (used by edge functions/workers)
create policy "Service role can manage background jobs."
  on background_jobs for all
  using ( auth.role() = 'service_role' );

-- ---------------------------------------------------------------------------
-- MEDIA UPLOADS
-- ---------------------------------------------------------------------------
create table public.media (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  filename text not null,
  file_path text not null,
  file_size integer,
  mime_type text,
  storage_provider text default 'supabase',
  public_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.media enable row level security;

create policy "Team members can view team media."
  on media for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = media.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team members can upload media."
  on media for insert
  with check (
    exists (
      select 1 from public.team_members tm
      where tm.team_id = media.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Media creators can delete own media."
  on media for delete
  using ( created_by = auth.uid() );

-- ---------------------------------------------------------------------------
-- STRIPE WEBHOOK EVENTS
-- ---------------------------------------------------------------------------
create table public.stripe_events (
  id uuid default uuid_generate_v4() primary key,
  stripe_id text not null unique,
  type text not null,
  data jsonb not null,
  processed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.stripe_events enable row level security;

create policy "Service role can view stripe events."
  on stripe_events for select
  using ( auth.role() = 'service_role' );

create policy "Service role can insert stripe events."
  on stripe_events for insert
  with check ( auth.role() = 'service_role' );

create policy "Service role can update stripe events."
  on stripe_events for update
  using ( auth.role() = 'service_role' );

-- ---------------------------------------------------------------------------
-- USER ONBOARDING TRACKING
-- ---------------------------------------------------------------------------
create table public.onboarding_steps (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  step text not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, step)
);

alter table public.onboarding_steps enable row level security;

create policy "Users can view own onboarding."
  on onboarding_steps for select
  using ( auth.uid() = user_id );

create policy "Users can update own onboarding."
  on onboarding_steps for update
  using ( auth.uid() = user_id );

create policy "Users can insert own onboarding."
  on onboarding_steps for insert
  with check ( auth.uid() = user_id );

-- ---------------------------------------------------------------------------
-- CREDIT PACKAGE PURCHASES
-- ---------------------------------------------------------------------------
create table public.credit_purchases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  credits integer not null,
  amount integer not null,
  stripe_payment_id text,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.credit_purchases enable row level security;

create policy "Users can view own credit purchases."
  on credit_purchases for select
  using ( auth.uid() = user_id );

create policy "Users can insert credit purchases."
  on credit_purchases for insert
  with check ( auth.uid() = user_id );

-- ---------------------------------------------------------------------------
-- SEARCH INDEX (for global search)
-- ---------------------------------------------------------------------------
create table public.search_index (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  searchable_type text not null,
  searchable_id uuid not null,
  title text not null,
  content text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.search_index enable row level security;
create index idx_search_index_team on public.search_index(team_id);
create index idx_search_index_type on public.search_index(searchable_type);
create index idx_search_index_content on public.search_index using gin(to_tsvector('english', title || ' ' || coalesce(content, '')));

create policy "Team members can search team content."
  on search_index for select
  using (
    team_id is not null and exists (
      select 1 from public.team_members tm
      where tm.team_id = search_index.team_id
      and tm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- FUNCTION: Update template usage count
-- ---------------------------------------------------------------------------
create or replace function public.increment_template_usage()
returns trigger as $$
begin
  update public.templates
  set usage_count = usage_count + 1, updated_at = now()
  where id = new.template_id;
  return new;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------------
-- FUNCTION: Create notification
-- ---------------------------------------------------------------------------
create or replace function public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_data jsonb default '{}'::jsonb
)
returns void as $$
begin
  insert into public.notifications (user_id, type, title, message, data)
  values (p_user_id, p_type, p_title, p_message, p_data);
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------------
-- FUNCTION: Queue background job
-- ---------------------------------------------------------------------------
create or replace function public.queue_job(
  p_job_type text,
  p_payload jsonb,
  p_scheduled_for timestamp with time zone default now()
)
returns uuid as $$
declare
  v_job_id uuid;
begin
  insert into public.background_jobs (job_type, payload, scheduled_for)
  values (p_job_type, p_payload, p_scheduled_for)
  returning id into v_job_id;
  return v_job_id;
end;
$$ language plpgsql security definer;