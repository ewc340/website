# Build Plan — Exact Execution Steps

**Status: planning only — no code has been written yet.** This document is
the precise, ordered spec for how the site will be built once you say go.
It complements [`PLAN.md`](./PLAN.md) (which covers *what* and *why*: layout
choice, content strategy, roadmap) by nailing down *exactly how*: package
list, plugin pipeline order, schemas, folder structure, and phase-by-phase
build order with exit criteria.

---

## 1. Final scope recap

- Layout: **Option D — Editorial / Magazine** homepage (blog-forward: hero
  headline, one featured post, a recent-posts grid, and a side rail for
  About/tags/projects — supersedes an earlier Option C pick).
- Nav: **Home · Projects · Blog** (3 items only).
- No Research, no Teaching, no Experience page, no dedicated Résumé page.
- Résumé = a link/button on Home (PDF in `/public`, opens in new tab).
- Blog posts are single Markdown/MDX files with frontmatter, supporting
  native footnotes and optional academic-style citations/bibliography.
- Blog engine built for modularity — every piece below is chosen so future
  iteration (new post types, new MDX components, a future CMS) touches as
  few files as possible.
- No domain yet — nothing in the plan depends on one being chosen.

---

## 2. Exact package list

**Framework/core**
- `next` (latest stable major at build time — Next.js 16 as of this
  writing), `react`, `react-dom`, `typescript`
- `tailwindcss` v4, `@tailwindcss/postcss`
- `shadcn/ui` primitives (installed as-needed via its CLI — copies
  accessible component source into `components/ui`, not a runtime
  dependency) for: navigation menu, dialog/sheet (mobile nav), tabs
  (tag filters), tooltip, button, badge
