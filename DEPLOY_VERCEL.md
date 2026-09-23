# Vercel Deployment — Vedya Rakhi

## One-time: 60 seconds in your browser

Your Zen browser is already logged into Vercel (saw the cookie storage). The CLI needs device-flow OAuth that I can't complete for you.

### Option A: Import from GitHub (fastest)

1. Open https://vercel.com/new in Zen browser
2. Click "Import Git Repository" → search for `vedya-rakhi-20260923`
3. Vercel detects it as a "Static Site" automatically (no build command)
4. Click **Deploy** (top right)
5. ~30 seconds → URL like `vedya-rakhi-20260923.vercel.app`

No settings to change. No env vars. No framework preset needed — Vercel auto-detects static HTML.

### Option B: CLI from your shell

In your terminal:
```
cd /tmp/vedya-deploy
vercel login --github
```
Browser opens → approve → then:
```
vercel --prod --yes
```
Done.

## After deploy

Tell me the URL and I'll add it to the README + verify both sites match.

## What's deployed right now

- **GitHub Pages:** https://ram1593charan-maker.github.io/vedya-rakhi-20260923/ (LIVE)
- **Vercel:** pending your 60s browser action

Both will serve the same 4-page site from the same git repo.