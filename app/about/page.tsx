import type { Metadata } from "next";

import { AboutContent } from "@/components/about-content";
import { JsonLd } from "@/components/json-ld";
import { personJsonLd } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — ${siteConfig.bio}`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <JsonLd data={personJsonLd()} />
      <AboutContent />
    </div>
  );
}
