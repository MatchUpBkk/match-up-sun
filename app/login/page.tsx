'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { useI18n } from '@/lib/i18n/context';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { dashboardPathForRole } from '@/lib/auth/roles';
import { IconArrow } from '@/components/Icons';

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        // Resolve role for the post-login redirect.
        const {
          data: { user },
        } = await supabase.auth.getUser();
        let role: unknown = user?.user_metadata?.role;
        if (user) {
          const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          role = data?.role ?? role;
        }
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');
        router.push(redirect && redirect.startsWith('/') ? redirect : dashboardPathForRole(role));
        router.refresh();
        return;
      }
      // Demo mode
      router.push('/dashboard/player');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x flex min-h-screen items-center justify-center py-28">
      <div className="glass w-full max-w-md p-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-8 text-center text-2xl font-extrabold text-white">{t('auth.login.title')}</h1>
        <p className="mt-2 text-center text-sm text-white/55">{t('auth.login.subtitle')}</p>

        {!isSupabaseConfigured() && (
          <p className="mt-4 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 px-3 py-2 text-center text-xs text-neon-cyan">
            {t('auth.demoNote')}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">{t('auth.email')}</label>
            <input type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label">{t('auth.password')}</label>
              <Link href="/reset-password" className="text-xs text-neon-cyan hover:underline">
                {t('auth.forgot')}
              </Link>
            </div>
            <input type="password" className="input" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="btn btn-primary w-full justify-center disabled:opacity-60" disabled={loading}>
            {loading ? '…' : t('nav.login')} <IconArrow className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/55">
          {t('auth.noAccount')}{' '}
          <Link href="/register" className="font-semibold text-neon-cyan hover:underline">
            {t('nav.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
