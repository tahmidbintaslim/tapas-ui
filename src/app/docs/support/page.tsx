import { pageMeta } from "@/app/_site/meta";
import { Bug, Lightbulb, ShieldAlert } from "lucide-react";
import { GITHUB_URL } from "../../_site/links";
import { A, DocsHeader, DocsPage, H2, P } from "../_ui";

export const metadata = pageMeta(
  "Support | Tapas UI",
  "Where to get help with Tapas UI: GitHub Issues for bugs and requests, private advisories for security reports.",
  "/docs/support",
);

const CHANNELS = [
  {
    icon: Bug,
    title: "Report a bug",
    body: "A section looks wrong, fails a contrast or keyboard check, or will not install. Include the section, steps, what you expected, and your browser and OS.",
    href: `${GITHUB_URL}/issues/new?template=bug_report.md`,
    cta: "Open a bug report",
  },
  {
    icon: Lightbulb,
    title: "Ask for a section or feature",
    body: "Tell us what the section should do on a launch page, or what is missing from an existing one.",
    href: `${GITHUB_URL}/issues/new/choose`,
    cta: "Open a request",
  },
  {
    icon: ShieldAlert,
    title: "Report a security issue",
    body: "Please do not open a public issue. Report it privately through a GitHub security advisory; only the maintainer can see it.",
    href: `${GITHUB_URL}/security/advisories/new`,
    cta: "Report privately",
  },
];

export default function Support() {
  return (
    <DocsPage>
      <DocsHeader
        crumb="Help"
        title="Support"
        lead="Tapas UI is maintained in the open on GitHub. Check the FAQ first; if that does not answer it, open an issue."
      />
      <ul className="grid gap-3 sm:grid-cols-3">
        {CHANNELS.map((c) => (
          <li key={c.title} className="flex flex-col gap-3 rounded-xl border bg-card p-5">
            <c.icon aria-hidden="true" className="size-5 text-brand" />
            <h2 className="font-semibold">{c.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            <a
              href={c.href}
              className="mt-auto inline-flex min-h-11 items-center text-sm font-medium underline decoration-brand/60 underline-offset-4 hover:decoration-brand"
            >
              {c.cta}
            </a>
          </li>
        ))}
      </ul>
      <section aria-labelledby="before" className="space-y-4">
        <H2 id="before">Before you open an issue</H2>
        <P>
          Read the <A href="/docs/faq">FAQ</A> and search the <A href={`${GITHUB_URL}/issues?q=is%3Aissue`}>existing issues</A>,
          open and closed. Support is best effort from one maintainer; there is no paid support or response-time promise.
        </P>
      </section>
    </DocsPage>
  );
}
