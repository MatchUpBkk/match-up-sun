'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { useI18n } from '@/lib/i18n/context';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { IconArrow, IconCheck } from '@/components/Icons';

export default function ResetPasswordUpdatePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) {
          setError(updateError.message);
          return;
        }
      }
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
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

        {done ? (
          <div className="mt-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neon-lime/10 text-neon-lime ring-1 ring-neon-lime/30">
              <IconCheck className="h-7 w-7" />
            </span>
            <h1 className="mt-6 text-2xl font-extrabold text-white">{t('auth.update.done')}</h1>
            <Link href="/login" className="btn btn-secondary mt-8 inline-flex">
              {t('nav.login')}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mt-8 text-center text-2xl font-extrabold text-white">{t('auth.update.title')}</h1>

            {!isSupabaseConfigured() && (
              <p className="mt-4 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 px-3 py-2 text-center text-xs text-neon-cyan">
                {t('auth.demoNote')}
              </p>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="label">{t('auth.password')}</label>
                <input
                  type="password"
                  className="input"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" className="btn btn-primary w-full justify-center disabled:opacity-60" disabled={loading}>
                {loading ? '…' : t('auth.update.cta')} <IconArrow className="h-4 w-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
