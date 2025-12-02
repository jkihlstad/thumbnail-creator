import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// Tier limits configuration
export const TIER_LIMITS = {
  free: { generations: 3, downloads: 3 },
  standard: { generations: 100, downloads: 100 },
  pro: { generations: 300, downloads: 300 },
} as const;

export const createUser = internalMutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      clerkId: args.clerkId,
      imageUrl: args.imageUrl,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    name: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("user not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      name: args.name,
    });
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("user not found");
    }

    await ctx.db.delete(user._id);
  },
});

export const getUser = query({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Update user subscription from Stripe webhook
export const updateSubscription = internalMutation({
  args: {
    clerkId: v.optional(v.string()),
    stripeCustomerId: v.string(),
    subscriptionId: v.optional(v.string()),
    subscriptionTier: v.union(v.literal("free"), v.literal("standard"), v.literal("pro")),
    subscriptionStatus: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due"), v.literal("trialing")),
    billingCycle: v.optional(v.union(v.literal("monthly"), v.literal("yearly"))),
    currentPeriodEnd: v.optional(v.number()),
  },
  async handler(ctx, args) {
    // Find user by stripeCustomerId or clerkId
    let user = await ctx.db
      .query("users")
      .withIndex("by_stripeCustomerId", (q) => q.eq("stripeCustomerId", args.stripeCustomerId))
      .first();

    if (!user && args.clerkId) {
      user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
        .first();
    }

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      stripeCustomerId: args.stripeCustomerId,
      subscriptionId: args.subscriptionId,
      subscriptionTier: args.subscriptionTier,
      subscriptionStatus: args.subscriptionStatus,
      billingCycle: args.billingCycle,
      currentPeriodEnd: args.currentPeriodEnd,
      // Reset usage when subscription changes
      generationsUsed: 0,
      downloadsUsed: 0,
      usageResetDate: Date.now(),
    });
  },
});

// Set Stripe customer ID on user
export const setStripeCustomerId = internalMutation({
  args: {
    clerkId: v.string(),
    stripeCustomerId: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      stripeCustomerId: args.stripeCustomerId,
    });
  },
});

// Get user by Stripe customer ID
export const getUserByStripeCustomerId = query({
  args: { stripeCustomerId: v.string() },
  async handler(ctx, args) {
    return await ctx.db
      .query("users")
      .withIndex("by_stripeCustomerId", (q) => q.eq("stripeCustomerId", args.stripeCustomerId))
      .first();
  },
});

// Increment generation usage
export const incrementGenerationUsage = mutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const tier = user.subscriptionTier || "free";
    const limits = TIER_LIMITS[tier];
    const currentUsage = user.generationsUsed || 0;

    // Check if we need to reset usage (monthly reset)
    const now = Date.now();
    const resetDate = user.usageResetDate || 0;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    if (now - resetDate > oneMonth) {
      // Reset usage
      await ctx.db.patch(user._id, {
        generationsUsed: 1,
        usageResetDate: now,
      });
      return { success: true, used: 1, limit: limits.generations };
    }

    if (currentUsage >= limits.generations) {
      throw new ConvexError(`Generation limit reached. You've used ${currentUsage} of ${limits.generations} generations.`);
    }

    await ctx.db.patch(user._id, {
      generationsUsed: currentUsage + 1,
    });

    return { success: true, used: currentUsage + 1, limit: limits.generations };
  },
});

// Increment download usage
export const incrementDownloadUsage = mutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const tier = user.subscriptionTier || "free";
    const limits = TIER_LIMITS[tier];
    const currentUsage = user.downloadsUsed || 0;

    // Check if we need to reset usage (monthly reset)
    const now = Date.now();
    const resetDate = user.usageResetDate || 0;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    if (now - resetDate > oneMonth) {
      // Reset usage
      await ctx.db.patch(user._id, {
        downloadsUsed: 1,
        usageResetDate: now,
      });
      return { success: true, used: 1, limit: limits.downloads };
    }

    if (currentUsage >= limits.downloads) {
      throw new ConvexError(`Download limit reached. You've used ${currentUsage} of ${limits.downloads} downloads.`);
    }

    await ctx.db.patch(user._id, {
      downloadsUsed: currentUsage + 1,
    });

    return { success: true, used: currentUsage + 1, limit: limits.downloads };
  },
});

// Get user usage stats
export const getUserUsage = query({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    const tier = (user.subscriptionTier || "free") as keyof typeof TIER_LIMITS;
    const limits = TIER_LIMITS[tier];

    // Check if we need to reset usage
    const now = Date.now();
    const resetDate = user.usageResetDate || 0;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    const needsReset = now - resetDate > oneMonth;

    return {
      generationsUsed: needsReset ? 0 : (user.generationsUsed || 0),
      generationsLimit: limits.generations,
      downloadsUsed: needsReset ? 0 : (user.downloadsUsed || 0),
      downloadsLimit: limits.downloads,
      currentTier: tier,
      billingCycle: user.billingCycle || "monthly",
      subscriptionStatus: user.subscriptionStatus || "active",
      currentPeriodEnd: user.currentPeriodEnd,
      stripeCustomerId: user.stripeCustomerId,
    };
  },
});
