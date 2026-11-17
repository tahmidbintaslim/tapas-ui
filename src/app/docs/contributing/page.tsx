import { pageMeta } from "@/app/_site/meta";
import { CONTRIBUTING_URL, GOOD_FIRST_ISSUES_URL } from "../../_site/links";
import { A, C, CodeBlock, DocsHeader, DocsPage, H2, P } from "../_ui";

export const metadata = pageMeta(
  "Contributing | Tapas UI",
  "How to contribute to Tapas UI: setup, the checks a pull request must pass, and how a section is structured.",
  "/docs/contributing",
);

const TOC = [
  { id: "setup", label: "Setup" },
  { id: "checks", label: "Checks" },
  { id: "section", label: "Adding a section" },
  { id: "prs", label: "Pull requests" },
];

export default function Contributing() {
  return (
    <DocsPage toc={TOC}>
      <DocsHeader
        crumb="Help"
        title="Contributing"
        lead="Issues and pull requests are welcome. This is a summary; the full rules are in CONTRIBUTING.md."
      />
      <section aria-labelledby="setup" className="space-y-4">
        <H2 id="setup">Setup</H2>
        <P>
          You need Node.js 22 (22.13 or later), 24, or 26 and later, and pnpm. Use pnpm only: the lockfile and security overrides are pnpm&apos;s.
        </P>
        <CodeBlock
          code={`git clone https://github.com/<your-username>/tapas-ui.git
cd tapas-ui
corepack enable
pnpm install --frozen-lockfile
pnpm dev`}
        />
      </section>
      <section aria-labelledby="checks" className="space-y-4">
        <H2 id="checks">Checks</H2>
        <P>CI runs these on every pull request. Run them first, then check your change in light and dark and at about 390px wide, with no sideways scrolling.</P>
        <CodeBlock code={`pnpm lint\npnpm typecheck\npnpm test\npnpm build`} />
      </section>
      <section aria-labelledby="section" className="space-y-4">
        <H2 id="section">Adding a section</H2>
        <ul className="max-w-[68ch] list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground marker:text-brand">
          <li>
            A folder in <C>src/components/custom/</C> with the component, an <C>index.ts</C>, tests and a Storybook story.
          </li>
          <li>Theme tokens only (<C>primary</C>, <C>muted</C>, <C>card</C>, <C>border</C>), never fixed colors.</li>
          <li>Semantic HTML, hidden decorative icons, no button inside a link, and server-component safe.</li>
          <li>
            An optional <C>&lt;name&gt;-motion.tsx</C> with the same props that follows the <A href="/docs/motion">motion rules</A>.
          </li>
          <li>
            An entry in <C>registry.json</C> listing every package it imports, and a docs entry with preview, usage, props and
            accessibility notes.
          </li>
          <li>Sample content that is fictional and labelled: no invented customers, prices, star counts or benchmarks.</li>
        </ul>
      </section>
      <section aria-labelledby="prs" className="space-y-4">
        <H2 id="prs">Pull requests</H2>
        <P>
          Branch from <C>main</C>, use conventional commit messages such as <C>feat(pricing-card): add a yearly toggle</C>,
          and describe what changed and how you checked it, with a screenshot for visual changes. Looking for a place to
          start? Try a <A href={GOOD_FIRST_ISSUES_URL}>good first issue</A>.
        </P>
        <P>
          Read the full guide in <A href={CONTRIBUTING_URL}>CONTRIBUTING.md</A>.
        </P>
      </section>
    </DocsPage>
  );
}
