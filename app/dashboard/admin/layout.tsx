import { redirect } from 'next/navigation';
import { isSupabaseConfigured, getUser, getProfile } from '@/lib/supabase/server';
import { dashboardPathForRole } from '@/lib/auth/roles';

/**
 * Restricts the admin dashboard to users whose profile role is 'admin'
 * (the source of truth, since admins are promoted via SQL). Non-admins are
 * redirected to their own dashboard. Open in demo mode.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <>{children}</>;

  const user = await getUser();
  if (!user) redirect('/login?redirect=/dashboard/admin');

  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    redirect(dashboardPathForRole(profile?.role));
  }

  return <>{children}</>;
}
