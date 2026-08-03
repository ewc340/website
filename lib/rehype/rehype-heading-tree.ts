import { toString } from "hast-util-to-string";
import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

export type HeadingItem = {
  id: string;
  text: string;
  depth: number;
};

const headingsCache = new Map<string, HeadingItem[]>();

export function getHeadingsForFile(filePath: string): HeadingItem[] {
  return headingsCache.get(filePath) ?? [];
}

export function clearHeadingsCache(): void {
  headingsCache.clear();
}

export const rehypeHeadingTree: Plugin<[], Root> = () => {
  return (tree, file) => {
    const headings: HeadingItem[] = [];

    visit(tree, "element", (node) => {
      if (node.tagName !== "h2" && node.tagName !== "h3") {
        return;
      }

      const id = node.properties?.id;
      if (typeof id !== "string" || id.length === 0) {
        return;
      }

      // Skip the visually-hidden "Footnotes" section heading that
      // remark-gfm/remark-rehype auto-generates (class="sr-only") — it's
      // real accessible markup for the footnotes list, not a reader-facing
      // content section, so it shouldn't clutter the clickable TOC.
      const className = node.properties?.className;
      const classList = Array.isArray(className) ? className : [];
      if (classList.includes("sr-only") || id === "footnote-label") {
        return;
      }

      headings.push({
        id,
        text: toString(node),
        depth: Number.parseInt(node.tagName[1] ?? "2", 10),
      });
    });

    const key = file.path ?? file.history[0] ?? "";
    if (key) {
      headingsCache.set(key, headings);
    }

    (file.data as { headings?: HeadingItem[] }).headings = headings;
  };
};

export type HeadingTreeFile = VFile & {
  data: {
    headings?: HeadingItem[];
  };
};
