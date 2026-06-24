'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/context';
import { IconBall, IconTrophy, IconArrow } from './Icons';

const columns = [
  { src: '/videos/hero-left.mp4', poster: '/videos/hero-left-poster.jpg', labelKey: 'hero.left', accent: 'from-neon-cyan/30' },
  { src: '/videos/hero-center.mp4', poster: '/videos/hero-center-poster.jpg', labelKey: 'hero.center', accent: 'from-neon-lime/25' },
  { src: '/videos/hero-right.mp4', poster: '/videos/hero-right-poster.jpg', labelKey: 'hero.right', accent: 'from-neon-purple/30' },
];

export function Hero() {
  const t = useT();

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Video wall */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3">
        {columns.map((c, i) => (
          <div
            key={c.src}
            className={[
              'relative h-full w-full overflow-hidden',
              i === 0 ? 'block' : '',
              i === 1 ? 'hidden md:block' : '',
              i === 2 ? 'hidden md:block' : '',
            ].join(' ')}
          >
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload={i === 0 ? 'auto' : 'metadata'}
              poster={c.poster}
            >
              <source src={c.src} type="video/mp4" />
            </video>
            {/* per-column accent glow */}
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${c.accent} to-transparent opacity-60`} />
            {/* column label */}
            <div className="pointer-events-none absolute bottom-28 left-0 right-0 hidden justify-center md:flex">
              <span className="chip bg-black/40 backdrop-blur-md">{t(c.labelKey)}</span>
            </div>
            {/* divider */}
            {i < 2 && <div className="absolute right-0 top-0 hidden h-full w-px bg-white/10 md:block" />}
          </div>
        ))}
      </div>

      {/* Cinematic overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
      <div className="pointer-events-none absolute inset-0 bg-ink/30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent_30%,rgba(5,6,10,0.5)_100%)]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pt-20 text-center">
        <span className="chip mb-6 animate-fade-in bg-black/30 backdrop-blur-md">
          <IconBall width={14} height={14} className="text-neon-cyan" />
          {t('hero.eyebrow')}
        </span>

        <h1 className="animate-fade-up text-balance text-5xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.6)] sm:text-7xl md:text-8xl">
          <span className="text-gradient-anim">PLAY.</span>{' '}
          <span className="text-white">CONNECT.</span>{' '}
          <span className="text-gradient-anim">COMPETE.</span>
        </h1>

        <p className="mt-6 max-w-2xl animate-fade-up text-balance text-base text-white/75 sm:text-lg" style={{ animationDelay: '120ms' }}>
          {t('hero.subtitle')}
        </p>

        <div className="mt-9 flex animate-fade-up flex-col items-center gap-3 sm:flex-row" style={{ animationDelay: '220ms' }}>
          <Link href="/events" className="btn-primary w-full sm:w-auto">
            <IconBall width={18} height={18} />
            {t('cta.findMatch')}
          </Link>
          <Link href="/tournaments" className="btn-secondary w-full sm:w-auto">
            <IconTrophy width={18} height={18} />
            {t('cta.viewTournaments')}
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-pulse-glow">
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-[10px] uppercase tracking-[0.3em]">{t('hero.scroll')}</span>
          <IconArrow width={16} height={16} className="rotate-90" />
        </div>
      </div>
    </section>
  );
}
