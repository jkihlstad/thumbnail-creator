import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createThumbnail = mutation({
  args: {
    title: v.string(),
    userId: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const thumbnailId = await ctx.db.insert("thumbnails", {
      title: args.title,
      userId: args.userId,
      imageUrl: args.imageUrl,
      votes: 0,
    });
    return thumbnailId;
  },
});

export const getUserThumbnails = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("thumbnails")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const deleteThumbnail = mutation({
  args: { thumbnailId: v.id("thumbnails") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.thumbnailId);
  },
});
