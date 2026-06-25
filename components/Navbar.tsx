'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';
import { IconMenu, IconX } from './Icons';
import { cn } from '@/lib/utils';

const links = [
  { href: '/events', key: 'nav.events' },
  { href: '/tournaments', key: 'nav.tournaments' },
  { href: '/community', key: 'nav.community' },
  { href: '/organizers', key: 'nav.organizers' },
  { href: '/pricing', key: 'nav.pricing' },
  { href: '/contact', key: 'nav.contact' },
];

export function Navbar() {
  const t = useT();
  const pathname = usePathname();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'border-b border-white/10 bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  active ? 'text-neon-cyan' : 'text-white/70 hover:text-white',
                )}
              >
                {t(l.key)}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/login" className="hidden rounded-xl px-3 py-2 text-sm font-medium text-white/80 transition hover:text-white sm:inline-flex">
                {t('nav.login')}
              </Link>
              <Link href="/register" className="hidden btn-primary !px-4 !py-2 text-sm sm:inline-flex">
                {t('nav.register')}
              </Link>
            </>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-3 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white">
                {t(l.key)}
              </Link>
            ))}
            {user ? (
              <div className="mt-2">
                <UserMenu mobile />
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/login" className="btn-ghost">
                  {t('nav.login')}
                </Link>
                <Link href="/register" className="btn-primary">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
