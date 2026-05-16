-- Align auth-backed app state with the current frontend.

alter table public.categories
  add column if not exists image_url text;

alter table public.categories
  drop constraint if exists categories_status_check;

alter table public.categories
  add constraint categories_status_check
  check (status in ('pending','consulting','contracted','in_progress','payment','completed'));

create table if not exists public.ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_type text,
  title text not null,
  amount integer not null check (amount >= 0),
  date date not null,
  memo text default '',
  owner text not null default 'shared' check (owner in ('groom','bride','shared')),
  type text not null default 'expense' check (type in ('income','expense','transfer')),
  is_recurring boolean not null default false,
  recurring_day integer check (recurring_day is null or (recurring_day between 1 and 31)),
  payment_method text default '',
  is_planned boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ledger enable row level security;

drop policy if exists "Users can manage own ledger" on public.ledger;

create policy "Users can manage own ledger"
  on public.ledger for all using (
    auth.uid() = user_id or
    auth.uid() in (select partner_id from public.profiles where id = user_id)
  )
  with check (
    auth.uid() = user_id or
    auth.uid() in (select partner_id from public.profiles where id = user_id)
  );

create index if not exists idx_ledger_user_date on public.ledger(user_id, date desc);
create index if not exists idx_ledger_user_recurring on public.ledger(user_id, is_recurring);
create index if not exists idx_ledger_user_planned on public.ledger(user_id, is_planned);
