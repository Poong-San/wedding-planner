-- supabase/migrations/001_initial_schema.sql

-- 사용자 프로필 (Supabase Auth 확장)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  name text not null default '',
  partner_id uuid references public.profiles(id),
  wedding_date date,
  bride_name text default '',
  groom_name text default '',
  couple_message text default '',
  couple_photo_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own and partner profile"
  on public.profiles for select using (
    auth.uid() = id or auth.uid() = partner_id
  );

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- 카테고리
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  name text not null,
  vendor text default '',
  manager text default '',
  contact text default '',
  address text default '',
  total integer default 0,
  event_date date,
  event_time time,
  status text default 'pending' check (status in ('pending','consulting','contracted','in_progress','completed')),
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "Users can manage own categories"
  on public.categories for all using (
    auth.uid() = user_id or
    auth.uid() in (select partner_id from public.profiles where id = user_id)
  );

-- 납부 일정
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  label text not null,
  amount integer not null default 0,
  date date,
  done boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.payments enable row level security;

create policy "Users can manage payments via category"
  on public.payments for all using (
    category_id in (
      select id from public.categories where
        user_id = auth.uid() or
        user_id in (select id from public.profiles where partner_id = auth.uid())
    )
  );

-- 일정 (캘린더)
create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  date date not null,
  time time,
  category_type text,
  memo text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Users can manage own events"
  on public.events for all using (
    auth.uid() = user_id or
    auth.uid() in (select partner_id from public.profiles where id = user_id)
  );

-- 예산
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  total_budget integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.budgets enable row level security;

create policy "Users can manage own budget"
  on public.budgets for all using (
    auth.uid() = user_id or
    auth.uid() in (select partner_id from public.profiles where id = user_id)
  );

-- 체크리스트
create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  timeline text not null,
  is_completed boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.checklist_items enable row level security;

create policy "Users can manage own checklist"
  on public.checklist_items for all using (
    auth.uid() = user_id or
    auth.uid() in (select partner_id from public.profiles where id = user_id)
  );

-- 하객
create table public.guests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  side text not null check (side in ('groom','bride')),
  relationship text default '',
  attendance text default 'undecided' check (attendance in ('attending','not_attending','undecided')),
  meal boolean default false,
  gift_amount integer default 0,
  memo text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.guests enable row level security;

create policy "Users can manage own guests"
  on public.guests for all using (
    auth.uid() = user_id or
    auth.uid() in (select partner_id from public.profiles where id = user_id)
  );

-- 첨부파일
create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text default '',
  file_size integer default 0,
  created_at timestamptz default now()
);

alter table public.attachments enable row level security;

create policy "Users can manage attachments via category"
  on public.attachments for all using (
    category_id in (
      select id from public.categories where
        user_id = auth.uid() or
        user_id in (select id from public.profiles where partner_id = auth.uid())
    )
  );
