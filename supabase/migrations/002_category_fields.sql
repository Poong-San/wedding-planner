-- supabase/migrations/002_category_fields.sql

create table public.category_fields (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  field_key text not null,
  field_label text not null,
  field_value text default '',
  field_type text default 'text' check (field_type in ('text','number','date','select','textarea','boolean')),
  field_options text default '',
  is_custom boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.category_fields enable row level security;

create policy "Users can manage fields via category"
  on public.category_fields for all using (
    category_id in (
      select id from public.categories where
        user_id = auth.uid() or
        user_id in (select id from public.profiles where partner_id = auth.uid())
    )
  );

create index idx_category_fields_category_id on public.category_fields(category_id);
