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
