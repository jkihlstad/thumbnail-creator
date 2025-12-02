# ThumbGen AI - AI-Powered Thumbnail Generator

A modern, AI-powered thumbnail generator built with Next.js 16, powered by OpenRouter's image generation models.

## Features

- **AI-Powered Generation** - Generate thumbnails using Google Gemini 3 Pro Image
- **Reference Image Upload** - Upload a reference image to guide the AI's style
- **Multiple Aspect Ratios** - Support for YouTube (16:9), TikTok (9:16), and Square (1:1)
- **Download Generated Images** - Save your thumbnails instantly
- **History Library** - Track all your generated thumbnails
- **Beautiful UI** - Modern, responsive dark mode interface
- **Fast Generation** - Typically 5-10 seconds per thumbnail

## Tech Stack

- **Framework:** Next.js 16.0.3
- **UI:** React 19.2.0 + Tailwind CSS 4.1.17
- **Icons:** Lucide React
- **Authentication:** Clerk
- **Backend:** Convex
- **AI:** OpenRouter API (Google Gemini)

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm, yarn, pnpm, or bun package manager
- OpenRouter API key ([Get one here](https://openrouter.ai/))
- Clerk account ([Sign up](https://clerk.com/))
- Convex account ([Sign up](https://convex.dev/))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd thumbnail-generator-ui
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Add your API keys to `.env.local`**
```env
OPENROUTER_API_KEY=sk-or-v1-your-api-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key
CLERK_SECRET_KEY=sk_test_your-key
NEXT_PUBLIC_CONVEX_URL=https://your-url.convex.cloud
CONVEX_DEPLOY_KEY=dev:your-deploy-key
CONVEX_DEPLOYMENT=dev:your-deployment
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Quick Deploy

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables
6. Click "Deploy"

**Required Environment Variables:**
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOY_KEY`
- `CONVEX_DEPLOYMENT`

### Detailed Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions including:
- GitHub deployment workflow
- Vercel CLI deployment
- Environment variable configuration
- Custom domain setup
- Troubleshooting guide

## Usage

### Generate a Thumbnail

1. Click **"Create"** in the navigation
2. Enter a description (e.g., "Epic gaming thumbnail with neon colors")
3. (Optional) Upload a reference image for style matching
4. Select aspect ratio (YouTube, TikTok, or Square)
5. Click **"Generate Thumbnail"**
6. Download or save to library

### View History

1. Navigate to the **"Library"** tab
2. Browse all previously generated thumbnails
3. Download any thumbnail from your history

## API Endpoints

### POST `/api/generate`

Generate a thumbnail based on prompt and optional reference image.

**Request:**
```json
{
  "prompt": "Epic gaming thumbnail with neon colors",
  "model": "google/gemini-3-pro-image-preview",
  "width": 1920,
  "height": 1080,
  "referenceImage": "data:image/png;base64,..." // optional
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,...",
  "model": "google/gemini-3-pro-image-preview",
  "prompt": "Enhanced prompt..."
}
```

## Project Structure

```
thumbnail-generator-ui/
├── src/
│   └── app/
│       ├── api/
│       │   └── generate/
│       │       └── route.ts       # Image generation API
│       ├── globals.css            # Global styles
│       ├── layout.tsx             # Root layout
│       └── page.tsx               # Main app component
├── public/                        # Static assets
├── .env.local                     # Environment variables (gitignored)
├── .env.example                   # Environment template
├── next.config.ts                 # Next.js configuration
├── tailwind.config.js             # Tailwind configuration
├── DEPLOYMENT.md                  # Deployment guide
└── README.md                      # This file
```

## Available Scripts

```bash
# Development
npm run dev        # Start dev server

# Production
npm run build      # Build for production
npm start          # Start production server

# Code Quality
npm run lint       # Run ESLint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key for image generation | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for auth | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key for auth | Yes |
| `NEXT_PUBLIC_CONVEX_URL` | Convex backend URL | Yes |
| `CONVEX_DEPLOY_KEY` | Convex deployment key | Yes |
| `CONVEX_DEPLOYMENT` | Convex deployment name | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (auto-set by Vercel) | No |

## Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Run `npm install` to update dependencies
- Clear `.next` directory: `rm -rf .next`

### API Errors
- Verify your OpenRouter API key is valid
- Check API key has sufficient credits
- Review server logs in Vercel dashboard

### Images Not Generating
- Check OpenRouter API status
- Verify model availability
- Check browser console for errors

For more help, see [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI by [OpenRouter](https://openrouter.ai/)
- Auth by [Clerk](https://clerk.com/)
- Backend by [Convex](https://convex.dev/)