- `next-themes` — dark/light mode with `localStorage` persistence + OS
  preference default (matches the reference site's behavior)
- `lucide-react` — icon set
- `class-variance-authority` + `clsx`/`tailwind-merge` — variant-friendly
  component styling (standard shadcn companions)

**Content pipeline (the blog engine)**
- `velite` — build-time content compiler: reads `content/**/*.mdx`,
  validates frontmatter against Zod schemas, outputs typed JSON/data
  modules the app imports. Chosen over Contentlayer, which is unmaintained
  as of 2026 and has App Router/Next 15+ compatibility problems; Velite is
  the actively-maintained, community-recommended successor.
- `zod` — schema definitions for Project/BlogPost frontmatter (via Velite)
- `remark-gfm` — GitHub-flavored markdown: tables, strikethrough,
  autolinked URLs, and **native footnote syntax** (`[^1]`)
- `rehype-citation` — turns `[@key]` into formatted citations + an
  auto-generated bibliography, sourced from a per-post `.bib`/CSL-JSON
  file; supports APA/MLA/Chicago/Vancouver/numeric styles; interleaves
  correctly with GFM footnotes for "note" citation styles
- `rehype-slug` — stable `id`s on every heading
- `rehype-autolink-headings` — clickable `#` anchor links on headings
- A small custom remark/rehype step (or `remark-flexible-toc`) to walk the
  post's heading tree and expose it as a computed `toc` field — this feeds
  the sticky, clickable section nav
- `rehype-pretty-code` (wrapping `shiki`) — syntax highlighting with
  matched light/dark themes, line highlighting, and a copy-to-clipboard
  affordance
- `remark-math` + `rehype-katex` — optional LaTeX math rendering, useful
  for research-flavored posts (e.g. quantum computing/ML notes); zero cost
  if unused
- `reading-time` — computed reading-time estimate per post

**SEO / feeds / assets**
- Next.js built-in **Metadata API** for per-page `<title>`/OG tags
- `next-sitemap` — `sitemap.xml` + `robots.txt`
- A small custom RSS route (`app/rss.xml/route.ts`) using `feed` or hand-
  rolled XML — kept in-repo rather than an extra heavy dependency
- `@vercel/og` — dynamic per-post Open Graph image generation

**Quality**
- ESLint (`eslint-config-next`), Prettier (+ `prettier-plugin-tailwindcss`
  for class sorting), TypeScript `strict: true`
- `@next/bundle-analyzer` (dev-only) to keep an eye on bundle size as MDX
  components accumulate

**Deferred to Phase 2 of the blog roadmap (not installed at launch)**
- `pagefind` (static search), `giscus` (comments), a newsletter embed —
  see `PLAN.md` §6

---

## 3. Content pipeline — exact plugin order

Order matters (GFM footnotes must exist before citation note-styles can
interleave with them; slugs must exist before autolink-headings can anchor
to them):

```
remarkPlugins: [
  remarkGfm,        // tables, footnotes [^1], strikethrough, autolinks
  remarkMath,        // $inline$ and $$block$$ math, opt-in per post
]

rehypePlugins: [
  rehypeSlug,                                 // id="..." on every heading
  rehypeAutolinkHeadings,                     // clickable “#” anchors
  rehypeHeadingTree,                          // custom: collects {id, text, depth}[] -> computed `toc` field
  [rehypeCitation, { bibliography, csl }],    // [@key] -> formatted citation + bibliography section
  rehypeKatex,                                // render math after citation/footnote text is finalized
  [rehypePrettyCode, { theme: { light, dark } }], // shiki syntax highlighting last, over finished code nodes
]
```

This exact chain is configured once, in Velite's config
(`velite.config.ts`), and applies uniformly to every post — a single
source of truth, which is itself a modularity requirement: adding a new
post never means touching this file again unless you're adding a whole new
markdown *feature* (rare), as opposed to a new post (constant).

### Authoring workflow this produces

A research-flavored post looks like:

```mdx
---
title: "Notes on the Rodeo Algorithm"
date: 2026-08-01
category: tech
tags: [quantum-computing, algorithms]
bibliography: rodeo-refs.bib
csl: apa
---

The Rodeo Algorithm reconstructs the ground state of a Hamiltonian.[^1]
It was later demonstrated on real hardware [@qian2024rodeo].

[^1]: This is a plain footnote — no bibliography entry needed.
```

...with `content/blog/notes-on-the-rodeo-algorithm/rodeo-refs.bib` sitting
next to the post as a normal BibTeX file. A quick "today I learned" post
simply omits `bibliography`/`csl` entirely — zero overhead for the common
case, full academic citation support when a post needs it.

---

## 4. Content schemas (exact Zod shape, via Velite)

```ts
// velite.config.ts (shape shown for planning precision — not yet implemented)

const projects = s.object({
  slug: s.slug('projects'),
  title: s.string(),
  date: s.isodate(),
  description: s.string().max(280),
  tags: s.array(s.string()),          // e.g. ["ai-ml", "systems", "web-dev"]
  stack: s.array(s.string()),         // e.g. ["react", "pytorch"]
  links: s.object({
    code: s.string().url().optional(),
    demo: s.string().url().optional(),
    paper: s.string().url().optional(),
    slides: s.string().url().optional(),
  }).default({}),
  image: s.image().optional(),
  featured: s.boolean().default(false),
  body: s.mdx(),
});

const posts = s.object({
  slug: s.slug('blog'),
  title: s.string(),
  date: s.isodate(),
  updated: s.isodate().optional(),
  category: s.enum(['tech', 'notes', 'life']).default('tech'),
  tags: s.array(s.string()).default([]),
  excerpt: s.string().max(280),
  cover: s.image().optional(),
  draft: s.boolean().default(false),
  bibliography: s.string().optional(),   // filename of a .bib/CSL-JSON next to the post
  csl: s.string().default('apa'),        // citation style override
  toc: s.boolean().default(true),        // some short "notes" posts may opt out
  layout: s.enum(['default', 'compact']).default('default'), // see §5 modularity
  readingTime: s.number(),               // computed from body word count
  headings: s.array(s.object({ id: s.string(), text: s.string(), depth: s.number() })), // computed, powers TOC
  body: s.mdx(),
});
```

Zod (via Velite) gives build-time validation — a malformed post (bad date,
missing required field, broken `.bib` reference) fails the build instead of
silently shipping a broken page. This is the schema layer that stays
stable even as the *content* changes weekly.

---

## 5. Modularity architecture — concrete patterns

Since the blog is expected to iterate a lot, these five patterns are what
make that cheap:

1. **`site.config.ts`** — single source of truth for nav items, social
   links, résumé URL, site name/tagline, default OG image, default citation
   style. Adding/removing a nav item (like this round's Research/
   Teaching/Experience removals) is a one-line array edit, never a
   template/JSX change.

2. **MDX component registry (`components/mdx/index.tsx`)** — one map of
   `{ Callout, Figure, Aside, Tweet, ... } ` passed to the MDX renderer.
   New content primitives are added here once and are immediately usable
   in any post, current or future, without touching the post-rendering
   page component.

3. **Per-post `layout`/`variant` field** (see schema above) — the same
   `BlogPost` type can render as a full "article" layout (cover image,
   TOC, share buttons) or a lightweight "compact/note" layout (no cover,
   no TOC, tighter spacing) — one Zod field switches which
   `app/blog/[slug]/page.tsx` sub-template is used, so short daily notes
   don't need the ceremony of a full research post.

4. **Content-source abstraction (`lib/content/posts.ts`,
   `lib/content/projects.ts`)** — every page ever calls
   `getAllPosts()`/`getPostBySlug()`/`getFeaturedProjects()`, never Velite's
   generated output directly. When/if the blog graduates to a CMS (Phase 3
   in `PLAN.md` §6), only this file changes.

5. **Design tokens over ad hoc classes** — colors, spacing, radii, and font
   scales live in `tailwind.config.ts`/CSS variables, not sprinkled
   one-off Tailwind classes; card, tag-pill, and button components are
   built once in `components/ui` and reused by both Projects and Blog, so a
   visual refresh is a token change, not a find-and-replace across pages.

---

## 6. Table of contents / clickable section navigation — exact implementation

This was specifically called out as a favorite, so here's the precise
mechanism:

1. **Build time:** the custom `rehypeHeadingTree` step (§3) walks the
   post's rendered heading nodes (`h2`/`h3`, ids already assigned by
   `rehype-slug`) and produces a flat `headings: {id, text, depth}[]` array,
   stored as a computed field on the post (§4). No client-side DOM parsing
   needed — it's data, available at render time.
