import { pageMeta } from "@/app/_site/meta";
import { CopyCommand } from "../../_site/copy-command";
import { GITHUB_URL, installCommand } from "../../_site/links";
import { A, C, DocsHeader, DocsPage, P } from "../_ui";

export const metadata = pageMeta(
  "FAQ | Tapas UI",
  "Answers about Tapas UI: license, motion, Next.js, server components, Tailwind v4, updates and using it without shadcn.",
  "/docs/faq",
);

const FAQ: { id: string; q: string; a: React.ReactNode }[] = [
  {
    id: "license",
    q: "Is it free? What is the license?",
    a: (
      <P>
        Yes. Tapas UI is open source under the <A href={`${GITHUB_URL}/blob/main/LICENSE`}>MIT license</A>. Use it in
        personal and commercial projects; once a section is installed, the code is yours.
      </P>
    ),
  },
  {
    id: "motion",
    q: "Do I need an animation library?",
    a: (
      <P>
        No. Plain sections use CSS only. Only the <A href="/docs/motion">motion versions</A> need the <C>motion</C> package,
        and the CLI installs it when you add one.
      </P>
    ),
  },
  {
    id: "nextjs",
    q: "Does it only work with Next.js?",
    a: (
      <P>
        The docs and examples use the Next.js App Router, but the sections are React components. Only the blog card imports
        from Next.js (<C>next/image</C>); the rest work in any React 19 app set up with shadcn/ui and Tailwind CSS v4.
      </P>
    ),
  },
  {
    id: "rsc",
    q: "Do sections work as React Server Components?",
    a: (
      <P>
        Yes. Plain sections have no hooks or browser APIs, so they render on the server. Interactive parts are small client
        components, and motion versions are client components that render the same markup on the server first.
      </P>
    ),
  },
  {
    id: "tailwind",
    q: "Which Tailwind version do I need?",
    a: <P>Tailwind CSS v4, with the CSS variables shadcn/ui sets up. Sections use v4 syntax such as <C>size-4</C> and <C>has-[]</C> variants.</P>,
  },
  {
    id: "update",
    q: "How do I update a section?",
    a: (
      <>
        <P>
          There is no package to bump: run the install command again. The CLI asks before it overwrites a file you already
          have. Commit your edits first so you can compare and keep the changes you made.
        </P>
        <CopyCommand command={installCommand("pricing-table")} />
      </>
    ),
  },
  {
    id: "without-shadcn",
    q: "Can I use it without shadcn/ui?",
    a: (
      <P>
        Not directly. Sections import shadcn primitives such as Button and Badge, the <C>cn()</C> helper, and read the shadcn
        theme variables. Running <C>npx shadcn@latest init</C> sets all of that up in a minute; see{" "}
        <A href="/docs/installation">Installation</A>.
      </P>
    ),
  },
  {
    id: "pro",
    q: "Is there a Pro version?",
    a: <P>Not yet. Everything on this site is free. Paid templates may come later; nothing is for sale today.</P>,
  },
  {
    id: "request",
    q: "Can I ask for a section?",
    a: (
      <P>
        Yes. Open a <A href={`${GITHUB_URL}/issues/new/choose`}>block request</A> on GitHub and describe what the section
        should do on a launch page.
      </P>
    ),
  },
];

export default function Faq() {
  return (
    <DocsPage toc={FAQ.map((f) => ({ id: f.id, label: f.q }))}>
      <DocsHeader crumb="Help" title="FAQ" lead="Short answers to what people ask before and after installing a section." />
      <div className="divide-y rounded-xl border bg-card">
        {FAQ.map((f) => (
          <section key={f.id} aria-labelledby={f.id} className="space-y-2 p-5">
            <h2 id={f.id} className="scroll-mt-24 text-[17px] font-semibold">
              {f.q}
            </h2>
            {f.a}
          </section>
        ))}
      </div>
      <P>
        Still stuck? See <A href="/docs/support">Support</A>.
      </P>
    </DocsPage>
  );
}
