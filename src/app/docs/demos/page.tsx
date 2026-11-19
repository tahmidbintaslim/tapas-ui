import { pageMeta } from "@/app/_site/meta";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { GITHUB_URL } from "../../_site/links";
import { DEMOS } from "../_pages";
import { A, C, DocsHeader, DocsPage, H2, P } from "../_ui";

export const metadata = pageMeta(
  "Demo sites | Tapas UI",
  "Three fictional launch sites built only from Tapas UI sections, with working waitlist forms.",
  "/docs/demos",
);

export default function Demos() {
  return (
    <DocsPage>
      <DocsHeader
        crumb="Getting started"
        title="Demo sites"
        lead="Three made-up products, each built only from Tapas sections and their props. They show what a finished launch page looks like, and their waitlist forms post to a real route."
      />
      <ul className="grid gap-3 sm:grid-cols-3">
        {DEMOS.map((demo) => (
          <li key={demo.href}>
            <Link
              href={demo.href}
              className="group flex h-full flex-col gap-2 rounded-xl border bg-card p-5 transition-colors hover:border-brand/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span className="flex items-center justify-between font-semibold">
                {demo.name}
                <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" />
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">{demo.body}</span>
            </Link>
          </li>
        ))}
      </ul>
      <section aria-labelledby="how" className="space-y-4">
        <H2 id="how">How they are built</H2>
        <P>
          Each demo keeps its copy in one <C>content.ts</C> file and passes it to sections as props, the way you would on
          your own site. The companies, people and figures are fictional, and every demo page is marked{" "}
          <C>noindex</C> so search engines never list them as real products.
        </P>
        <P>
          The signup forms post to an API route in each demo. The <A href="/docs/guides/waitlist">waitlist guide</A>{" "}
          walks through that route. Read the source in{" "}
          <A href={`${GITHUB_URL}/tree/main/src/app/examples`}>src/app/examples</A>.
        </P>
      </section>
    </DocsPage>
  );
}
