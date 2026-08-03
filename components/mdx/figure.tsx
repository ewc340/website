import Image from "next/image";

import { cn } from "@/lib/utils";

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
};

export function Figure({
  src,
  alt,
  caption,
  width = 800,
  height = 450,
  className,
}: FigureProps) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="overflow-hidden rounded-lg border border-border">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
