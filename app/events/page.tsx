import { EventsBrowser } from '@/components/events/EventsBrowser';
import { getPublishedEvents } from '@/lib/data/events';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await getPublishedEvents();
  return <EventsBrowser events={events} />;
}
