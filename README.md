# website

A personal portfolio + blog site (Next.js App Router, TypeScript, Tailwind CSS v4). See [`docs/PLAN.md`](docs/PLAN.md) and [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) for the full design/architecture spec, and [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for shipping instructions.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in NEXT_PUBLIC_SITE_URL / NEXT_PUBLIC_SITE_NAME
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (runs a Velite content build first) |
| `npm run build` | Production build (runs a Velite content build first) |
| `npm run start` | Start the production server (after `build`) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier, writes formatted files |

## Content

Blog posts and projects live as Markdown/MDX under `content/blog/*` and `content/projects/*`, validated against Zod schemas in `velite.config.ts`. See `docs/BUILD_PLAN.md` §3–4 for the exact frontmatter schema, footnote (`[^1]`) and citation (`[@key]` + a per-post `.bib` file) authoring workflow.

## Before going live

- Replace the placeholder name/socials/résumé in `site.config.ts` and `public/resume.pdf`.
- Replace the placeholder bio copy in `components/home/author-card.tsx` and the homepage hero copy in `app/page.tsx`.
- Set `NEXT_PUBLIC_SITE_URL` to your real domain once you have one (see `docs/DEPLOYMENT.md`).
