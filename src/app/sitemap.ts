import type { MetadataRoute } from "next";
import { TEMPLATES } from "./_site/templates";
import { DOC_PAGES } from "./docs/_pages";

const BASE = "https://tapasui.tahmid.space";

/** Public pages only; the fictional /examples demos stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/templates",
    // Every docs page, section pages included, from the sidebar.
    ...DOC_PAGES.map((p) => p.href),
    ...TEMPLATES.flatMap((t) => [`/templates/${t.slug}`, `/templates/${t.slug}/motion`]),
  ];
  return paths.map((p) => ({ url: `${BASE}${p}` }));
}
