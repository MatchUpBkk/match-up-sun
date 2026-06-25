'use client';

import Link from 'next/link';
import { DashLayout, StatTile, DataPanel, type DashTab } from '@/components/dashboard/DashLayout';
import { Badge } from '@/components/RoleBadge';
import { useI18n } from '@/lib/i18n/context';
import { sampleEvents } from '@/lib/data/sampleEvents';
import { formatDate, formatTHB } from '@/lib/utils';
import { IconCalendar, IconClock, IconCard, IconUsers, IconArrow } from '@/components/Icons';

export default function PlayerDashboard() {
  const { t, locale } = useI18n();

  const registered = sampleEvents.slice(0, 3);
  const history = sampleEvents.slice(3, 6);

  const tabs: DashTab[] = [
    {
      key: 'registrations',
      label: t('dash.player.registrations'),
      icon: IconCalendar,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile label={t('dash.player.registrations')} value="3" accent="cyan" />
            <StatTile label={t('dash.player.history')} value="12" accent="purple" />
            <StatTile label={t('dash.player.payments')} value="฿2,400" accent="lime" />
            <StatTile label={t('stats.matches')} value="9" accent="cyan" />
          </div>
          <DataPanel title={t('dash.player.registrations')}>
            <ul className="divide-y divide-white/5">
              {registered.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                  <div>
                    <Link href={`/events/${e.slug}`} className="font-semibold text-white hover:text-neon-cyan">
                      {e.title}
                    </Link>
                    <p className="mt-1 flex items-center gap-3 text-xs text-white/50">
                      <span className="flex items-center gap-1"><IconCalendar className="h-3.5 w-3.5" /> {formatDate(e.date, locale)}</span>
                      <span className="flex items-center gap-1"><IconClock className="h-3.5 w-3.5" /> {e.time}</span>
                    </p>
                  </div>
                  <Badge label={t('verify.status.approved')} variant="approved" />
                </li>
              ))}
            </ul>
          </DataPanel>
        </div>
      ),
    },
    {
      key: 'history',
      label: t('dash.player.history'),
      icon: IconClock,
      content: (
        <DataPanel title={t('dash.player.history')}>
          <ul className="divide-y divide-white/5">
            {history.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold text-white">{e.title}</p>
                  <p className="mt-1 text-xs text-white/50">{formatDate(e.date, locale)}</p>
                </div>
                <span className="text-sm text-white/40">{t('verify.status.approved')}</span>
              </li>
            ))}
          </ul>
        </DataPanel>
      ),
    },
    {
      key: 'payments',
      label: t('dash.player.payments'),
      icon: IconCard,
      content: (
        <DataPanel title={t('dash.player.payments')}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-white/40">
                <tr>
                  <th className="pb-3 pr-4">{t('nav.events')}</th>
                  <th className="pb-3 pr-4">{t('pay.amount')}</th>
                  <th className="pb-3">{t('dash.player.payments')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {registered.map((e) => (
                  <tr key={e.id}>
                    <td className="py-3 pr-4 text-white/80">{e.title}</td>
                    <td className="py-3 pr-4 font-semibold text-white">{formatTHB(e.type === 'tournament' ? e.entryFee ?? 0 : e.price ?? 0)}</td>
                    <td className="py-3"><Badge label={t('verify.status.approved')} variant="approved" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataPanel>
      ),
    },
    {
      key: 'profile',
      label: t('dash.player.profile'),
      icon: IconUsers,
      content: (
        <DataPanel title={t('dash.player.profile')}>
          <p className="text-sm text-white/60">{t('profile.subtitle')}</p>
          <Link href="/dashboard/profile" className="btn btn-primary mt-5 inline-flex">
            {t('nav.profile')}
          </Link>
        </DataPanel>
      ),
    },
  ];

  return (
    <DashLayout
      title={t('dash.player.title')}
      welcome={t('dash.welcome', { name: 'Alex' })}
      badge={
        <Link href="/events" className="btn btn-secondary">
          {t('cta.findMatch')} <IconArrow className="h-4 w-4" />
        </Link>
      }
      tabs={tabs}
    />
  );
}
