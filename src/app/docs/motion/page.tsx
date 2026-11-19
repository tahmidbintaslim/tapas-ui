import { pageMeta } from "@/app/_site/meta";
import { CopyCommand } from "../../_site/copy-command";
import { installCommand } from "../../_site/links";
import { A, C, CodeBlock, DocsHeader, DocsPage, H2, P } from "../_ui";

export const metadata = pageMeta(
  "Motion | Tapas UI",
  "Plain and motion versions of Tapas UI sections: reduced motion, pause controls and server rendering.",
  "/docs/motion",
);

const TOC = [
  { id: "two-versions", label: "Plain and motion" },
  { id: "install", label: "Install" },
  { id: "rules", label: "What motion versions promise" },
  { id: "server", label: "Server pages" },
];

export default function Motion() {
  return (
    <DocsPage toc={TOC}>
      <DocsHeader
        crumb="Customization"
        title="Motion"
        lead="Every section works without animation. Where movement adds meaning, there is also a motion version with the same props, built on the motion package."
      />
      <section aria-labelledby="two-versions" className="space-y-4">
        <H2 id="two-versions">Plain and motion</H2>
        <P>
          The plain file is a server component with CSS only. The motion file, <C>&lt;name&gt;-motion.tsx</C>, is a client
          component that takes exactly the same props, so you can swap one for the other without touching your content.
          Section pages show both behind the Plain / Motion switch.
        </P>
      </section>
      <section aria-labelledby="install" className="space-y-4">
        <H2 id="install">Install</H2>
        <P>
          Add <C>-motion</C> to the item name. The CLI also installs the plain version (the motion one reuses its parts)
          and the <C>motion</C> npm package.
        </P>
        <CopyCommand command={installCommand("hero-motion")} />
        <CodeBlock code={`import { HeroMotion } from "@/components/custom/hero/hero-motion";`} />
      </section>
      <section aria-labelledby="rules" className="space-y-4">
        <H2 id="rules">What motion versions promise</H2>
        <ul className="max-w-[68ch] list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground marker:text-brand">
          <li>
            <strong className="text-foreground">Reduced motion.</strong> They call <C>useReducedMotion()</C>; with the
            setting on, they render exactly the plain layout.
          </li>
          <li>
            <strong className="text-foreground">Content is never hidden.</strong> Text and images are in the server HTML
            and visible before JavaScript runs. Animation starts only after mount.
          </li>
          <li>
            <strong className="text-foreground">A pause button.</strong> Anything that moves for more than five seconds,
            such as a marquee or a looping beam, has a visible pause control.
          </li>
          <li>
            <strong className="text-foreground">Cheap properties.</strong> They animate transform, opacity, filter,
            clip-path and shadows only, so layout never shifts.
          </li>
          <li>
            <strong className="text-foreground">One tree.</strong> The server and the browser render the same markup;
            motion switches on after hydration instead of swapping in a different component.
          </li>
        </ul>
      </section>
      <section aria-labelledby="server" className="space-y-4">
        <H2 id="server">Using motion sections from a server page</H2>
        <P>
          Props passed from a server component to a client component must be serializable. Pass icons as elements, not as
          component references:
        </P>
        <CodeBlock code={`// Works\nicon: <Zap aria-hidden="true" />\n\n// Fails: a function can't cross to the client\nicon: Zap`} />
        <P>
          The rules come from <A href="/docs/contributing">the contributing guide</A>, which every new section follows.
        </P>
      </section>
    </DocsPage>
  );
}
