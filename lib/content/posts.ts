import { posts } from "#velite";

export type BlogPost = (typeof posts)[number];

export function getAllPosts(): BlogPost[] {
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
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
