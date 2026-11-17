import { pageMeta } from "@/app/_site/meta";
import { GITHUB_URL } from "../../../_site/links";
import { A, C, CodeBlock, DocsHeader, DocsPage, H2, P } from "../../_ui";

export const metadata = pageMeta(
  "SEO for launch pages | Tapas UI",
  "Metadata, share cards, one h1, a sitemap and noindex for demo pages: how the Tapas UI site does SEO in Next.js.",
  "/docs/guides/seo",
);

const TOC = [
  { id: "metadata", label: "Title and share cards" },
  { id: "headings", label: "One h1" },
  { id: "sitemap", label: "Sitemap and robots" },
  { id: "noindex", label: "Keep demos out" },
  { id: "jsonld", label: "Structured data" },
];

export default function SeoGuide() {
  return (
    <DocsPage toc={TOC}>
      <DocsHeader
        crumb="Guides"
        title="SEO for launch pages"
        lead="Sections render as server components, so search engines get the full text in the first HTML. The rest is a few Next.js files. This is what this site does."
      />
      <section aria-labelledby="metadata" className="space-y-4">
        <H2 id="metadata">Title, description and share cards</H2>
        <P>
          Give every page its own title, description and canonical URL, and set the Open Graph and Twitter fields so shared
          links show that page. This site uses one helper for it:
        </P>
        <CodeBlock
          label="lib/page-meta.ts"
          code={`import type { Metadata } from "next";

export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    // Setting openGraph drops the root opengraph-image file, so point back at it.
    openGraph: { title, description, url: path, type: "website", images: "/opengraph-image.png" },
    twitter: { card: "summary_large_image", title, description, images: "/twitter-image.png" },
  };
}

// app/pricing/page.tsx
export const metadata = pageMeta("Pricing | Acme", "Plans for teams of every size.", "/pricing");`}
        />
        <P>
          Set <C>metadataBase</C> in your root layout so these paths become absolute URLs.
        </P>
      </section>
      <section aria-labelledby="headings" className="space-y-4">
        <H2 id="headings">One h1 per page</H2>
        <P>
          Heroes render an <C>h1</C>. If a page has a second hero, or its own heading above one, pass{" "}
          <C>titleAs=&quot;h2&quot;</C>. Other sections start at <C>h2</C>, so the outline stays in order.
        </P>
      </section>
      <section aria-labelledby="sitemap" className="space-y-4">
        <H2 id="sitemap">Sitemap and robots</H2>
        <CodeBlock
          label="app/sitemap.ts"
          code={`import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/pricing", "/changelog"].map((p) => ({ url: \`https://example.com\${p}\` }));
}`}
        />
        <CodeBlock
          label="app/robots.ts"
          code={`import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/examples/"] },
    sitemap: "https://example.com/sitemap.xml",
  };
}`}
        />
      </section>
      <section aria-labelledby="noindex" className="space-y-4">
        <H2 id="noindex">Keep demo and preview pages out of search</H2>
        <P>
          This site&apos;s demo companies are fictional, so their layouts set <C>robots</C> to <C>noindex</C> and they are
          left out of the sitemap. Do the same for staging copies or pages with sample content.
        </P>
        <CodeBlock label="app/examples/layout.tsx" code={`export const metadata = { robots: { index: false, follow: true } };`} />
      </section>
      <section aria-labelledby="jsonld" className="space-y-4">
        <H2 id="jsonld">Structured data</H2>
        <P>
          A <C>&lt;script type=&quot;application/ld+json&quot;&gt;</C> tag describes the page to search engines. This site
          adds a <C>SoftwareSourceCode</C> entry to each section page; for a product, <C>SoftwareApplication</C> or{" "}
          <C>Product</C> fit. See <A href={`${GITHUB_URL}/blob/main/src/app/_site/json-ld.tsx`}>json-ld.tsx</A> for a
          version that escapes its content safely.
        </P>
      </section>
    </DocsPage>
  );
}
