# RA Lands

Website for RA Land Investments LLC: land listings with financing details, plus independent land advisory.
Built with Next.js (App Router), TypeScript and Tailwind CSS v4, Supabase for listings, and Vercel for hosting.

```bash
npm install
cp .env.example .env.local   # then fill it in (see below)
npm run dev                  # http://localhost:3000
npm run lint && npm run typecheck && npm run build
```

Without Supabase variables, `npm run dev` shows six clearly labelled **sample listings** so the design can be
reviewed. A production build shows no listings until Supabase is connected (set
`NEXT_PUBLIC_USE_SAMPLE_PARCELS=1` to preview samples on a deployment).

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero, featured properties, why choose us, advisory services, how it works |
| `/properties` | Listing grid with state, acreage, price and status filters and sorting |
| `/properties/[code]` | Parcel page: photos, details, financing terms, map link, inquiry form |
| `/about`, `/how-it-works`, `/faq`, `/contact`, `/privacy` | Information pages |
| `/ra-admin` | Private listings admin (not linked, `noindex`) |

## Listings admin (`/ra-admin`)

The owner adds, edits, publishes or hides, reorders and deletes listings, including photos, and sets each
parcel's status (For Sale, Under Contract, Sold) and optional financing terms.

- Sign-in is a one-time code emailed to an address in `ADMIN_EMAILS` (`src/lib/admin.ts`, currently
  `revital.halevi@gmail.com`). Codes are never sent to any other address.
- Data lives in `public.parcels` and the public `parcel-photos` storage bucket in Supabase.
- Access is enforced in the database (row-level security via `public.is_admin()`), not just in the page, so the
  publishable key is safe in the browser. **Keep the admin email list in `src/lib/admin.ts` and in the SQL
  function in sync.**
- Saving revalidates the public pages immediately.

### One-time Supabase setup (done by the client)

1. Create a Supabase project.
2. In the SQL editor, run `supabase/migrations/20261116000000_parcels_and_photos.sql`.
3. **Authentication > Emails**: edit the **Magic Link** template so the email shows the code, e.g.
   `<p>Your sign-in code: <strong>{{ .Token }}</strong></p>`. (The default only has a link.)
4. **Authentication > URL Configuration**: set the Site URL to the production domain and add
   `https://<domain>/auth/callback` (and the Vercel preview pattern if wanted) as redirect URLs.
5. **Settings > API**: copy the project URL and publishable key into `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel, then redeploy.
6. Optional but recommended: set up custom SMTP in Supabase (Authentication > Emails) so sign-in codes are not
   limited by the built-in sender's low hourly cap.

## Forms

The consultation form, property inquiries and newsletter signup all post to `/api/contact`, which validates the
input (honeypot field, length limits, header-injection safe, light per-IP throttle) and emails it through the
SMTP2GO API. Nothing is stored. Set `SMTP2GO_API_KEY`, `CONTACT_FROM_EMAIL` (verified sender) and
`CONTACT_TO_EMAIL` in Vercel. Replies go straight to the visitor (Reply-To).

## Good practices in place

- Security headers and a static CSP in `next.config.ts` (the only outside origin is the Supabase project).
- Public pages set no cookies and load no third-party scripts; the proxy only touches `/ra-admin`.
- Static generation with on-demand revalidation, sitemap (includes parcels), robots, canonical URLs, Open Graph,
  JSON-LD (organization, FAQ, product offers).
- Accessibility: skip link, landmarks, labelled form controls, visible focus, reduced-motion support, keyboard
  navigable menu and filters.
- Self-hosted font (Plus Jakarta Sans) through `next/font`.

## Content to review before launch

- Copy on About, How It Works, FAQ and Privacy is a draft written from the RA Land Investments site. The
  business should confirm every statement (financing, signing and deed steps, privacy and terms) and have the
  policy reviewed.
- Parcel and hero imagery are illustrations in the brand palette (`LandscapeArt`), not photos. Upload real
  photos per parcel in the admin; the hero collage can be swapped for photos too.
- Testimonials are intentionally omitted until real ones are available.
- Set `NEXT_PUBLIC_SITE_URL` to the real domain.

## Deployment

Deployed on Vercel (Git integration). Set the environment variables from `.env.example` in the Vercel project.
