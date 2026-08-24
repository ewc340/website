import Link from "next/link";

import { FeaturedPostCard } from "@/components/home/featured-post-card";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getFeaturedPost } from "@/lib/content/posts";
import { personJsonLd } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export default function HomePage() {
  const featuredPost = getFeaturedPost();
  const allPosts = getAllPosts();
  const recentPosts = allPosts
    .filter((post) => post.slug !== featuredPost?.slug)
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <JsonLd data={personJsonLd()} />
      <section className="mb-12 space-y-3">
        <h1 className="font-heading max-w-3xl text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          Notes on software, research, and the craft of building things well.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
      </section>

      <div className="space-y-12">
        {featuredPost ? (
          <section>
            <FeaturedPostCard post={featuredPost} />
          </section>
        ) : null}

        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-2xl font-medium tracking-tight">
              Recent posts
            </h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all posts →
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No posts yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
