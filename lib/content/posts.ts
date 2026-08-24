import { posts } from "#velite";

export type BlogPost = (typeof posts)[number];

/** Published posts visible in listings, feeds, sitemap, and tag indexes. */
function isListedPost(post: BlogPost): boolean {
  return !post.draft && !post.unlisted;
}

/** Any non-draft post, including unlisted — reachable by direct URL only. */
function isAccessiblePost(post: BlogPost): boolean {
  return !post.draft;
}

export function getAllPosts(): BlogPost[] {
  return posts
    .filter(isListedPost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** For static generation: build pages for listed + unlisted posts (not drafts). */
export function getPostsForStaticGeneration(): BlogPost[] {
  return posts
    .filter(isAccessiblePost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug && isAccessiblePost(post));
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getFeaturedPost(): BlogPost | undefined {
  return getAllPosts()[0];
}

export function getPostsByCategory(category: BlogPost["category"]): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return [...tags].sort();
}

export function getTagCounts(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPopularTags(limit = 10): { tag: string; count: number }[] {
  return getTagCounts().slice(0, limit);
}
