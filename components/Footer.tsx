'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/context';
import { Logo } from './Logo';
import { IconInstagram, IconFacebook, IconArrow } from './Icons';

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-ink-800/60">
      <div className="container-x py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-white/55">{t('footer.tagline')}</p>
            <div className="mt-5 flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-neon-purple/50 hover:text-neon-purple" aria-label="Instagram">
                <IconInstagram width={18} height={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-neon-cyan/50 hover:text-neon-cyan" aria-label="Facebook">
                <IconFacebook width={18} height={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{t('footer.platform')}</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/events" className="hover:text-neon-cyan">{t('nav.events')}</Link></li>
              <li><Link href="/tournaments" className="hover:text-neon-cyan">{t('nav.tournaments')}</Link></li>
              <li><Link href="/community" className="hover:text-neon-cyan">{t('nav.community')}</Link></li>
              <li><Link href="/pricing" className="hover:text-neon-cyan">{t('nav.pricing')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{t('footer.company')}</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/organizers" className="hover:text-neon-cyan">{t('nav.organizers')}</Link></li>
              <li><Link href="/contact" className="hover:text-neon-cyan">{t('nav.contact')}</Link></li>
              <li><Link href="/login" className="hover:text-neon-cyan">{t('nav.login')}</Link></li>
              <li><Link href="/register" className="hover:text-neon-cyan">{t('nav.register')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{t('footer.newsletter')}</h4>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5"
            >
              <input type="email" required placeholder="you@email.com" className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 outline-none" />
              <button type="submit" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neon-gradient text-ink" aria-label={t('footer.subscribe')}>
                <IconArrow width={16} height={16} />
              </button>
            </form>
            <p className="mt-3 text-xs text-white/40">{t('footer.madeIn')}</p>
          </div>
        </div>

        <div className="neon-divider my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/45 sm:flex-row">
          <p>© {year} Match Up BKK. {t('footer.rights')}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">{t('footer.privacy')}</Link>
            <Link href="/terms" className="hover:text-white">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
