import { pageMeta } from "@/app/_site/meta";
import { C, CodeBlock, DocsHeader, DocsPage, H2, P, A } from "../../_ui";

export const metadata = pageMeta(
  "Checkout links | Tapas UI",
  "Point Tapas UI pricing buttons at Stripe Payment Links or any URL, with separate monthly and yearly links.",
  "/docs/guides/checkout",
);

export default function CheckoutGuide() {
  return (
    <DocsPage>
      <DocsHeader
        crumb="Guides"
        title="Checkout links"
        lead="Pricing sections take a plain link for each plan. That can be a Stripe Payment Link, a Lemon Squeezy or Paddle checkout URL, or your own signup page. No SDK and no client code."
      />
      <section aria-labelledby="links" className="space-y-4">
        <H2 id="links">Monthly and yearly links</H2>
        <P>
          Each plan&apos;s <C>cta</C> has an <C>href</C> for monthly billing and an optional <C>yearlyHref</C>. While the
          visitor has Yearly selected, the button uses <C>yearlyHref</C>. In the plain pricing table the switch is CSS
          reading a radio input, so the right link is there even without JavaScript.
        </P>
        <CodeBlock
          label="app/pricing/page.tsx"
          code={`<PricingTable
  yearlyNote="2 months free"
  plans={[
    {
      name: "Pro",
      monthly: 19,
      yearly: 190,
      features: ["Unlimited projects"],
      cta: {
        label: "Start with Pro",
        href: "https://buy.stripe.com/your-monthly-link",
        yearlyHref: "https://buy.stripe.com/your-yearly-link",
      },
      popular: true,
    },
  ]}
/>`}
        />
        <P>
          The same <C>cta</C> shape works in <A href="/docs/sections/pricing-table">Pricing table</A> and{" "}
          <A href="/docs/sections/price-morph">Price morph</A>. Without <C>yearlyHref</C>, both periods use <C>href</C>.
        </P>
      </section>
      <section aria-labelledby="stripe" className="space-y-4">
        <H2 id="stripe">With Stripe Payment Links</H2>
        <P>
          In the Stripe Dashboard, create one Payment Link per plan and billing period, then paste each URL into the plan.
          Set the link&apos;s confirmation page to redirect back to your site so buyers land somewhere useful. Prices shown
          on the page are only text: keep them in step with the prices in Stripe.
        </P>
      </section>
      <section aria-labelledby="free" className="space-y-4">
        <H2 id="free">Free plans and signups</H2>
        <P>
          A free plan or a trial can link to your own route, such as <C>/signup</C>. Any value an <C>&lt;a href&gt;</C>{" "}
          accepts works.
        </P>
      </section>
    </DocsPage>
  );
}
