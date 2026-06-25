'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { toRole, type AppRole } from './roles';

type AuthUser = { id: string; email: string | null } | null;

type AuthValue = {
  user: AuthUser;
  role: AppRole | null;
  fullName: string | null;
  avatarUrl: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({
  children,
  initialUser = null,
  initialRole = null,
  initialName = null,
  initialAvatar = null,
}: {
  children: ReactNode;
  initialUser?: AuthUser;
  initialRole?: AppRole | null;
  initialName?: string | null;
  initialAvatar?: string | null;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser>(initialUser);
  const [role, setRole] = useState<AppRole | null>(initialRole);
  const [fullName, setFullName] = useState<string | null>(initialName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatar);
  const [loading, setLoading] = useState(false);

  async function loadProfile(uid: string, fallbackRole?: unknown, fallbackName?: unknown) {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url')
      .eq('id', uid)
      .single();
    setRole(toRole(data?.role ?? fallbackRole));
    setFullName((data?.full_name as string) ?? (fallbackName as string) ?? null);
    setAvatarUrl((data?.avatar_url as string) ?? null);
  }

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      const u = session?.user ?? null;
      if (u) {
        setUser({ id: u.id, email: u.email ?? null });
        setLoading(true);
        loadProfile(u.id, u.user_metadata?.role, u.user_metadata?.full_name).finally(() => setLoading(false));
      } else {
        setUser(null);
        setRole(null);
        setFullName(null);
        setAvatarUrl(null);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshProfile() {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    if (u) await loadProfile(u.id, u.user_metadata?.role, u.user_metadata?.full_name);
    router.refresh();
  }

  async function signOut() {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    setRole(null);
    setFullName(null);
    setAvatarUrl(null);
    router.replace('/');
    router.refresh();
  }

  return (
    <AuthContext.Provider value={{ user, role, fullName, avatarUrl, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      role: null,
      fullName: null,
      avatarUrl: null,
      loading: false,
      signOut: async () => {},
      refreshProfile: async () => {},
    };
  }
  return ctx;
}
