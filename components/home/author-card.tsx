import Link from "next/link";
import { Code, Mail, User } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/site.config";

const iconMap = {
  github: Code,
  linkedin: User,
  email: Mail,
} as const;

export function AuthorCard() {
  const initials = siteConfig.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
        >
          {initials}
        </div>
        <div className="space-y-2">
          <h2 className="font-medium">{siteConfig.name}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {siteConfig.bio}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        {siteConfig.socials.map((social) => {
          const Icon = iconMap[social.icon];
          return (
            <Link
              key={social.href}
              href={social.href}
              aria-label={social.label}
              className="text-muted-foreground transition-colors hover:text-foreground"
              {...(social.icon === "email"
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              <Icon className="size-4" />
            </Link>
          );
        })}
      </div>
      <a
        href={siteConfig.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4 w-full" })}
      >
        Résumé
      </a>
    </section>
  );
}
