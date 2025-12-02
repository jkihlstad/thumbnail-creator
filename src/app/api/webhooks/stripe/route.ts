import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  });
}

function getConvexClient() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL is not configured');
  }
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
}

// Map Stripe price IDs to tiers
function getTierFromPriceId(priceId: string): 'standard' | 'pro' {
  const standardPrices = [
    process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID,
    process.env.STRIPE_STANDARD_YEARLY_PRICE_ID,
  ];
  const proPrices = [
    process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  ];

  if (standardPrices.includes(priceId)) {
    return 'standard';
  }
  if (proPrices.includes(priceId)) {
    return 'pro';
  }
  // Default to standard if unknown
  return 'standard';
}

function getBillingCycle(priceId: string): 'monthly' | 'yearly' {
  const yearlyPrices = [
    process.env.STRIPE_STANDARD_YEARLY_PRICE_ID,
    process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  ];
  return yearlyPrices.includes(priceId) ? 'yearly' : 'monthly';
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const convex = getConvexClient();

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription' && session.subscription) {
          // Get the subscription details
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const subscription = subscriptionResponse as unknown as Stripe.Subscription;

          const priceId = subscription.items.data[0]?.price.id;
          const tier = getTierFromPriceId(priceId);
          const billingCycle = getBillingCycle(priceId);

          // Get clerk ID from metadata (we'll add this to checkout session)
          const clerkId = session.metadata?.clerkId;

          // Update user subscription in Convex using internal HTTP endpoint
          // We need to call the Convex HTTP action for internal mutations
          const updatePayload = {
            clerkId,
            stripeCustomerId: session.customer as string,
            subscriptionId: subscription.id,
            subscriptionTier: tier,
            subscriptionStatus: subscription.status as 'active' | 'canceled' | 'past_due' | 'trialing',
            billingCycle,
            currentPeriodEnd: (subscription as any).current_period_end * 1000,
          };

          // Call Convex HTTP endpoint to update subscription
          const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!.replace('.cloud', '.site');
          await fetch(`${convexUrl}/updateSubscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatePayload),
          });

          console.log('Checkout completed for customer:', session.customer, 'tier:', tier);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        const tier = getTierFromPriceId(priceId);
        const billingCycle = getBillingCycle(priceId);

        const updatePayload = {
          stripeCustomerId: subscription.customer as string,
          subscriptionId: subscription.id,
          subscriptionTier: tier,
          subscriptionStatus: subscription.status as 'active' | 'canceled' | 'past_due' | 'trialing',
          billingCycle,
          currentPeriodEnd: (subscription as any).current_period_end * 1000,
        };

        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!.replace('.cloud', '.site');
        await fetch(`${convexUrl}/updateSubscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });

        console.log('Subscription updated for customer:', subscription.customer);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const updatePayload = {
          stripeCustomerId: subscription.customer as string,
          subscriptionTier: 'free' as const,
          subscriptionStatus: 'canceled' as const,
        };

        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!.replace('.cloud', '.site');
        await fetch(`${convexUrl}/updateSubscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });

        console.log('Subscription deleted for customer:', subscription.customer);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceData = invoice as any;

        if (invoiceData.subscription) {
          const updatePayload = {
            stripeCustomerId: invoice.customer as string,
            subscriptionStatus: 'past_due' as const,
          };

          const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!.replace('.cloud', '.site');
          await fetch(`${convexUrl}/updateSubscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatePayload),
          });

          console.log('Payment failed for customer:', invoice.customer);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