2. **Render:** `components/blog/table-of-contents.tsx` (client component)
   receives that `headings` array as a prop and renders a list of anchor
   links (`<a href="#slug-id">`) indented by `depth`.
3. **Active-section highlighting:** an `IntersectionObserver` watches each
   heading element; whichever heading is currently topmost in the viewport
   gets an "active" style on its corresponding TOC entry, and clicking a
   TOC entry smooth-scrolls to that heading (`scrollIntoView` with
   `prefers-reduced-motion` respected — instant jump instead of smooth
   scroll if the user has that OS setting on).
4. **Responsive behavior:** sticky right-hand rail on wide viewports
   (matches the mockup); collapses into a "Jump to section" disclosure
   button placed just under the post header on mobile/tablet.
5. **Opt-out:** honors the per-post `toc: false` field for short posts
   where a TOC would be silly (e.g. a 3-paragraph "TIL" note).

---

## 7. Homepage (Option D editorial/magazine) — exact section inventory

Top to bottom, adapted from the Layout D mockup with the dropped sections
(Research/Teaching/Experience/Résumé page) removed and résumé handled as a
link:

1. **Navbar** — wordmark/name left, `Home · Projects · Blog` right, a
   search icon (wired up once `pagefind` lands in the Phase 2 blog
   roadmap — until then it's either omitted or a disabled/tooltip state),
   theme toggle.
2. **Hero headline** — serif display headline (e.g. "Notes on software,
   research, and everyday learning" — actual copy is yours to write),
   with a one-line gray subtext underneath. No profile photo required here
   (kept for the side-rail author card instead) to keep the hero
   text-forward, matching the mockup.
3. **Featured post card** — the single most recent (or manually pinned via
   `featured: true` on a post) article, large cover image + title +
   excerpt + author/date + tags, spanning most of the width.
4. **Recent posts grid** — 3-column grid (responsive to 1-column on
   mobile) of the next 6 most recent posts, each a compact card (cover
   thumbnail, title, date, reading time). Links to `/blog` for the full,
   filterable archive live just above or below this grid ("View all
   posts →").
5. **Side rail** (right-hand column on desktop, moves below the main
   column on mobile/tablet):
   - **About the author** mini card — small circular photo, name, 2-line
     bio, and the social icon row (GitHub, LinkedIn, email) plus the
     **Résumé** link/button (opens `/resume.pdf` in a new tab). This is
     where "About" effectively lives, satisfying that Home doubles as
     About without a separate page.
   - **Popular tags** — a pill list of the most-used blog tags, each
     linking to `/blog/tags/[tag]`.
   - **Featured projects** mini list — 3 rows (name + one-line
     description), each linking to `/projects` or a project's own links;
     "View all projects →" link to the full `/projects` page.
6. **Footer** — small text, repeated social icons, no newsletter signup at
   launch (newsletter capture is a Phase 2 blog-roadmap item per `PLAN.md`
   §6 — the footer slot for it exists but ships empty/omitted until then).

This keeps writing as the visual lead (matching your preference for Option
D) while folding About/Résumé/Projects into a supporting rail rather than
resurrecting the dropped nav items.

---

## 8. Final folder structure

```
/
├─ app/
│  ├─ layout.tsx                     # shell: navbar, footer, ThemeProvider
│  ├─ page.tsx                       # Home (editorial: hero, featured post, recent grid, side rail)
│  ├─ projects/
│  │  ├─ page.tsx                    # tag-filterable grid
│  │  └─ [slug]/page.tsx             # project detail (optional if description fits on the card)
│  ├─ blog/
│  │  ├─ page.tsx                    # paginated post list, tag/category filter
│  │  ├─ [slug]/page.tsx             # post reader (variant: default | compact, §5)
│  │  └─ tags/[tag]/page.tsx
│  ├─ rss.xml/route.ts
│  ├─ sitemap.ts
│  └─ api/og/route.tsx               # dynamic OG image generation
├─ content/
│  ├─ projects/
│  │  └─ <slug>.mdx
│  └─ blog/
│     └─ <slug>/
│        ├─ index.mdx                # frontmatter + body
│        ├─ references.bib           # optional, only if the post cites sources
│        └─ cover.png                # optional, colocated post assets
├─ components/
│  ├─ nav-bar.tsx, footer.tsx, theme-toggle.tsx
│  ├─ home/                          # featured-post-card.tsx, recent-posts-grid.tsx, side-rail/
│  │  └─ side-rail/                  # author-card.tsx, popular-tags.tsx, featured-projects-list.tsx
│  ├─ project-card.tsx, post-card.tsx, tag-pill.tsx
│  ├─ blog/table-of-contents.tsx
│  ├─ ui/                            # shadcn primitives
│  └─ mdx/                           # registry: callout.tsx, figure.tsx, index.tsx
├─ lib/
│  ├─ content/                       # posts.ts, projects.ts — the abstraction from §5.4
│  └─ seo.ts, rss.ts
├─ site.config.ts                    # nav, socials, résumé URL, default CSL, etc. (§5.1)
├─ velite.config.ts                  # schemas (§4) + plugin pipeline (§3)
└─ public/
   └─ resume.pdf
```

Everything the previous round removed (Research/Teaching/Experience routes,
a dedicated résumé page) simply doesn't appear here — nothing to delete
later, since it was never scaffolded.

---

## 9. Build phases — ordered, with exit criteria

Each phase produces something reviewable before the next starts. No phase
has begun yet; this is the order they'll happen in once you say go.

**Phase 0 — Project scaffold**
- `create-next-app` (TypeScript, App Router, Tailwind v4), ESLint/Prettier
  config, `next-themes` wired with a working dark/light toggle, base
  typography and color tokens in place, empty `site.config.ts`.
- *Exit criteria:* blank but styled homepage deploys to a Vercel preview
  URL with working dark mode.

**Phase 1 — Content engine**
- Install and configure Velite with the Project/BlogPost schemas (§4) and
  full plugin pipeline (§3): footnotes, citations, TOC extraction, syntax
  highlighting, math.
- Two seed posts (one plain "notes" post, one with footnotes *and* a
  `.bib` citation) and two seed projects to prove every content feature
  end-to-end.
- *Exit criteria:* both seed posts render correctly at `/blog/<slug>`,
  including a real formatted bibliography and a working clickable TOC.

**Phase 2 — Blog templates & components**
- Post list page (pagination, tag/category filters), post reader page
  (`default` and `compact` variants), table-of-contents component with
  active-section highlighting, MDX component registry (`Callout`, `Figure`
  at minimum), reading time, RSS route, sitemap, per-post OG images.
- *Exit criteria:* `/blog` fully navigable end to end from list → post →
  tag filter → RSS/sitemap all validate.

**Phase 3 — Projects section**
- Projects grid with tag filtering (mirrors the reference site's
  tag-chip-with-counts UI), project card component shared visually with
  post cards.
- *Exit criteria:* `/projects` fully navigable, tag filters work, at least
  4–5 real or placeholder projects rendered.

**Phase 4 — Home (editorial layout)**
- Hero headline, featured-post card, recent-posts grid, and the side rail
  (author card, popular tags, featured projects) from §7, pulling live
  data from `lib/content` throughout (no hardcoded duplication of content
  already modeled elsewhere).
- *Exit criteria:* homepage matches the chosen mockup's structure, is
  responsive down to mobile (side rail moves below the main column), and
  every section's data is real (pulled from content, not stubbed).

**Phase 5 — SEO, polish, accessibility pass**
- Metadata API wired on every route, JSON-LD (`Person`, `BlogPosting`),
  `next-sitemap`, Lighthouse pass (target 95+ across categories),
  reduced-motion checks, focus-state audit, alt-text audit.
- *Exit criteria:* Lighthouse scores meet target; social link previews
  (OG image/description) look correct when pasted into Slack/iMessage/etc.

**Phase 6 — Content fill & launch on Vercel subdomain**
- Replace remaining placeholder content with your real bio, photo, résumé
  PDF, project list, and first handful of posts (aim for at least 2–3 real
  posts before launch so the editorial homepage's featured card + recent
  grid don't look sparse).
- Deploy to production following the exact steps in
  [`DEPLOYMENT.md`](./DEPLOYMENT.md) §§1–4 (repo → Vercel import → env
  vars → verify) — no purchased domain needed yet.
- *Exit criteria:* site is live and shareable at a Vercel URL.

**Phase 7 — Domain cutover (whenever you've purchased one)**
- Follow [`DEPLOYMENT.md`](./DEPLOYMENT.md) §5 exactly: add the domain in
  Vercel, add the apex A record + `www` CNAME (or delegate to Vercel
  nameservers) at your registrar, set `NEXT_PUBLIC_SITE_URL`, redeploy,
  verify sitemap/RSS/OG now emit the real domain.
- *Exit criteria:* site live at the custom domain with valid HTTPS, per
  `DEPLOYMENT.md` §5's verification steps.

**Phase 8+ — Blog roadmap Phase 2 features** (from `PLAN.md` §6, as/when
you want them): `pagefind` search, `giscus` comments, related posts,
newsletter capture, view counts. Each is additive and independent — can be
picked up in any order, or skipped.

---

## 10. Open items / assumptions to flag

These are reasonable defaults chosen to keep moving without blocking on
you — flag any you want changed before Phase 0 starts:

1. **Résumé format/location assumed:** a static PDF at `/public/resume.pdf`,
   linked from Home. If you'd rather link to an external hosted resume
   (e.g. a Google Drive/Docs link), that's a one-line change in
   `site.config.ts` — no structural impact either way.
2. **Default citation style assumed: APA.** Overridable per-post via the
   `csl` field if a specific post calls for Chicago/numeric/etc.
3. **Hero headline copy and side-rail author bio length** are placeholder
   until you provide real copy — structurally these are just strings in
   `site.config.ts`/frontmatter, no layout impact either way.
4. **Math rendering (`remark-math`/`rehype-katex`)** is included at zero
   cost if unused — confirm you don't want it removed entirely for a
   slightly smaller bundle if you're certain you'll never write equations.
5. Nothing above is final until you confirm — this document describes the
   *plan*, and Phase 0 hasn't started.
