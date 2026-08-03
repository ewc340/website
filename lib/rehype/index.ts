import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { PluggableList } from "unified";

import { rehypeCitationFromPost } from "./rehype-citation-from-post";
import { rehypeHeadingTree } from "./rehype-heading-tree";

export const remarkPlugins = [remarkGfm, remarkMath] satisfies PluggableList;

export const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "wrap",
      properties: {
        className: ["anchor"],
      },
    },
  ],
  rehypeHeadingTree,
  rehypeCitationFromPost,
  rehypeKatex,
  [
    rehypePrettyCode,
    {
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
      keepBackground: false,
    },
  ],
] satisfies PluggableList;
