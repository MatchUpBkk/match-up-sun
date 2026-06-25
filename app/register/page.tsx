'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { useI18n } from '@/lib/i18n/context';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { dashboardPathForRole } from '@/lib/auth/roles';
import { IconArrow, IconBall, IconTrophy, IconCheck } from '@/components/Icons';

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [role, setRole] = useState<'player' | 'organizer'>('player');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name, role },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        // If email confirmation is required, there's no session yet.
        if (data.session) {
          router.push(dashboardPathForRole(role));
          router.refresh();
        } else {
          setSent(true);
        }
        return;
      }
      // Demo mode
      router.push(dashboardPathForRole(role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { key: 'player' as const, icon: IconBall, label: t('auth.role.player') },
    { key: 'organizer' as const, icon: IconTrophy, label: t('auth.role.organizer') },
  ];

  if (sent) {
    return (
      <div className="container-x flex min-h-screen items-center justify-center py-28">
        <div className="glass w-full max-w-md p-8 text-center">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neon-lime/10 text-neon-lime ring-1 ring-neon-lime/30">
              <IconCheck className="h-7 w-7" />
            </span>
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-white">{t('auth.verify.title')}</h1>
          <p className="mt-3 text-sm text-white/65">{t('auth.verify.body').replace('{email}', form.email)}</p>
          <Link href="/login" className="btn btn-secondary mt-8 inline-flex">
            {t('nav.login')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x flex min-h-screen items-center justify-center py-28">
      <div className="glass w-full max-w-md p-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-8 text-center text-2xl font-extrabold text-white">{t('auth.register.title')}</h1>
        <p className="mt-2 text-center text-sm text-white/55">{t('auth.register.subtitle')}</p>

        {!isSupabaseConfigured() && (
          <p className="mt-4 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 px-3 py-2 text-center text-xs text-neon-cyan">
            {t('auth.demoNote')}
          </p>
        )}

        {/* Role selector */}
        <div className="mt-6">
          <label className="label">{t('auth.role')}</label>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-4 transition ${
                  role === r.key ? 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan' : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                <r.icon className="h-6 w-6" />
                <span className="text-sm font-semibold">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="label">{t('auth.name')}</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('auth.email')}</label>
            <input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('auth.password')}</label>
            <input type="password" className="input" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="btn btn-primary w-full justify-center disabled:opacity-60" disabled={loading}>
            {loading ? '…' : t('cta.getStarted')} <IconArrow className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/55">
          {t('auth.haveAccount')}{' '}
          <Link href="/login" className="font-semibold text-neon-cyan hover:underline">
            {t('nav.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
