'use client';

import { useState } from 'react';
import { DashLayout, StatTile, DataPanel, type DashTab } from '@/components/dashboard/DashLayout';
import { Badge } from '@/components/RoleBadge';
import { useI18n } from '@/lib/i18n/context';
import { sampleEvents } from '@/lib/data/sampleEvents';
import { formatTHB } from '@/lib/utils';
import {
  IconShield,
  IconUsers,
  IconCalendar,
  IconSpark,
  IconCard,
  IconChart,
  IconCheck,
  IconX,
} from '@/components/Icons';

const pendingOrganizers = [
  { id: 'o1', name: 'Riverside SC', docs: 'ID + Utility bill', submitted: '2d ago' },
  { id: 'o2', name: 'Sukhumvit United', docs: 'Passport + Bank statement', submitted: '4h ago' },
  { id: 'o3', name: 'Thonburi FC', docs: 'Driver License + Water bill', submitted: '1d ago' },
];

const pendingPayments = [
  { id: 'p1', user: 'Somchai P.', event: 'Wednesday Night Match', amount: 250, method: 'PromptPay' },
  { id: 'p2', user: 'Ploy S.', event: 'Bangkok Cup 7s', amount: 1200, method: 'PromptPay' },
];

export default function AdminDashboard() {
  const { t } = useI18n();
  const [organizers, setOrganizers] = useState(pendingOrganizers);
  const [payments, setPayments] = useState(pendingPayments);

  const tabs: DashTab[] = [
    {
      key: 'analytics',
      label: t('dash.admin.analytics'),
      icon: IconChart,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile label={t('stats.players')} value="4,812" accent="cyan" />
            <StatTile label={t('stats.organizers')} value="62" accent="purple" />
            <StatTile label={t('nav.events')} value="318" accent="lime" />
            <StatTile label={t('dash.player.payments')} value="฿1.2M" accent="cyan" />
          </div>
          <DataPanel title={t('dash.admin.analytics')}>
            <div className="flex h-48 items-end gap-2">
              {[40, 65, 52, 78, 60, 88, 72, 95, 80, 110, 98, 124].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t bg-gradient-to-t from-neon-cyan/30 to-neon-purple/70" style={{ height: `${(h / 124) * 100}%` }} />
                  <span className="text-[10px] text-white/30">{i + 1}</span>
                </div>
              ))}
            </div>
          </DataPanel>
        </div>
      ),
    },
    {
      key: 'organizers',
      label: t('dash.admin.organizers'),
      icon: IconShield,
      content: (
        <DataPanel title={t('dash.admin.organizers')}>
          {organizers.length === 0 ? (
            <p className="py-8 text-center text-white/40">{t('dash.empty')}</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {organizers.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-white">{o.name}</p>
                    <p className="text-xs text-white/50">{o.docs} · {o.submitted}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1 rounded-lg border border-neon-lime/30 bg-neon-lime/10 px-3 py-1.5 text-xs font-semibold text-neon-lime"
                      onClick={() => setOrganizers((prev) => prev.filter((x) => x.id !== o.id))}
                    >
                      <IconCheck className="h-4 w-4" /> {t('dash.approve')}
                    </button>
                    <button
                      className="flex items-center gap-1 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-300"
                      onClick={() => setOrganizers((prev) => prev.filter((x) => x.id !== o.id))}
                    >
                      <IconX className="h-4 w-4" /> {t('dash.reject')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DataPanel>
      ),
    },
    {
      key: 'payments',
      label: t('dash.admin.payments'),
      icon: IconCard,
      content: (
        <DataPanel title={t('dash.admin.payments')}>
          {payments.length === 0 ? (
            <p className="py-8 text-center text-white/40">{t('dash.empty')}</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {payments.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-white">{p.user}</p>
                    <p className="text-xs text-white/50">{p.event} · {p.method}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-neon-cyan">{formatTHB(p.amount)}</span>
                    <button
                      className="flex items-center gap-1 rounded-lg border border-neon-lime/30 bg-neon-lime/10 px-3 py-1.5 text-xs font-semibold text-neon-lime"
                      onClick={() => setPayments((prev) => prev.filter((x) => x.id !== p.id))}
                    >
                      <IconCheck className="h-4 w-4" /> {t('dash.approve')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DataPanel>
      ),
    },
    {
      key: 'events',
      label: t('dash.admin.events'),
      icon: IconCalendar,
      content: (
        <DataPanel title={t('dash.admin.events')}>
          <ul className="divide-y divide-white/5">
            {sampleEvents.slice(0, 6).map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold text-white">{e.title}</p>
                  <p className="text-xs text-white/50">{e.organizer.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  {e.featured && <Badge label={t('discover.featured')} variant="featured" />}
                  <button className="flex items-center gap-1 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-1.5 text-xs font-semibold text-neon-cyan">
                    <IconSpark className="h-4 w-4" /> {t('dash.feature')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </DataPanel>
      ),
    },
    {
      key: 'users',
      label: t('dash.admin.users'),
      icon: IconUsers,
      content: (
        <DataPanel title={t('dash.admin.users')}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-white/40">
                <tr>
                  <th className="pb-3 pr-4">{t('auth.name')}</th>
                  <th className="pb-3 pr-4">{t('auth.role')}</th>
                  <th className="pb-3">{t('verify.title')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { n: 'Alex Player', r: t('auth.role.player'), v: 'approved' as const },
                  { n: 'Riverside SC', r: t('auth.role.organizer'), v: 'pending' as const },
                  { n: 'Somchai P.', r: t('auth.role.player'), v: 'approved' as const },
                ].map((u) => (
                  <tr key={u.n}>
                    <td className="py-3 pr-4 text-white/80">{u.n}</td>
                    <td className="py-3 pr-4 text-white/60">{u.r}</td>
                    <td className="py-3"><Badge label={t(`verify.status.${u.v}`)} variant={u.v} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataPanel>
      ),
    },
  ];

  return (
    <DashLayout
      title={t('dash.admin.title')}
      welcome={t('dash.welcome', { name: 'Admin' })}
      badge={<Badge label="Admin" variant="featured" />}
      tabs={tabs}
    />
  );
}
