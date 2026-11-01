-- 0001: profiles, roles, helper functions, RLS foundation.
-- One row in profiles per auth user. The first user to sign in becomes owner.

create type public.user_role as enum ('owner', 'consultant', 'viewer');

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null default '',
  role        public.user_role not null default 'consultant',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Generic updated_at trigger, reused by every later table.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a profile automatically when a user is created in auth.
-- First ever user becomes owner so the app can be bootstrapped without SQL.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  first_user boolean;
begin
  select not exists (select 1 from public.profiles) into first_user;
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when first_user then 'owner'::public.user_role else 'consultant'::public.user_role end
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper functions used by RLS policies everywhere.
-- security definer + stable so they can read profiles without recursion.
create or replace function public.current_user_role()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and is_active;
$$;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_user_role() = 'owner', false);
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_user_role() in ('owner', 'consultant'), false);
$$;

create or replace function public.is_active_user()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_user_role() is not null, false);
$$;

revoke execute on function public.current_user_role() from public, anon;
revoke execute on function public.is_owner() from public, anon;
revoke execute on function public.is_staff() from public, anon;
revoke execute on function public.is_active_user() from public, anon;
grant execute on function public.current_user_role(), public.is_owner(), public.is_staff(), public.is_active_user() to authenticated;

-- RLS
alter table public.profiles enable row level security;

create policy "profiles: active users read all"
  on public.profiles for select
  using (public.is_active_user());

create policy "profiles: owner updates any"
  on public.profiles for update
  using (public.is_owner())
  with check (public.is_owner());

create policy "profiles: user updates own name"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()) and is_active = (select is_active from public.profiles where id = auth.uid()));

-- No insert/delete policies: rows are created by the trigger and removed by cascade.

-- Activity log, written by triggers on later tables.
create table public.activity_log (
  id          bigint generated always as identity primary key,
  actor_id    uuid references public.profiles(id) on delete set null,
  entity      text not null,
  entity_id   text not null,
  action      text not null,
  diff        jsonb,
  created_at  timestamptz not null default now()
);

create index activity_log_created_at_idx on public.activity_log (created_at desc);
create index activity_log_entity_idx on public.activity_log (entity, entity_id);

alter table public.activity_log enable row level security;

create policy "activity_log: owner reads"
  on public.activity_log for select
  using (public.is_owner());

-- Generic row-change logger. Attach to any table:
--   create trigger <t>_log after insert or update or delete on <t>
--   for each row execute function public.log_row_change();
create or replace function public.log_row_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  rec_id text;
  payload jsonb;
begin
  if tg_op = 'DELETE' then
    rec_id := old.id::text;
    payload := jsonb_build_object('old', to_jsonb(old));
  elsif tg_op = 'UPDATE' then
    rec_id := new.id::text;
    payload := jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new));
  else
    rec_id := new.id::text;
    payload := jsonb_build_object('new', to_jsonb(new));
  end if;
  insert into public.activity_log (actor_id, entity, entity_id, action, diff)
  values (auth.uid(), tg_table_name, rec_id, lower(tg_op), payload);
  return coalesce(new, old);
end $$;

create trigger profiles_log
  after insert or update or delete on public.profiles
  for each row execute function public.log_row_change();
