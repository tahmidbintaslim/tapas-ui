import registry from "../../../registry.json";

export type SectionKind = "hero" | "block" | "card";

export interface SectionMeta {
  /** Registry item name; also the docs URL slug. */
  slug: string;
  title: string;
  description: string;
  kind: SectionKind;
  /** Registry name of the optional motion version, when one exists. */
  motionSlug?: string;
  /** Docs and sidebar group. */
  group: string;
}

/** Docs groups in sidebar order; each section belongs to exactly one. `blurb` is the group's one-line purpose. */
export const GROUPS: { name: string; blurb: string; slugs: string[] }[] = [
  { name: "Heroes", blurb: "The first screen: your headline, one action and proof it works.", slugs: [] },
  { name: "Marketing", blurb: "Pricing, comparisons and calls to action that link to your checkout or signup.", slugs: ["pricing-table", "comparison-table", "cta-banner", "cta-split", "newsletter"] },
  { name: "Proof", blurb: "Logos, quotes and numbers, for when you have real ones to show.", slugs: ["logo-cloud", "testimonials-wall", "testimonial-highlight", "stats-band", "social-proof"] },
  { name: "Features", blurb: "Explain what the product does, in grids, rows and steps.", slugs: ["feature-grid", "feature-rows", "bento-grid", "steps", "integrations-grid"] },
  { name: "Company", blurb: "Team, blog, changelog, FAQ and contact: the pages around the launch.", slugs: ["team", "blog-grid", "changelog", "faq", "faq-two-column", "contact"] },
  { name: "Navigation & utility", blurb: "Navbars, footers, notices, a 404 and a coming-soon page.", slugs: ["navbar", "navbar-floating", "announcement-bar", "footer", "footer-simple", "not-found", "coming-soon"] },
  { name: "Cards", blurb: "Single cards to drop into your own layouts.", slugs: [] },
  { name: "Proof and conversion", blurb: "Animated numbers, logos, quotes, prices and a launch countdown.", slugs: ["number-ticker", "logo-velocity", "testimonial-stack", "price-morph", "launch-countdown"] },
  { name: "Effects", blurb: "Spotlights, beams and reveals that point at the thing to click.", slugs: ["spotlight-cards", "beam-border", "text-reveal", "dot-field", "magnetic-cta"] },
  { name: "Product story", blurb: "Show the product: a sticky tour, a terminal, a device frame, a before/after.", slugs: ["sticky-showcase", "terminal-demo", "device-frame", "compare-slider", "flow-beams"] },
];

/** URL-safe id for a group heading, such as "navigation-utility". */
export const groupId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Site-only plate color for a group's dot, cycling through the three logo plates. */
export const groupColor = (name: string) =>
  ["var(--saffron)", "var(--paprika)", "var(--olive)"][Math.max(0, GROUPS.findIndex((g) => g.name === name)) % 3];

const groupOf = (name: string, kind: SectionKind) =>
  kind === "hero" ? "Heroes" : kind === "card" ? "Cards" : (GROUPS.find((g) => g.slugs.includes(name))?.name ?? "Other");

/** Display order within each kind; unlisted items go last in registry order. */
const ORDER = [
  "hero",
  "hero-split",
  "hero-command",
  "hero-spotlight",
  "hero-shader",
  "hero-showcase",
  "hero-waitlist",
  "hero-marquee",
  "hero-video",
  "hero-theme-cycle",
  "hero-plates",
  "pricing-table",
  "comparison-table",
  "cta-banner",
  "cta-split",
  "newsletter",
  "logo-cloud",
  "testimonials-wall",
  "testimonial-highlight",
  "stats-band",
  "social-proof",
  "feature-grid",
  "feature-rows",
  "bento-grid",
  "steps",
  "integrations-grid",
  "team",
  "blog-grid",
  "changelog",
  "faq",
  "faq-two-column",
  "contact",
  "navbar",
  "navbar-floating",
  "announcement-bar",
  "footer",
  "footer-simple",
  "not-found",
  "coming-soon",
  "pricing-card",
  "testimonial-card",
  "feature-card",
  "statistics-card",
  "blog-card",
  "interactive-card",
];

/** Registry items that support other items and aren't sections themselves. */
const HELPERS = ["motion-lift"];

const names = new Set(registry.items.map((item) => item.name));
const kindOf = (name: string): SectionKind =>
  name === "hero" || name.startsWith("hero-") ? "hero" : name.endsWith("-card") ? "card" : "block";
const rank = (name: string) => (ORDER.includes(name) ? ORDER.indexOf(name) : ORDER.length);

/**
 * Every plain registry item, read from registry.json so docs never drift from
 * it. `<name>-motion` items are folded into their plain item as `motionSlug`.
 */
export const SECTIONS: SectionMeta[] = registry.items
  .filter((item) => !item.name.endsWith("-motion") && !item.name.startsWith("template-") && !HELPERS.includes(item.name))
  .map((item) => ({
    slug: item.name,
    title: item.title,
    description: item.description,
    kind: kindOf(item.name),
    group: groupOf(item.name, kindOf(item.name)),
    motionSlug: names.has(`${item.name}-motion`) ? `${item.name}-motion` : undefined,
  }))
  .sort((a, b) => rank(a.slug) - rank(b.slug));

/** SECTIONS bucketed by GROUPS, in order; empty groups are dropped. */
export const GROUPED = GROUPS.map((g) => ({ name: g.name, blurb: g.blurb, items: SECTIONS.filter((s) => s.group === g.name) })).filter((g) => g.items.length > 0);

export const getSection = (slug: string) => SECTIONS.find((s) => s.slug === slug);
