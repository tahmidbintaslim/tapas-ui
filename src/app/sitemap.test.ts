import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists docs pages and leaves out the fictional demos", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://tapasui.tahmid.space/docs/sections/faq");
    expect(urls.some((u) => u.includes("/examples/"))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("includes the guides and help pages", () => {
    const urls = sitemap().map((e) => e.url);
    for (const path of ["/docs/cli", "/docs/motion", "/docs/guides/waitlist", "/docs/guides/seo", "/docs/faq", "/docs/support", "/docs/changelog"]) {
      expect(urls).toContain(`https://tapasui.tahmid.space${path}`);
    }
  });
});
