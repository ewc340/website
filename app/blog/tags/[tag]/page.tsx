import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { getAllTags, getPostsByTag } from "@/lib/content/posts";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export function generateMetadata({ params }: TagPageProps) {
  return params.then(({ tag }) => ({
    title: `Posts tagged “${tag}”`,
    description: `All blog posts tagged with ${tag}.`,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10 space-y-3">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground">
            ← Back to blog
          </Link>
        </nav>
        <h1 className="font-heading text-4xl font-medium tracking-tight">
          Tag: {tag}
        </h1>
        <p className="text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          No posts found for this tag.
        </p>
      )}
    </div>
  );
}
