import { redirect } from 'next/navigation';
import { isSupabaseConfigured, getUser, getProfile } from '@/lib/supabase/server';
import { dashboardPathForRole } from '@/lib/auth/roles';

/**
 * Restricts the organizer dashboard to organizers (and admins). Other roles are
 * redirected to their own dashboard. Open in demo mode.
 */
export default async function OrganizerLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <>{children}</>;

  const user = await getUser();
  if (!user) redirect('/login?redirect=/dashboard/organizer');

  const profile = await getProfile();
  if (!profile || (profile.role !== 'organizer' && profile.role !== 'admin')) {
    redirect(dashboardPathForRole(profile?.role));
  }

  return <>{children}</>;
}
