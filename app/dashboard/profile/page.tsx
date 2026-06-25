import { getUser, getProfile, isSupabaseConfigured } from '@/lib/supabase/server';
import { ProfileForm } from '@/components/profile/ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getUser();
  const profile = await getProfile();

  return (
    <div className="container-x max-w-2xl py-28">
      <ProfileForm
        configured={isSupabaseConfigured()}
        userId={user?.id ?? null}
        email={user?.email ?? null}
        initial={{
          fullName: profile?.full_name ?? '',
          location: profile?.location ?? '',
          skillLevel: (profile?.skill_level as string) ?? 'intermediate',
          avatarUrl: profile?.avatar_url ?? null,
          role: (profile?.role as string) ?? 'player',
          verificationStatus: (profile?.verification_status as string) ?? 'unverified',
        }}
      />
    </div>
  );
}
