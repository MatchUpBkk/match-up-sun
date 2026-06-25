'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hero } from '@/components/Hero';
import { SectionHeading } from '@/components/SectionHeading';
import { EventCard } from '@/components/EventCard';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/RoleBadge';
import { CountUp } from '@/components/journey/CountUp';
import { StaggerGroup, StaggerItem, Reveal } from '@/components/journey/primitives';
import { ConnectionLines } from '@/components/journey/ConnectionLines';
import { TournamentBracket } from '@/components/journey/TournamentBracket';
import { CinematicCard } from '@/components/journey/CinematicCard';
import { Parallax } from '@/components/journey/Parallax';
import { useI18n } from '@/lib/i18n/context';
import { sampleEvents, testimonials } from '@/lib/data/sampleEvents';
import {
  IconSearch,
  IconCalendar,
  IconBall,
  IconTrophy,
  IconUsers,
  IconClock,
  IconShield,
  IconInstagram,
  IconFacebook,
  IconArrow,
  IconCheck,
  IconSpark,
} from '@/components/Icons';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HomePage() {
  const { t } = useI18n();

  const stats = [
    { value: '4,800+', label: t('stats.players') },
    { value: '320+', label: t('stats.matches') },
    { value: '60+', label: t('stats.organizers') },
    { value: '12', label: t('stats.cities') },
  ];

  const steps = [
    { icon: IconSearch, title: t('how.1.title'), body: t('how.1.body') },
    { icon: IconCalendar, title: t('how.2.title'), body: t('how.2.body') },
    { icon: IconUsers, title: t('how.3.title'), body: t('how.3.body') },
  ];

  const featured = sampleEvents.filter((e) => e.featured).slice(0, 3);
  const fallback = featured.length ? featured : sampleEvents.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Stats — "Join Matches": cards rise + numbers count up */}
      <section id="s-matches" className="border-y border-white/5 bg-ink-800/40">
        <StaggerGroup className="container-x grid grid-cols-2 gap-6 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-gradient sm:text-4xl">
                <CountUp value={s.value} />
              </div>
              <div className="mt-1 text-sm uppercase tracking-wide text-white/50">{s.label}</div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* How it works — "Find Players" */}
      <section id="s-find" className="container-x py-20 sm:py-28">
        <Reveal>
          <SectionHeading eyebrow={t('how.eyebrow')} title={t('how.title')} subtitle={t('how.subtitle')} />
        </Reveal>
        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <StaggerItem key={s.title}>
              <GlassCard hover className="h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-cyan/10 text-neon-cyan ring-1 ring-neon-cyan/30">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <span className="text-sm font-bold text-neon-purple">0{i + 1}</span>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.body}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Event types — "Join Tournaments": self-drawing bracket */}
      <section id="s-tournaments" className="relative overflow-hidden border-y border-white/5 bg-ink-800/30 py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading eyebrow={t('types.eyebrow')} title={t('types.title')} />
          </Reveal>
          <div className="mx-auto mt-10 max-w-2xl">
            <TournamentBracket />
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal direction="right">
              <div className="glass glass-hover h-full overflow-hidden p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-purple/10 text-neon-purple ring-1 ring-neon-purple/30">
                    <IconTrophy className="h-6 w-6" />
                  </span>
                  <Badge label={t('discover.type.tournament')} variant="tournament" />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold text-white">{t('types.tournament.title')}</h3>
                <p className="mt-3 text-white/60">{t('types.tournament.body')}</p>
                <Link href="/tournaments" className="btn btn-secondary mt-6 inline-flex">
                  {t('cta.viewTournaments')} <IconArrow className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <Reveal direction="left">
              <div className="glass glass-hover h-full overflow-hidden p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-cyan/10 text-neon-cyan ring-1 ring-neon-cyan/30">
                    <IconBall className="h-6 w-6" />
                  </span>
                  <Badge label={t('discover.type.session')} variant="session" />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold text-white">{t('types.session.title')}</h3>
                <p className="mt-3 text-white/60">{t('types.session.body')}</p>
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 px-4 py-3 text-sm text-neon-cyan">
                  <IconClock className="h-4 w-4 shrink-0" />
                  <span className="font-semibold">{t('types.session.example')}</span>
                </div>
                <Link href="/events" className="btn btn-secondary mt-6 inline-flex">
                  {t('cta.findMatch')} <IconArrow className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured events — "Compete": alternating staggered cards */}
      <section id="s-compete" className="container-x py-20 sm:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="left" eyebrow={t('discover.featured')} title={t('discover.title')} subtitle={t('discover.subtitle')} />
            <Link href="/events" className="btn btn-ghost shrink-0">
              {t('cta.viewAll')} <IconArrow className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {fallback.map((e) => (
            <StaggerItem key={e.id} className="h-full">
              <CinematicCard className="h-full">
                <EventCard event={e} />
              </CinematicCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Organizer + social CTA — "Build Connections" */}
      <section id="s-connections" className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
        <Parallax className="pointer-events-none absolute inset-x-0 -inset-y-12" from={-24} to={24}>
          <div className="h-full w-full bg-neon-gradient opacity-[0.08]" aria-hidden />
        </Parallax>
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right">
            <span className="chip mb-4">{t('org.eyebrow')}</span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('org.title')}</h2>
            <p className="mt-4 text-white/60">{t('org.subtitle')}</p>
            <ul className="mt-6 space-y-3">
              {['org.f1', 'org.f2', 'org.f3', 'org.f4'].map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neon-lime/10 text-neon-lime ring-1 ring-neon-lime/30">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">{t(`${k}.title`)}</p>
                    <p className="text-sm text-white/55">{t(`${k}.body`)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/organizers" className="btn btn-primary">
                {t('cta.becomeOrganizer')}
              </Link>
              <Link href="/pricing" className="btn btn-secondary">
                {t('nav.pricing')}
              </Link>
            </div>
          </Reveal>

          <Reveal direction="left" delay={120}>
            <GlassCard className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-purple/10 text-neon-purple ring-1 ring-neon-purple/30">
                  <IconSpark className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-white">{t('org.social.title')}</h3>
              </div>
              <p className="mt-3 text-sm text-white/60">{t('org.social.body')}</p>
              <div className="mt-6 flex gap-3">
                <span className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white">
                  <IconInstagram className="h-5 w-5 text-neon-purple" /> Instagram
                </span>
                <span className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white">
                  <IconFacebook className="h-5 w-5 text-neon-cyan" /> Facebook
                </span>
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-neon-lime/20 bg-neon-lime/5 px-4 py-3">
                <IconShield className="h-5 w-5 shrink-0 text-neon-lime" />
                <p className="text-sm text-white/70">{t('org.verify.body')}</p>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* Testimonials — "Become Part of the Community": animated connection lines */}
      <section id="s-community" className="container-x py-20 sm:py-28">
        <Reveal>
          <SectionHeading eyebrow={t('community.eyebrow')} title={t('community.testimonials')} />
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl opacity-80">
          <ConnectionLines />
        </div>
        <StaggerGroup className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {testimonials.map((tm) => (
            <StaggerItem key={tm.id}>
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
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Final CTA — the journey arrives */}
      <section id="s-register" className="container-x pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="glass relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          <div className="absolute inset-0 bg-neon-gradient opacity-10" aria-hidden />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-lime/20 blur-3xl"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: [0, 0.8, 0.45], scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          />
          <div className="relative">
            <h2 className="text-3xl font-extrabold text-white sm:text-5xl">{t('hero.title')}</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">{t('community.subtitle')}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/events" className="btn btn-primary">
                {t('cta.findMatch')}
              </Link>
              <Link href="/register" className="btn btn-secondary">
                {t('cta.getStarted')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
