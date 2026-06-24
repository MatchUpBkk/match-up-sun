// ── Domain types for MATCH UP BKK ───────────────────────────

export type UserRole = 'player' | 'organizer' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export type EventType = 'tournament' | 'session';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'mixed';

export type ListingTier = 'free' | 'featured' | 'promotion';

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'waitlist';

export type PaymentMethod = 'card' | 'promptpay';

export type PaymentStatus = 'pending' | 'awaiting_approval' | 'paid' | 'refunded' | 'failed';

export interface Organizer {
  id: string;
  name: string;
  avatarUrl?: string;
  verified: boolean;
}

export interface FootballEvent {
  id: string;
  slug: string;
  type: EventType;
  title: string;
  description: string;
  date: string; // ISO
  time: string; // "19:00"
  location: string;
  area: string; // Bangkok area for filtering
  coverUrl: string;
  organizer: Organizer;
  featured: boolean;
  tier: ListingTier;
  // Tournament fields
  entryFee?: number;
  maxTeams?: number;
  registeredTeams?: number;
  prize?: string;
  // Session fields
  price?: number;
  spotsTotal?: number;
  spotsTaken?: number;
  skillLevel?: SkillLevel;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}
