
-- Roles enum and table
create type public.app_role as enum ('candidate', 'recruiter', 'admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view their own roles" on public.user_roles
  for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  headline text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles viewable by owner" on public.profiles
  for select to authenticated using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));
create policy "Profiles insert own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "Profiles update own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Auto-create profile + default candidate role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  insert into public.user_roles (user_id, role) values (new.id, 'candidate');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Resumes
create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  mime_type text,
  raw_text text,
  parsed jsonb,
  created_at timestamptz not null default now()
);

alter table public.resumes enable row level security;

create policy "Resumes select own" on public.resumes
  for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Resumes insert own" on public.resumes
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Resumes update own" on public.resumes
  for update to authenticated using (auth.uid() = user_id);
create policy "Resumes delete own" on public.resumes
  for delete to authenticated using (auth.uid() = user_id);

-- Analyses (ATS vs job description)
create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid not null references public.resumes(id) on delete cascade,
  job_title text,
  job_description text not null,
  overall_score int,
  keyword_score int,
  skills_score int,
  experience_score int,
  semantic_score int,
  matched_keywords jsonb,
  missing_keywords jsonb,
  strengths jsonb,
  improvements jsonb,
  recommended_skills jsonb,
  created_at timestamptz not null default now()
);

alter table public.analyses enable row level security;

create policy "Analyses select own" on public.analyses
  for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Analyses insert own" on public.analyses
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Analyses delete own" on public.analyses
  for delete to authenticated using (auth.uid() = user_id);

-- Interview sessions
create table public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  job_title text,
  job_description text,
  difficulty text,
  questions jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.interview_sessions enable row level security;

create policy "Interview select own" on public.interview_sessions
  for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Interview insert own" on public.interview_sessions
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Interview delete own" on public.interview_sessions
  for delete to authenticated using (auth.uid() = user_id);

-- Storage bucket for resumes (private)
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false);

create policy "Users read own resume files" on storage.objects
  for select to authenticated
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users upload own resume files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users delete own resume files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
