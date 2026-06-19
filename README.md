# Atlas & Away

A Morocco travel blog + newsletter riding the World Cup wave (2022 Atlas Lions run → 2030 co-hosting),
built with Astro + MDX. Goal: grow an engaged audience first, monetize via affiliate links + a free
lead magnet, then launch a product once the audience validates demand.

## Stack

- **Astro 6 + MDX** — static site, fast, beginner-friendly, deploys free on Vercel/Netlify.
- **Content collections** (`src/content/blog/`) — write posts as `.mdx` files with frontmatter.
- No backend/database required to start.

## Project structure

```
src/
  content.config.ts        # blog collection schema (title, description, pubDate, tags, draft)
  content/blog/*.mdx        # blog posts
  components/
    NewsletterSignup.astro  # reusable opt-in form, used on home + every post
    AffiliateLink.astro     # wraps outbound monetized links with disclosure + rel attrs
    Header.astro / Footer.astro
  layouts/
    BaseLayout.astro
    BlogPost.astro
  pages/
    index.astro             # home: hero + newsletter + latest posts
    blog/index.astro         # post listing
    blog/[...slug].astro     # post template
    freebie.astro            # lead-magnet landing page (free checklist PDF)
    about.astro
  consts.ts                  # site title/description + newsletter form action URL
```

## Run it

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to ./dist
npm run preview
```

## Before you publish, wire up these TODOs

1. **Newsletter provider** — `src/consts.ts` has a placeholder `NEWSLETTER_FORM_ACTION`. Sign up
   for a free tier (Buttondown, MailerLite, or ConvertKit), grab the embed form action URL, and
   paste it in. All signup forms on the site (`NewsletterSignup.astro` and `/freebie`) read from
   this one constant.
2. **The freebie PDF** — `/freebie` promises a 1-page Morocco World Cup trip checklist. Write it
   (Canva/Google Docs → PDF), host it, and either set it as your ESP's "welcome email" attachment
   or redirect to it after signup.
3. **Affiliate programs** — join a couple of these and drop real tracking links into
   `<AffiliateLink href="...">` wherever you mention a tool/service:
   - Booking.com Affiliate Partner Program (hotels/riads)
   - Skyscanner / Kayak affiliate programs (flights)
   - Amazon Associates (travel gear: power adapters, daypacks, etc.)
   - GetYourGuide / Viator (tours, day trips)
4. **Domain + `astro.config.mjs`** — replace the placeholder `site: 'https://example.com'` with
   your real domain once you have one (needed for correct sitemap/SEO).
5. **Deploy** — push to GitHub, import the repo in Vercel, done. No env vars needed for the
   current setup.

## Content strategy (why this niche, why now)

Morocco's visibility has compounding hooks: the Atlas Lions' 2022 semifinal run, ongoing AFCON/
World Cup qualifier news, and the 2030 World Cup (co-hosted with Spain/Portugal). Every fixture is
a fresh reason for search and social interest to spike — that's the trend to ride with timely,
specific content instead of generic "10 places to visit in Morocco" listicles.

**Cadence to aim for:** 2-3 posts/week to start. Mix of:
- **Evergreen guides** (budget breakdowns, visa rules, host-city comparisons) — these compound in
  SEO traffic over time.
- **Trend-jacking posts** published within 24-48h of any national-team news (a big win, a
  qualifier draw, a 2030 World Cup announcement) — these drive the social/search spikes.
- **Newsletter-exclusive content** (price-alert roundups, "what changed this week") to give
  subscribers a reason to stay subscribed beyond the blog itself.

**Funnel:** blog post → newsletter signup (every post ends with `<NewsletterSignup />`) → freebie
checklist as the lead magnet → affiliate revenue from the guides themselves → once the list is
large enough, a paid product (templates, a deeper guide, or a tool) validated by what subscribers
actually ask for.
