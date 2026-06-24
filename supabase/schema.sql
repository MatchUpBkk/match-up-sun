-- ════════════════════════════════════════════════════════════════════
--  MATCH UP BKK — Supabase schema
--  Run in the Supabase SQL Editor (or `supabase db push`).
--  Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- ════════════════════════════════════════════════════════════════════

-- ── Extensions ──────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enums ───────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('player', 'organizer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_status as enum ('unverified', 'pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type event_type as enum ('tournament', 'session');
exception when duplicate_object then null; end $$;

do $$ begin
  create type skill_level as enum ('beginner', 'intermediate', 'advanced', 'mixed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_tier as enum ('free', 'featured', 'promotion');
exception when duplicate_object then null; end $$;

do $$ begin
  create type registration_status as enum ('pending', 'confirmed', 'cancelled', 'waitlist');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('card', 'promptpay');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'awaiting_approval', 'paid', 'refunded', 'failed');
exception when duplicate_object then null; end $$;

-- ── profiles (1:1 with auth.users) ──────────────────────────────────
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  full_name           text,
  avatar_url          text,
  role                user_role not null default 'player',
  skill_level         skill_level default 'intermediate',
  location            text,
  verification_status verification_status not null default 'unverified',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── organizer_documents (verification) ──────────────────────────────
create table if not exists public.organizer_documents (
  id            uuid primary key default uuid_generate_v4(),
  organizer_id  uuid not null references public.profiles(id) on delete cascade,
  id_doc_url    text,        -- Government-issued ID (passport / national ID / license)
  address_doc_url text,      -- Proof of address (utility / water / electricity / bank)
  status        verification_status not null default 'pending',
  reviewed_by   uuid references public.profiles(id),
  notes         text,
  created_at    timestamptz not null default now()
);

-- ── events ──────────────────────────────────────────────────────────
create table if not exists public.events (
  id               uuid primary key default uuid_generate_v4(),
  slug             text unique not null,
  organizer_id     uuid not null references public.profiles(id) on delete cascade,
  type             event_type not null,
  title            text not null,
  description      text,
  event_date       date not null,
  event_time       text,
  location         text,
  area             text,
  cover_url        text,
  tier             listing_tier not null default 'free',
  featured         boolean not null default false,
  published        boolean not null default false,
  -- tournament
  entry_fee        integer,      -- THB
  max_teams        integer,
  registered_teams integer default 0,
  prize            text,
  -- session
  price            integer,      -- THB
  spots_total      integer,
  spots_taken      integer default 0,
  skill_level      skill_level,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists events_type_idx on public.events(type);
create index if not exists events_area_idx on public.events(area);
create index if not exists events_date_idx on public.events(event_date);

-- ── event_media ─────────────────────────────────────────────────────
create table if not exists public.event_media (
  id         uuid primary key default uuid_generate_v4(),
  event_id   uuid not null references public.events(id) on delete cascade,
  url        text not null,
  kind       text not null default 'image',  -- 'image' | 'video'
  created_at timestamptz not null default now()
);

-- ── registrations ───────────────────────────────────────────────────
create table if not exists public.registrations (
  id          uuid primary key default uuid_generate_v4(),
  event_id    uuid not null references public.events(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  team_name   text,
  status      registration_status not null default 'pending',
  attended    boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (event_id, user_id)
);

-- ── payments ────────────────────────────────────────────────────────
create table if not exists public.payments (
  id               uuid primary key default uuid_generate_v4(),
  registration_id  uuid references public.registrations(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  event_id         uuid references public.events(id) on delete set null,
  amount           integer not null,      -- THB
  method           payment_method not null,
  status           payment_status not null default 'pending',
  proof_url        text,                  -- PromptPay proof upload
  stripe_session_id text,
  approved_by      uuid references public.profiles(id),
  created_at       timestamptz not null default now()
);

-- ── listings (marketplace upgrades) ─────────────────────────────────
create table if not exists public.listings (
  id          uuid primary key default uuid_generate_v4(),
  event_id    uuid not null references public.events(id) on delete cascade,
  tier        listing_tier not null,
  price       integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════
--  updated_at trigger
-- ════════════════════════════════════════════════════════════════════
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

drop trigger if exists profiles_updated on public.profiles;
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists events_updated on public.events;
create trigger events_updated before update on public.events
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════════════
--  Auto-create a profile when a new auth user signs up
-- ════════════════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'player')
  )
  on conflict (id) do nothing;
  return new;
end; $$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ════════════════════════════════════════════════════════════════════
--  Helper: is the current user an admin?
-- ════════════════════════════════════════════════════════════════════
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- ════════════════════════════════════════════════════════════════════
--  Row Level Security
-- ════════════════════════════════════════════════════════════════════
alter table public.profiles            enable row level security;
alter table public.organizer_documents enable row level security;
alter table public.events              enable row level security;
alter table public.event_media         enable row level security;
alter table public.registrations       enable row level security;
alter table public.payments            enable row level security;
alter table public.listings            enable row level security;

-- profiles
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id or public.is_admin() or true);  -- public read of basic profile

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- organizer_documents (private; owner + admin)
drop policy if exists "docs owner read" on public.organizer_documents;
create policy "docs owner read" on public.organizer_documents
  for select using (auth.uid() = organizer_id or public.is_admin());

drop policy if exists "docs owner write" on public.organizer_documents;
create policy "docs owner write" on public.organizer_documents
  for insert with check (auth.uid() = organizer_id);

drop policy if exists "docs admin update" on public.organizer_documents;
create policy "docs admin update" on public.organizer_documents
  for update using (public.is_admin());

-- events: published events are world-readable; organizers manage their own
drop policy if exists "events public read" on public.events;
create policy "events public read" on public.events
  for select using (published = true or auth.uid() = organizer_id or public.is_admin());

drop policy if exists "events organizer insert" on public.events;
create policy "events organizer insert" on public.events
  for insert with check (auth.uid() = organizer_id);

drop policy if exists "events organizer update" on public.events;
create policy "events organizer update" on public.events
  for update using (auth.uid() = organizer_id or public.is_admin());

drop policy if exists "events organizer delete" on public.events;
create policy "events organizer delete" on public.events
  for delete using (auth.uid() = organizer_id or public.is_admin());

-- event_media: readable with the event; writable by the owner
drop policy if exists "media public read" on public.event_media;
create policy "media public read" on public.event_media for select using (true);

drop policy if exists "media owner write" on public.event_media;
create policy "media owner write" on public.event_media
  for insert with check (
    exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
  );

-- registrations: player sees own; organizer sees rows for own events; admin all
drop policy if exists "regs read" on public.registrations;
create policy "regs read" on public.registrations
  for select using (
    auth.uid() = user_id
    or public.is_admin()
    or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
  );

drop policy if exists "regs player insert" on public.registrations;
create policy "regs player insert" on public.registrations
  for insert with check (auth.uid() = user_id);

drop policy if exists "regs update" on public.registrations;
create policy "regs update" on public.registrations
  for update using (
    auth.uid() = user_id
    or public.is_admin()
    or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
  );

-- payments
drop policy if exists "payments read" on public.payments;
create policy "payments read" on public.payments
  for select using (
    auth.uid() = user_id
    or public.is_admin()
    or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
  );

drop policy if exists "payments insert" on public.payments;
create policy "payments insert" on public.payments
  for insert with check (auth.uid() = user_id);

drop policy if exists "payments approve" on public.payments;
create policy "payments approve" on public.payments
  for update using (
    public.is_admin()
    or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
  );

-- listings
drop policy if exists "listings read" on public.listings;
create policy "listings read" on public.listings for select using (true);

drop policy if exists "listings owner write" on public.listings;
create policy "listings owner write" on public.listings
  for insert with check (
    exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
  );

-- ════════════════════════════════════════════════════════════════════
--  Storage buckets
-- ════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values
  ('event-media', 'event-media', true),
  ('verification-docs', 'verification-docs', false),
  ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

-- event-media: public read, owner write
drop policy if exists "event-media read" on storage.objects;
create policy "event-media read" on storage.objects
  for select using (bucket_id = 'event-media');

drop policy if exists "event-media write" on storage.objects;
create policy "event-media write" on storage.objects
  for insert with check (bucket_id = 'event-media' and auth.role() = 'authenticated');

-- verification-docs: private (owner-or-admin read; owner write)
drop policy if exists "verif read" on storage.objects;
create policy "verif read" on storage.objects
  for select using (bucket_id = 'verification-docs' and (owner = auth.uid() or public.is_admin()));

drop policy if exists "verif write" on storage.objects;
create policy "verif write" on storage.objects
  for insert with check (bucket_id = 'verification-docs' and auth.role() = 'authenticated');

-- payment-proofs: private
drop policy if exists "proof read" on storage.objects;
create policy "proof read" on storage.objects
  for select using (bucket_id = 'payment-proofs' and (owner = auth.uid() or public.is_admin()));

drop policy if exists "proof write" on storage.objects;
create policy "proof write" on storage.objects
  for insert with check (bucket_id = 'payment-proofs' and auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════════════
--  Seed note:
--  Promote an account to admin after sign-up:
--    update public.profiles set role = 'admin' where id = '<auth-user-uuid>';
-- ════════════════════════════════════════════════════════════════════
