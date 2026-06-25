'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { Badge } from '@/components/RoleBadge';
import { PromptPayPanel } from '@/components/PromptPayPanel';
import { useI18n } from '@/lib/i18n/context';
import { formatDate, formatTHB } from '@/lib/utils';
import type { FootballEvent, PaymentMethod } from '@/lib/types';
import {
  IconCalendar,
  IconClock,
  IconPin,
  IconUsers,
  IconTrophy,
  IconShield,
  IconCard,
  IconQR,
  IconCheck,
  IconArrow,
  IconBall,
} from '@/components/Icons';

export function EventDetail({ event }: { event: FootballEvent }) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardDone, setCardDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const isTournament = event.type === 'tournament';
  const price = isTournament ? event.entryFee ?? 0 : event.price ?? 0;
  const spotsLeft =
    !isTournament && event.spotsTotal != null && event.spotsTaken != null ? event.spotsTotal - event.spotsTaken : null;
  const teamsLeft =
    isTournament && event.maxTeams != null && event.registeredTeams != null ? event.maxTeams - event.registeredTeams : null;

  const startCardCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, title: event.title, amount: price }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      // Demo fallback when Stripe keys are not configured
      setCardDone(true);
    } catch {
      setCardDone(true);
    } finally {
      setLoading(false);
    }
  };

  const meta = [
    { icon: IconCalendar, label: formatDate(event.date, locale) },
    { icon: IconClock, label: event.time },
    { icon: IconPin, label: event.location },
    isTournament
      ? { icon: IconTrophy, label: event.prize ?? '' }
      : { icon: IconUsers, label: `${event.skillLevel ? t(`level.${event.skillLevel}`) : ''}` },
  ].filter((m) => m.label);

  return (
    <div className="pt-24 pb-24 sm:pt-28">
      {/* Cover */}
      <div className={`relative h-64 w-full overflow-hidden sm:h-80 ${isTournament ? 'bg-gradient-to-br from-neon-purple/40 via-ink-700 to-neon-cyan/30' : 'bg-gradient-to-br from-neon-cyan/40 via-ink-700 to-neon-lime/25'}`}>
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        <IconBall className="absolute -right-8 -top-8 h-56 w-56 text-white/5" />
        <div className="container-x relative flex h-full flex-col justify-end pb-8">
          <div className="flex flex-wrap gap-2">
            <Badge label={isTournament ? t('discover.type.tournament') : t('discover.type.session')} variant={event.type} />
            {event.featured && <Badge label={t('discover.featured')} variant="featured" />}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">{event.title}</h1>
        </div>
      </div>

      <div className="container-x mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Left: details */}
        <div>
          <Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {meta.map((m, i) => (
                <div key={i} className="glass p-4">
                  <m.icon className="h-5 w-5 text-neon-cyan" />
                  <p className="mt-2 text-sm font-medium text-white/80">{m.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-8">
              <h2 className="text-xl font-bold text-white">{t('nav.events')}</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-white/65">{event.description}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 font-bold text-white">
                {event.organizer.name.charAt(0)}
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">{t('event.organizer')}</p>
                <p className="flex items-center gap-1.5 font-semibold text-white">
                  {event.organizer.name}
                  {event.organizer.verified && <IconShield className="h-4 w-4 text-neon-lime" />}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: registration card */}
        <div>
          <div className="glass sticky top-24 p-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-white/50">{isTournament ? t('event.entryFee') : t('event.price')}</span>
              <span className="text-3xl font-extrabold text-gradient">{formatTHB(price)}</span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {spotsLeft != null && (
                <div className="flex items-center justify-between text-white/60">
                  <span>{t('event.spots')}</span>
                  <span className="font-semibold text-white">{spotsLeft}</span>
                </div>
              )}
              {teamsLeft != null && (
                <div className="flex items-center justify-between text-white/60">
                  <span>{t('event.teams')}</span>
                  <span className="font-semibold text-white">{teamsLeft}</span>
                </div>
              )}
            </div>

            {!open ? (
              <button className="btn btn-primary mt-6 w-full justify-center" onClick={() => setOpen(true)}>
                {t('event.register')} <IconArrow className="h-4 w-4" />
              </button>
            ) : (
              <div className="mt-6">
                {/* Method tabs */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      method === 'card' ? 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan' : 'border-white/10 bg-white/5 text-white/60'
                    }`}
                    onClick={() => setMethod('card')}
                  >
                    <IconCard className="h-4 w-4" /> {t('pay.card')}
                  </button>
                  <button
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      method === 'promptpay' ? 'border-neon-purple/50 bg-neon-purple/10 text-neon-purple' : 'border-white/10 bg-white/5 text-white/60'
                    }`}
                    onClick={() => setMethod('promptpay')}
                  >
                    <IconQR className="h-4 w-4" /> {t('pay.promptpay')}
                  </button>
                </div>

                <div className="mt-5">
                  {method === 'card' ? (
                    cardDone ? (
                      <div className="flex flex-col items-center py-8 text-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neon-lime/10 text-neon-lime ring-1 ring-neon-lime/30">
                          <IconCheck className="h-7 w-7" />
                        </span>
                        <p className="mt-4 font-semibold text-white">{t('contact.sent')}</p>
                        <p className="mt-1 text-xs text-white/50">{t('misc.demo')}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-white/55">{t('pay.cardBody')}</p>
                        <button
                          className="btn btn-primary mt-4 w-full justify-center disabled:opacity-60"
                          onClick={startCardCheckout}
                          disabled={loading}
                        >
                          {loading ? '…' : `${t('pay.pay')} · ${formatTHB(price)}`}
                        </button>
                      </div>
                    )
                  ) : (
                    <PromptPayPanel amount={price} />
                  )}
                </div>
              </div>
            )}

            <p className="mt-4 text-center text-xs text-white/35">{t('misc.demo')}</p>
          </div>
        </div>
      </div>

      <div className="container-x mt-16">
        <Link href="/events" className="btn btn-ghost">
          ← {t('nav.events')}
        </Link>
      </div>
    </div>
  );
}
