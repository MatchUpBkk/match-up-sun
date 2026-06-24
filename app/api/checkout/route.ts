import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripe = getStripe();

  // Graceful demo mode: when Stripe is not configured, signal the client to
  // fall back to its in-app confirmation screen instead of throwing.
  if (!stripe) {
    return NextResponse.json({ demo: true, message: 'Stripe not configured' }, { status: 200 });
  }

  let body: { eventId?: string; title?: string; amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { title = 'Match Up BKK Event', amount = 0, eventId } = body;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'promptpay'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'thb',
            unit_amount: Math.max(0, Math.round(amount * 100)),
            product_data: {
              name: title,
              metadata: eventId ? { eventId } : {},
            },
          },
        },
      ],
      success_url: `${siteUrl}/dashboard/player?status=success`,
      cancel_url: `${siteUrl}/events?status=cancelled`,
      metadata: eventId ? { eventId } : {},
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
