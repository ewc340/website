import type { MDXComponents } from "mdx/types";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { Figure } from "./figure";

export const mdxComponents: MDXComponents = {
  h2: ({ children, id, className, ...props }) => (
    <h2
      id={id}
      className={cn(
        "font-heading mt-12 scroll-mt-24 text-2xl font-medium tracking-tight first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, className, ...props }) => (
    <h3
      id={id}
      className={cn(
        "mt-8 scroll-mt-24 text-xl font-medium tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, className, ...props }) => (
    <p
      className={cn("my-4 leading-7 text-foreground/90", className)}
      {...props}
    >
      {children}
    </p>
  ),
  a: ({ children, href, className, ...props }) => {
    const isExternal = href?.startsWith("http");
    const isAnchor = href?.startsWith("#");

    if (isExternal) {
      return (
        <a
          href={href}
          className={cn(
            "font-medium text-primary underline-offset-4 hover:underline",
            className,
          )}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    if (isAnchor) {
      return (
        <a
          href={href}
          className={cn(
            "font-medium text-primary underline-offset-4 hover:underline",
            className,
          )}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href ?? "#"}
        className={cn(
          "font-medium text-primary underline-offset-4 hover:underline",
          className,
        )}
        {...props}
      >
        {children}
      </Link>
    );
  },
  blockquote: ({ children, className, ...props }) => (
    <blockquote
      className={cn(
        "my-8 border-l-4 border-primary/60 bg-muted/40 py-2 pl-5 pr-2 text-lg leading-relaxed text-foreground/90 italic",
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
  pre: (props) => <CodeBlock {...props} />,
  code: ({ children, className, ...props }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={cn("font-mono text-sm", className)} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className={cn(
          "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  img: ({ alt, className, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className={cn("my-6 h-auto w-full rounded-lg border border-border", className)}
      {...props}
    />
  ),
  ul: ({ children, className, ...props }) => (
    <ul
      className={cn("my-4 list-disc space-y-2 pl-6 leading-7", className)}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }) => (
    <ol
      className={cn("my-4 list-decimal space-y-2 pl-6 leading-7", className)}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }) => (
    <li className={cn("text-foreground/90", className)} {...props}>
      {children}
    </li>
  ),
  hr: (props) => <hr className="my-8 border-border" {...props} />,
  figure: ({ children, className, ...props }) => {
    // rehype-pretty-code wraps code blocks in <figure data-rehype-pretty-code-figure>;
    // CodeBlock (via the `pre` override below) already owns all spacing/border/overflow
    // styling for that case, so don't double-wrap it here or the copy button's
    // positioning context gets nested inside an extra `overflow-hidden` box.
    if ("data-rehype-pretty-code-figure" in props) {
      return (
        <figure className={className} {...props}>
          {children}
        </figure>
      );
    }

    return (
      <figure
        className={cn("my-6 overflow-hidden rounded-lg border border-border", className)}
        {...props}
      >
        {children}
      </figure>
    );
  },
  Callout,
  Figure,
};

export { Callout, Figure, CodeBlock };
