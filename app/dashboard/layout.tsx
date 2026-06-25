import { redirect } from 'next/navigation';
import { isSupabaseConfigured, getUser } from '@/lib/supabase/server';

/**
 * Requires an authenticated session for everything under /dashboard.
 * In demo mode (no Supabase env) dashboards stay open with sample data.
 * This is defense-in-depth alongside the middleware gate.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    const user = await getUser();
    if (!user) redirect('/login?redirect=/dashboard');
  }
  return <>{children}</>;
}
