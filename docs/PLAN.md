# Personal Website + Blog — Design, Architecture & Layout Plan

This document plans a professional personal website (portfolio + blog) modeled on
the content style of [kenchoi.dev](https://www.kenchoi.dev/) — minus the
coursework page — plus a first-class blog for tech writing and day-to-day
"things I learned" notes. It is meant to be reviewed and used to pick a
direction before any implementation begins.

Reference site analysis, four alternative homepage layouts (with mockups),
a recommended tech stack/architecture, content model, blog roadmap, and a
deployment/domain plan are all included below.

---

## 1. Reference site breakdown (kenchoi.dev)

What it gets right, so we keep it:

- **Single clear identity statement** — one-paragraph bio up top, no fluff.
- **Fixed, minimal top navbar** with a wordmark and 3–4 nav items, blurred
  background on scroll, and a light/dark toggle (persisted in
  `localStorage`, defaults to OS preference).
- **Tag-driven content** — Projects and Research pages are really just
  filterable, tagged card lists (tag → count chips at the top, click to
  filter).
- **Consistent card anatomy** — title, date, 1–2 sentence description, tech
  tags, and 1–3 outbound links (`Code`, `Paper`, `Website`, `Slides`).
- **Socials in the hero, not buried in a footer** — GitHub, LinkedIn, Google
  Scholar as icon links right under the bio.
- Built with **Next.js + Tailwind**, statically generated, no backend.

Content sections we'll carry over (dropping *Coursework* per your request):

| Reference page | Our equivalent            | Notes |
|---|---|---|
| Home (bio)      | **Home**                  | Bio, current role, photo, socials, resume link |
| Projects        | **Projects**              | Same card model: tags, tech stack, links |
| Research        | **Research** *(optional)* | Keep only if you have/expect publications; otherwise fold a short "talks" list into About |
| Teaching         | **Experience** *(optional)* | Repurpose as work-experience timeline instead of teaching, or drop |
| Coursework       | *(dropped)*                | Per request |
| — (new)          | **Blog**                  | The main addition — see §4 |

Proposed final nav: **Home · Projects · Blog · About · Contact** (Research
folded into About or kept as its own item if you have publications worth
showcasing to company reviewers — publications read very well to recruiters).

---

## 2. Layout options

Four distinct homepage directions, each with a mockup. All four share the same
content (bio, projects, blog, contact) — they differ in *information density,
personality, and how blog-forward they are*. Pick one, or tell me to blend
two (e.g., Layout A's simplicity with Layout D's blog-forward homepage).

### Layout A — Minimal Professional (closest to the reference)

<img src="/opt/cursor/artifacts/assets/layout-a-minimal.png" alt="Layout A: minimal professional homepage mockup" />

Fixed top navbar, centered hero (photo + one-paragraph bio + social icons),
then two calm rows of preview cards: *Latest Writing* and *Featured
Projects*. Single accent color, huge whitespace.

- **Best for:** the safest, highest-signal choice for a hiring-manager
  audience. Fastest to build. Feels like a slightly more polished version of
  the reference site.
- **Trade-off:** the blog is a secondary citizen on the homepage.

### Layout B — Sidebar Profile / Portfolio Dashboard

<img src="/opt/cursor/artifacts/assets/layout-b-sidebar.png" alt="Layout B: persistent sidebar profile layout mockup" />

Persistent left sidebar (photo, name, title, bio, socials, nav, theme
toggle) that never scrolls away; main panel on the right holds About →
Experience timeline → Featured Projects → Recent Posts, all on one scroll.

- **Best for:** a "digital résumé" feel — great if you want experience/
  timeline to be very prominent (this is closer to sites like
  brittanychiang.com). Socials and nav are always visible, which reads
  confident and organized.
- **Trade-off:** eats horizontal space on desktop; needs a distinct mobile
  version (sidebar collapses to a top sheet/drawer).

### Layout C — Bento Grid / Modern Tech

<img src="/opt/cursor/artifacts/assets/layout-c-bento.png" alt="Layout C: bento grid modern homepage mockup" />

Hero row (greeting + photo/illustration), then an asymmetric bento grid of
cards: About, "Currently" (building/learning/reading), Latest Post,
Tech Stack, GitHub activity, Get in Touch.

- **Best for:** signaling current, modern front-end craft — this layout is
  itself a mini portfolio piece, since bento grids are trendy in the
  design/dev community right now. Good if you want the site to *also*
  demonstrate UI skill, not just list content.
- **Trade-off:** more component variety to design/build; can look "busy" if
  not executed carefully; ages faster stylistically than A or B.

### Layout D — Editorial / Magazine (blog-forward)

<img src="/opt/cursor/artifacts/assets/layout-d-editorial.png" alt="Layout D: editorial magazine-style blog-forward homepage mockup" />

Large serif headline framed around *writing* ("Notes on software, research,
and everyday learning"), one large featured-post card, a grid of recent
posts, a slim "About the author + tags + featured projects" rail, and a
newsletter signup in the footer.

- **Best for:** you said the blog will grow in importance — this layout
  treats writing as the primary product and the portfolio as a supporting
  rail. Reads like a real publication/blog, which is compelling if you plan
  to write often and want repeat readers, not just one-time recruiter visits.
- **Trade-off:** if you don't post consistently, an empty/sparse blog feed
  is the first thing visitors see — needs a content backlog before launch
  (or a "coming soon" seed post) to avoid feeling empty.

### Recommendation

Given "extremely professional, people from other companies will look at
it" **and** "blog will get more advanced over time," I'd lean **Layout A
for structure/tone with Layout D's treatment of the blog module** on the
homepage (i.e., keep the calm, minimal hero of A, but give the "Latest
Writing" section the bigger featured-post treatment from D). This reads as
professional first, keeps hiring managers oriented immediately, while still
giving the blog room to grow into the site's second pillar. Layout B is the
strongest alternative if you want experience/timeline to be the star.

---

## 3. Blog post page (applies to any homepage layout)

<img src="/opt/cursor/artifacts/assets/blog-post-page.png" alt="Blog post reading page mockup" />

Centered ~700px reading column, breadcrumb, title, author/date/reading-time
meta row, tag pills, cover image, body copy with a proper dark syntax-
highlighted code block (with copy button), pull-quotes, sticky
table-of-contents on wide viewports, share buttons, author bio card,
related-posts grid, and a comments section anchor (wired up in Phase 2,
see §6).

---

## 4. Recommended architecture

### 4.1 Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSG for portfolio pages, SSR/ISR-ready for blog, file-based routing, best-in-class SEO/metadata + OG image APIs, huge ecosystem, same family as the reference site so it's a proven fit for this genre of site |
| Styling | **Tailwind CSS v4 + shadcn/ui** | Fast to build a *professional*, consistent design system; shadcn gives accessible primitives (nav, dialog, tabs, tooltip) you don't have to hand-roll |
| Content (now) | **MDX in-repo** via `contentlayer2` (or `velite`) | Git-versioned content, zero infra/DB, type-safe frontmatter, instant local preview, PR-review-able writing — the right amount of "advanced" for launch |
| Content (later) | Swap the content source behind a small `lib/content` interface | See §6 — lets you graduate to a headless CMS or DB-backed editor without touching UI code |
| Code highlighting | `shiki` / `rehype-pretty-code` | The polished, VS-Code-quality code blocks companies' engineers will notice |
| Icons | `lucide-react` | Consistent, professional icon set |
| Animation | `framer-motion` (used sparingly) | Subtle fade/slide-in only; respect `prefers-reduced-motion` |
| Fonts | UI: **Geist Sans** (or Inter). Blog body: optionally pair with **Newsreader**/**Lora** serif for long-form reading warmth | Professional, highly legible pairing |
| Hosting | **Vercel** (Hobby tier is enough initially) | Zero-config Next.js hosting, preview deployments per PR, image optimization, custom domains, generous free tier |
| Domain | Buy via Cloudflare Registrar / Namecheap / Google Domains, point to Vercel | Cloudflare Registrar has no markup and pairs nicely if you ever want their CDN/WAF in front |
| Analytics | **Vercel Analytics** or **Plausible** | Privacy-friendly, no cookie-consent banner needed — keeps the "professional" feel intact |
| SEO | Next.js Metadata API + `next-sitemap` + `@vercel/og` for auto-generated per-post OG images + `Person`/`BlogPosting` JSON-LD | Makes link previews and Google results look polished |
| Quality gates | ESLint + Prettier + TypeScript `strict` + optional Playwright smoke test | Keeps the codebase maintainable as the blog grows |

This is intentionally the *same* class of stack as kenchoi.dev, so it
inherits a proven "this looks professional" baseline, while the content
layer is architected so the blog can grow up later (§6) without a rewrite.

### 4.2 Repository / route structure

```
/
├─ app/
│  ├─ layout.tsx                 # shell: navbar, footer, theme provider
│  ├─ page.tsx                   # Home
│  ├─ projects/
│  │  ├─ page.tsx                # tag-filterable grid
│  │  └─ [slug]/page.tsx         # optional detail page
│  ├─ research/page.tsx          # optional
│  ├─ about/page.tsx
│  ├─ contact/page.tsx           # or fold into footer
│  ├─ blog/
│  │  ├─ page.tsx                # paginated post list
│  │  ├─ [slug]/page.tsx         # post reader
│  │  └─ tags/[tag]/page.tsx
│  ├─ rss.xml/route.ts
│  ├─ sitemap.ts
│  └─ api/og/route.tsx           # dynamic OG image generation
├─ content/
│  ├─ projects/*.mdx
│  ├─ research/*.mdx
│  └─ blog/*.mdx                 # frontmatter: title, date, tags, category, draft, cover
├─ components/
│  ├─ nav-bar.tsx, footer.tsx, theme-toggle.tsx
│  ├─ project-card.tsx, post-card.tsx, tag-pill.tsx
│  └─ mdx/ (custom MDX components: CodeBlock, Callout, Figure, Tweet, etc.)
├─ lib/
│  ├─ content/                   # abstraction over "where content comes from" (see §6)
│  └─ seo.ts, rss.ts
└─ public/
```

Single Next.js app, single Vercel project — this satisfies "deploy on the
same website" for the blog now *and* later: the blog is always just routes
under `/blog/*` in the same deploy, never a separate subdomain/app unless
you explicitly choose to split it later.

### 4.3 Data model (frontmatter schemas)

```ts
// Project
{ slug, title, date, description, tags: string[], stack: string[],
  links: { code?, demo?, paper?, slides? }, image?, featured?: boolean }

// Publication (if kept)
{ title, authors: string[], year, venue, tags: string[], links: { paper?, code? } }

// BlogPost
{ slug, title, date, updated?, category: "tech" | "notes" | "life",
  tags: string[], excerpt, cover?, draft?: boolean, readingTime (computed) }
```

`category` gives you the two buckets you mentioned — polished tech
write-ups vs. quick "today I learned" notes — without needing two separate
systems; the blog index can filter/segment by category the same way
Projects filters by tag.

---

## 5. Visual design system (summary)

- **Palette:** neutral off-white/near-black base for light/dark, one accent
  color (pick something distinct from the generic Tailwind "blue-600" —
  e.g., a deep indigo or teal — for professional differentiation).
- **Type scale:** one UI sans-serif for nav/labels/cards; optional serif for
  blog post body copy only, to make long-form reading feel editorial and
  distinct from the portfolio chrome.
- **Components to design once, reuse everywhere:** navbar, footer, card
  (project/post share a base), tag pill, button, timeline item, code block
  theme, table-of-contents, empty state.
- **Motion:** small, purposeful only (fade/slide on scroll into view,
  hover elevation on cards) — nothing that reads as "template."
- **Accessibility:** semantic landmarks, visible focus rings, alt text on
  every image, color contrast ≥ WCAG AA in both themes, honors
  `prefers-reduced-motion`.

---

## 6. Blog roadmap — designed to grow up without a rewrite

**Phase 1 — Launch (MVP, ships with the rest of the site)**
- MDX posts in `content/blog`, frontmatter-typed, `category` + `tags`
- List page with pagination + tag/category filter, post reader page (§3)
- Syntax highlighting, computed reading time, RSS feed, sitemap, per-post
  OG images
- Dark mode parity

**Phase 2 — Advanced-but-still-static**
- Search via `pagefind` (static, no external service) or Algolia if you
  want typeahead
- Comments via `giscus` (backed by GitHub Discussions — free, fits a dev
  audience, no moderation infra to run)
- "Related posts" (tag-similarity), newsletter capture (Buttondown/
  ConvertKit embed, no backend needed)
- View counts via a tiny serverless counter (Vercel KV/Upstash Redis)

**Phase 3 — Full CMS / editor, if the blog outgrows Git-based writing**
- Swap the `lib/content` data source from "read MDX files" to a headless
  CMS (Sanity, Payload, or Contentlayer→DB) or a small custom admin backed
  by Postgres — because the rest of the app only ever calls
  `getAllPosts()` / `getPostBySlug()`, this migration touches one module,
  not the UI
- Enables: writing/publishing from a phone, scheduled posts, drafts with
  shareable preview links, multi-author support if ever wanted
- Everything still deploys from the same Next.js app/domain — no split
  needed unless you want one

This phasing is the key to "the blog will be more advanced someday but I
still want it on the same website": every phase is additive to the same
codebase and same deployment, so there's never a "migrate the blog to a
new platform" project later.

---

## 7. Deployment & domain plan

1. Buy the domain (suggest checking `yourname.dev`, `yourname.com`, or
   `yourname.io`) via Cloudflare Registrar or Namecheap.
2. Push this repo to GitHub, import into Vercel (Hobby plan is enough).
3. Point the domain's DNS at Vercel (A/ALIAS + CNAME per Vercel's
   instructions); Vercel auto-provisions HTTPS.
4. Every `git push` to `main` auto-deploys to production; every PR gets a
   preview URL — useful for reviewing new blog posts before they go live.
5. Add Vercel Analytics/Plausible once traffic matters.

---

## 8. Suggested next steps

1. Pick a layout (A/B/C/D, or a hybrid) and confirm the nav/content list in §1.
2. I scaffold the Next.js + Tailwind project with the chosen layout, home
   page, Projects and Blog sections wired to MDX content, dark mode, and a
   couple of seed blog posts/projects so it's not empty on first deploy.
3. You supply real content (bio, photo, project list, first few posts) and
   we iterate on copy/design.
4. Wire up the domain once you've purchased it.
