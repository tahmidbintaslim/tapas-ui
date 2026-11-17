import { pageMeta } from "@/app/_site/meta";
import { CopyCommand } from "../../../_site/copy-command";
import { GITHUB_URL, installCommand } from "../../../_site/links";
import { A, C, CodeBlock, DocsHeader, DocsPage, H2, P } from "../../_ui";

export const metadata = pageMeta(
  "Waitlist forms | Tapas UI",
  "Post Tapas UI waitlist forms to your own Next.js route: origin check, honeypot, validation and a Resend segment.",
  "/docs/guides/waitlist",
);

const TOC = [
  { id: "form", label: "The form" },
  { id: "route", label: "The route" },
  { id: "store", label: "Storing emails" },
  { id: "result", label: "Showing the result" },
];

const ROUTE = `// app/api/waitlist/route.ts
const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export async function POST(request: Request) {
  // Refuse posts from other sites (browsers send Origin on form posts).
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return new Response("Forbidden", { status: 403 });

  const form = await request.formData().catch(() => null);
  const email = String(form?.get("email") ?? "").trim().toLowerCase();
  const back = (joined: string) => Response.redirect(new URL(\`/?joined=\${joined}#join\`, request.url), 303);

  // Honeypot: only bots fill the hidden field. Look successful, store nothing.
  if (String(form?.get("website") ?? "") !== "") return back("1");
  if (email.length > 254 || !EMAIL.test(email)) return back("invalid");

  const res = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers: { Authorization: \`Bearer \${process.env.RESEND_API_KEY}\`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, segments: [{ id: process.env.RESEND_SEGMENT_ID }] }),
  }).catch(() => null);
  return back(res?.ok ? "1" : "error");
}`;

export default function WaitlistGuide() {
  return (
    <DocsPage toc={TOC}>
      <DocsHeader
        crumb="Guides"
        title="Waitlist forms"
        lead="The waitlist hero and the newsletter section are plain HTML forms. They post to any URL you give them, so the emails land in your own API route, and they work before JavaScript loads."
      />
      <section aria-labelledby="form" className="space-y-4">
        <H2 id="form">1. Point the form at your route</H2>
        <CopyCommand command={installCommand("hero-waitlist")} />
        <P>
          Set <C>action</C> to your route and <C>honeypotName</C> to a field name bots will fill. The section renders that
          field off screen, hidden from screen readers and skipped by the keyboard.
        </P>
        <CodeBlock
          label="app/page.tsx"
          code={`<HeroWaitlist
  id="join"
  title="Be first in line"
  action="/api/waitlist"
  honeypotName="website"
  note="One email when we launch. No spam."
/>`}
        />
      </section>
      <section aria-labelledby="route" className="space-y-4">
        <H2 id="route">2. Handle the post</H2>
        <P>
          This is a shortened version of the route the demo sites run. It checks the <C>Origin</C> header, drops honeypot
          hits, validates the address and redirects back with a <C>303</C>, so a refresh never posts twice.
        </P>
        <CodeBlock code={ROUTE} label="app/api/waitlist/route.ts" />
        <P>
          The full version, which also handles a contact that already exists and runs in a demo mode without keys, is{" "}
          <A href={`${GITHUB_URL}/blob/main/src/app/examples/_lib/waitlist.ts`}>examples/_lib/waitlist.ts</A>.
        </P>
      </section>
      <section aria-labelledby="store" className="space-y-4">
        <H2 id="store">3. Store the emails</H2>
        <P>
          The example adds each address to a Resend segment. Set <C>RESEND_API_KEY</C> and <C>RESEND_SEGMENT_ID</C> in your
          environment (on Vercel, under Project Settings, Environment Variables). To use another service, replace the{" "}
          <C>fetch</C> call; the form does not change.
        </P>
      </section>
      <section aria-labelledby="result" className="space-y-4">
        <H2 id="result">4. Tell the visitor what happened</H2>
        <P>
          The route redirects to <C>?joined=1</C>, <C>invalid</C> or <C>error</C>. Read <C>searchParams</C> in your page
          and show a message next to the form, in an element with <C>role=&quot;status&quot;</C> so screen readers announce
          it.
        </P>
      </section>
    </DocsPage>
  );
}
