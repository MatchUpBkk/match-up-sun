'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useT } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { dashboardPathForRole } from '@/lib/auth/roles';

export function UserMenu({ mobile = false }: { mobile?: boolean }) {
  const t = useT();
  const { user, role, fullName, avatarUrl, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  if (!user) return null;

  const dash = dashboardPathForRole(role);
  const initial = (fullName || user.email || '?').charAt(0).toUpperCase();

  if (mobile) {
    return (
      <div className="grid gap-2">
        <Link href={dash} className="btn-ghost justify-start">
          {t('nav.dashboard')}
        </Link>
        <Link href="/dashboard/profile" className="btn-ghost justify-start">
          {t('nav.profile')}
        </Link>
        <button type="button" onClick={() => signOut()} className="btn-secondary justify-start">
          {t('nav.logout')}
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white/80 transition hover:text-white"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neon-cyan/40 to-neon-purple/40 text-xs font-bold text-white">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </span>
        <span className="hidden max-w-[120px] truncate md:inline">{fullName || user.email}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-ink-700/95 shadow-glass backdrop-blur-xl"
        >
          <Link
            href={dash}
            role="menuitem"
            className="block px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            {t('nav.dashboard')}
          </Link>
          <Link
            href="/dashboard/profile"
            role="menuitem"
            className="block px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            {t('nav.profile')}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut()}
            className="block w-full px-4 py-2.5 text-left text-sm text-neon-pink transition hover:bg-white/5"
          >
            {t('nav.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
