import { BeamBorder, BeamBorderMotion } from "@/components/custom/beam-border";
import { DotField, DotFieldMotion } from "@/components/custom/dot-field";
import { MagneticCta, MagneticCtaMotion } from "@/components/custom/magnetic-cta";
import { SpotlightCards, SpotlightCardsMotion } from "@/components/custom/spotlight-cards";
import { TextReveal, TextRevealMotion } from "@/components/custom/text-reveal";
import { CreditCard, Mail, Palette, ShieldCheck, Terminal, Zap } from "lucide-react";
import type { PropDoc, SectionDoc } from "./_content";

const ROOT: PropDoc = {
  name: "...props",
  type: `React.ComponentProps<"section">`,
  description: "Any other section attribute (id, aria-*, data-*, ref) goes to the root element.",
};
const ACTIONS: PropDoc[] = [
  { name: "primaryAction", type: "{ label: string; href: string }", description: "Filled button." },
  { name: "secondaryAction", type: "{ label: string; href: string }", description: "Outline button." },
];

export const sampleSpotlightCards = [
  { title: "Stores emails", description: "The waitlist form posts to your own route. Sample feature.", icon: <Mail /> },
  { title: "Takes a checkout link", description: "Point any plan's button at your payment page.", icon: <CreditCard /> },
  { title: "Blocks spam", description: "A honeypot field catches bots without a puzzle.", icon: <ShieldCheck /> },
  { title: "One command", description: "Install any section with the shadcn CLI.", icon: <Terminal /> },
  { title: "Your theme", description: "Every color comes from your shadcn tokens.", icon: <Palette /> },
  { title: "Optional motion", description: "Add the motion file where it helps, skip it where it doesn't.", icon: <Zap /> },
];

const spotlight = { title: "Built for launch day", description: "Sample features.", items: sampleSpotlightCards };

const beam = {
  eyebrow: "Sample offer",
  title: "Ship the landing page this weekend",
  description: "Copy the sections, keep the code, change anything. Sample copy.",
  primaryAction: { label: "Get started", href: "#start" },
  secondaryAction: { label: "Read the docs", href: "#docs" },
};

const reveal = {
  eyebrow: "Sample statement",
  text: "Most launch pages are written in a weekend and never touched again. Ours is built so the form stores the email, the button takes the payment, and the page still reads well a year later.",
};

const dots = {
  eyebrow: "Beta",
  title: "A quiet grid that notices you",
  description: "Dots swell and brighten around the pointer. Sample copy.",
  primaryAction: { label: "Get started", href: "#start" },
  secondaryAction: { label: "See pricing", href: "#pricing" },
};

const magnetic = {
  title: "Ready when you are",
  description: "One button, hard to miss. Sample copy.",
  primaryAction: { label: "Start building", href: "#start" },
  secondaryAction: { label: "or read the docs first", href: "#docs" },
};

