import { pageMeta } from "@/app/_site/meta";
import { GITHUB_URL } from "../../_site/links";
import { A, DocsHeader, DocsPage, P } from "../_ui";

export const metadata = pageMeta(
  "Changelog | Tapas UI",
  "What shipped in Tapas UI, grouped by date, with links to each pull request.",
  "/docs/changelog",
);

/** Hand-written from the merged pull requests on main. Dates are merge dates. */
const RELEASES: { date: string; label: string; items: { pr: number; text: string }[] }[] = [
  {
    date: "2026-11-17",
    label: "17 November 2026",
    items: [
      { pr: 38, text: "15 creative sections (number ticker, price morph, spotlight cards, terminal demo and more) and a home page that shows them working." },
      { pr: 39, text: "The new sections in the demo sites and the SaaS template; a contrast fix for the floating navbar." },
      { pr: 40, text: "README lists all 60 sections, 6 templates and 3 demo sites." },
    ],
  },
  {
    date: "2026-11-12",
    label: "12 November 2026",
    items: [{ pr: 37, text: "New identity: launch pages that actually work. Copy leads with what each section does." }],
  },
  {
    date: "2026-11-11",
    label: "11 November 2026",
    items: [{ pr: 36, text: "New brand, a section ribbon on the home page, the Stackwise demo, 3 more templates and 6 motion sections." }],
  },
  {
    date: "2026-11-09",
    label: "9 November 2026",
    items: [
      { pr: 30, text: "Second demo site, Patchnote, built from motion sections, with a shared waitlist route." },
      { pr: 31, text: "WebGL hero: hero-shader and hero-shader-motion." },
      { pr: 32, text: "Waitlist sign-ups are stored in a Resend segment." },
      { pr: 33, text: "Home page: less text, one bold statement, AAA contrast." },
      { pr: 34, text: "Mobile, SEO and React fixes from two audits." },
      { pr: 35, text: "Motion sections hydrate in place; static demo pages, menu closing and JSON-LD." },
    ],
  },
  {
    date: "2026-11-08",
    label: "8 November 2026",
    items: [
      { pr: 25, text: "One h1 per page, the real domain, and Copy code / Copy AI prompt / Copy MCP install on every section." },
      { pr: 26, text: "Section cards with real preview images and copy buttons." },
      { pr: 27, text: "Ledgerline, a working demo site built only from Tapas sections." },
      { pr: 28, text: "Review fixes for the demo, plus CI and dependency security fixes." },
      { pr: 29, text: "Honeypot field for waitlist forms." },
    ],
  },
];

export default function Changelog() {
  return (
    <DocsPage>
      <DocsHeader
        crumb="Help"
        title="Changelog"
        lead="What shipped, newest first. Tapas UI has no version numbers: each section is copied into your project, so you update one by installing it again."
      />
      <ol className="space-y-10">
        {RELEASES.map((r) => (
          <li key={r.date} className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <h2 className="text-sm font-semibold sm:pt-0.5">
              <time dateTime={r.date}>{r.label}</time>
            </h2>
            <ul className="space-y-3 border-l pl-5">
              {r.items.map((item) => (
                <li key={item.pr} className="relative leading-relaxed text-muted-foreground">
                  <span aria-hidden="true" className="absolute top-2.5 -left-[1.5625rem] size-2 rounded-full bg-brand" />
                  {item.text}{" "}
                  <a
                    href={`${GITHUB_URL}/pull/${item.pr}`}
                    className="font-mono text-[13px] text-foreground underline decoration-brand/60 underline-offset-4 hover:decoration-brand"
                  >
                    #{item.pr}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <P>
        Earlier work is in the <A href={`${GITHUB_URL}/pulls?q=is%3Apr+is%3Amerged`}>merged pull requests</A> on GitHub.
      </P>
    </DocsPage>
  );
}
