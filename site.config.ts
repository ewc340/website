export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "email";
};

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Your Name",
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? "Your Name",
  description: "Notes on software, research, and everyday learning.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nav: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
  ] satisfies NavItem[],
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/yourusername",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/yourusername",
      icon: "linkedin",
    },
    {
      label: "Email",
      href: "mailto:you@example.com",
      icon: "email",
    },
  ] satisfies SocialLink[],
  resumeUrl: "/resume.pdf",
  defaultCsl: "apa",
} as const;

export type SiteConfig = typeof siteConfig;
