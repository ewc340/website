import Link from "next/link";
import { Code, Mail, User } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/site.config";

const iconMap = {
  github: Code,
  linkedin: User,
  email: Mail,
} as const;

export function AboutContent() {
  const initials = siteConfig.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        <div
          aria-hidden
          className="flex size-24 shrink-0 items-center justify-center rounded-full bg-primary/15 text-2xl font-semibold text-primary"
        >
          {initials}
        </div>
        <div className="space-y-3">
          <h1 className="font-heading text-4xl font-medium tracking-tight">
            {siteConfig.name}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            {siteConfig.bio}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        {siteConfig.socials.map((social) => {
          const Icon = iconMap[social.icon];
          return (
            <Link
              key={social.href}
              href={social.href}
              aria-label={social.label}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              {...(social.icon === "email"
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              <Icon className="size-4" />
              {social.label}
            </Link>
          );
        })}
        <a
          href={siteConfig.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Résumé
        </a>
      </div>
    </div>
  );
}
