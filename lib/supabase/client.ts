'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

/** True when public Supabase env vars are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Cookie-aware browser Supabase client (memoised). Shares the session with the
 * server via cookies, so SSR/middleware and the client stay in sync.
 * Throws only if called without configuration — guard with isSupabaseConfigured().
 */
export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local',
    );
  }
  if (!browserClient) {
    browserClient = createBrowserClient(url, anon);
  }
  return browserClient;
}

/** Back-compat alias. */
export const getSupabaseBrowserClient = createClient;
