import { HomeContent } from '@/components/home/HomeContent';
import { getFeaturedEvents, getPublishedEvents } from '@/lib/data/events';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featured = await getFeaturedEvents(3);
  if (featured.length === 0) featured = (await getPublishedEvents()).slice(0, 3);
  return <HomeContent featured={featured} />;
}
