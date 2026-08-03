import { AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

type CalloutProps = {
  variant?: "note" | "warning";
  title?: string;
  children: React.ReactNode;
};

const variantStyles = {
  note: {
    container: "border-primary/30 bg-accent/50 text-foreground",
    icon: Info,
    defaultTitle: "Note",
  },
  warning: {
    container: "border-amber-500/40 bg-amber-500/10 text-foreground",
    icon: AlertTriangle,
    defaultTitle: "Warning",
  },
} as const;

export function Callout({
  variant = "note",
  title,
  children,
}: CalloutProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <aside
      className={cn(
        "my-6 flex gap-3 rounded-lg border px-4 py-3 not-prose",
        styles.container,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium">{title ?? styles.defaultTitle}</p>
        <div className="text-sm leading-relaxed text-muted-foreground [&>p]:m-0">
          {children}
        </div>
      </div>
    </aside>
  );
}
