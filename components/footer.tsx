import Link from "next/link";
import { Code, Mail, User } from "lucide-react";

import { siteConfig } from "@/site.config";

const iconMap = {
  github: Code,
  linkedin: User,
  email: Mail,
} as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div className="flex items-center gap-3">
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
      </div>
    </footer>
  );
}
