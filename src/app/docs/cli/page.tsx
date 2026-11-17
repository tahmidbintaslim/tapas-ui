import { pageMeta } from "@/app/_site/meta";
import { CopyCommand } from "../../_site/copy-command";
import { installCommand } from "../../_site/links";
import { REGISTRY_NAMESPACE, aiPrompt, mcpPrompt, registriesSnippet } from "../../_site/prompts";
import { A, C, CodeBlock, DocsHeader, DocsPage, H2, P } from "../_ui";

export const metadata = pageMeta(
  "CLI & AI agents | Tapas UI",
  "Install Tapas UI sections with the shadcn CLI, the @tapas namespace, the shadcn MCP server or a copied AI prompt.",
  "/docs/cli",
);

const TOC = [
  { id: "url", label: "Install by URL" },
  { id: "namespace", label: "The @tapas namespace" },
  { id: "mcp", label: "shadcn MCP server" },
  { id: "prompt", label: "Copy AI prompt" },
];

export default function Cli() {
  return (
    <DocsPage toc={TOC}>
      <DocsHeader
        crumb="Getting started"
        title="CLI & AI agents"
        lead="Tapas UI is a shadcn registry, so anything that speaks to shadcn can install a section: the CLI, an MCP-aware agent, or an AI tool following a prompt you paste."
      />
      <section aria-labelledby="url" className="space-y-4">
        <H2 id="url">Install by URL</H2>
        <P>
          Every section has a JSON file under <C>/r/</C>. Pass its URL to <C>shadcn add</C>; the CLI copies the files into
          your project and installs the shadcn primitives and npm packages the item lists.
        </P>
        <CopyCommand command={installCommand("pricing-table")} />
        <P>
          A motion version is its own item, named with <C>-motion</C>. It pulls in the plain one and the <C>motion</C> package.
        </P>
        <CopyCommand command={installCommand("pricing-table-motion")} />
      </section>
      <section aria-labelledby="namespace" className="space-y-4">
        <H2 id="namespace">The {REGISTRY_NAMESPACE} namespace</H2>
        <P>
          Register the namespace once in <C>components.json</C> and you can name items instead of pasting URLs.
        </P>
        <CodeBlock code={`{\n  ${registriesSnippet.replace(/\n/g, "\n  ")}\n}`} label="components.json" />
        <CopyCommand command={`npx shadcn@latest add ${REGISTRY_NAMESPACE}/pricing-table`} />
      </section>
      <section aria-labelledby="mcp" className="space-y-4">
        <H2 id="mcp">shadcn MCP server</H2>
        <P>
          Agents that run the shadcn MCP server (Claude Code, Cursor, VS Code and others) can browse and install registry
          items for you. With the namespace registered, ask for an item by name. Each section page has{" "}
          <strong>Copy MCP install</strong>, which gives you this instruction for that section:
        </P>
        <CodeBlock code={mcpPrompt("pricing-table")} label="Prompt" />
        <P>
          See the <A href="https://ui.shadcn.com/docs/mcp">shadcn MCP docs</A> to set the server up for your editor.
        </P>
      </section>
      <section aria-labelledby="prompt" className="space-y-4">
        <H2 id="prompt">Copy AI prompt</H2>
        <P>
          For tools without the MCP server, such as v0 or Lovable, every section page and card has{" "}
          <strong>Copy AI prompt</strong>. It tells the tool which command to run and how to use the section, and asks it to
          keep your theme tokens:
        </P>
        <CodeBlock code={aiPrompt({ slug: "pricing-table", title: "Pricing table" })} label="Prompt" />
      </section>
    </DocsPage>
  );
}
