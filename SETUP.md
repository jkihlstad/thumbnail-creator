# Thumbnail Generator - Production Setup Guide

This guide will help you deploy and configure the Thumbnail Generator application for production use.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Accounts on:
  - [Convex](https://convex.dev) - Backend and database
  - [Clerk](https://clerk.com) - Authentication
  - [OpenRouter](https://openrouter.ai) - AI image generation API

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Set Up Convex Backend

### 2.1 Create a Convex Account and Project

1. Go to [https://convex.dev](https://convex.dev) and sign up/sign in
2. Create a new project (e.g., "thumbnail-generator")
3. Note your project URL (will look like `https://your-project.convex.cloud`)

### 2.2 Install Convex CLI

```bash
npm install -g convex
```

### 2.3 Initialize Convex

```bash
npx convex dev
```

This will:
- Generate the `convex/_generated` folder with TypeScript types
- Start a local development server
- Provide you with your `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOY_KEY`

### 2.4 Deploy Convex Functions

```bash
npx convex deploy
```

---

## 3. Set Up Clerk Authentication

### 3.1 Create a Clerk Application

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Choose authentication methods (Email, Google, GitHub, etc.)

### 3.2 Get Clerk API Keys

From your Clerk dashboard:
- Navigate to **API Keys**
- Copy:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
  - `CLERK_SECRET_KEY` (starts with `sk_`)

### 3.3 Configure Clerk Webhook for User Sync

1. In Clerk Dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Set endpoint URL to: `https://your-convex-project.convex.site/clerk-webhook`
4. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the **Signing Secret** (this is your `CLERK_WEBHOOK_SECRET`)

---

## 4. Set Up OpenRouter API

### 4.1 Create OpenRouter Account

1. Go to [https://openrouter.ai](https://openrouter.ai)
2. Sign up and verify your email
3. Add credits to your account (starts around $5)

### 4.2 Get API Key

1. Navigate to **Keys** in the dashboard
2. Create a new API key
3. Copy the key (starts with `sk-or-v1-`)

---

## 5. Configure Environment Variables

### 5.1 Create `.env.local` file

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 5.2 Fill in the values

Edit `.env.local` with your actual credentials:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOY_KEY=prod:...

# Clerk Webhook
CLERK_WEBHOOK_SECRET=whsec_...

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-...
```

---

## 6. Run Development Server

```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Build for Production

### 7.1 Test Production Build

```bash
npm run build
npm start
```

### 7.2 Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CONVEX_URL`
   - `CLERK_WEBHOOK_SECRET`
   - `OPENROUTER_API_KEY`
5. Deploy!

### 7.3 Update Clerk Webhook URL

After deploying to Vercel:
1. Get your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Update Clerk webhook endpoint to: `https://your-convex-project.convex.site/clerk-webhook`
3. Update Clerk redirect URLs in dashboard to include your Vercel domain

---

## 8. Verify Deployment

Test these features:
- [ ] Landing page loads correctly
- [ ] Sign up creates a new user
- [ ] Sign in works with existing user
- [ ] Thumbnail generation produces an image
- [ ] Download button downloads the image
- [ ] History shows previously generated thumbnails
- [ ] Error messages display correctly

---

## 9. Production Checklist

- [ ] All environment variables are set correctly
- [ ] Convex functions are deployed to production
- [ ] Clerk webhook is configured and working
- [ ] OpenRouter API has sufficient credits
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Database backup strategy (Convex handles this)
- [ ] Error monitoring set up (optional: Sentry)
- [ ] Analytics configured (optional: Vercel Analytics)

---

## Troubleshooting

### Build Errors

**Problem:** TypeScript errors about `_generated` modules

**Solution:** Run `npx convex dev` to generate types

---

**Problem:** PostCSS or Tailwind errors

**Solution:** Ensure you have the correct versions:
```bash
npm install @tailwindcss/postcss@latest tailwindcss@latest
```

---

### Runtime Errors

**Problem:** "Convex client not initialized"

**Solution:** Check that `NEXT_PUBLIC_CONVEX_URL` is set correctly

---

**Problem:** "User not authenticated"

**Solution:** Verify Clerk keys are correct and webhook is receiving events

---

**Problem:** "Failed to generate thumbnail"

**Solution:**
- Check OpenRouter API key is valid
- Ensure you have credits in your OpenRouter account
- Check the Convex logs for detailed error messages

---

## Cost Estimates

- **Convex:** Free tier includes 1M function calls/month
- **Clerk:** Free tier includes 10,000 monthly active users
- **OpenRouter (Stable Diffusion 3):** ~$0.035 per image generation
- **Vercel:** Free tier for hobby projects

---

## Support

For issues:
- Convex Docs: [https://docs.convex.dev](https://docs.convex.dev)
- Clerk Docs: [https://clerk.com/docs](https://clerk.com/docs)
- Next.js Docs: [https://nextjs.org/docs](https://nextjs.org/docs)
