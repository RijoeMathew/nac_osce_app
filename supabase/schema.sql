create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'candidate',
  target_exam_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.cases (
  id text primary key,
  title text not null,
  station_type text not null,
  setting text not null,
  difficulty text not null,
  patient_name text not null,
  patient_age integer not null,
  emotional_state text not null,
  opening_prompt text not null,
  candidate_instructions text not null,
  visible_info jsonb not null default '[]'::jsonb,
  hidden_facts jsonb not null,
  checklist jsonb not null,
  suggested_next_case_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  case_id text references public.cases(id) on delete set null,
  phase text not null default 'reading',
  started_at timestamptz default now(),
  ended_at timestamptz,
  reading_seconds integer default 120,
  encounter_seconds integer default 660
);

create table if not exists public.transcripts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.practice_sessions(id) on delete cascade,
  role text not null check (role in ('candidate', 'patient', 'system')),
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.practice_sessions(id) on delete cascade,
  overall_score integer not null,
  history_score integer not null,
  communication_score integer not null,
  clinical_reasoning_score integer not null,
  management_score integer not null,
  missed_red_flags jsonb not null default '[]'::jsonb,
  missed_questions jsonb not null default '[]'::jsonb,
  strengths jsonb not null default '[]'::jsonb,
  weaknesses jsonb not null default '[]'::jsonb,
  improvement_tips jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.transcripts enable row level security;
alter table public.scores enable row level security;

create policy "profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are writable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "sessions are readable by owner"
  on public.practice_sessions for select
  using (auth.uid() = user_id);

create policy "sessions are writable by owner"
  on public.practice_sessions for insert
  with check (auth.uid() = user_id);

create policy "transcripts are readable through owned session"
  on public.transcripts for select
  using (
    exists (
      select 1 from public.practice_sessions
      where practice_sessions.id = transcripts.session_id
      and practice_sessions.user_id = auth.uid()
    )
  );

create policy "scores are readable through owned session"
  on public.scores for select
  using (
    exists (
      select 1 from public.practice_sessions
      where practice_sessions.id = scores.session_id
      and practice_sessions.user_id = auth.uid()
    )
  );
