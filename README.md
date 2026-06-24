# MATCH UP BKK ⚽️

**Play. Connect. Compete.** — Bangkok's premium football marketplace for tournaments and weekday matches.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Stripe**. Responsive, animated, glassmorphic, and Vercel‑deploy‑ready.

---

## ⚠️ Please read first — build verification

This project was scaffolded in a **sandbox without internet access**, so `npm install` and `npm run build` **could not be executed here** (the npm registry is unreachable from the sandbox). The code is written to be build‑safe and conventional, but you should run the install + build **once on your machine** before deploying:

```bash
npm install
npm run build
```

If anything surfaces, it'll almost always be an env var or a Node version mismatch — see the steps below. Node **18.18+** (or 20+) is recommended.

---

## ✨ Features

- **Cinematic hero** — three side‑by‑side vertical videos (action · community · duels) on desktop, mobile‑optimized to a single video, dark overlay, autoplay/loop/muted.
- **Multi‑language** — English, German, Thai with a platform‑wide switcher (persists to `localStorage` + cookie).
- **Event discovery** — search + filter by type, location (Bangkok areas), date, price, and skill level.
- **Two event types** — Tournaments (entry fee, max teams, prize) and Match Sessions (price, spots, skill level, e.g. *Wednesday Night Match · 90 Min · 3 Rotating Teams*).
- **Roles** — Player, Organizer, Admin, each with a dedicated dashboard.
- **Organizer verification** — Government ID + Proof of Address upload, admin approval gate before publishing.
- **Payments** — Stripe Checkout (cards, Apple Pay, Google Pay, PromptPay) **and** a native Thai **PromptPay QR** flow with payment‑proof upload + organizer/admin approval.
- **Marketplace tiers** — Free Listing, Featured Event (399 THB), Promotion Package (499–999 THB) with social‑media promotion.
- **Community** — highlights, gallery, upcoming events, testimonials.

## 🗂 Pages

`/` Home · `/events` · `/events/[slug]` · `/tournaments` · `/community` · `/organizers` · `/pricing` · `/contact` · `/login` · `/register` · `/dashboard/player` · `/dashboard/organizer` · `/dashboard/admin`

---

## 🚀 Getting started

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
#   …then fill in the values (see below)

# 3. Run
npm run dev      # http://localhost:3000

# 4. Production build
npm run build && npm start
```

The app runs **without any keys** in a graceful **demo mode**: discovery, dashboards, and the PromptPay QR all work against bundled sample data. Add keys to switch on real auth and card payments.

---

## 🔑 Environment variables

Copy `.env.example` → `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Absolute site URL (OpenGraph, Stripe redirects) |
| `NEXT_PUBLIC_SUPABASE_URL` | for auth/db | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for auth/db | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | server tasks | Service‑role key (server only — never exposed) |
| `STRIPE_SECRET_KEY` | card payments | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | card payments | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | webhooks | Verifies Stripe webhook signatures |
| `NEXT_PUBLIC_PROMPTPAY_ID` | PromptPay | Mobile number or 13‑digit national ID for the QR |
| `NEXT_PUBLIC_PROMPTPAY_NAME` | PromptPay | Display name shown under the QR |

---

## 🐘 Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql). It creates tables, enums, RLS policies, the new‑user trigger, and three storage buckets (`event-media`, `verification-docs`, `payment-proofs`).
3. Copy the project URL + anon key into `.env.local`.
4. Promote yourself to admin after signing up:
   ```sql
   update public.profiles set role = 'admin' where id = '<your-auth-user-uuid>';
   ```

## 💳 Stripe setup

1. Grab your keys from the [Stripe dashboard](https://dashboard.stripe.com/apikeys).
2. Set `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Card checkout endpoint: `POST /api/checkout` (creates a Checkout Session with `card` + `promptpay`).
4. Webhook endpoint: `POST /api/stripe/webhook`. Add it in Stripe, then set `STRIPE_WEBHOOK_SECRET`.
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## 📱 PromptPay (Thailand QR)

The PromptPay QR is generated **client‑side** (EMVCo‑compliant payload with CRC, no external service) in `lib/promptpay.ts`. The flow: user picks PromptPay → QR renders with the amount → user uploads a payment slip → organizer/admin approves it in their dashboard. Set `NEXT_PUBLIC_PROMPTPAY_ID` to your PromptPay mobile/ID.

---

## 🎨 Brand & assets

- Logo + favicons live in `public/brand/`.
- Hero videos live in `public/videos/` (`hero-left.mp4`, `hero-center.mp4`, `hero-right.mp4`, each with a `-poster.jpg`).
  They were transcoded from your uploads to web‑optimized portrait H.264. **To swap a clip**, replace the file (and its poster) keeping the same name.
- Colors: neon cyan `#22e0ff`, neon purple `#b14dff`, neon lime `#9ef01a` on near‑black `#05060a`. Edit in `tailwind.config.ts`.

## 🌍 Internationalization

Dictionaries live in `lib/i18n/dictionaries.ts` (flat dot‑keys). Add a language by extending `LOCALES` + `LOCALE_META` and adding a dictionary. Use `useT()` / `useI18n()` in any client component.

---

## ☁️ Deploy to Vercel

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add the env vars from the table above in **Project → Settings → Environment Variables**.
4. Deploy. The Next.js preset needs no extra config.

---

## 📁 Structure

```
app/                  # App Router pages + API routes
  api/checkout/       # Stripe Checkout Session
  api/stripe/webhook/ # Stripe webhook
  dashboard/          # player · organizer · admin
components/           # UI + dashboard components
lib/
  i18n/               # dictionaries + context (en/de/th)
  supabase/           # browser + admin clients
  stripe/             # server client
  data/               # sample events + testimonials
  promptpay.ts        # EMVCo PromptPay QR payload
  types.ts utils.ts
public/brand · public/videos
supabase/schema.sql   # DB schema + RLS + storage
```

## 🧰 Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

---

Made for the Bangkok football community. ⚽️
