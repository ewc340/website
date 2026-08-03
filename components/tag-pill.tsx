import Link from "next/link";

import { cn } from "@/lib/utils";

type TagPillProps = {
  tag: string;
  href?: string;
  count?: number;
  active?: boolean;
  className?: string;
};

export function TagPill({
  tag,
  href,
  count,
  active = false,
  className,
}: TagPillProps) {
  const label = count !== undefined ? `${tag} (${count})` : tag;
  const classes = cn(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-muted/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return <span className={classes}>{label}</span>;
}
