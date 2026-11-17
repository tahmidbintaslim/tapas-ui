import { GITHUB_URL } from "../_site/links";
import { GROUPED, groupColor } from "../_site/sections";

export type DocLink = { label: string; href: string; description?: string; group?: string };
export type DocGroup = { title: string; color?: string; links: DocLink[] };

/** Written docs pages, in sidebar order. The section pages are added from registry.json below. */
const GUIDES: DocGroup[] = [
  {
    title: "Getting started",
    links: [
      { label: "Introduction", href: "/docs", description: "What Tapas UI is and where to start." },
      { label: "Installation", href: "/docs/installation", description: "Set up shadcn/ui and add your first section." },
      { label: "CLI & AI agents", href: "/docs/cli", description: "The shadcn CLI, the @tapas namespace, the MCP server and AI prompts." },
      { label: "Templates", href: "/docs/templates", description: "Whole pages built from sections, installed with one command." },
      { label: "Demo sites", href: "/docs/demos", description: "Three fictional sites built only from Tapas sections." },
    ],
  },
  {
    title: "Customization",
    links: [
      { label: "Theming", href: "/docs/theming", description: "How sections pick up your colors and radius." },
      { label: "Dark mode", href: "/docs/dark-mode", description: "Sections follow your .dark variables." },
      { label: "Motion", href: "/docs/motion", description: "Plain and motion versions, reduced motion and pause controls." },
      { label: "Accessibility", href: "/docs/accessibility", description: "What every section guarantees." },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "Waitlist forms", href: "/docs/guides/waitlist", description: "Post signups to your own API route and store them." },
      { label: "Checkout links", href: "/docs/guides/checkout", description: "Point pricing buttons at Stripe payment links or any URL." },
      { label: "SEO for launch pages", href: "/docs/guides/seo", description: "Metadata, share cards, sitemaps and noindex for demos." },
    ],
  },
];

const HELP: DocGroup = {
  title: "Help",
  links: [
    { label: "FAQ", href: "/docs/faq", description: "License, requirements, updates and more." },
    { label: "Support", href: "/docs/support", description: "Where to report bugs and security issues." },
    { label: "Contributing", href: "/docs/contributing", description: "Set up the repo and open a pull request." },
    { label: "Changelog", href: "/docs/changelog", description: "What shipped, by date." },
  ],
};

/** The docs sidebar: guides, then every section by group, then help. */
export const DOC_NAV: DocGroup[] = [
  ...GUIDES,
  {
    title: "Components",
    links: [{ label: "All sections", href: "/docs/sections", description: "Every section with a live preview." }],
  },
  ...GROUPED.map((g) => ({
    title: g.name,
    color: groupColor(g.name),
    links: g.items.map((s) => ({ label: s.title, href: `/docs/sections/${s.slug}`, description: s.description, group: g.name })),
  })),
  HELP,
];

/** Every docs page in reading order, for previous/next links and search. */
export const DOC_PAGES: DocLink[] = DOC_NAV.flatMap((g) => g.links.map((l) => ({ ...l, group: l.group ?? g.title })));

/** Where a docs page's source lives on GitHub. Section pages point at the section's own folder. */
export function editUrl(href: string) {
  const section = href.match(/^\/docs\/sections\/(.+)$/);
  if (section) return `${GITHUB_URL}/tree/main/src/components/custom/${section[1]}`;
  return `${GITHUB_URL}/blob/main/src/app${href}/page.tsx`;
}

/** The fictional demo sites (kept out of search engines with noindex). */
export const DEMOS = [
  { name: "Ledgerline", href: "/examples/ledgerline", body: "Invoicing for freelancers. Three pages, plain sections, no animation library." },
  { name: "Patchnote", href: "/examples/patchnote", body: "AI release notes. One page built from the motion sections." },
  { name: "Stackwise", href: "/examples/stackwise", body: "An AI dependency agent. WebGL hero, pricing page and comparison table." },
];
