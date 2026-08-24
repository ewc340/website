import readingTime from "reading-time";
import { context, defineCollection, defineConfig, s } from "velite";

import { rehypePlugins, remarkPlugins } from "./lib/rehype";
import { getHeadingsForFile } from "./lib/rehype/rehype-heading-tree";

const projects = defineCollection({
  name: "Project",
  pattern: "projects/*.mdx",
  schema: s
    .object({
      slug: s.slug("projects"),
      title: s.string(),
      date: s.isodate(),
      description: s.string().max(280),
      tags: s.array(s.string()),
      stack: s.array(s.string()),
      links: s
        .object({
          code: s.string().url().optional(),
          demo: s.string().url().optional(),
          paper: s.string().url().optional(),
          slides: s.string().url().optional(),
        })
        .default({}),
      image: s.image().optional(),
      featured: s.boolean().default(false),
      body: s.mdx(),
    })
    .transform((data) => data),
});

const posts = defineCollection({
  name: "BlogPost",
  pattern: "blog/**/index.mdx",
  schema: s
    .object({
      slug: s.slug("blog"),
      title: s.string(),
      date: s.isodate(),
      updated: s.isodate().optional(),
      category: s.enum(["tech", "notes", "life"]).default("tech"),
      tags: s.array(s.string()).default([]),
      excerpt: s.string().max(280),
      cover: s.image().optional(),
      draft: s.boolean().default(false),
      unlisted: s.boolean().default(false),
      bibliography: s.string().optional(),
      csl: s.string().default("apa"),
      toc: s.boolean().default(true),
      layout: s.enum(["default", "compact"]).default("default"),
      body: s.mdx(),
    })
    .transform((data) => {
      const filePath = context().file.path;
      const plain = context().file.plain ?? "";
      const stats = readingTime(plain);

      return {
        ...data,
        readingTime: Math.max(1, Math.ceil(stats.minutes)),
        headings: getHeadingsForFile(filePath),
      };
    }),
});

export default defineConfig({
  root: "content",
  strict: true,
  mdx: {
    gfm: false,
    remarkPlugins,
    rehypePlugins,
  },
  collections: {
    projects,
    posts,
  },
});
