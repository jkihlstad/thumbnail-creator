import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

// Tier limits - must match convex/users.ts
const TIER_LIMITS = {
  free: { generations: 3, downloads: 3 },
  standard: { generations: 100, downloads: 100 },
  pro: { generations: 300, downloads: 300 },
} as const;

function getConvexClient() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL is not configured');
  }
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const convex = getConvexClient();
    const userUsage = await convex.query(api.users.getUserUsage, { clerkId: userId });

    if (!userUsage) {
      // Return default free tier limits for new users
      const limits = TIER_LIMITS.free;
      return NextResponse.json({
        generationsUsed: 0,
        generationsLimit: limits.generations,
        downloadsUsed: 0,
        downloadsLimit: limits.downloads,
        currentTier: 'free' as const,
        billingCycle: 'monthly' as const,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        subscriptionStatus: 'active' as const,
      });
    }

    // Calculate next billing date from currentPeriodEnd
    const nextBillingDate = userUsage.currentPeriodEnd
      ? new Date(userUsage.currentPeriodEnd).toLocaleDateString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

    return NextResponse.json({
      generationsUsed: userUsage.generationsUsed,
      generationsLimit: userUsage.generationsLimit,
      downloadsUsed: userUsage.downloadsUsed,
      downloadsLimit: userUsage.downloadsLimit,
      currentTier: userUsage.currentTier,
      billingCycle: userUsage.billingCycle,
      nextBillingDate,
      subscriptionStatus: userUsage.subscriptionStatus,
    });
  } catch (error: any) {
    console.error('Error fetching usage:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch usage' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type } = body; // 'generation' or 'download'

    const convex = getConvexClient();

    if (type === 'generation') {
      const result = await convex.mutation(api.users.incrementGenerationUsage, { clerkId: userId });
      return NextResponse.json({
        success: true,
        usage: {
          generationsUsed: result.used,
          generationsLimit: result.limit,
        },
      });
    } else if (type === 'download') {
      const result = await convex.mutation(api.users.incrementDownloadUsage, { clerkId: userId });
      return NextResponse.json({
        success: true,
        usage: {
          downloadsUsed: result.used,
          downloadsLimit: result.limit,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid usage type. Must be "generation" or "download".' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error tracking usage:', error);

    // Check if it's a limit exceeded error
    if (error.message?.includes('limit reached')) {
      return NextResponse.json(
        {
          error: 'Limit exceeded',
          message: error.message,
          upgradeUrl: '/pricing',
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to track usage' },
      { status: 500 }
    );
  }
}
