import { runSync } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";

import { mdxComponents } from "./index";

type MDXContentProps = {
  code: string;
  components?: MDXComponents;
};

export function MDXContent({ code, components }: MDXContentProps) {
  const { default: Content } = runSync(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return <Content components={{ ...mdxComponents, ...components }} />;
}
