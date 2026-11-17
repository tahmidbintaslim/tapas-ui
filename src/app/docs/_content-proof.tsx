import { LaunchCountdown, LaunchCountdownMotion } from "@/components/custom/launch-countdown";
import { LogoVelocity, LogoVelocityMotion } from "@/components/custom/logo-velocity";
import { NumberTicker, NumberTickerMotion } from "@/components/custom/number-ticker";
import { PriceMorph, PriceMorphMotion } from "@/components/custom/price-morph";
import { TestimonialStack, TestimonialStackMotion } from "@/components/custom/testimonial-stack";
import { Button } from "@/components/ui/button";
import { Blocks, Braces, Layers, Palette, Triangle, Wind } from "lucide-react";
import type { PropDoc, SectionDoc } from "./_content";

const ROOT: PropDoc = {
  name: "...props",
  type: `React.ComponentProps<"section">`,
  description: "Any other section attribute (id, aria-*, data-*, ref) goes to the root element.",
};

const stats = [
  { value: 1280, label: "Waitlist signups (sample)" },
  { value: 38.5, label: "Visitor to signup (sample)", suffix: "%", decimals: 1 },
  { value: 412, label: "Checkouts (sample)" },
  { value: 6, label: "Days from idea to launch (sample)" },
];

const logos = [
  { name: "Next.js", logo: <><Triangle />Next.js</> },
  { name: "React", logo: <><Blocks />React</> },
  { name: "Tailwind CSS", logo: <><Wind />Tailwind CSS</> },
  { name: "shadcn/ui", logo: <><Layers />shadcn/ui</> },
  { name: "TypeScript", logo: <><Braces />TypeScript</> },
  { name: "Your theme", logo: <><Palette />Your theme</> },
];

const quotes = [
  { quote: "We swapped our hero the night before launch and nothing else on the page had to change.", author: "Ana Diaz", role: "Founder, sample app (fictional)" },
  { quote: "The pricing section took my checkout links as plain hrefs. I had it live before lunch.", author: "Ben Okafor", role: "Indie hacker (fictional)" },
  { quote: "It picked up our shadcn theme without a single override, dark mode included.", author: "Cy Tanaka", role: "Designer (fictional)" },
  { quote: "I could read every file it installed. That is why I trusted it on a launch page.", author: "Dee Marsh", role: "Solo developer (fictional)" },
];

const plans = [
  { name: "Solo", description: "For one product", monthly: 9, yearly: 84, features: ["1 site", "All sections", "Email support"], cta: { label: "Choose Solo", href: "#solo" } },
  { name: "Studio", description: "For several launches", monthly: 29, yearly: 276, featured: true, features: ["10 sites", "All templates", "Priority support"], cta: { label: "Choose Studio", href: "#studio-monthly", yearlyHref: "#studio-yearly" } },
  { name: "Team", description: "For agencies", monthly: 79, yearly: 756, features: ["Unlimited sites", "Shared themes", "Onboarding call"], cta: { label: "Choose Team", href: "#team" } },
];

/** A stand-in waitlist form for the preview; it posts nowhere. */
const waitlist = (id: string) => (
  <form action="#waitlist" className="flex w-full flex-col gap-2 sm:flex-row">
    <label htmlFor={id} className="sr-only">
      Email address
    </label>
    <input
      id={id}
      name="email"
      type="email"
      required
      autoComplete="email"
      placeholder="you@example.com"
      className="h-11 min-w-0 rounded-md border bg-background px-3 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:flex-1 sm:text-sm"
    />
    <Button type="submit" size="lg" className="h-11">
      Join the waitlist
    </Button>
  </form>
);

const countdown = {
  title: "Something new is on the way",
  description: "One email on launch day, nothing before. Sample copy.",
  launchDate: "2027-06-01T15:00:00Z",
};

