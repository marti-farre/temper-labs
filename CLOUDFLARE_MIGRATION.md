# Cloudflare Pages Migration Guide

## ✅ Setup Complete

The project is now configured for Cloudflare Pages deployment.

### Changes Made:
- ✅ Upgraded to Next.js 15.0.0 and React 19
- ✅ Installed @cloudflare/next-on-pages and wrangler
- ✅ Added Cloudflare deployment scripts to package.json
- ✅ Created wrangler.toml configuration

## Deployment Steps

### 1. First-time Setup

Login to Cloudflare (if not already logged in):
```bash
npx wrangler login
```

### 2. Set Environment Variables

Add your environment variables to Cloudflare Pages:
```bash
npx wrangler pages secret put GROQ_API_KEY
npx wrangler pages secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY
```

### 3. Build and Deploy

Deploy to Cloudflare Pages:
```bash
npm run pages:deploy
```

Or build and deploy separately:
```bash
# Build for Cloudflare Pages
npm run pages:build

# Deploy the build
npx wrangler pages deploy .vercel/output/static --project-name=temperlabs
```

### 4. Connect Domain

Since temperlabs.dev is already on Cloudflare:

1. Go to Cloudflare Dashboard → Pages → temperlabs
2. Click "Custom domains" → "Set up a custom domain"
3. Enter: `temperlabs.dev`
4. Cloudflare will automatically configure the DNS (since the domain is already there)

### 5. Verify Deployment

Check these endpoints:
- https://temperlabs.dev
- https://temperlabs.dev/api/test-agent
- https://temperlabs.dev/api/stats

## Local Preview

Test the Cloudflare build locally:
```bash
npm run pages:preview
```

## Important Notes

### ⚠️ Deprecation Warning
`@cloudflare/next-on-pages` is deprecated. Consider migrating to [OpenNext](https://opennext.js.org/cloudflare) in the future.

### ⚠️ Next.js 15.0.0 Security
Next.js 15.0.0 has a security vulnerability. Consider upgrading to a patched version after Cloudflare Pages supports it.

### Route Handlers
All API routes under `/app/api/` should work as-is. The Next.js App Router is fully supported.

### Environment Variables
- Public variables: Prefix with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
- Private variables: No prefix needed (e.g., `GROQ_API_KEY`)

### Edge Runtime
Some features may need adjustment for Cloudflare Workers runtime:
- Node.js APIs may not be available (use Web APIs instead)
- File system access is limited
- Check [Cloudflare Workers compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)

## Troubleshooting

### Build fails
If the build fails, check:
1. All environment variables are set
2. No Node.js-specific APIs are used in Edge routes
3. Dependencies are compatible with Edge runtime

### API routes not working
- Ensure routes use `export const runtime = 'edge'` if needed
- Check Cloudflare Workers logs in the dashboard

### Domain not connecting
- Verify DNS records in Cloudflare DNS settings
- Wait 5-10 minutes for DNS propagation

## Rollback to Vercel

If needed, you can still deploy to Vercel:
```bash
vercel --prod
```

The project supports both platforms.
