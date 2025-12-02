import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

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

function getPriceIds() {
  return {
    standard_monthly: process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID!,
    standard_yearly: process.env.STRIPE_STANDARD_YEARLY_PRICE_ID!,
    pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in first.' },
        { status: 401 }
      );
    }

    const stripe = getStripe();
    const convex = getConvexClient();
    const PRICE_IDS = getPriceIds();
    const body = await request.json();
    const { priceId, billingCycle } = body;

    // Map tier to Stripe price ID
    let stripePriceId: string;
    if (priceId === 'standard') {
      stripePriceId = billingCycle === 'yearly' ? PRICE_IDS.standard_yearly : PRICE_IDS.standard_monthly;
    } else if (priceId === 'pro') {
      stripePriceId = billingCycle === 'yearly' ? PRICE_IDS.pro_yearly : PRICE_IDS.pro_monthly;
    } else {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Get user from Convex to check for existing Stripe customer
    const user = await convex.query(api.users.getUser, { clerkId: userId });

    // Build checkout session options
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: {
        clerkId: userId,
        tier: priceId,
        billingCycle: billingCycle,
      },
    };

    // If user already has a Stripe customer ID, use it
    if (user?.stripeCustomerId) {
      sessionOptions.customer = user.stripeCustomerId;
    } else if (user?.email) {
      // Otherwise, pre-fill email for new customer
      sessionOptions.customer_email = user.email;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
