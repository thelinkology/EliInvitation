# Christening Invitation

A personalized, mobile-first christening invitation built with Next.js 16, TypeScript and Tailwind CSS, hosted on Vercel.
RSVPs are stored in Google Sheets, through Google Apps Script. Google Forms is an optional backup.

* `/` is the shared invitation. Optional `?to=Name&type=godparent&role=ninang` personalizes the greeting only.
* `/i/<code>` is a personal invitation. It is looked up in the Google Sheet on the server.
* `/api/rsvp` receives RSVP and godparent answers and forwards them to Apps Script.

**New to this? Start with [`docs/GO-LIVE.md`](docs/GO-LIVE.md)**, a step-by-step guide from your computer to a live link.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values — see docs/SETUP.md
npm run dev                  # http://localhost:3000
```

## Where things live

| What | File |
| --- | --- |
| Baby's name, date, venues, attire, reminders, photos | [`src/config/event.ts`](src/config/event.ts) |
| RSVP settings (reads environment variables) | [`src/config/rsvp.ts`](src/config/rsvp.ts) |
| Google Sheet backend (paste into Apps Script) | [`apps-script/Code.gs`](apps-script/Code.gs) |
| Step-by-step Google + Vercel setup | [`docs/SETUP.md`](docs/SETUP.md) |
| Photos | `public/images/` |

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, click **Add New → Project** and import the repository. The defaults work.
3. Add the environment variables from [`.env.example`](.env.example). See [`docs/SETUP.md`](docs/SETUP.md), Part B.
4. Click **Deploy**. Redeploy after any environment variable change.

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npx tsc --noEmit`
