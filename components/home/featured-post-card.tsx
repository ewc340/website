import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

import { TagPill } from "@/components/tag-pill";
import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/lib/content/posts";

type FeaturedPostCardProps = {
  post: BlogPost;
};

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/30"
    >
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px]">
          {post.cover ? (
            <Image
              src={post.cover}
              alt=""
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/15 to-accent/40" />
          )}
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Featured
          </p>
          <h2 className="font-heading text-2xl font-medium tracking-tight text-balance transition-colors group-hover:text-primary md:text-3xl">
            {post.title}
          </h2>
          <p className="text-muted-foreground">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {post.readingTime} min read
            </span>
          </div>
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <TagPill key={tag} tag={tag} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
