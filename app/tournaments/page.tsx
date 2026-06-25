import { TournamentsContent } from '@/components/tournaments/TournamentsContent';
import { getTournaments } from '@/lib/data/events';

export const dynamic = 'force-dynamic';

export default async function TournamentsPage() {
  const events = await getTournaments();
  return <TournamentsContent events={events} />;
}
