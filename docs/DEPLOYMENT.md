# Deployment Plan — Exact Steps

**Status: planning only — nothing has been deployed yet** (there's no app
to deploy until `BUILD_PLAN.md` Phase 0 is built). This document is the
precise runbook for shipping the site once it exists, in two parts:
launching now on a free Vercel subdomain (no purchased domain required),
and cutting over to a custom domain later whenever you've bought one.

---

## 1. Prerequisites

- A GitHub repository with the site's code (this repo already qualifies —
  `ewc340/website`, currently on the `cursor/personal-site-blog-plan-d4dc`
  branch for planning; the actual app code will eventually land on `main`).
- A free [Vercel](https://vercel.com) account, signed up with **"Continue
  with GitHub"** so repo access is granted automatically (no manual token
  copying needed).
- Nothing else. No domain, no credit card, no paid tier required to reach
  a live, shareable production URL.

---

## 2. First deploy (Vercel free subdomain)

1. **Import the repo.** In the Vercel dashboard, click **Add New… →
   Project**, select the `ewc340/website` GitHub repo, and click **Import**.
2. **Configure the project.** Vercel auto-detects Next.js. Leave:
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `.` (repo root, since this is a single-app repo)
   - Build Command: default (`next build` — Velite's content build runs
     as a `prebuild`/`predev` npm script wired up in Phase 1, so a plain
     `next build` is all Vercel needs to invoke)
   - Output Directory: default (Vercel manages this for Next.js)
3. **Set environment variables** (Project → Settings → Environment
   Variables, or in the import screen before the first deploy):

   | Variable | Value at launch | Notes |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://<project-name>.vercel.app` | Vercel also exposes `VERCEL_URL` automatically per-deployment; this explicit var is the *canonical* one used in sitemap/RSS/OG so it doesn't change on every preview deploy |
   | `NEXT_PUBLIC_SITE_NAME` | your name/site title | Used in metadata templates |

   (Analytics/search/comments env vars are added later, in the Phase 2
   blog roadmap — not needed at launch.)
4. **Deploy.** Click **Deploy**. First build takes a few minutes; Vercel
   gives you a live URL immediately after
   (`https://<project-name>.vercel.app`).
5. **Verify:**
   - Homepage, `/projects`, and `/blog` all load.
   - Toggle dark mode and refresh — it should persist.
   - View source on a blog post and confirm the citation/footnote
     rendering and table of contents actually appear (this is the one
     most likely to silently break if a plugin is mis-ordered).
   - Check `/sitemap.xml` and `/rss.xml` both return valid XML.

At this point the site is **live and shareable** — this URL is good enough
to put in an email signature, LinkedIn, or send to a recruiter while the
domain question is still open.

---

## 3. Ongoing deploy workflow

- **Every push to `main` auto-deploys to production.** No manual deploy
  step, ever.
- **Every pull request gets its own preview URL**, posted as a comment on
  the PR by the Vercel GitHub integration. This is genuinely useful for
  this project specifically: open a PR for a new blog post, review it at
  its real rendered URL (citations, TOC, code blocks and all) before
  merging, exactly like reviewing code.
- **Instant rollback:** if a deploy ever breaks something, Vercel's
  dashboard (Deployments tab) lets you "Promote to Production" any past
  successful deployment in one click — no `git revert` required to recover
  immediately, though you should still fix and revert in git afterward.
- Recommended branch protection on `main` once this repo has real content:
  require the Vercel preview build to succeed before merging.

---

## 4. Analytics & basic monitoring (add once traffic matters)

1. Vercel dashboard → Project → **Analytics** tab → Enable. Zero-config,
   privacy-respecting, no cookie banner needed (satisfies the
   "professional" bar — no consent popup greeting visitors).