export const PROOF_DOCS: Record<string, SectionDoc> = {
  "number-ticker": {
    preview: <NumberTicker title="Launch week, in numbers" description="Sample data." stats={stats} />,
    importLine: `import { NumberTicker } from "@/components/custom/number-ticker/number-ticker";`,
    usage: `<NumberTicker
  title="Launch week, in numbers"
  stats={[
    { value: 1280, label: "Waitlist signups" },
    { value: 38.5, label: "Visitor to signup", suffix: "%", decimals: 1 },
  ]}
/>`,
    props: [
      { name: "stats", type: "{ value; label; prefix?; suffix?; decimals? }[]", required: true, description: "2 to 4 read best. Use real numbers." },
      { name: "title / description", type: "string", description: "Heading (h2) and line under it." },
      ROOT,
    ],
    a11y: [
      "A description list: each label is the term and the number its value.",
      "Numbers format with a fixed locale, so server and browser match.",
    ],
    motion: {
      summary:
        "Each digit is a wheel that rolls to its value with a spring, one after another, when the row scrolls into view. A row already on screen when the page loads stays still.",
      preview: <NumberTickerMotion title="Launch week, in numbers" description="Sample data." stats={stats} />,
      importLine: `import { NumberTickerMotion } from "@/components/custom/number-ticker/number-ticker-motion";`,
      usage: `<NumberTickerMotion stats={stats} />`,
    },
  },
  "logo-velocity": {
    preview: <LogoVelocity title="Works with your stack" logos={logos} />,
    importLine: `import { LogoVelocity } from "@/components/custom/logo-velocity/logo-velocity";`,
    usage: `<LogoVelocity
  title="Works with your stack"
  logos={[
    { name: "Next.js", logo: <NextLogo /> },
    { name: "Tailwind CSS" },
  ]}
/>`,
    props: [
      { name: "logos", type: "{ name: string; logo?: ReactNode }[]", required: true, description: "The name shows as text when there is no logo. Only show logos you may use." },
      { name: "title", type: "string", description: "Small heading (h2) above the row." },
      { name: "speed", type: "number", default: "36", description: "Resting drift in pixels per second. Used by the motion version." },
      ROOT,
    ],
    a11y: ["A list; each logo's name is read even when the logo is an image or icon."],
    motion: {
      summary:
        "The row drifts slowly, speeds up and leans with the page scroll, turns around when you scroll back up, and eases to a drift again. It stops on hover, on keyboard focus and with the pause button.",
      preview: <LogoVelocityMotion title="Works with your stack" logos={logos} />,
      importLine: `import { LogoVelocityMotion } from "@/components/custom/logo-velocity/logo-velocity-motion";`,
      usage: `<LogoVelocityMotion logos={logos} speed={36} />`,
    },
  },
  "testimonial-stack": {
    preview: <TestimonialStack title="What founders say" description="Sample quotes from fictional people." items={quotes} />,
    importLine: `import { TestimonialStack } from "@/components/custom/testimonial-stack/testimonial-stack";`,
    usage: `<TestimonialStack
  title="What founders say"
  items={[
    { quote: "It just worked.", author: "Ana Diaz", role: "Founder", avatar: "/ana.webp" },
  ]}
/>`,
    props: [
      { name: "items", type: "{ quote; author; role?; avatar? }[]", required: true, description: "Real quotes only. Initials replace a missing avatar." },
      { name: "title / description", type: "string", description: "Heading (h2) and line under it." },
      ROOT,
    ],
    a11y: ["A list of figures: each quote is a blockquote with its author in the caption."],
    motion: {
      summary:
        "Quotes sit in a deck. Drag or swipe the top card away, or use the Previous and Next buttons or the arrow keys; the cards behind spring forward. Every quote stays in the list for screen readers.",
      preview: <TestimonialStackMotion title="What founders say" description="Sample quotes from fictional people." items={quotes} />,
      importLine: `import { TestimonialStackMotion } from "@/components/custom/testimonial-stack/testimonial-stack-motion";`,
      usage: `<TestimonialStackMotion items={quotes} />`,
    },
  },
  "price-morph": {
    preview: <PriceMorph title="Simple pricing" description="Sample plans and prices." plans={plans} />,
    importLine: `import { PriceMorph } from "@/components/custom/price-morph/price-morph";`,
    usage: `<PriceMorph
  title="Simple pricing"
  plans={[
    {
      name: "Studio",
      monthly: 29,
      yearly: 276,
      featured: true,
      features: ["10 sites", "Priority support"],
      cta: { label: "Choose Studio", href: monthlyCheckoutUrl, yearlyHref: yearlyCheckoutUrl },
    },
  ]}
/>`,
    props: [
      { name: "plans", type: "{ name; description?; monthly; yearly; features; cta; featured? }[]", required: true, description: "`yearly` is the price per year. The saving is worked out from the two prices." },
      { name: "plans[].cta", type: "{ label; href; yearlyHref? }", required: true, description: "Any link, such as a checkout URL. `yearlyHref` is used while yearly is selected." },
      { name: "currency", type: "string", default: `"$"`, description: "Shown before each price." },
      { name: "monthlyLabel / yearlyLabel", type: "string", default: `"Monthly" / "Yearly"`, description: "Switch labels." },
      { name: "featuredLabel", type: "string", default: `"Most popular"`, description: "Badge on the featured plan." },
      { name: "title / description", type: "string", description: "Heading (h2) and line under it." },
      ROOT,
    ],
    a11y: [
      "The switch is a radio group named “Billing period”; arrow keys change it.",
      "Without JavaScript the switch still works: CSS reads the checked radio.",
      "Each plan is a list item named after the plan, with its own h3.",
    ],
    motion: {
      summary:
        "Switching the period morphs each price digit by digit, the save badge pops in on yearly, and a soft light crosses the featured plan once per switch.",
      preview: <PriceMorphMotion title="Simple pricing" description="Sample plans and prices." plans={plans} />,
      importLine: `import { PriceMorphMotion } from "@/components/custom/price-morph/price-morph-motion";`,
      usage: `<PriceMorphMotion plans={plans} />`,
    },
  },
  "launch-countdown": {
    preview: <LaunchCountdown {...countdown}>{waitlist("countdown-email")}</LaunchCountdown>,
    importLine: `import { LaunchCountdown } from "@/components/custom/launch-countdown/launch-countdown";`,
    usage: `<LaunchCountdown title="Something new is on the way" launchDate="2027-06-01T15:00:00Z">
  <WaitlistForm />
</LaunchCountdown>`,
    props: [
      { name: "title", type: "string", required: true, description: "Main heading." },
      { name: "launchDate", type: "string", required: true, description: "ISO date or date-time. A bare date means midnight UTC. Use your real date." },
      { name: "children", type: "ReactNode", description: "Your waitlist form, or anything else, under the date." },
      { name: "titleAs", type: `"h1" | "h2"`, default: `"h2"`, description: "Use h1 when this is the page's main heading." },
      { name: "description", type: "string", description: "Line under the heading." },
      { name: "badge", type: "string", default: `"Coming soon"`, description: "Small label above the heading." },
      ROOT,
    ],
    a11y: ["The date is text in a time element, shown in UTC with a fixed locale so server and browser match."],
    motion: {
      summary:
        "A live clock counts down, each changed digit dropping in. The clock starts after the page loads, has a pause button, and gives way to a launched line once the date has passed.",
      preview: <LaunchCountdownMotion {...countdown}>{waitlist("countdown-email-motion")}</LaunchCountdownMotion>,
      importLine: `import { LaunchCountdownMotion } from "@/components/custom/launch-countdown/launch-countdown-motion";`,
      usage: `<LaunchCountdownMotion title="Something new is on the way" launchDate="2027-06-01T15:00:00Z">
  <WaitlistForm />
</LaunchCountdownMotion>`,
      extraProps: [
        { name: "launchedBadge", type: "string", default: `"Live now"`, description: "Badge text once the date has passed." },
        { name: "launchedMessage", type: "string", default: `"We have launched. Come and have a look."`, description: "Line shown instead of the clock once the date has passed." },
      ],
    },
  },
};
