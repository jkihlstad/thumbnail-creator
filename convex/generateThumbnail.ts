import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";

export const generateThumbnail = action({
  args: {
    prompt: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const response = await openai.images.generate({
      model: "stabilityai/stable-diffusion-3",
      prompt: args.prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data?.[0]?.url;

    if (imageUrl) {
      // Save the thumbnail to the database
      await ctx.runMutation(api.thumbnails.createThumbnail, {
        title: args.prompt.slice(0, 50), // Use first 50 chars of prompt as title
        userId: args.userId,
        imageUrl: imageUrl,
      });
    }

    return imageUrl;
  },
});
