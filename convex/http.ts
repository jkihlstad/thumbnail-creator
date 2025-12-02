import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { ConvexError } from "convex/values";

type WebhookEvent = {
  type: string;
  data: any;
};

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Invalid request", { status: 400 });
  }
  switch (event.type) {
    case "user.created":
      await ctx.runMutation(internal.users.createUser, {
        clerkId: event.data.id,
        email: event.data.email_addresses[0]?.email_address,
        imageUrl: event.data.image_url,
        name: event.data.first_name,
      });
      break;
    case "user.updated":
      await ctx.runMutation(internal.users.updateUser, {
        clerkId: event.data.id,
        imageUrl: event.data.image_url,
        name: event.data.first_name,
      });
      break;
    case "user.deleted":
      await ctx.runMutation(internal.users.deleteUser, {
        clerkId: event.data.id,
      });
      break;
  }
  return new Response(null, {
    status: 200,
  });
});

async function validateRequest(
  req: Request
): Promise<WebhookEvent | undefined> {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not defined");
  }
  const payload = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const webhook = new Webhook(webhookSecret);
  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Error validating webhook:", error);
    return undefined;
  }
}

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

// Stripe subscription update endpoint
const handleStripeSubscriptionUpdate = httpAction(async (ctx, request) => {
  try {
    const body = await request.json();
    const {
      clerkId,
      stripeCustomerId,
      subscriptionId,
      subscriptionTier,
      subscriptionStatus,
      billingCycle,
      currentPeriodEnd,
    } = body;

    if (!stripeCustomerId) {
      return new Response("Missing stripeCustomerId", { status: 400 });
    }

    await ctx.runMutation(internal.users.updateSubscription, {
      clerkId,
      stripeCustomerId,
      subscriptionId,
      subscriptionTier: subscriptionTier || "free",
      subscriptionStatus: subscriptionStatus || "active",
      billingCycle,
      currentPeriodEnd,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error updating subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

http.route({
  path: "/updateSubscription",
  method: "POST",
  handler: handleStripeSubscriptionUpdate,
});

export default http;
