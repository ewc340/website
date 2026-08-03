import { ProjectCard } from "@/components/project-card";
import { TagPill } from "@/components/tag-pill";
import { getAllProjects, getProjectTags } from "@/lib/content/projects";

type ProjectsPageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const activeTag = params.tag;

  let projects = getAllProjects();
  if (activeTag) {
    projects = projects.filter((project) => project.tags.includes(activeTag));
  }

  const tagCounts = getProjectTags();

  const buildUrl = (tag: string | null) =>
    tag ? `/projects?tag=${encodeURIComponent(tag)}` : "/projects";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10 space-y-3">
        <h1 className="font-heading text-4xl font-medium tracking-tight">
          Projects
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A selection of tools, experiments, and open-source work.
        </p>
      </header>

      {tagCounts.length > 0 ? (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <TagPill tag="All" href={buildUrl(null)} active={!activeTag} />
          {tagCounts.map(({ tag, count }) => (
            <TagPill
              key={tag}
              tag={tag}
              count={count}
              href={buildUrl(tag)}
              active={activeTag === tag}
            />
          ))}
        </div>
      ) : null}

      {projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          No projects match this filter.
        </p>
      )}
    </div>
  );
}
