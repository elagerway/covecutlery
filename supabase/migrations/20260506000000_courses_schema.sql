-- Courses schema + gamification (mirrors Orchestrator Academy pipeline)

-- Profiles table (if not exists)
create table if not exists public.profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'admin')),
  xp integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  last_activity_date date,
  created_at timestamptz default now() not null
);

-- Courses
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text not null default '',
  thumbnail_url text,
  is_free boolean not null default true,
  price numeric(10,2),
  "order" integer not null default 0,
  active boolean not null default true,
  level text not null default 'entry' check (level in ('entry', 'intermediate', 'advanced')),
  created_at timestamptz default now() not null
);

-- Modules
create table public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  slug text not null,
  description text not null default '',
  "order" integer not null default 0,
  created_at timestamptz default now() not null,
  unique(course_id, slug)
);

-- Lessons
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  slug text not null,
  content_type text not null default 'text' check (content_type in ('video', 'text', 'interactive', 'quiz')),
  content text not null default '',
  video_url text,
  "order" integer not null default 0,
  created_at timestamptz default now() not null,
  unique(module_id, slug)
);

-- User enrollments
create table public.user_enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  enrolled_at timestamptz default now() not null,
  unique(user_id, course_id)
);

-- User progress
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  unique(user_id, lesson_id)
);

-- Module quizzes
create table public.module_quizzes (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null unique,
  questions jsonb not null default '[]'::jsonb,
  xp_reward integer not null default 25,
  created_at timestamptz default now() not null
);

-- Module quiz results
create table public.module_quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  module_quiz_id uuid references public.module_quizzes(id) on delete cascade not null,
  score integer not null,
  total integer not null,
  passed boolean not null default false,
  xp_earned integer not null default 0,
  answers jsonb,
  completed_at timestamptz default now() not null,
  unique(user_id, module_quiz_id)
);

-- Achievements catalog
create table public.achievements (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  description text not null,
  icon text not null default 'trophy',
  xp_reward integer not null default 0,
  created_at timestamptz default now() not null
);

-- User achievements
create table public.user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  achievement_id uuid references public.achievements(id) on delete cascade not null,
  unlocked_at timestamptz default now() not null,
  unique(user_id, achievement_id)
);

-- XP log
create table public.xp_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  amount integer not null,
  source text not null,
  source_id text,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_modules_course_id on public.modules(course_id);
create index idx_lessons_module_id on public.lessons(module_id);
create index idx_user_enrollments_user_id on public.user_enrollments(user_id);
create index idx_user_progress_user_id on public.user_progress(user_id);
create index idx_user_progress_lesson_id on public.user_progress(lesson_id);
create index idx_module_quizzes_module_id on public.module_quizzes(module_id);
create index idx_module_quiz_results_user_id on public.module_quiz_results(user_id);
create index idx_user_achievements_user_id on public.user_achievements(user_id);
create index idx_xp_log_user_id on public.xp_log(user_id);

-- RLS Policies

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = user_id);

alter table public.courses enable row level security;
create policy "Courses are viewable by everyone" on public.courses for select using (true);

alter table public.modules enable row level security;
create policy "Modules are viewable by everyone" on public.modules for select using (true);

alter table public.lessons enable row level security;
create policy "Lessons are viewable by everyone" on public.lessons for select using (true);

alter table public.user_enrollments enable row level security;
create policy "Users can view their own enrollments" on public.user_enrollments for select using (auth.uid() = user_id);
create policy "Users can enroll themselves" on public.user_enrollments for insert with check (auth.uid() = user_id);

alter table public.user_progress enable row level security;
create policy "Users can view their own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can insert their own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update their own progress" on public.user_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.module_quizzes enable row level security;
create policy "Module quizzes are viewable by everyone" on public.module_quizzes for select using (true);

alter table public.module_quiz_results enable row level security;
create policy "Users can view their own quiz results" on public.module_quiz_results for select using (auth.uid() = user_id);
create policy "Users can insert their own quiz results" on public.module_quiz_results for insert with check (auth.uid() = user_id);

alter table public.achievements enable row level security;
create policy "Achievements are viewable by everyone" on public.achievements for select using (true);

alter table public.user_achievements enable row level security;
create policy "User achievements are viewable by everyone" on public.user_achievements for select using (true);
create policy "Users can insert their own achievements" on public.user_achievements for insert with check (auth.uid() = user_id);

alter table public.xp_log enable row level security;
create policy "Users can view their own XP log" on public.xp_log for select using (auth.uid() = user_id);
create policy "Users can insert their own XP log" on public.xp_log for insert with check (auth.uid() = user_id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Seed achievements
insert into public.achievements (slug, title, description, icon, xp_reward) values
  ('first-lesson', 'First Steps', 'Complete your first lesson', 'rocket', 10),
  ('first-module', 'Module Master', 'Complete all lessons in a module', 'book-check', 25),
  ('quiz-ace', 'Quiz Ace', 'Score 100% on a module quiz', 'zap', 50),
  ('five-lessons', 'Getting Warmed Up', 'Complete 5 lessons', 'flame', 25),
  ('ten-lessons', 'Double Digits', 'Complete 10 lessons', 'star', 50),
  ('first-quiz', 'Quiz Taker', 'Pass your first module quiz', 'check-circle', 15),
  ('five-quizzes', 'Quiz Champion', 'Pass 5 module quizzes', 'crown', 75),
  ('streak-3', 'On a Roll', 'Learn 3 days in a row', 'flame', 30),
  ('streak-7', 'Week Warrior', 'Learn 7 days in a row', 'calendar', 75),
  ('all-sharp', 'Sharp Master', 'Complete all Train To Be Sharp modules', 'trophy', 500);
