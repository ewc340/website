import type { Metadata } from "next";
import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { TagPill } from "@/components/tag-pill";
import {
  getAllPosts,
  getAllTags,
  getTagCounts,
} from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical write-ups, research notes, and things I'm learning along the way.",
  alternates: { canonical: "/blog" },
};

const POSTS_PER_PAGE = 10;
const CATEGORIES = ["tech", "notes", "life"] as const;

type BlogPageProps = {
  searchParams: Promise<{
    page?: string;
    tag?: string;
    category?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const activeTag = params.tag;
  const activeCategory = params.category;

  let posts = getAllPosts();

  if (activeTag) {
    posts = posts.filter((post) => post.tags.includes(activeTag));
  }

  if (
    activeCategory &&
    CATEGORIES.includes(activeCategory as (typeof CATEGORIES)[number])
  ) {
    posts = posts.filter((post) => post.category === activeCategory);
  }

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(start, start + POSTS_PER_PAGE);

  const buildUrl = (overrides: {
    page?: number;
    tag?: string | null;
    category?: string | null;
  }) => {
    const search = new URLSearchParams();
    const tag = overrides.tag !== undefined ? overrides.tag : activeTag;
    const category =
      overrides.category !== undefined ? overrides.category : activeCategory;
    const pageNum = overrides.page ?? page;

    if (tag) search.set("tag", tag);
    if (category) search.set("category", category);
    if (pageNum > 1) search.set("page", String(pageNum));

    const query = search.toString();
    return query ? `/blog?${query}` : "/blog";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10 space-y-3">
        <h1 className="font-heading text-4xl font-medium tracking-tight">Blog</h1>
        <p className="max-w-2xl text-muted-foreground">
          Technical write-ups, research notes, and things I&apos;m learning along
          the way.
        </p>
      </header>

      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Category:</span>
          <TagPill
            tag="All"
            href={buildUrl({ category: null, page: 1 })}
            active={!activeCategory}
          />
          {CATEGORIES.map((category) => (
            <TagPill
              key={category}
              tag={category}
              href={buildUrl({ category, page: 1 })}
              active={activeCategory === category}
            />
          ))}
        </div>

        {getAllTags().length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Tags:</span>
            <TagPill
              tag="All"
              href={buildUrl({ tag: null, page: 1 })}
              active={!activeTag}
            />
            {getTagCounts().map(({ tag, count }) => (
              <TagPill
                key={tag}
                tag={tag}
                count={count}
                href={buildUrl({ tag, page: 1 })}
                active={activeTag === tag}
              />
            ))}
          </div>
        ) : null}
      </div>

      {paginatedPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {paginatedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          No posts match these filters.
        </p>
      )}

      {totalPages > 1 ? (
        <nav
          className="mt-10 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          {page > 1 ? (
            <Link
              href={buildUrl({ page: page - 1 })}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Previous
            </Link>
          ) : null}
          <span className="px-3 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={buildUrl({ page: page + 1 })}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
