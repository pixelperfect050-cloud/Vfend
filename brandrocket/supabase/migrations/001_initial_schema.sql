-- 001_initial_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- TEAMS
create table public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.teams enable row level security;

create policy "Teams are viewable by members."
  on teams for select
  using (
    auth.uid() = owner_id or
    exists (
      select 1 from public.team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Users can create teams."
  on teams for insert
  with check ( auth.uid() = owner_id );

create policy "Team owners can update teams."
  on teams for update
  using ( auth.uid() = owner_id );

create policy "Team owners can delete teams."
  on teams for delete
  using ( auth.uid() = owner_id );

-- TEAM MEMBERS
create table public.team_members (
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member' not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (team_id, user_id)
);

alter table public.team_members enable row level security;

create policy "Members can view other members."
  on team_members for select
  using (
    exists (
      select 1 from public.team_members tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
    )
    or
    exists (
      select 1 from public.teams t
      where t.id = team_members.team_id
      and t.owner_id = auth.uid()
    )
  );

create policy "Team owners can manage members."
  on team_members for all
  using (
    exists (
      select 1 from public.teams t
      where t.id = team_members.team_id
      and t.owner_id = auth.uid()
    )
  );

-- CAMPAIGNS
create table public.campaigns (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text not null,
  status text default 'draft',
  content jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.campaigns enable row level security;

create policy "Users can view own or team campaigns."
  on campaigns for select
  using (
    auth.uid() = user_id or
    (team_id is not null and exists (
      select 1 from public.team_members
      where team_id = campaigns.team_id
      and user_id = auth.uid()
    ))
  );

create policy "Users can create campaigns."
  on campaigns for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own or team campaigns."
  on campaigns for update
  using (
    auth.uid() = user_id or
    (team_id is not null and exists (
      select 1 from public.team_members
      where team_id = campaigns.team_id
      and user_id = auth.uid()
    ))
  );

create policy "Users can delete own campaigns."
  on campaigns for delete
  using ( auth.uid() = user_id );

-- ADS
create table public.ads (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  platform text not null,
  content jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ads enable row level security;

create policy "Users can view ads of their campaigns."
  on ads for select
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = ads.campaign_id
      and (
        c.user_id = auth.uid() or
        (c.team_id is not null and exists (
          select 1 from public.team_members tm
          where tm.team_id = c.team_id
          and tm.user_id = auth.uid()
        ))
      )
    )
  );

create policy "Users can manage ads of their campaigns."
  on ads for all
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = ads.campaign_id
      and (
        c.user_id = auth.uid() or
        (c.team_id is not null and exists (
          select 1 from public.team_members tm
          where tm.team_id = c.team_id
          and tm.user_id = auth.uid()
        ))
      )
    )
  );

-- BLOGS
create table public.blogs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text,
  keywords text[],
  status text default 'draft',
  seo_score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blogs enable row level security;

create policy "Users can view own blogs."
  on blogs for select
  using ( auth.uid() = user_id );

create policy "Users can manage own blogs."
  on blogs for all
  using ( auth.uid() = user_id );

-- SEO REPORTS
create table public.seo_reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  url text not null,
  score integer,
  results jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.seo_reports enable row level security;

create policy "Users can view own reports."
  on seo_reports for select
  using ( auth.uid() = user_id );

create policy "Users can manage own reports."
  on seo_reports for all
  using ( auth.uid() = user_id );

-- CREDIT USAGE
create table public.credit_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  action text not null,
  credits_used integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.credit_usage enable row level security;

create policy "Users can view own credit usage."
  on credit_usage for select
  using ( auth.uid() = user_id );

-- SUBSCRIPTIONS
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan text not null,
  status text not null,
  stripe_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions."
  on subscriptions for select
  using ( auth.uid() = user_id );

-- TRIGGER FOR NEW USER
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
