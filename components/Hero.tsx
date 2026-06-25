'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'framer-motion';
import { useT } from '@/lib/i18n/context';
import { TextReveal } from './journey/TextReveal';
import { EASE } from './journey/tokens';
import { IconBall, IconTrophy, IconArrow } from './Icons';

const columns = [
  { src: '/videos/hero-left.mp4', poster: '/videos/hero-left-poster.jpg', labelKey: 'hero.left', accent: 'from-neon-cyan/30' },
  { src: '/videos/hero-center.mp4', poster: '/videos/hero-center-poster.jpg', labelKey: 'hero.center', accent: 'from-neon-lime/25' },
  { src: '/videos/hero-right.mp4', poster: '/videos/hero-right-poster.jpg', labelKey: 'hero.right', accent: 'from-neon-purple/30' },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export function Hero() {
  const t = useT();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Layered depth: video drifts + scales slowest; content lifts + fades fastest.
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Video wall — scroll parallax (outer) + slow Ken-Burns zoom (inner) */}
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y: videoY, scale: videoScale }}>
        <motion.div
          className="absolute inset-0 grid grid-cols-1 md:grid-cols-3"
          animate={reduce ? undefined : { scale: [1, 1.06] }}
          transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        >
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
        </motion.div>
      </motion.div>

      {/* Cinematic overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
      <div className="pointer-events-none absolute inset-0 bg-ink/30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent_30%,rgba(5,6,10,0.55)_100%)]" />
      {/* soft glow that breathes behind the headline */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-cyan/10 blur-3xl"
        animate={reduce ? undefined : { opacity: [0.3, 0.5, 0.3], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pt-20 text-center"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
          <motion.span variants={item} className="chip mb-6 bg-black/30 backdrop-blur-md">
            <IconBall width={14} height={14} className="text-neon-cyan" />
            {t('hero.eyebrow')}
          </motion.span>

          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.6)] sm:text-7xl md:text-8xl">
            <TextReveal
              delay={0.2}
              segments={[
                { text: 'PLAY.', className: 'text-gradient-anim' },
                { text: 'CONNECT.', className: 'text-white' },
                { text: 'COMPETE.', className: 'text-gradient-anim' },
              ]}
            />
          </h1>

          <motion.p variants={item} className="mt-6 max-w-2xl text-balance text-base text-white/75 sm:text-lg">
            {t('hero.subtitle')}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/events" className="btn-primary w-full sm:w-auto">
              <IconBall width={18} height={18} />
              {t('cta.findMatch')}
            </Link>
            <Link href="/tournaments" className="btn-secondary w-full sm:w-auto">
              <IconTrophy width={18} height={18} />
              {t('cta.viewTournaments')}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

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
