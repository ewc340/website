import { projects } from "#velite";

export type Project = (typeof projects)[number];

export function getAllProjects(): Project[] {
  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

export function getProjectTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const project of getAllProjects()) {
    for (const tag of project.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getProjectPrimaryLink(
  links: Project["links"],
): string | undefined {
  return links.code ?? links.demo ?? links.paper ?? links.slides;
}
