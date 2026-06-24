'use client';

import Link from 'next/link';
import type { FootballEvent } from '@/lib/types';
import { useI18n } from '@/lib/i18n/context';
import { formatDate, formatTHB, cn } from '@/lib/utils';
import { Badge } from './RoleBadge';
import { IconCalendar, IconClock, IconPin, IconUsers, IconTrophy, IconBall, IconShield, IconArrow } from './Icons';

function coverGradient(e: FootballEvent): string {
  return e.type === 'tournament'
    ? 'from-neon-purple/40 via-ink-700 to-neon-cyan/30'
    : 'from-neon-cyan/40 via-ink-700 to-neon-lime/25';
}

export function EventCard({ event }: { event: FootballEvent }) {
  const { t, locale } = useI18n();
  const isTournament = event.type === 'tournament';

  const spotsLeft =
    !isTournament && event.spotsTotal != null && event.spotsTaken != null ? event.spotsTotal - event.spotsTaken : null;
  const teamsLeft =
    isTournament && event.maxTeams != null && event.registeredTeams != null ? event.maxTeams - event.registeredTeams : null;
  const soldOut = (spotsLeft != null && spotsLeft <= 0) || (teamsLeft != null && teamsLeft <= 0);
  const price = isTournament ? event.entryFee ?? 0 : event.price ?? 0;

  return (
    <div className="group glass glass-hover flex flex-col overflow-hidden p-0">
      {/* Cover */}
      <div className={cn('relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br', coverGradient(event))}>
        <div className="absolute inset-0 bg-grid bg-[size:22px_22px] opacity-40" />
        <div className="absolute inset-0 grid place-items-center">
          {isTournament ? (
            <IconTrophy className="text-white/15 transition-transform duration-500 group-hover:scale-110" width={96} height={96} />
          ) : (
            <IconBall className="text-white/15 transition-transform duration-500 group-hover:scale-110" width={96} height={96} />
          )}
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge label={isTournament ? t('discover.type.tournament') : t('discover.type.session')} variant={event.type} />
          {event.featured && <Badge label={t('discover.featured')} variant="featured" />}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="rounded-lg border border-white/15 bg-black/50 px-2.5 py-1 text-sm font-bold text-white backdrop-blur-md">
            {price === 0 ? t('event.free') : formatTHB(price)}
            {price > 0 && <span className="ml-1 text-[11px] font-medium text-white/60">{isTournament ? t('event.perTeam') : t('event.perPlayer')}</span>}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-white">{event.title}</h3>

        <div className="mt-3 space-y-2 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <IconCalendar width={15} height={15} className="text-neon-cyan" />
            <span>{formatDate(event.date, locale)}</span>
            <IconClock width={15} height={15} className="ml-2 text-neon-cyan" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconPin width={15} height={15} className="text-neon-purple" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            {isTournament ? (
              <>
                <IconTrophy width={15} height={15} className="text-neon-lime" />
                <span>{event.prize || '—'}</span>
              </>
            ) : (
              <>
                <IconUsers width={15} height={15} className="text-neon-lime" />
                <span className="capitalize">{t(`level.${event.skillLevel ?? 'mixed'}`)}</span>
              </>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="mt-4">
          {soldOut ? (
            <span className="text-sm font-semibold text-red-300">{t('event.soldOut')}</span>
          ) : isTournament ? (
            <AvailabilityBar value={event.registeredTeams ?? 0} total={event.maxTeams ?? 0} label={`${teamsLeft} ${t('event.teams')} ${t('event.spots')}`} />
          ) : (
            <AvailabilityBar value={event.spotsTaken ?? 0} total={event.spotsTotal ?? 0} label={`${spotsLeft} ${t('event.spots')}`} />
          )}
        </div>

        {/* Organizer + CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-xs text-white/55">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-white">
              {event.organizer.name.slice(0, 2).toUpperCase()}
            </span>
            <span className="flex items-center gap-1">
              {event.organizer.name}
              {event.organizer.verified && <IconShield width={13} height={13} className="text-neon-cyan" />}
            </span>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className={cn('inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition', soldOut ? 'text-white/40' : 'text-neon-cyan hover:gap-2')}
          >
            {t('cta.seeDetails')}
            <IconArrow width={15} height={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function AvailabilityBar({ value, total, label }: { value: number; total: number; label: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-white/50">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-neon-gradient transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
