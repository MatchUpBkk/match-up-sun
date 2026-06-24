'use client';

import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { GlassCard } from '@/components/GlassCard';
import { useI18n } from '@/lib/i18n/context';
import {
  IconCalendar,
  IconUsers,
  IconChart,
  IconSpark,
  IconInstagram,
  IconFacebook,
  IconShield,
  IconCheck,
  IconUpload,
  IconArrow,
} from '@/components/Icons';

export default function OrganizersPage() {
  const { t } = useI18n();

  const features = [
    { icon: IconCalendar, k: 'org.f1' },
    { icon: IconUsers, k: 'org.f2' },
    { icon: IconChart, k: 'org.f3' },
    { icon: IconSpark, k: 'org.f4' },
  ];

  return (
    <div className="pt-28 pb-24 sm:pt-32">
      {/* Intro */}
      <section className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="chip mb-4">{t('org.eyebrow')}</span>
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">{t('org.title')}</h1>
            <p className="mt-4 text-white/60">{t('org.subtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-primary">
                {t('cta.becomeOrganizer')}
              </Link>
              <Link href="/pricing" className="btn btn-secondary">
                {t('nav.pricing')}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f) => (
                <GlassCard key={f.k} hover className="h-full">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-cyan/10 text-neon-cyan ring-1 ring-neon-cyan/30">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-semibold text-white">{t(`${f.k}.title`)}</p>
                  <p className="mt-1 text-sm text-white/55">{t(`${f.k}.body`)}</p>
                </GlassCard>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Social promotion */}
      <section className="container-x mt-24">
        <Reveal>
          <div className="glass relative overflow-hidden p-8 sm:p-12">
            <div className="absolute inset-0 bg-neon-gradient opacity-[0.08]" aria-hidden />
            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="chip mb-4">{t('community.eyebrow')}</span>
                <h2 className="text-3xl font-extrabold text-white">{t('org.social.title')}</h2>
                <p className="mt-3 text-white/60">{t('org.social.body')}</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <IconInstagram className="h-8 w-8 text-neon-purple" />
                  <p className="font-semibold text-white">Instagram</p>
                  <p className="text-xs text-white/50">Stories · Reels · Posts</p>
                </div>
                <div className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <IconFacebook className="h-8 w-8 text-neon-cyan" />
                  <p className="font-semibold text-white">Facebook</p>
                  <p className="text-xs text-white/50">Pages · Groups · Events</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Verification */}
      <section className="container-x mt-24">
        <Reveal>
          <SectionHeading eyebrow={t('verify.title')} title={t('verify.title')} subtitle={t('verify.subtitle')} />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-cyan/10 text-neon-cyan ring-1 ring-neon-cyan/30">
                  <IconShield className="h-5 w-5" />
                </span>
                <h3 className="font-bold text-white">{t('verify.id.title')}</h3>
              </div>
              <p className="mt-3 text-sm text-white/60">{t('verify.id.body')}</p>
            </GlassCard>
          </Reveal>
          <Reveal delay={100}>
            <GlassCard className="h-full">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple ring-1 ring-neon-purple/30">
                  <IconUpload className="h-5 w-5" />
                </span>
                <h3 className="font-bold text-white">{t('verify.address.title')}</h3>
              </div>
              <p className="mt-3 text-sm text-white/60">{t('verify.address.body')}</p>
            </GlassCard>
          </Reveal>
        </div>
        <Reveal>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-neon-lime/20 bg-neon-lime/5 px-5 py-4">
            <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-neon-lime" />
            <p className="text-sm text-white/70">{t('verify.note')}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-10 text-center">
            <Link href="/dashboard/organizer" className="btn btn-primary">
              {t('cta.getStarted')} <IconArrow className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
