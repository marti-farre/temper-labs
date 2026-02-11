# Deploy to Cloudflare Pages via GitHub

## Quick Setup (5 minutes)

### 1. Go to Cloudflare Pages
Open: https://dash.cloudflare.com/

Navigate to: **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

### 2. Connect GitHub Repository
- Click **"Connect GitHub"**
- Authorize Cloudflare to access your repositories
- Select: **YOUR_USERNAME/temper-llm**
- Click **"Begin setup"**

### 3. Configure Build Settings

**Framework preset:** Next.js (Static & SSR)

**Build configurations:**
```
Production branch: main
Build command: npm run build
Build output directory: .next
Root directory: /
Node version: 20
```

### 4. Add Environment Variables

Click **"Add variable"** for each:

| Variable Name | Value |
|--------------|-------|
| `GROQ_API_KEY` | Your Groq API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service key |
| `NODE_VERSION` | 20 |

**Important:** Check "Same value for preview and production" for all variables.

### 5. Deploy

Click **"Save and Deploy"**

Cloudflare will:
1. Clone your repo
2. Install dependencies
3. Run `npm run build`
4. Deploy to their global network

Wait 2-3 minutes for first deploy.

### 6. Connect Your Domain

After deployment:
1. Go to your project → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter: `temperlabs.dev`
4. Click **"Continue"**
5. Cloudflare auto-configures DNS (domain is already on Cloudflare)

**Done!** Your site will be live at https://temperlabs.dev in ~2 minutes.

---

## Future Deployments (Automatic!)

Just push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Cloudflare automatically deploys on every push to `main`.

---

## Preview Deployments

Every pull request gets a preview URL automatically:
- Create a PR → Cloudflare builds and deploys
- Get a unique URL like `https://abc123.temper-llm.pages.dev`
- Test before merging to production

---

## Managing Environment Variables

To update environment variables:
1. Cloudflare Dashboard → Your project
2. **Settings** → **Environment variables**
3. Edit values
4. Click **"Save"**
5. Trigger a new deployment (push a commit or click "Retry deployment")

---

## Troubleshooting

### Build fails
- Check build logs in Cloudflare dashboard
- Verify all environment variables are set
- Make sure Node version is set to 20

### Domain not connecting
- Check DNS settings at: Cloudflare DNS → temperlabs.dev
- Should have these records automatically:
  - `temperlabs.dev` → CNAME → your-project.pages.dev
  - `www.temperlabs.dev` → CNAME → your-project.pages.dev

### Environment variables not working
- Make sure they're set for both "Production" and "Preview"
- Trigger a new deployment after adding variables
- Check variable names match exactly (case-sensitive)

---

## Rollback

To rollback to a previous deployment:
1. Go to **Deployments** tab
2. Find the working deployment
3. Click **"···"** → **"Rollback to this deployment"**

---

## CLI Access (Optional)

If you want CLI access later:
```bash
npx wrangler pages deployment list --project-name=temperlabs
npx wrangler pages deployment tail --project-name=temperlabs
```

---

## Next Steps

✅ Push code → auto-deploys
✅ Preview PRs before merge
✅ Zero CLI configuration needed
✅ Global CDN + automatic SSL
✅ Unlimited bandwidth on free tier

Your deployment workflow is now:
```bash
git add .
git commit -m "New feature"
git push
# ✨ Live in 2 minutes!
```
