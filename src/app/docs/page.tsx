import { pageMeta } from "@/app/_site/meta";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CopyCommand } from "../_site/copy-command";
import { installCommand } from "../_site/links";
import { SECTIONS } from "../_site/sections";
import { C, DocsHeader, H2, P } from "./_ui";
import { DEMOS } from "./_pages";

export const metadata = pageMeta("Introduction | Tapas UI", "Tapas UI is a free, open-source set of launch page sections for Next.js and shadcn/ui: waitlist, pricing and checkout, wired up.", "/docs");

const STEPS = [
  { href: "/docs/installation", title: "Install", body: "Set up shadcn/ui and add your first section with one command.", color: "var(--saffron)" },
  { href: "/docs/theming", title: "Theme it", body: "Sections read your colors, radius and dark mode. Nothing to override.", color: "var(--paprika)" },
  { href: "/docs/sections", title: "Browse sections", body: `All ${SECTIONS.length} sections and cards, with live previews.`, color: "var(--olive)" },
];

const cardClass =
  "group flex h-full flex-col gap-2 rounded-xl border bg-card p-5 transition-[border-color,box-shadow] hover:border-brand/50 hover:shadow-[0_16px_40px_-24px_color-mix(in_oklch,var(--saffron)_50%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export default function DocsIntro() {
  return (
    <article className="max-w-3xl space-y-12">
      <DocsHeader
        crumb="Getting started"
        title="Launch pages that actually work"
        lead="Tapas UI is a free, open-source set of sections for the page you launch with: waitlist forms that store emails, pricing that takes a checkout link, and the rest of a landing page around them. You install a section with one command, and its code lands in your project for you to own and edit."
      >
        <div className="max-w-xl pt-2">
          <CopyCommand command={installCommand("hero-waitlist")} className="bg-card shadow-xs" />
        </div>
      </DocsHeader>

      <section aria-labelledby="start" className="space-y-4">
        <H2 id="start">Start here</H2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.href}>
              <Link href={step.href} className={cardClass}>
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ background: step.color }} />
                  Step {i + 1}
                </span>
                <span className="flex items-center justify-between text-[17px] font-semibold">
                  {step.title}
                  <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{step.body}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="demos" className="space-y-4">
        <H2 id="demos">See it working</H2>
        <P>Three fictional products, each built only from Tapas sections. The waitlist forms really post.</P>
        <ul className="grid gap-3 sm:grid-cols-3">
          {DEMOS.map((demo) => (
            <li key={demo.href}>
              <Link href={demo.href} className={cardClass}>
                <span className="flex items-center justify-between font-semibold">
                  {demo.name}
                  <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{demo.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how" className="space-y-4">
        <H2 id="how">How it works</H2>
        <P>
          Each section is an item in a shadcn registry. Running <C>npx shadcn@latest add</C> with its URL copies the
          component into <C>components/custom/</C> and installs what it depends on, such as the shadcn Button or
          lucide-react. There is no Tapas package in <C>node_modules</C> and nothing to keep updated.
        </P>
      </section>
      <section aria-labelledby="principles" className="space-y-4">
        <H2 id="principles">What every section follows</H2>
        <ul className="max-w-[68ch] list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground marker:text-brand">
          <li>
            It uses your shadcn theme variables (<C>--primary</C>, <C>--muted</C>, <C>--radius</C>), so it matches the rest
            of your app.
          </li>
          <li>It renders as a React Server Component. Only interactive parts are client components.</li>
          <li>It uses semantic HTML with keyboard and screen-reader support, checked in light and dark.</li>
          <li>It takes its content as props, so you can keep copy in one place.</li>
        </ul>
      </section>
    </article>
  );
}
