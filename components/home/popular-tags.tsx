import { TagPill } from "@/components/tag-pill";
import type { getPopularTags } from "@/lib/content/posts";

type PopularTagsProps = {
  tags: ReturnType<typeof getPopularTags>;
};

export function PopularTags({ tags }: PopularTagsProps) {
  if (tags.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Popular tags
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(({ tag, count }) => (
          <TagPill
            key={tag}
            tag={tag}
            count={count}
            href={`/blog/tags/${tag}`}
          />
        ))}
      </div>
    </section>
  );
}
