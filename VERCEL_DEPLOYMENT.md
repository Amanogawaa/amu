# Deploying Client to Vercel

This guide will help you deploy your Next.js client application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket Repository**: Your code should be in a Git repository
3. **Environment Variables**: Have all your environment variables ready (see below)

## Quick Deploy via Vercel Dashboard

### Step 1: Import Your Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your repository (`thesis` or the repository containing the `amu` folder)
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `amu` (if your repo contains both client and server)
   - **Build Command**: `npm run build` or `bun run build`
   - **Output Directory**: `.next` (default for Next.js)
   - **Install Command**: `npm install` or `bun install`

### Step 2: Configure Environment Variables

In the Vercel dashboard, go to your project → **Settings** → **Environment Variables** and add:

#### Required Environment Variables

```env
# Firebase Client Configuration (all required)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# API Server URL (your Render server URL)
NEXT_PUBLIC_API_URL=https://your-app-name.onrender.com
```

**Important Notes:**
- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Never put sensitive secrets in `NEXT_PUBLIC_*` variables
- Set `NEXT_PUBLIC_API_URL` to your Render server URL (e.g., `https://amu-api.onrender.com`)

### Step 3: Deploy

1. Click **"Deploy"**
2. Vercel will automatically:
   - Install dependencies
   - Run the build command
   - Deploy your application
3. Your app will be live at `https://your-project-name.vercel.app`

## Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
# or
bun add -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Navigate to Client Directory

```bash
cd amu
```

### Step 4: Deploy

```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

### Step 5: Set Environment Variables via CLI

```bash
# Set all environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_API_URL

# For each variable, you'll be prompted to:
# 1. Enter the value
# 2. Select environments (Development, Preview, Production)
```

## Environment-Specific Configuration

You can set different values for different environments:

- **Development**: Used in Vercel's development environment
- **Preview**: Used for preview deployments (pull requests)
- **Production**: Used for production deployments

### Example: Different API URLs per Environment

```bash
# Development
vercel env add NEXT_PUBLIC_API_URL development
# Enter: http://localhost:3001

# Preview
vercel env add NEXT_PUBLIC_API_URL preview
# Enter: https://amu-api-staging.onrender.com

# Production
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://amu-api.onrender.com
```

## Custom Domain Setup

1. Go to your project → **Settings** → **Domains**
2. Add your custom domain (e.g., `app.yourdomain.com`)
3. Follow Vercel's DNS configuration instructions
4. Update your Render server's `CORS_ORIGINS` to include your custom domain

## Continuous Deployment

Vercel automatically deploys when you push to your Git repository:

- **Production**: Deploys from your default branch (usually `main` or `master`)
- **Preview**: Creates preview deployments for pull requests

### Branch Protection

To require manual approval for production deployments:

1. Go to **Settings** → **Git**
2. Enable **"Production Branch Protection"**
3. Select which branches require approval

## Build Configuration

If you need to customize the build, create a `vercel.json` file in the `amu` directory:

```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

## Troubleshooting

### Build Fails

1. **Check Build Logs**: Go to your deployment → **Logs** tab
2. **Common Issues**:
   - Missing environment variables
   - Build command errors
   - Dependency installation failures

### Environment Variables Not Working

1. **Verify Variable Names**: Must start with `NEXT_PUBLIC_` for client-side access
2. **Redeploy**: After adding env vars, trigger a new deployment
3. **Check Build Logs**: Variables are injected at build time

### API Requests Failing

1. **Check CORS**: Ensure your Render server allows requests from your Vercel domain
2. **Verify API URL**: Check `NEXT_PUBLIC_API_URL` is set correctly
3. **Check Network Tab**: Use browser DevTools to see actual requests

### Socket.io Connection Issues

1. **Verify WebSocket Support**: Vercel supports WebSockets
2. **Check API URL**: Ensure `NEXT_PUBLIC_API_URL` points to your Render server
3. **Check Server CORS**: Render server must allow your Vercel domain

## Performance Optimization

### Enable Edge Functions (Optional)

For better performance, you can use Vercel Edge Functions:

1. Create `amu/src/app/api/[...route]/route.ts` (if needed)
2. Vercel will automatically detect and deploy as Edge Functions

### Image Optimization

Next.js Image component is automatically optimized on Vercel. Ensure your `next.config.ts` has proper image configuration (already configured).

## Monitoring

### Analytics

1. Go to **Analytics** tab in your Vercel dashboard
2. Enable **Web Analytics** (free tier available)
3. View page views, performance metrics, and more

### Logs

1. Go to your deployment → **Logs** tab
2. View real-time logs and errors
3. Filter by function, time, or search terms

## Next Steps

1. ✅ Set up environment variables
2. ✅ Deploy to Vercel
3. ✅ Configure custom domain (optional)
4. ✅ Set up monitoring and analytics
5. ✅ Update Render server CORS to allow your Vercel domain

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)


