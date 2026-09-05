# AI Resume Builder

Modern resume builder with AI assistance, live preview, guest mode, Clerk auth, and Convex sync.

## Features

* AI resume generation (Gemini via Convex — signed-in users)
* Multi-section editor with autosave and ATS score
* Live preview + print / Save as PDF
* Public share links (`/r/:id`)
* Guest mode (device-local) with migrate-on-signup
* Clerk + Convex JWT ownership checks

## Tech Stack

React 19 · Vite · Tailwind · React Router 7 · Clerk · Convex · Gemini

## Local setup

```bash
npm install

# Clerk JWT template named exactly "convex"
# Then set Convex env:
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://YOUR_SUBDOMAIN.clerk.accounts.dev
npx convex env set GOOGLE_AI_API_KEY your_gemini_api_key

npx convex dev   # terminal 1
npm run dev      # terminal 2
```

### Frontend `.env.local`

```env
CONVEX_DEPLOYMENT=...
VITE_CONVEX_URL=https://YOUR_DEPLOYMENT.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_CLERK_JWT_TEMPLATE=convex
VITE_BASE_URL=http://localhost:5173
```

Do **not** put `GOOGLE_AI_API_KEY` in `VITE_*`.

## Deploy to Vercel

1. **Deploy Convex production**
   ```bash
   npx convex deploy
   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://YOUR_SUBDOMAIN.clerk.accounts.dev --prod
   npx convex env set GOOGLE_AI_API_KEY your_gemini_api_key --prod
   ```
   Copy the production `VITE_CONVEX_URL` from the Convex dashboard.

2. **Vercel project**
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - `vercel.json` already rewrites all routes to `index.html` (SPA)

3. **Vercel environment variables** (Production + Preview)
   ```env
   VITE_CONVEX_URL=https://YOUR_PROD_DEPLOYMENT.convex.cloud
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_or_test_...
   VITE_CLERK_JWT_TEMPLATE=convex
   VITE_BASE_URL=https://your-app.vercel.app
   ```
   Redeploy after changing any `VITE_*` var (they are baked in at build time).

4. **Clerk dashboard**
   - Add your Vercel domain(s) under Allowed origins / redirect URLs
   - JWT template name must be exactly `convex`

5. **Smoke test**
   - Landing → Continue as guest → edit → print
   - Sign up → guest resume migrates
   - Share `/r/:id` in an incognito window
   - AI button (signed-in) with Gemini key set

## Routes

| Path | Access | Purpose |
|------|--------|---------|
| `/` | Public | Landing |
| `/auth/sign-in` | Public | Sign in / sign up |
| `/dashboard` | Guest or signed-in | Resume list |
| `/dashboard/resume/:id` | Guest or signed-in | Editor |
| `/dashboard/resume/:id/view` | Guest or signed-in | Preview / print |
| `/r/:id` | Public | Shared resume |

## Browser support

Built for modern Chrome, Safari, Firefox, Edge, and Brave (Chromium). Clipboard uses a Safari-safe fallback. Guest data uses `localStorage` (may be limited in private browsing).

## License

MIT