export const FX_DOCS: Record<string, SectionDoc> = {
  "spotlight-cards": {
    preview: <SpotlightCards {...spotlight} />,
    importLine: `import { SpotlightCards } from "@/components/custom/spotlight-cards/spotlight-cards";`,
    usage: `<SpotlightCards
  title="Built for launch day"
  columns={3}
  items={[{ title: "Stores emails", description: "The form posts to your own route.", icon: <Mail /> }]}
/>`,
    props: [
      { name: "items", type: "{ title: string; description: string; icon?: ReactNode }[]", required: true, description: "Cards in reading order. Pass icons as elements (<Mail />)." },
      { name: "columns", type: "2 | 3", default: "3", description: "Columns from the lg breakpoint." },
      { name: "title / description", type: "string", description: "Heading (h2) and line under it." },
      ROOT,
    ],
    a11y: [
      "Cards are list items with an h3 each; icons are decorative and hidden from screen readers.",
      "The glow and tilt are decoration for mouse and pen. Touch and keyboard users get the same content, and reduced motion turns both off.",
    ],
    motion: {
      summary:
        "A soft glow in your primary color follows the pointer across the whole grid, each card's border lights up where the pointer is nearest, and nearby cards lean a degree or two toward it.",
      preview: <SpotlightCardsMotion {...spotlight} />,
      importLine: `import { SpotlightCardsMotion } from "@/components/custom/spotlight-cards/spotlight-cards-motion";`,
      usage: `<SpotlightCardsMotion title="Built for launch day" items={items} />`,
    },
  },
  "beam-border": {
    preview: <BeamBorder {...beam} />,
    importLine: `import { BeamBorder } from "@/components/custom/beam-border/beam-border";`,
    usage: `<BeamBorder
  title="Ship the landing page this weekend"
  description="Copy the sections, keep the code."
  primaryAction={{ label: "Get started", href: "/signup" }}
/>`,
    props: [
      { name: "title", type: "string", required: true, description: "The heading, rendered as an h2." },
      { name: "eyebrow", type: "string", description: "Small badge above the title." },
      { name: "description", type: "string", description: "Supporting line under the title." },
      ...ACTIONS,
      ROOT,
    ],
    a11y: [
      "The beam loops, so the motion version shows a Pause border button (WCAG 2.2.2). It also stops while off screen.",
      "With reduced motion the static gradient border is shown and there is no button.",
    ],
    motion: {
      summary: "A beam of light travels around the border, with a soft glow outside the panel that follows it. It has a pause button and stops while off screen.",
      preview: <BeamBorderMotion {...beam} />,
      importLine: `import { BeamBorderMotion } from "@/components/custom/beam-border/beam-border-motion";`,
      usage: `<BeamBorderMotion
  title="Ship the landing page this weekend"
  primaryAction={{ label: "Get started", href: "/signup" }}
/>`,
    },
  },
  "text-reveal": {
    preview: <TextReveal {...reveal} />,
    importLine: `import { TextReveal } from "@/components/custom/text-reveal/text-reveal";`,
    usage: `<TextReveal
  eyebrow="Why we built it"
  text="Most launch pages are written in a weekend and never touched again."
/>`,
    props: [
      { name: "text", type: "string", required: true, description: "The statement. One or two sentences read best." },
      { name: "eyebrow", type: "string", description: "Small label above the statement." },
      ROOT,
    ],
    a11y: [
      "The statement is a paragraph, not a heading: give the page its headings elsewhere.",
      "In the motion version screen readers get the plain sentence once; the word-by-word copy is hidden from them.",
      "Without JavaScript, and with reduced motion, the text is shown at full strength.",
    ],
    motion: {
      summary: "Words go from dim to full strength as the reader scrolls through the paragraph, with a tint of your primary color on the word being read. Scroll the page to see it.",
      preview: <TextRevealMotion {...reveal} />,
      importLine: `import { TextRevealMotion } from "@/components/custom/text-reveal/text-reveal-motion";`,
      usage: `<TextRevealMotion text="Most launch pages are written in a weekend and never touched again." />`,
    },
  },
  "dot-field": {
    preview: <DotField titleAs="h2" {...dots} />,
    importLine: `import { DotField } from "@/components/custom/dot-field/dot-field";`,
    usage: `<DotField
  eyebrow="Beta"
  title="A quiet grid that notices you"
  description="Dots swell and brighten around the pointer."
  primaryAction={{ label: "Get started", href: "/signup" }}
/>`,
    props: [
      { name: "title", type: "string", required: true, description: "The headline." },
      { name: "titleAs", type: `"h1" | "h2"`, default: `"h1"`, description: "Use h2 when the page already has an h1." },
      { name: "eyebrow", type: "string", description: "Small badge above the title." },
      { name: "description", type: "string", description: "Supporting line under the title." },
      ...ACTIONS,
      ROOT,
    ],
    a11y: [
      "The dot grid is decorative and hidden from screen readers; the copy sits on a patch of the page background so it stays readable.",
      "The idle wave loops, so the motion version shows a Pause background button (WCAG 2.2.2). Drawing also stops while off screen.",
      "With reduced motion the static CSS grid is shown and there is no canvas or button.",
    ],
    motion: {
      summary: "Dots near the pointer swell and brighten with a springy falloff, and a slow wave crosses the grid when no pointer is around. One canvas, no library, with a pause button.",
      preview: <DotFieldMotion titleAs="h2" {...dots} />,
      importLine: `import { DotFieldMotion } from "@/components/custom/dot-field/dot-field-motion";`,
      usage: `<DotFieldMotion title="A quiet grid that notices you" primaryAction={{ label: "Get started", href: "/signup" }} />`,
    },
  },
  "magnetic-cta": {
    preview: <MagneticCta {...magnetic} />,
    importLine: `import { MagneticCta } from "@/components/custom/magnetic-cta/magnetic-cta";`,
    usage: `<MagneticCta
  title="Ready when you are"
  description="One button, hard to miss."
  primaryAction={{ label: "Start building", href: "/signup" }}
  secondaryAction={{ label: "or read the docs first", href: "/docs" }}
/>`,
    props: [
      { name: "title", type: "string", required: true, description: "The heading, rendered as an h2." },
      { name: "primaryAction", type: "{ label: string; href: string }", required: true, description: "The large pill button." },
      { name: "secondaryAction", type: "{ label: string; href: string }", description: "A quieter text link under the button." },
      { name: "description", type: "string", description: "Supporting line under the title." },
      ROOT,
    ],
    a11y: [
      "The button is a real link at least 56px tall; the text link under it is 44px tall.",
      "The magnetic pull is for mouse and pen only. With touch, keyboard or reduced motion it is a normal button in a fixed place.",
    ],
    motion: {
      summary: "Within a radius around it, the button is pulled toward the pointer on a spring, its label shifts a little further, a halo gathers behind it, and it squashes when pressed.",
      preview: <MagneticCtaMotion {...magnetic} />,
      importLine: `import { MagneticCtaMotion } from "@/components/custom/magnetic-cta/magnetic-cta-motion";`,
      usage: `<MagneticCtaMotion title="Ready when you are" primaryAction={{ label: "Start building", href: "/signup" }} />`,
    },
  },
};
