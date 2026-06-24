'use client';

import { useI18n } from '@/lib/i18n/context';
import { BANGKOK_AREAS } from '@/lib/data/sampleEvents';
import type { EventType, SkillLevel } from '@/lib/types';
import { IconSearch } from './Icons';

export interface Filters {
  q: string;
  type: EventType | 'all';
  area: string | 'all';
  date: string;
  maxPrice: number;
  level: SkillLevel | 'all';
}

export const EMPTY_FILTERS: Filters = {
  q: '',
  type: 'all',
  area: 'all',
  date: '',
  maxPrice: 2000,
  level: 'all',
};

export function FilterBar({
  filters,
  onChange,
  showType = true,
  showLevel = true,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  showType?: boolean;
  showLevel?: boolean;
}) {
  const { t } = useI18n();
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value });

  return (
    <div className="glass p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Search */}
        <div className="md:col-span-12">
          <label className="label">{t('discover.search')}</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              <IconSearch className="h-5 w-5" />
            </span>
            <input
              className="input pl-10"
              placeholder={t('discover.search')}
              value={filters.q}
              onChange={(e) => set('q', e.target.value)}
            />
          </div>
        </div>

        {showType && (
          <div className="md:col-span-3">
            <label className="label">{t('discover.type')}</label>
            <select className="input" value={filters.type} onChange={(e) => set('type', e.target.value as Filters['type'])}>
              <option value="all">{t('discover.type.all')}</option>
              <option value="tournament">{t('discover.type.tournament')}</option>
              <option value="session">{t('discover.type.session')}</option>
            </select>
          </div>
        )}

        <div className={showType ? 'md:col-span-3' : 'md:col-span-4'}>
          <label className="label">{t('discover.location')}</label>
          <select className="input" value={filters.area} onChange={(e) => set('area', e.target.value)}>
            <option value="all">{t('discover.location.all')}</option>
            {BANGKOK_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className={showType ? 'md:col-span-3' : 'md:col-span-4'}>
          <label className="label">{t('discover.date')}</label>
          <input type="date" className="input" value={filters.date} onChange={(e) => set('date', e.target.value)} />
        </div>

        {showLevel && (
          <div className="md:col-span-3">
            <label className="label">{t('discover.level')}</label>
            <select className="input" value={filters.level} onChange={(e) => set('level', e.target.value as Filters['level'])}>
              <option value="all">{t('discover.level.all')}</option>
              <option value="beginner">{t('level.beginner')}</option>
              <option value="intermediate">{t('level.intermediate')}</option>
              <option value="advanced">{t('level.advanced')}</option>
              <option value="mixed">{t('level.mixed')}</option>
            </select>
          </div>
        )}

        {/* Price */}
        <div className="md:col-span-12">
          <div className="flex items-center justify-between">
            <label className="label">{t('discover.price')}</label>
            <span className="text-sm font-semibold text-neon-cyan">
              {filters.maxPrice >= 2000 ? '฿2000+' : `฿${filters.maxPrice}`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice', Number(e.target.value))}
            className="w-full accent-neon-cyan"
          />
        </div>

        <div className="md:col-span-12 flex justify-end">
          <button className="btn btn-ghost" onClick={() => onChange(EMPTY_FILTERS)}>
            {t('discover.reset')}
          </button>
        </div>
      </div>
    </div>
  );
}

export function applyFilters(events: import('@/lib/types').FootballEvent[], f: Filters) {
  return events.filter((e) => {
    if (f.q && !`${e.title} ${e.description} ${e.location} ${e.area}`.toLowerCase().includes(f.q.toLowerCase())) return false;
    if (f.type !== 'all' && e.type !== f.type) return false;
    if (f.area !== 'all' && e.area !== f.area) return false;
    if (f.date && e.date.slice(0, 10) < f.date) return false;
    const price = e.type === 'tournament' ? e.entryFee ?? 0 : e.price ?? 0;
    if (f.maxPrice < 2000 && price > f.maxPrice) return false;
    if (f.level !== 'all' && e.type === 'session' && e.skillLevel && e.skillLevel !== f.level) return false;
    return true;
  });
}
