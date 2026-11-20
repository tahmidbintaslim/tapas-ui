import { pageMeta } from "@/app/_site/meta";
import { C, CodeBlock, DocsHeader, DocsPage, H2, P } from "../_ui";

export const metadata = pageMeta(
  "Dark mode | Tapas UI",
  "Tapas UI sections follow your shadcn .dark variables. Set up a theme switch with next-themes.",
  "/docs/dark-mode",
);

export default function DarkMode() {
  return (
    <DocsPage>
      <DocsHeader
        crumb="Customization"
        title="Dark mode"
        lead="Sections have no dark styles of their own. They use your shadcn variables, so whatever you define under .dark is what they show."
      />
      <section aria-labelledby="variables" className="space-y-4">
        <H2 id="variables">Define the dark variables</H2>
        <P>
          <C>shadcn init</C> writes a <C>.dark</C> block into your <C>globals.css</C>. Edit it like the light one; every
          section picks it up.
        </P>
        <CodeBlock
          label="app/globals.css"
          code={`.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --muted-foreground: oklch(0.708 0 0);
}`}
        />
      </section>
      <section aria-labelledby="switch" className="space-y-4">
        <H2 id="switch">Add a theme switch</H2>
        <P>
          This site uses next-themes with the <C>class</C> attribute, so the <C>.dark</C> class lands on <C>&lt;html&gt;</C>{" "}
          and the visitor&apos;s system setting is the default.
        </P>
        <CodeBlock
          label="app/layout.tsx"
          code={`import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}`}
        />
      </section>
      <section aria-labelledby="check" className="space-y-4">
        <H2 id="check">Check both themes</H2>
        <P>
          Every section is checked for WCAG AA contrast in light and dark with shadcn&apos;s default colors. If you change{" "}
          <C>--muted-foreground</C> or <C>--primary</C>, check the contrast of text on <C>--background</C> and{" "}
          <C>--card</C> again. The theme toggle in the header switches these docs, previews included.
        </P>
      </section>
    </DocsPage>
  );
}
