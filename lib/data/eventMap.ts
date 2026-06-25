import type { FootballEvent } from '@/lib/types';

/** Columns + organizer join used for every event read. */
export const EVENT_SELECT =
  '*, organizer:profiles!events_organizer_id_fkey(full_name, verification_status, avatar_url)';

/** Map a snake_case events row (with joined organizer) → the app's FootballEvent shape. */
export function mapEventRow(row: any): FootballEvent {
  const org = row.organizer ?? {};
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    title: row.title,
    description: row.description ?? '',
    date: row.event_date ? new Date(row.event_date).toISOString() : new Date().toISOString(),
    time: row.event_time ?? '',
    location: row.location ?? '',
    area: row.area ?? '',
    coverUrl: row.cover_url ?? '',
    organizer: {
      id: row.organizer_id,
      name: org.full_name || 'Organizer',
      avatarUrl: org.avatar_url ?? undefined,
      verified: org.verification_status === 'approved',
    },
    featured: !!row.featured,
    tier: row.tier ?? 'free',
    entryFee: row.entry_fee ?? undefined,
    maxTeams: row.max_teams ?? undefined,
    registeredTeams: row.registered_teams ?? undefined,
    prize: row.prize ?? undefined,
    price: row.price ?? undefined,
    spotsTotal: row.spots_total ?? undefined,
    spotsTaken: row.spots_taken ?? undefined,
    skillLevel: row.skill_level ?? undefined,
  };
}
