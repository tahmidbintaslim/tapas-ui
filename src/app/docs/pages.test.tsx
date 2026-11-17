import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DOC_PAGES, editUrl } from "./_pages";

vi.mock("next/navigation", () => ({ usePathname: () => "/docs", useRouter: () => ({ push: vi.fn() }) }));

// Written docs pages (section pages read files at build time and are covered by the build).
const written = DOC_PAGES.filter((p) => !p.href.startsWith("/docs/sections/"));
const load = (href: string) => import(/* @vite-ignore */ href === "/docs" ? "./page.tsx" : `./${href.slice("/docs/".length)}/page.tsx`);

describe("docs pages", () => {
  it.each(written.map((p) => p.href))("%s has exactly one h1 and metadata", async (href) => {
    const mod = await load(href);
    const { container } = render(<mod.default />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(mod.metadata?.alternates?.canonical).toBe(href);
  });

  it("every page has a unique href and an edit link", () => {
    expect(new Set(DOC_PAGES.map((p) => p.href)).size).toBe(DOC_PAGES.length);
    expect(editUrl("/docs/faq")).toMatch(/\/blob\/main\/src\/app\/docs\/faq\/page\.tsx$/);
    expect(editUrl("/docs/sections/faq")).toMatch(/\/tree\/main\/src\/components\/custom\/faq$/);
  });
});
