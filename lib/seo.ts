import { siteConfig } from "@/site.config";
import type { BlogPost } from "@/lib/content/posts";

export function personJsonLd() {
  const sameAs = siteConfig.socials
    .filter((social) => social.icon !== "email")
    .map((social) => social.href);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function blogPostingJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    url: `${siteConfig.url}/blog/${post.slug}`,
    ...(post.cover ? { image: `${siteConfig.url}${post.cover}` } : {}),
  };
}
