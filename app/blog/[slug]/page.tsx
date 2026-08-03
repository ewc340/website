import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";

import { TableOfContents } from "@/components/blog/table-of-contents";
import { JsonLd } from "@/components/json-ld";
import { MDXContent } from "@/components/mdx/mdx-content";
import { TagPill } from "@/components/tag-pill";
import { getAllPosts, getPostBySlug } from "@/lib/content/posts";
import { formatDate } from "@/lib/format";
import { blogPostingJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const isCompact = post.layout === "compact";
  const showToc =
    !isCompact && post.toc && post.headings.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd data={blogPostingJsonLd(post)} />
      <div
        className={cn(
          "mx-auto",
          showToc ? "max-w-4xl lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12" : "max-w-3xl",
        )}
      >
        <article className={cn(isCompact ? "space-y-4" : "space-y-6")}>
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground">{post.title}</li>
            </ol>
          </nav>

          <header className={cn("space-y-4", isCompact && "space-y-3")}>
            <h1
              className={cn(
                "font-heading font-medium tracking-tight text-balance",
                isCompact ? "text-3xl" : "text-4xl sm:text-5xl",
              )}
            >
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.updated ? (
                <>
                  <span aria-hidden>·</span>
                  <span>Updated {formatDate(post.updated)}</span>
                </>
              ) : null}
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {post.readingTime} min read
              </span>
              <span aria-hidden>·</span>
              <span className="capitalize">{post.category}</span>
            </div>
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <TagPill key={tag} tag={tag} href={`/blog/tags/${tag}`} />
                ))}
              </div>
            ) : null}
          </header>

          {showToc ? (
            <TableOfContents headings={post.headings} variant="mobile" />
          ) : null}

          {!isCompact && post.cover ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border">
              <Image
                src={post.cover}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : null}

          <div
            className={cn(
              "prose-blog",
              isCompact ? "space-y-3 text-[0.95rem]" : "space-y-4",
            )}
          >
            <MDXContent code={post.body} />
          </div>
        </article>

        {showToc ? (
          <TableOfContents headings={post.headings} variant="desktop" />
        ) : null}
      </div>
    </div>
  );
}
