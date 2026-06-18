create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  email text not null,
  role text check (role in ('child', 'parent')),
  level integer not null default 1,
  xp integer not null default 0,
  created_at timestamptz not null default now(),
  parent_id uuid references public.profiles(id) on delete set null,
  child_id uuid references public.profiles(id) on delete set null
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  level integer not null default 1,
  xp integer not null default 0,
  achievements jsonb not null default '[]'::jsonb,
  statistics jsonb not null default '{}'::jsonb,
  ai_history jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.speech_analysis_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.profiles(id) on delete set null,
  child_id uuid references public.profiles(id) on delete set null,
  input_text text not null,
  score integer not null,
  clarity integer not null,
  speech_quality integer not null,
  effort integer not null,
  praises jsonb not null default '[]'::jsonb,
  suggestion text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.speech_analysis_history enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id or auth.uid() = parent_id or auth.uid() = child_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read own speech history"
  on public.speech_analysis_history for select
  using (auth.uid() = user_id or auth.uid() = parent_id or auth.uid() = child_id);

create policy "Users can insert own speech history"
  on public.speech_analysis_history for insert
  with check (auth.uid() = user_id);
