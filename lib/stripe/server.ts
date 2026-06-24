import Stripe from 'stripe';

let stripe: Stripe | null = null;

/**
 * Lazily instantiate the Stripe server client.
 * Returns null when STRIPE_SECRET_KEY is absent so the build never fails.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) {
    stripe = new Stripe(key, { apiVersion: '2024-06-20' });
  }
  return stripe;
}
