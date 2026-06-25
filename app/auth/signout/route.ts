import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/** Robust server-side sign out. Clears the session cookie and returns home. */
export async function POST(request: Request) {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  // 303 so the browser follows with a GET.
  return NextResponse.redirect(new URL('/', request.url), { status: 303 });
}
