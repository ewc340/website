import Link from "next/link";
import {
  Code2,
  ExternalLink,
  FileText,
  Presentation,
} from "lucide-react";

import { TagPill } from "@/components/tag-pill";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

const linkConfig = [
  { key: "code" as const, label: "Code", icon: Code2 },
  { key: "demo" as const, label: "Demo", icon: ExternalLink },
  { key: "paper" as const, label: "Paper", icon: FileText },
  { key: "slides" as const, label: "Slides", icon: Presentation },
];

export function ProjectCard({ project, className }: ProjectCardProps) {
  const availableLinks = linkConfig.filter(
    (item) => project.links[item.key],
  );

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-accent/20",
        className,
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <Link href="/projects" className="space-y-1">
            <h3 className="font-heading text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
              {project.title}
            </h3>
          </Link>
          <time
            dateTime={project.date}
            className="shrink-0 text-xs text-muted-foreground"
          >
            {formatDate(project.date)}
          </time>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <TagPill key={tag} tag={tag} />
        ))}
      </div>

      {project.stack.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <Badge key={item} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      ) : null}

      {availableLinks.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 pt-2">
          {availableLinks.map(({ key, label, icon: Icon }) => (
            <a
              key={key}
              href={project.links[key]}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "xs" })}
            >
              <Icon />
              {label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
