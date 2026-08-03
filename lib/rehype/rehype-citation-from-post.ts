import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import type { Root } from "hast";
import rehypeCitation from "rehype-citation";
import type { Plugin } from "unified";
import { unified } from "unified";

import { siteConfig } from "@/site.config";

export const rehypeCitationFromPost: Plugin<[], Root> = () => {
  return async (tree, file) => {
    const filePath = file.path ?? file.history[0];
    if (!filePath) {
      return;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    const bibliography = data.bibliography;

    if (typeof bibliography !== "string" || bibliography.length === 0) {
      return;
    }

    const dir = path.dirname(filePath);
    const bibFullPath = path.join(dir, bibliography);

    if (!fs.existsSync(bibFullPath)) {
      return;
    }

    const csl =
      typeof data.csl === "string" && data.csl.length > 0
        ? data.csl
        : siteConfig.defaultCsl;

    await unified()
      .use(rehypeCitation, { path: dir, bibliography, csl })
      .run(tree, file);
  };
};
