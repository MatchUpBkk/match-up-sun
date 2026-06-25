import { NextResponse } from 'next/server';
import { createClient, getProfile } from '@/lib/supabase/server';
import { dashboardPathForRole } from '@/lib/auth/roles';

export const dynamic = 'force-dynamic';

/**
 * Handles links from Supabase auth emails (email verification + password
 * recovery). Exchanges the one-time code for a session cookie, then redirects
 * to `next` (if provided) or the user's role dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  const supabase = createClient();

  if (supabase && code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next && next.startsWith('/')) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      const profile = await getProfile();
      return NextResponse.redirect(`${origin}${dashboardPathForRole(profile?.role)}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
