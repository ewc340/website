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
