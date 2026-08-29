-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: uses "if not exists" / "or replace" everywhere.

create extension if not exists "pgcrypto";

-- One row per registered user, keyed to auth.users.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text unique not null,
  first_name text not null default '',
  last_name text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are publicly readable" on public.profiles;
create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
-- Expects handle/first_name/last_name to be passed as signUp() metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, handle, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'handle', new.id::text),
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Wishlist items, each owned by one profile.
create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  url text not null,
  title text not null default '',
  description text not null default '',
  image_url text,
  price numeric,
  currency text not null default 'RUB',
  target_amount numeric,
  raised_amount numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.wishlist_items enable row level security;

drop policy if exists "wishlist items are publicly readable" on public.wishlist_items;
create policy "wishlist items are publicly readable"
  on public.wishlist_items for select
  using (true);

drop policy if exists "owners manage their own wishlist items" on public.wishlist_items;
create policy "owners manage their own wishlist items"
  on public.wishlist_items for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
