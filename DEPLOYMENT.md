# Deploying ThumbGen AI to Vercel

This guide will walk you through deploying your thumbnail generator application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free)
2. Your project code in a Git repository (GitHub, GitLab, or Bitbucket)
3. All required API keys ready

## Required Environment Variables

Before deploying, make sure you have the following API keys:

```env
# Convex Backend
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOY_KEY=your_convex_deploy_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenRouter API (for AI image generation)
OPENROUTER_API_KEY=your_openrouter_api_key

# Convex Deployment
CONVEX_DEPLOYMENT=your_convex_deployment_name
```

## Deployment Methods

### Method 1: Deploy via GitHub (Recommended)

#### Step 1: Push Your Code to GitHub

If you haven't already, initialize a git repository and push to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - ThumbGen AI"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

#### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

#### Step 3: Configure Environment Variables

1. In the deployment configuration screen, expand **"Environment Variables"**
2. Add each environment variable:
   - Variable Name: `OPENROUTER_API_KEY`
   - Value: `your_openrouter_api_key`
   - Click **"Add"**
3. Repeat for all environment variables listed above
4. Make sure to select the correct environment (Production, Preview, Development)

#### Step 4: Deploy

1. Review your settings
2. Click **"Deploy"**
3. Wait for the deployment to complete (usually 2-3 minutes)
4. Click on the deployment URL to visit your live app

### Method 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

From your project directory, run:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? **thumbnail-generator-ui**
- In which directory is your code located? **.**
- Want to override settings? **N**

#### Step 4: Add Environment Variables

```bash
# Add each environment variable
vercel env add OPENROUTER_API_KEY
# Paste your API key when prompted
# Select which environments (production, preview, development)

# Repeat for all environment variables
vercel env add NEXT_PUBLIC_CONVEX_URL
vercel env add CONVEX_DEPLOY_KEY
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add CONVEX_DEPLOYMENT
```

#### Step 5: Deploy to Production

```bash
vercel --prod
```

## Post-Deployment Setup

### Update Your Environment URLs

After deployment, you may need to update some environment variables:

1. **Update `NEXT_PUBLIC_SITE_URL`** (if needed):
   - Add this variable in Vercel dashboard
   - Set it to your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

2. **Update Clerk Settings**:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Add your Vercel domain to allowed origins

3. **Update Convex Settings** (if needed):
   - Go to your Convex dashboard
   - Add your Vercel domain to allowed origins

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy every push to the `main` branch to production
- Create preview deployments for pull requests
- Run builds and tests before deploying

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain name
5. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails

**Check build logs:**
- Go to your deployment in Vercel Dashboard
- Click on the failed deployment
- Review the build logs for errors

**Common issues:**
- Missing environment variables
- TypeScript errors
- Dependency conflicts

### Environment Variables Not Working

1. Verify all variables are set in Vercel Dashboard
2. Redeploy after adding new variables
3. Check variable names (they're case-sensitive)
4. For `NEXT_PUBLIC_*` variables, make sure they're available at build time

### API Routes Not Working

1. Ensure your API routes are in `src/app/api/` directory
2. Check Vercel function logs in the dashboard
3. Verify API route files export proper HTTP methods

### Images Not Loading

1. Check the image domains configuration in `next.config.ts`
2. Verify CORS settings if loading from external sources
3. Check file size limits (Vercel has 4.5MB response limit for serverless functions)

## Performance Optimization

### Enable Image Optimization

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
```

### Enable Compression

Vercel automatically enables compression for your responses.

### Monitor Performance

1. Go to Vercel Dashboard → Your Project
2. Click **"Analytics"** to see:
   - Page load times
   - Web Vitals
   - Traffic statistics

## Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Remove a deployment
vercel remove [deployment-name]

# List environment variables
vercel env ls

# Pull environment variables to local
vercel env pull

# Open project in browser
vercel open
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## Security Notes

- **Never commit `.env.local`** to git (already in .gitignore)
- Rotate API keys regularly
- Use Vercel's environment variable encryption
- Enable 2FA on your Vercel account
- Review deployment logs for sensitive data

## Monitoring and Logs

### View Real-time Logs

```bash
vercel logs --follow
```

### View Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click **"Functions"**
4. View logs for each serverless function

---

**Deployment URL:** Your app will be available at `https://[project-name].vercel.app`

**Need help?** Check the [troubleshooting section](#troubleshooting) or contact Vercel support.
