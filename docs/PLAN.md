# Personal Website + Blog — Design, Architecture & Layout Plan

This document plans a professional personal website (portfolio + blog) modeled on
the content style of [kenchoi.dev](https://www.kenchoi.dev/) — minus the
coursework page — plus a first-class blog for tech writing and day-to-day
"things I learned" notes. It is meant to be reviewed and used to pick a
direction before any implementation begins.

Reference site analysis, four alternative homepage layouts (with mockups),
a recommended tech stack/architecture, content model, blog roadmap, and a
deployment/domain plan are all included below.

> **Status:** Layout and scope decisions below have been reviewed and locked
> in (see §0). The exact, step-by-step execution plan built from these
> decisions lives in [`BUILD_PLAN.md`](./BUILD_PLAN.md) — that's the
> document to read if you want to know precisely how this will get built,
> in what order, with what packages and file layout, before any code is
> written.

---

## 0. Decisions (locked in)

| Topic | Decision |
|---|---|
| Homepage layout | **Option C — Bento Grid**, chosen |
| Blog post reading page | Keep the clickable/sticky **table-of-contents + section navigation** shown in the post-page mockup, regardless of homepage layout — carried over because it's genuinely useful for readers, independent of which homepage style wraps around it |
| Research tab | **Removed** — no dedicated Research/Publications page |
| Teaching tab | **Removed** |
| Experience section | **Removed** — the résumé covers work history instead of an on-site timeline |
| Résumé | **No dedicated page.** A "Résumé" link/button lives on the homepage (hero row and/or a small bento card) pointing to a PDF, opened in a new tab |
| Nav nav items | **Home · Projects · Blog** only (About is folded into Home, Contact is folded into the hero/footer — see §1) |
| Blog content format | **Markdown/MDX per post**, one file per post, git-versioned |
| Footnotes | Native GFM footnote syntax (`[^1]`) — no extra authoring ceremony |
| References/citations | Per-post optional `.bib` file + in-text `[@key]` citations, auto-rendered as a formatted bibliography — for the research-flavored posts |
| Blog architecture | Explicitly designed to be **modular/customizable** for frequent iteration — see §6 and `BUILD_PLAN.md` §5 |
| Domain | **Not yet chosen/purchased.** Architecture is domain-agnostic (env-var driven canonical URL) so development is not blocked — see §7 |

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

Content sections, updated per your latest decisions:

| Reference page | Our equivalent            | Notes |
|---|---|---|
| Home (bio)      | **Home**                  | Bio, current role, photo, socials, résumé link — doubles as "About," no separate page |
| Projects        | **Projects**              | Same card model: tags, tech stack, links |
| Research        | *(dropped)*                | No Research/Publications page |
| Teaching         | *(dropped)*                | No Teaching page |
| Coursework       | *(dropped)*                | Per original request |
| — (new)          | **Experience**              | *(dropped)* — résumé (linked from Home) covers work history instead |
| — (new)          | **Blog**                  | The main addition — see §4 |

**Final nav: Home · Projects · Blog.** Contact is a `mailto:` link + social
icons in the hero (and repeated in the footer); résumé is a link/button on
Home, not a nav item or page.

---

## 2. Layout options

Four distinct homepage directions were proposed, each with a mockup.
**Option C (Bento Grid) is the chosen direction** — kept here for the full
record, along with the others for context on why.

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

### Layout C — Bento Grid / Modern Tech ✅ **Chosen**

<img src="/opt/cursor/artifacts/assets/layout-c-bento.png" alt="Layout C: bento grid modern homepage mockup" />

Hero row (greeting + photo/illustration), then an asymmetric bento grid of
cards. Adapted final card inventory (no Research/Teaching/Experience, résumé
as a link not a page — see `BUILD_PLAN.md` §7 for the exact card-by-card
spec): **About Me, Currently, Latest Writing, Featured Projects, Tech
Stack, Résumé & Contact.**

- **Best for:** signaling current, modern front-end craft — this layout is
  itself a mini portfolio piece, since bento grids are trendy in the
  design/dev community right now. Good if you want the site to *also*
  demonstrate UI skill, not just list content.
- **Trade-off:** more component variety to design/build; can look "busy" if
  not executed carefully; ages faster stylistically than A or B. Mitigated
  by keeping the palette restrained (one accent color) and the grid to 6
  cards max on the homepage.

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

### Decision

**Option C, chosen** — with one blend from Option D carried over: the
**clickable, sticky in-page section navigation** from the blog post mockup
(§3) is kept for every blog post regardless of homepage style, since that's
a reader-facing feature on the post page itself, not a homepage layout
choice. The homepage bento grid stays restrained (6 cards) and the "Latest
Writing" card links straight into the full Blog index so the two layers
don't compete.

---

## 3. Blog post page (applies to any homepage layout) ✅ Confirmed — a favorite

<img src="/opt/cursor/artifacts/assets/blog-post-page.png" alt="Blog post reading page mockup" />

Centered ~700px reading column, breadcrumb, title, author/date/reading-time
meta row, tag pills, cover image, body copy with a proper dark syntax-
highlighted code block (with copy button), pull-quotes, **sticky
table-of-contents with click-to-jump section navigation** on wide viewports,
share buttons, author bio card, related-posts grid, and a comments section
anchor (wired up in Phase 2, see §6).

You called out the clickable section navigation specifically as useful for
readers — it's confirmed as a permanent fixture of every post page. Exact
implementation (heading extraction, active-section highlighting) is in
`BUILD_PLAN.md` §6.

---

## 4. Recommended architecture

### 4.1 Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSG for portfolio pages, SSR/ISR-ready for blog, file-based routing, best-in-class SEO/metadata + OG image APIs, huge ecosystem, same family as the reference site so it's a proven fit for this genre of site |
| Styling | **Tailwind CSS v4 + shadcn/ui** | Fast to build a *professional*, consistent design system; shadcn gives accessible primitives (nav, dialog, tabs, tooltip) you don't have to hand-roll |
| Content (now) | **MDX in-repo** via **Velite** | Git-versioned content, zero infra/DB, Zod-validated + type-safe frontmatter, instant local preview, PR-review-able writing. (Contentlayer, the older choice for this, is unmaintained as of 2026 and has App Router compatibility issues — Velite is the actively-maintained, community-recommended replacement) |
| Content (later) | Swap the content source behind a small `lib/content` interface | See §6 — lets you graduate to a headless CMS or DB-backed editor without touching UI code |
| Footnotes | `remark-gfm` (native `[^1]` footnote syntax) | Zero extra authoring syntax — it's what you already know from GitHub-flavored markdown |
| Citations/bibliography | `rehype-citation` (+ per-post `.bib`/CSL-JSON file) | Turns `[@key]` into formatted in-text citations and an auto-generated bibliography (APA/Chicago/numeric/etc.), interleaves correctly with GFM footnotes for "note" citation styles — see `BUILD_PLAN.md` §6 |
| Heading anchors/TOC | `rehype-slug` + `rehype-autolink-headings` + a small heading-tree extractor | Powers the sticky, clickable section nav on every post |
| Code highlighting | `shiki` via `rehype-pretty-code` | The polished, VS-Code-quality code blocks companies' engineers will notice, with matched light/dark themes |
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

See `BUILD_PLAN.md` §8 for the exact, final folder structure (Research/
Teaching/Experience/Résumé routes removed, blog content pipeline detailed).
Single Next.js app, single Vercel project — this satisfies "deploy on the
same website" for the blog now *and* later: the blog is always just routes
under `/blog/*` in the same deploy, never a separate subdomain/app unless
you explicitly choose to split it later.

### 4.3 Data model (frontmatter schemas)

See `BUILD_PLAN.md` §4 for the exact Zod schemas (including the optional
`bibliography` field and citation style override for research-flavored
posts). Summary:

```ts
// Project
{ slug, title, date, description, tags: string[], stack: string[],
  links: { code?, demo?, paper?, slides? }, image?, featured?: boolean }

// BlogPost
{ slug, title, date, updated?, category: "tech" | "notes" | "life",
  tags: string[], excerpt, cover?, draft?: boolean,
  bibliography?: string,       // e.g. "references.bib" — only for research-flavored posts
  csl?: string,                // citation style override, defaults to a site-wide default
  toc?: boolean,                // default true — some short "notes" posts may not need one
  readingTime (computed) }
```

`category` gives you the two buckets you mentioned — polished tech
write-ups vs. quick "today I learned" notes — without needing two separate
systems; the blog index can filter/segment by category the same way
Projects filters by tag. Research has been dropped as a separate section,
but research-*flavored* posts are still fully supported inside the blog via
the `bibliography` field.

---

## 5. Visual design system (summary)

Bento cards, tag pills, and the code-block theme all need to look
consistent with each other since Option C surfaces several UI patterns at
once on the homepage — see `BUILD_PLAN.md` §5 for the concrete "design once,
reuse everywhere" component list this implies.

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

You flagged that the blog should be **as modular/customizable as possible**
since you expect to iterate on it a lot. That requirement shapes the
architecture in a few concrete ways (full detail in `BUILD_PLAN.md` §5):

- **Config-driven nav & site metadata** — adding/removing a nav item,
  social link, or the résumé link is a one-line change in `site.config.ts`,
  not a template edit (this is exactly the kind of change we just made
  three times in this round: drop Research, drop Teaching, drop Experience).
- **A pluggable MDX component registry** — new content primitives
  (`Callout`, `Figure`, `Poll`, an embed, etc.) are added to one map and are
  then usable in any post immediately, without touching the render pipeline.
- **A per-post `layout`/`variant` field** — lets a "quick note" post render
  more compactly (no TOC, no cover image) than a long research-style post,
  from the same content type.
- **Content-source abstraction** (`lib/content`) — the blog's data access
  is one small interface (`getAllPosts`, `getPostBySlug`, ...) so the
  Phase 3 CMS migration below never touches page/component code.

With that context, the phased roadmap:

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

## 7. Deployment & domain plan — no domain chosen yet

You haven't settled on a domain (still checking availability). This does
**not** block building or even shipping the site:

1. Build and deploy now to Vercel's free auto-assigned subdomain
   (`<project>.vercel.app`) — that's a fully working, shareable production
   site from day one.
2. The codebase never hardcodes a domain anywhere: a single
   `NEXT_PUBLIC_SITE_URL` env var (defaulting to the Vercel URL) feeds the
   canonical URL, sitemap, RSS feed, and Open Graph tags. Buying a domain
   later is purely a config + DNS change, zero code changes.
3. When you have a candidate name, tell me and I can check registrar
   availability for you before you buy (WHOIS/registrar lookup), and
   suggest close alternatives (`.dev`, `.com`, `.io`, `.me`) if your first
   choice is taken.
4. Once purchased (suggest Cloudflare Registrar for no markup, or
   Namecheap): point DNS at Vercel (A/ALIAS + CNAME per Vercel's
   instructions), Vercel auto-provisions HTTPS, update
   `NEXT_PUBLIC_SITE_URL`, redeploy. No downtime, no re-architecture.
5. Add Vercel Analytics/Plausible once traffic matters.

---

## 8. Suggested next steps

See [`BUILD_PLAN.md`](./BUILD_PLAN.md) for the exact, ordered execution
plan. At a high level, once you give the go-ahead to start building:

1. Scaffold the Next.js + Tailwind + Velite project (empty shell, design
   tokens, config-driven nav, dark mode).
2. Build the Home bento grid, Projects section, and the Blog engine
   (MDX pipeline with footnotes/citations/TOC) in parallel-friendly slices.
3. Seed a couple of real or placeholder posts/projects so the first deploy
   isn't empty, deploy to a Vercel preview URL for you to review.
4. You supply real content (bio, photo, project list, résumé PDF, first
   few posts) and we iterate on copy/design.
5. Wire up the domain once you've picked and purchased one (§7).
