import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { Project } from "@/lib/content/projects";
import { getProjectPrimaryLink } from "@/lib/content/projects";

type FeaturedProjectsListProps = {
  projects: Project[];
};

export function FeaturedProjectsList({ projects }: FeaturedProjectsListProps) {
  if (projects.length === 0) return null;

  const items = projects.slice(0, 3);

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Featured projects
      </h2>
      <ul className="space-y-4">
        {items.map((project) => {
          const href = getProjectPrimaryLink(project.links) ?? "/projects";
          const isExternal = href.startsWith("http");

          return (
            <li key={project.slug}>
              <a
                href={href}
                className="group block space-y-1"
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-medium transition-colors group-hover:text-primary">
                    {project.title}
                  </span>
                  {isExternal ? (
                    <ExternalLink className="size-3 text-muted-foreground" />
                  ) : null}
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
      <Link
        href="/projects"
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        View all projects →
      </Link>
    </section>
  );
}
