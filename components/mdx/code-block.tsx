"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CodeBlockProps = React.ComponentProps<"pre">;

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const isPrettyCode = "data-language" in props;

  const handleCopy = useCallback(async () => {
    const text = preRef.current?.textContent ?? "";
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable
    }
  }, []);

  return (
    <div className="group/code relative my-6">
      <pre
        ref={preRef}
        className={cn(
          !isPrettyCode &&
            "overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
      {/* Visible by default (not hover-only) so the affordance is discoverable
          on touch devices, which have no hover state; it brightens further on
          hover/focus for desktop feedback. */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-md border border-border bg-background/90 text-muted-foreground opacity-70 shadow-sm transition-opacity hover:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover/code:opacity-100"
      >
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  );
}
