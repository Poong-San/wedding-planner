-- The app is a private shared workspace for the couple.
-- Supabase Auth gates access, and all authenticated app users share the same data.

drop policy if exists "Users can view own and partner profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Authenticated users can view shared profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Authenticated users can update shared profiles"
  on public.profiles for update
  to authenticated
  using (true)
  with check (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can manage own categories" on public.categories;
create policy "Authenticated users can manage shared categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can manage payments via category" on public.payments;
create policy "Authenticated users can manage shared payments"
  on public.payments for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can manage own events" on public.events;
create policy "Authenticated users can manage shared events"
  on public.events for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can manage own budget" on public.budgets;
create policy "Authenticated users can manage shared budgets"
  on public.budgets for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can manage own checklist" on public.checklist_items;
create policy "Authenticated users can manage shared checklist"
  on public.checklist_items for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can manage own guests" on public.guests;
create policy "Authenticated users can manage shared guests"
  on public.guests for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can manage attachments via category" on public.attachments;
create policy "Authenticated users can manage shared attachments"
  on public.attachments for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can manage fields via category" on public.category_fields;
create policy "Authenticated users can manage shared category fields"
  on public.category_fields for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can manage own ledger" on public.ledger;
create policy "Authenticated users can manage shared ledger"
  on public.ledger for all
  to authenticated
  using (true)
  with check (true);
