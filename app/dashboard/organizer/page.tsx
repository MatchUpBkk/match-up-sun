'use client';

import { useState } from 'react';
import { DashLayout, StatTile, DataPanel, type DashTab } from '@/components/dashboard/DashLayout';
import { Badge } from '@/components/RoleBadge';
import { useI18n } from '@/lib/i18n/context';
import { sampleEvents } from '@/lib/data/sampleEvents';
import { formatDate, formatTHB, downloadCSV } from '@/lib/utils';
import {
  IconCalendar,
  IconUsers,
  IconUpload,
  IconShield,
  IconCheck,
  IconChart,
  IconTrophy,
  IconBall,
} from '@/components/Icons';

const sampleParticipants = [
  { name: 'Somchai P.', email: 'somchai@example.com', team: 'Bangkok Lions', paid: 'Paid', attended: 'Yes' },
  { name: 'Niran K.', email: 'niran@example.com', team: 'Thonburi FC', paid: 'Paid', attended: 'Yes' },
  { name: 'James W.', email: 'james@example.com', team: 'Sukhumvit United', paid: 'Pending', attended: 'No' },
  { name: 'Ploy S.', email: 'ploy@example.com', team: 'Riverside SC', paid: 'Paid', attended: 'No' },
];

export default function OrganizerDashboard() {
  const { t, locale } = useI18n();
  const [verifStatus] = useState<'pending' | 'approved'>('pending');
  const myEvents = sampleEvents.slice(0, 4);

  const tabs: DashTab[] = [
    {
      key: 'events',
      label: t('dash.organizer.myEvents'),
      icon: IconCalendar,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile label={t('dash.organizer.myEvents')} value="4" accent="cyan" />
            <StatTile label={t('stats.players')} value="186" accent="purple" />
            <StatTile label={t('dash.player.payments')} value="฿74,600" accent="lime" />
            <StatTile label={t('discover.featured')} value="2" accent="cyan" />
          </div>
          <DataPanel title={t('dash.organizer.myEvents')}>
            <ul className="divide-y divide-white/5">
              {myEvents.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${e.type === 'tournament' ? 'bg-neon-purple/10 text-neon-purple' : 'bg-neon-cyan/10 text-neon-cyan'}`}>
                      {e.type === 'tournament' ? <IconTrophy className="h-5 w-5" /> : <IconBall className="h-5 w-5" />}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{e.title}</p>
                      <p className="text-xs text-white/50">{formatDate(e.date, locale)} · {e.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {e.featured && <Badge label={t('discover.featured')} variant="featured" />}
                    <button className="btn btn-ghost px-3 py-1.5 text-xs">{t('dash.organizer.participants')}</button>
                  </div>
                </li>
              ))}
            </ul>
          </DataPanel>
        </div>
      ),
    },
    {
      key: 'create',
      label: t('dash.organizer.create'),
      icon: IconCheck,
      content: (
        <DataPanel title={t('dash.organizer.create')}>
          {verifStatus !== 'approved' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
              <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <p className="text-sm text-amber-200/90">{t('org.verify.body')}</p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">{t('contact.subject')}</label>
              <input className="input" placeholder="Wednesday Night Match — 90 Min · 3 Teams" />
            </div>
            <div>
              <label className="label">{t('discover.type')}</label>
              <select className="input">
                <option value="session">{t('discover.type.session')}</option>
                <option value="tournament">{t('discover.type.tournament')}</option>
              </select>
            </div>
            <div>
              <label className="label">{t('discover.location')}</label>
              <input className="input" placeholder="Bangkok" />
            </div>
            <div>
              <label className="label">{t('discover.date')}</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="label">{t('event.price')}</label>
              <input type="number" className="input" placeholder="250" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t('contact.message')}</label>
              <textarea className="input min-h-[120px] resize-y" />
            </div>
          </div>
          <button className="btn btn-primary mt-5" disabled={verifStatus !== 'approved'}>
            {t('dash.organizer.create')}
          </button>
        </DataPanel>
      ),
    },
    {
      key: 'participants',
      label: t('dash.organizer.participants'),
      icon: IconUsers,
      content: (
        <DataPanel
          title={t('dash.organizer.participants')}
          action={
            <button className="btn btn-secondary px-3 py-1.5 text-xs" onClick={() => downloadCSV('participants.csv', sampleParticipants)}>
              {t('dash.export')}
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-white/40">
                <tr>
                  <th className="pb-3 pr-4">{t('auth.name')}</th>
                  <th className="pb-3 pr-4">{t('event.teams')}</th>
                  <th className="pb-3 pr-4">{t('dash.player.payments')}</th>
                  <th className="pb-3">{t('dash.attendance')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sampleParticipants.map((p) => (
                  <tr key={p.email}>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="text-xs text-white/40">{p.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-white/70">{p.team}</td>
                    <td className="py-3 pr-4">
                      <Badge label={p.paid} variant={p.paid === 'Paid' ? 'approved' : 'pending'} />
                    </td>
                    <td className="py-3">
                      <input type="checkbox" defaultChecked={p.attended === 'Yes'} className="h-4 w-4 accent-neon-cyan" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataPanel>
      ),
    },
    {
      key: 'media',
      label: t('dash.organizer.media'),
      icon: IconUpload,
      content: (
        <DataPanel title={t('dash.organizer.media')}>
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <label key={i} className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/5 text-center transition hover:border-neon-cyan/40">
                <IconUpload className="h-7 w-7 text-white/40" />
                <span className="text-xs text-white/50">{t('verify.upload')}</span>
                <input type="file" accept="image/*,video/*" className="hidden" />
              </label>
            ))}
          </div>
        </DataPanel>
      ),
    },
    {
      key: 'verification',
      label: t('dash.organizer.verification'),
      icon: IconShield,
      content: (
        <DataPanel title={t('verify.title')}>
          <div className="mb-5 flex items-center gap-3">
            <span className="text-sm text-white/55">{t('verify.title')}:</span>
            <Badge label={verifStatus === 'approved' ? t('verify.status.approved') : t('verify.status.pending')} variant={verifStatus === 'approved' ? 'approved' : 'pending'} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-semibold text-white">{t('verify.id.title')}</p>
              <p className="mb-3 text-xs text-white/50">{t('verify.id.body')}</p>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-8 transition hover:border-neon-cyan/40">
                <IconUpload className="h-6 w-6 text-white/40" />
                <span className="text-xs text-white/50">{t('verify.upload')}</span>
                <input type="file" accept="image/*,application/pdf" className="hidden" />
              </label>
            </div>
            <div>
              <p className="mb-2 font-semibold text-white">{t('verify.address.title')}</p>
              <p className="mb-3 text-xs text-white/50">{t('verify.address.body')}</p>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-8 transition hover:border-neon-purple/40">
                <IconUpload className="h-6 w-6 text-white/40" />
                <span className="text-xs text-white/50">{t('verify.upload')}</span>
                <input type="file" accept="image/*,application/pdf" className="hidden" />
              </label>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-neon-lime/20 bg-neon-lime/5 px-4 py-3">
            <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-neon-lime" />
            <p className="text-sm text-white/70">{t('verify.note')}</p>
          </div>
          <button className="btn btn-primary mt-5">{t('verify.submit')}</button>
        </DataPanel>
      ),
    },
    {
      key: 'analytics',
      label: t('dash.admin.analytics'),
      icon: IconChart,
      content: (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile label={t('stats.players')} value="186" accent="cyan" />
          <StatTile label={t('dash.player.payments')} value="฿74,600" accent="lime" />
          <StatTile label={t('discover.results')} value="68%" accent="purple" />
        </div>
      ),
    },
  ];

  return (
    <DashLayout
      title={t('dash.organizer.title')}
      welcome={t('dash.welcome', { name: 'Riverside SC' })}
      badge={<Badge label={verifStatus === 'approved' ? t('verify.status.approved') : t('verify.status.pending')} variant={verifStatus === 'approved' ? 'approved' : 'pending'} />}
      tabs={tabs}
    />
  );
}
