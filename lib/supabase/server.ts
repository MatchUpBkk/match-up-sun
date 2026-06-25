import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { toRole, type AppRole } from '@/lib/auth/roles';

/** True when public Supabase env vars are present (server-side). */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Cookie-aware server client for Server Components, Route Handlers and the
 * dashboard guards. Returns null in demo mode (no Supabase env) so callers can
 * degrade gracefully and the app still builds/runs without keys.
 */
export function createClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const cookieStore = cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        // In a Server Component cookies are read-only and this throws — that's
        // fine; the middleware is responsible for refreshing the session cookie.
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* no-op: refresh handled in middleware */
        }
      },
    },
  });
}

/** The authenticated user (or null in demo mode / when signed out). */
export async function getUser() {
  const supabase = createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export type Profile = {
  id: string;
  full_name: string | null;
  role: AppRole;
  verification_status: string | null;
  avatar_url: string | null;
  location: string | null;
  skill_level: string | null;
};

/** Fetch the current user's profile row (or null). */
export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, role, verification_status, avatar_url, location, skill_level')
    .eq('id', user.id)
    .single();

  if (!data) {
    // Profile row not yet created — fall back to auth metadata role.
    return {
      id: user.id,
      full_name: (user.user_metadata?.full_name as string) ?? null,
      role: toRole(user.user_metadata?.role),
      verification_status: null,
      avatar_url: null,
      location: null,
      skill_level: null,
    };
  }

  return { ...data, role: toRole(data.role) } as Profile;
}
