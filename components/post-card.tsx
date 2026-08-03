import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

import { TagPill } from "@/components/tag-pill";
import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/lib/content/posts";
import { cn } from "@/lib/utils";

type PostCardProps = {
  post: BlogPost;
  className?: string;
  showCover?: boolean;
};

export function PostCard({
  post,
  className,
  showCover = true,
}: PostCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/30 hover:bg-accent/20",
        className,
      )}
    >
      {showCover ? (
        <Link href={`/blog/${post.slug}`} className="block">
          {post.cover ? (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.cover}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 via-primary/10 to-accent/30" />
          )}
        </Link>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {post.readingTime} min read
          </span>
        </div>
        <Link href={`/blog/${post.slug}`} className="space-y-2">
          <h3 className="font-heading text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        </Link>
        {post.tags.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} href={`/blog/tags/${tag}`} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
