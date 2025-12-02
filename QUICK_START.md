# Quick Start Guide

Get your Thumbnail Generator app running in 5 minutes!

## Step 1: Initialize Convex (REQUIRED)

```bash
npx convex dev
```

This command will:
- Prompt you to log in to Convex (creates account if needed)
- Create a new Convex project or connect to existing one
- Generate TypeScript types in `convex/_generated/`
- Provide you with `NEXT_PUBLIC_CONVEX_URL`
- Start the Convex development server

**Important:** Keep this terminal running!

---

## Step 2: Create Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Convex URL from Step 1:

```env
# From Convex dev output
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Temporary keys for testing (get real ones later)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder
CLERK_WEBHOOK_SECRET=whsec_placeholder
OPENROUTER_API_KEY=sk-or-v1-placeholder
```

---

## Step 3: Start Next.js Dev Server

Open a **new terminal** and run:

```bash
npm run dev
```

---

## Step 4: Open in Browser

Navigate to: [http://localhost:3000](http://localhost:3000)

You should see the landing page!

---

## Step 5: Set Up Authentication (to use the app)

### Get Clerk Keys

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create an application
3. Copy the keys to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

4. Restart the dev server:
   ```bash
   # Press Ctrl+C then:
   npm run dev
   ```

Now you can sign up and sign in!

---

## Step 6: Set Up OpenRouter (to generate thumbnails)

### Get OpenRouter API Key

1. Go to [https://openrouter.ai](https://openrouter.ai)
2. Sign up and add credits ($5 minimum)
3. Generate an API key
4. Add to `.env.local`:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-actual-key
   ```

5. Restart the dev server

Now you can generate thumbnails!

---

## Step 7: Configure Clerk Webhook (for production)

1. In Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-project.convex.site/clerk-webhook`
   - Find your convex.site URL in Convex dashboard
3. Select events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the signing secret to `.env.local`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_actual_secret
   ```

---

## Troubleshooting

### "Cannot find module '_generated/server'"

**Solution:** Run `npx convex dev` in a terminal

---

### "Clerk: Missing publishable key"

**Solution:** Add Clerk keys to `.env.local` and restart dev server

---

### "Failed to generate thumbnail"

**Solution:** Check that `OPENROUTER_API_KEY` is valid and has credits

---

### Build errors with Tailwind CSS

**Solution:** Already fixed! The PostCSS config has been updated for Tailwind v4

---

## You're All Set! 🎉

Your application is now:
- ✅ Fully integrated with Convex
- ✅ Authenticated with Clerk
- ✅ Generating AI thumbnails
- ✅ Saving to database
- ✅ Download functionality working
- ✅ History view enabled
- ✅ Error handling implemented
- ✅ Production ready!

For detailed deployment instructions, see [SETUP.md](./SETUP.md)
