-- ============================================================================
-- MATCH UP BKK · Phase 1 migration — Profiles, Roles & Avatars
-- Run this once in the Supabase SQL editor (your schema.sql is already applied).
-- Safe to re-run (idempotent).
-- ============================================================================

-- 1) Avatars storage bucket (public read, owner-scoped writes) ----------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars owner insert" on storage.objects;
create policy "avatars owner insert" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars owner update" on storage.objects;
create policy "avatars owner update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars owner delete" on storage.objects;
create policy "avatars owner delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 2) Privilege-escalation guard ----------------------------------------------
-- Prevents non-admins from changing their own role or verification_status.
-- (The "profiles self update" RLS policy intentionally allows self-updates of
--  safe columns; this trigger keeps the privileged columns locked.)
create or replace function public.guard_profile_privileged_columns()
returns trigger as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.verification_status := old.verification_status;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists profiles_guard_privileged on public.profiles;
create trigger profiles_guard_privileged
  before update on public.profiles
  for each row execute function public.guard_profile_privileged_columns();
