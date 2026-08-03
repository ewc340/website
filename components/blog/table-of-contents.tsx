"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { HeadingItem } from "@/lib/rehype/rehype-heading-tree";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  headings: HeadingItem[];
  variant?: "mobile" | "desktop" | "both";
};

export function TableOfContents({
  headings,
  variant = "both",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: [0, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      const element = document.getElementById(id);
      if (!element) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      element.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      setActiveId(id);
      setMobileOpen(false);
      window.history.replaceState(null, "", `#${id}`);
    },
    [],
  );

  if (headings.length === 0) return null;

  const navList = (
    <nav aria-label="Table of contents">
      <ul className="space-y-1 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.depth - 2) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(event) => handleClick(event, heading.id)}
              className={cn(
                "block rounded-md px-2 py-1.5 leading-snug transition-colors",
                activeId === heading.id
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {variant !== "desktop" ? (
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm font-medium"
            aria-expanded={mobileOpen}
          >
            Jump to section
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                mobileOpen && "rotate-180",
              )}
            />
          </button>
          {mobileOpen ? (
            <div className="mt-2 rounded-lg border border-border bg-card p-3">
              {navList}
            </div>
          ) : null}
        </div>
      ) : null}

      {variant !== "mobile" ? (
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              On this page
            </p>
            {navList}
          </div>
        </aside>
      ) : null}
    </>
  );
}
