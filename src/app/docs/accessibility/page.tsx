import { pageMeta } from "@/app/_site/meta";
import { A, C, DocsHeader, DocsPage, H2, P } from "../_ui";

export const metadata = pageMeta(
  "Accessibility | Tapas UI",
  "What every Tapas UI section guarantees: WCAG 2.2 AA in light and dark, semantic HTML, keyboard support and reduced motion.",
  "/docs/accessibility",
);

const GUARANTEES = [
  ["WCAG 2.2 AA", "Text contrast meets AA in light and dark with shadcn's default colors, because sections use theme tokens instead of fixed colors."],
  ["Semantic HTML", "Lists are lists, quotes are figures, dates are <time>, and actions are real buttons and links. A button is never nested in a link."],
  ["Headings you control", "Heroes render an h1 and take titleAs=\"h2\" when a page already has one; other sections start at h2."],
  ["Keyboard and screen readers", "Everything works with a keyboard, focus is visible, and decorative icons are hidden with aria-hidden."],
  ["Works without JavaScript", "Forms, FAQ accordions and the pricing period switch are native elements (form, details, radio inputs)."],
  ["Reduced motion", "Motion versions render the plain layout when the visitor asks for less motion, and loops longer than five seconds have a pause button."],
  ["Same text on server and client", "Numbers and dates use a fixed locale, so screen readers never hear a flash of different text after hydration."],
] as const;

export default function Accessibility() {
  return (
    <DocsPage>
      <DocsHeader
        crumb="Customization"
        title="Accessibility"
        lead="Accessibility is part of what a section is, not an add-on. These are the rules every Tapas section follows, and each section page lists its own notes."
      />
      <section aria-labelledby="guarantees" className="space-y-4">
        <H2 id="guarantees">What every section guarantees</H2>
        <dl className="divide-y rounded-xl border bg-card">
          {GUARANTEES.map(([term, detail]) => (
            <div key={term} className="grid gap-1 p-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
              <dt className="font-medium">{term}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="checked" className="space-y-4">
        <H2 id="checked">How it is checked</H2>
        <P>
          Sections have Vitest and Testing Library tests for what a screen reader user depends on, and Storybook stories
          checked with the axe accessibility panel. Pull requests are checked in both themes and at phone width (about
          390px) with no sideways scrolling.
        </P>
      </section>
      <section aria-labelledby="yours" className="space-y-4">
        <H2 id="yours">Keeping it accessible after you edit</H2>
        <P>
          The code is yours once installed. If you change colors, recheck contrast for <C>--muted-foreground</C> on{" "}
          <C>--background</C>. Keep one <C>h1</C> per page (pass <C>titleAs=&quot;h2&quot;</C> to any extra hero), and give
          images real alt text unless they are decorative. Found a gap in a section?{" "}
          <A href="/docs/support">Report it</A>.
        </P>
      </section>
    </DocsPage>
  );
}
