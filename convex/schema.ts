import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  thumbnails: defineTable({
    title: v.string(),
    userId: v.string(),
    imageUrl: v.optional(v.string()),
    votes: v.number(),
  }).index("by_userId", ["userId"]),
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
    // Stripe subscription fields
    stripeCustomerId: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    subscriptionTier: v.optional(v.union(v.literal("free"), v.literal("standard"), v.literal("pro"))),
    subscriptionStatus: v.optional(v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due"), v.literal("trialing"))),
    billingCycle: v.optional(v.union(v.literal("monthly"), v.literal("yearly"))),
    currentPeriodEnd: v.optional(v.number()),
    // Usage tracking
    generationsUsed: v.optional(v.number()),
    downloadsUsed: v.optional(v.number()),
    usageResetDate: v.optional(v.number()),
  }).index("by_clerkId", ["clerkId"]).index("by_stripeCustomerId", ["stripeCustomerId"]),
});
