import { createClient as createServerSupabase } from '@/lib/supabase/server';
import type { FootballEvent } from '@/lib/types';
import { sampleEvents, getEventBySlug as sampleBySlug } from '@/lib/data/sampleEvents';
import { EVENT_SELECT, mapEventRow } from '@/lib/data/eventMap';

export { EVENT_SELECT, mapEventRow };

/** All published events, soonest first. Falls back to sample data in demo mode. */
export async function getPublishedEvents(): Promise<FootballEvent[]> {
  const supabase = createServerSupabase();
  if (!supabase) return sampleEvents;
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('published', true)
    .order('event_date', { ascending: true });
  if (error || !data) return [];
  return data.map(mapEventRow);
}

/** Featured + published events for the homepage strip. */
export async function getFeaturedEvents(limit = 3): Promise<FootballEvent[]> {
  const supabase = createServerSupabase();
  if (!supabase) return sampleEvents.filter((e) => e.featured).slice(0, limit);
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('published', true)
    .eq('featured', true)
    .order('event_date', { ascending: true })
    .limit(limit);
  if (error || !data) return [];
  return data.map(mapEventRow);
}

/** Published tournaments only. */
export async function getTournaments(): Promise<FootballEvent[]> {
  const supabase = createServerSupabase();
  if (!supabase) return sampleEvents.filter((e) => e.type === 'tournament');
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('published', true)
    .eq('type', 'tournament')
    .order('event_date', { ascending: true });
  if (error || !data) return [];
  return data.map(mapEventRow);
}

/** A single event by slug (RLS limits anon visibility to published). */
export async function getEventBySlug(slug: string): Promise<FootballEvent | null> {
  const supabase = createServerSupabase();
  if (!supabase) return sampleBySlug(slug) ?? null;
  const { data, error } = await supabase.from('events').select(EVENT_SELECT).eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return mapEventRow(data);
}
