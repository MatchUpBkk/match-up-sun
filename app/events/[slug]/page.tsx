import { notFound } from 'next/navigation';
import { EventDetail } from '@/components/events/EventDetail';
import { getEventBySlug } from '@/lib/data/events';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();
  return <EventDetail event={event} />;
}