2. Optional alternative/addition: [Plausible](https://plausible.io) (paid,
   nicer dashboard, still cookie-free) — add its script tag and a
   `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var if you go this route instead.
3. Optional: Vercel's **Speed Insights** add-on for real-user Core Web
   Vitals tracking, useful to confirm the Lighthouse targets from
   `BUILD_PLAN.md` Phase 5 hold up for real visitors.

---

## 5. Domain cutover (once you've purchased a domain)

You don't have a domain yet — this section is ready to execute the moment
you do, with no code changes required (only the `NEXT_PUBLIC_SITE_URL` env
var changes; everything else already reads from it).

### 5.1 Buying the domain

- Check availability for your candidate name — tell me the name(s) you're
  considering and I can check availability across common TLDs (`.com`,
  `.dev`, `.io`, `.me`) before you buy.
- Recommended registrars: **Cloudflare Registrar** (sells at wholesale
  price, no markup, and has a very clean DNS UI if you ever want to manage
  DNS there instead of at Vercel) or **Namecheap** (easy UI, frequent
  first-year discounts). Avoid registrars that upsell "premium DNS" or
  "domain privacy" as paid add-ons — both are free or default-on at
  Cloudflare/Namecheap.

### 5.2 Add the domain in Vercel

1. Vercel dashboard → Project → **Settings → Domains**.
2. Enter your apex domain (e.g. `yourname.dev`) and click **Add**.
3. Vercel will also prompt you to add the `www` subdomain — add that too
   (Vercel recommends serving from `www` and redirecting the apex to it,
   or vice versa; either is fine, pick one as your canonical URL and
   redirect the other — configurable in the same Domains screen via each
   domain's **Redirect to** field).
4. Vercel now shows the exact DNS records to add, tailored to your project.
   They'll match the pattern below, but always use the exact values shown
   in your own dashboard (Vercel occasionally uses per-project CNAME
   targets).

### 5.3 Configure DNS at your registrar

At your domain registrar's DNS settings, add:

| Record type | Host/Name | Value | Purpose |
|---|---|---|---|
| `A` | `@` (apex/root) | `76.76.21.21` (or the exact value in your Vercel domain card) | Points the bare domain (`yourname.dev`) at Vercel. Apex domains can't use CNAME — this is the standards-compliant approach Vercel documents. |
| `CNAME` | `www` | the CNAME target shown in your Vercel domain card (e.g. `cname.vercel-dns.com`, exact value per project) | Points `www.yourname.dev` at Vercel |

Notes:
- **Delete any pre-existing `A`/`CNAME` records** for the apex/`www` from
  the registrar's default parking-page setup first — leftover records are
  the most common cause of "domain not verifying."
- Alternative, simpler option: instead of individual records, **delegate
  to Vercel's nameservers** (shown in the same Domains screen) — Vercel
  then manages all DNS for the domain via its own dashboard, which is
  convenient but means DNS changes for anything else (e.g. a future email
  provider's MX records) also happen in Vercel's UI instead of the
  registrar's.
- DNS propagation can take anywhere from a few minutes to ~48 hours
  worldwide; Vercel's Domains screen shows a live "Valid Configuration" ✅
  once it detects the records.

### 5.4 Finish the cutover

1. Once Vercel shows the domain as valid, it automatically provisions a
   free SSL certificate (Let's Encrypt) — no action needed.
2. Update the `NEXT_PUBLIC_SITE_URL` environment variable (§2) to the real
   domain (e.g. `https://yourname.dev`), then **redeploy** (Vercel
   dashboard → Deployments → ⋯ → Redeploy, or just push any commit) so the
   sitemap, RSS feed, and Open Graph tags start emitting the real domain
   instead of the `.vercel.app` one.
3. **Verify:**
   - Visit the apex and `www` domains directly — both should load over
     HTTPS with no certificate warning.
   - Confirm the non-canonical one (apex or `www`, whichever you didn't
     pick as primary) redirects to the canonical one.
   - Re-check `/sitemap.xml`, `/rss.xml`, and a shared-link preview (paste
     the homepage URL into Slack/iMessage) to confirm they now show the
     real domain, not the Vercel one.
   - From a terminal: `dig A yourname.dev` and `dig CNAME www.yourname.dev`
     to confirm the records resolve as expected if anything looks off.
4. Optional: submit the sitemap to **Google Search Console** (add the
   property, verify via the DNS TXT record method or the existing Vercel
   domain, submit `/sitemap.xml`) so new blog posts get indexed promptly.

No downtime occurs during this cutover — the `.vercel.app` URL keeps
working throughout and indefinitely afterward, it just stops being the
one you share.

---

## 6. Summary checklist

- [ ] Repo pushed to GitHub *(already true for this repo)*
- [ ] Vercel project created, imported from GitHub
- [ ] `NEXT_PUBLIC_SITE_URL` (and `NEXT_PUBLIC_SITE_NAME`) set
- [ ] First deploy verified (home/projects/blog load, dark mode persists,
      TOC/citations render, sitemap + RSS valid)
- [ ] Vercel Analytics enabled
- [ ] Domain purchased (whenever you're ready — not required to launch)
- [ ] Domain added in Vercel, DNS records added at registrar
- [ ] `NEXT_PUBLIC_SITE_URL` updated to the real domain, redeployed,
      re-verified
- [ ] Sitemap submitted to Google Search Console
