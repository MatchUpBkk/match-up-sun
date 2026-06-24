import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    // Not configured — acknowledge so Stripe (or a local test) doesn't retry.
    return NextResponse.json({ received: true, configured: false });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const payload = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      // TODO: mark registration paid in Supabase using session.metadata.eventId
      break;
    }
    case 'checkout.session.expired': {
      // TODO: release held spot
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
