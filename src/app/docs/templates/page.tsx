import { pageMeta } from "@/app/_site/meta";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CopyCommand } from "../../_site/copy-command";
import { installCommand } from "../../_site/links";
import { TEMPLATES } from "../../_site/templates";
import { C, CodeBlock, DocsHeader, DocsPage, H2, P } from "../_ui";

export const metadata = pageMeta(
  "Templates | Tapas UI",
  "Free landing page templates built from Tapas sections, each installed with one shadcn CLI command.",
  "/docs/templates",
);

export default function TemplatesDocs() {
  return (
    <DocsPage>
      <DocsHeader
        crumb="Getting started"
        title="Templates"
        lead={`${TEMPLATES.length} free page templates, assembled from Tapas sections. Each comes plain (server components, CSS only) or with motion, and takes your copy through one content prop. Names and figures in them are fictional samples.`}
      />
      <section aria-labelledby="use" className="space-y-4">
        <H2 id="use">Use a template</H2>
        <P>
          Installing a template adds its page component, its sample <C>content.tsx</C> and every section it uses. Render it
          from a route and pass only the copy you want to change; the rest falls back to the sample.
        </P>
        <CodeBlock
          label="app/page.tsx"
          code={`import { SaasTemplate } from "@/components/templates/saas/saas";

export default function Page() {
  return <SaasTemplate content={{ /* your copy, merged over the sample */ }} />;
}`}
        />
      </section>
      <section aria-labelledby="list" className="space-y-4">
        <H2 id="list">All templates</H2>
        <ul className="space-y-4">
          {TEMPLATES.map((t) => (
            <li key={t.slug} className="space-y-3 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[17px] font-semibold">{t.title}</h3>
                <span className="flex gap-4 text-sm">
                  <Link href={`/templates/${t.slug}`} className="inline-flex min-h-11 items-center gap-1 font-medium underline decoration-brand/60 underline-offset-4 hover:decoration-brand sm:min-h-0">
                    Plain preview <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </Link>
                  <Link href={`/templates/${t.slug}/motion`} className="inline-flex min-h-11 items-center gap-1 font-medium underline decoration-brand/60 underline-offset-4 hover:decoration-brand sm:min-h-0">
                    Motion preview <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </Link>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{t.description}</p>
              <CopyCommand command={installCommand(t.registry)} />
            </li>
          ))}
        </ul>
        <P>
          For the motion version, add <C>-motion</C> to the item name, such as <C>{TEMPLATES[0].registry}-motion</C>.
        </P>
      </section>
    </DocsPage>
  );
}
