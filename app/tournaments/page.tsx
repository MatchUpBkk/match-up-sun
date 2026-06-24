'use client';

import { useMemo, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { EventCard } from '@/components/EventCard';
import { FilterBar, EMPTY_FILTERS, applyFilters, type Filters } from '@/components/FilterBar';
import { useI18n } from '@/lib/i18n/context';
import { sampleEvents } from '@/lib/data/sampleEvents';

export default function TournamentsPage() {
  const { t } = useI18n();
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS, type: 'tournament' });

  const tournaments = useMemo(() => sampleEvents.filter((e) => e.type === 'tournament'), []);
  const results = useMemo(() => applyFilters(tournaments, filters), [tournaments, filters]);

  return (
    <div className="container-x pt-28 pb-24 sm:pt-32">
      <Reveal>
        <span className="chip mb-4">{t('discover.type.tournament')}</span>
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">{t('nav.tournaments')}</h1>
        <p className="mt-3 max-w-2xl text-white/60">{t('types.tournament.body')}</p>
      </Reveal>

      <div className="mt-10">
        <Reveal>
          <FilterBar filters={filters} onChange={setFilters} showType={false} showLevel={false} />
        </Reveal>
      </div>

      <p className="mt-8 text-sm text-white/50">
        {results.length} {t('discover.results')}
      </p>

      {results.length === 0 ? (
        <div className="glass mt-6 p-12 text-center text-white/50">{t('discover.empty')}</div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((e, i) => (
            <Reveal key={e.id} delay={(i % 3) * 80}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
