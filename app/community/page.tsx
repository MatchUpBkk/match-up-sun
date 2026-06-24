'use client';

import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { GlassCard } from '@/components/GlassCard';
import { EventCard } from '@/components/EventCard';
import { useI18n } from '@/lib/i18n/context';
import { sampleEvents, testimonials } from '@/lib/data/sampleEvents';
import { IconPlay, IconBall, IconArrow } from '@/components/Icons';

const galleryGradients = [
  'from-neon-cyan/30 to-neon-purple/20',
  'from-neon-purple/30 to-neon-cyan/20',
  'from-neon-lime/25 to-neon-cyan/20',
  'from-neon-cyan/25 to-neon-lime/20',
  'from-neon-purple/30 to-neon-lime/20',
  'from-neon-cyan/30 to-neon-purple/25',
];

export default function CommunityPage() {
  const { t } = useI18n();
  const upcoming = sampleEvents.slice(0, 3);

  return (
    <div className="pt-28 pb-24 sm:pt-32">
      <section className="container-x">
        <Reveal>
          <SectionHeading eyebrow={t('community.eyebrow')} title={t('community.title')} subtitle={t('community.subtitle')} />
        </Reveal>
      </section>

      {/* Highlights / video */}
      <section className="container-x mt-14">
        <Reveal>
          <h2 className="text-2xl font-bold text-white">{t('community.highlights')}</h2>
        </Reveal>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="glass relative aspect-video overflow-hidden p-0">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/videos/hero-center-poster.jpg"
              >
                <source src="/videos/hero-center.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neon-cyan/20 text-neon-cyan ring-1 ring-neon-cyan/40 backdrop-blur">
                  <IconPlay className="h-5 w-5" />
                </span>
                <p className="font-semibold text-white">{t('community.highlights')}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid h-full grid-rows-2 gap-6">
              {[0, 1].map((idx) => (
                <div key={idx} className="glass relative overflow-hidden p-0">
                  <video className="h-full w-full object-cover" autoPlay muted loop playsInline poster={idx === 0 ? '/videos/hero-left-poster.jpg' : '/videos/hero-right-poster.jpg'}>
                    <source src={idx === 0 ? '/videos/hero-left.mp4' : '/videos/hero-right.mp4'} type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Photo gallery */}
      <section className="container-x mt-20">
        <Reveal>
          <h2 className="text-2xl font-bold text-white">{t('community.gallery')}</h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {galleryGradients.map((g, i) => (
            <Reveal key={i} delay={(i % 3) * 70}>
              <div className={`glass relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br ${g} p-0`}>
                <IconBall className="h-12 w-12 text-white/20" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-wide text-white/60">
                  Match #{i + 1}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section className="container-x mt-20">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">{t('community.upcoming')}</h2>
            <Link href="/events" className="btn btn-ghost shrink-0">
              {t('cta.viewAll')} <IconArrow className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((e, i) => (
            <Reveal key={e.id} delay={(i % 3) * 80}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-x mt-20">
        <Reveal>
          <h2 className="text-2xl font-bold text-white">{t('community.testimonials')}</h2>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((tm, i) => (
            <Reveal key={tm.id} delay={i * 80}>
              <GlassCard hover className="h-full">
                <p className="text-sm leading-relaxed text-white/75">“{tm.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 text-sm font-bold text-white">
                    {tm.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{tm.name}</p>
                    <p className="text-xs text-white/50">{tm.role}</p>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x mt-20">
        <Reveal>
          <div className="glass relative overflow-hidden px-6 py-14 text-center">
            <div className="absolute inset-0 bg-neon-gradient opacity-10" aria-hidden />
            <div className="relative">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{t('community.join')}</h2>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/register" className="btn btn-primary">
                  {t('cta.getStarted')}
                </Link>
                <Link href="/events" className="btn btn-secondary">
                  {t('cta.findMatch')}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
