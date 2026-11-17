import { CompareSlider, CompareSliderMotion } from "@/components/custom/compare-slider";
import { DeviceFrame, DeviceFrameMotion } from "@/components/custom/device-frame";
import { FlowBeams, FlowBeamsMotion } from "@/components/custom/flow-beams";
import { StickyShowcase, StickyShowcaseMotion } from "@/components/custom/sticky-showcase";
import { TerminalDemo, TerminalDemoMotion, type TerminalLine } from "@/components/custom/terminal-demo";
import { Database, MousePointerClick, Rocket, Send } from "lucide-react";
import type { PropDoc, SectionDoc } from "./_content";
import { DemoScreen } from "./_content-heroes";

const ROOT = (el: string): PropDoc => ({
  name: "...props",
  type: `React.ComponentProps<"${el}">`,
  description: `Any other ${el} attribute (id, aria-*, data-*, ref) goes to the root element.`,
});

/** Sample screens for the previews: made-up UI, labelled as sample. */
function SampleForm() {
  return (
    <div role="img" aria-label="Sample signup form" className="space-y-3 p-6">
      <p className="text-sm font-medium">Join the waitlist (sample)</p>
      <div className="h-9 rounded-md border bg-background" />
      <div className="grid h-9 place-items-center rounded-md bg-primary text-sm font-medium text-primary-foreground">Join</div>
      <p className="text-xs text-muted-foreground">Sample screen, not a real form.</p>
    </div>
  );
}
function SampleList() {
  return (
    <div role="img" aria-label="Sample list of signups" className="space-y-2.5 p-6">
      <p className="text-sm font-medium">Signups (sample data)</p>
      {[72, 56, 64, 48].map((w, i) => (
        <div key={i} className="flex items-center gap-3 rounded-md border bg-background px-3 py-2">
          <span className="size-5 rounded-full bg-primary/20" />
          <span className="h-2 rounded-full bg-muted-foreground/30" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
}

export const sampleShowcase = [
  { label: "Collect", title: "A form that stores every email", description: "Visitors sign up from the hero. Sample copy for a made-up product.", media: <DeviceFrame url="example.com"><SampleForm /></DeviceFrame> },
  { label: "Review", title: "See who joined, in order", description: "Each signup lands in a list you can export. Sample copy.", media: <DeviceFrame url="example.com/signups"><SampleList /></DeviceFrame> },
  { label: "Measure", title: "Watch the launch week", description: "A chart of the week, without a tracking script. Sample copy.", media: <DeviceFrame url="example.com/stats"><div className="p-4"><DemoScreen /></div></DeviceFrame> },
];

export const sampleTerminal: TerminalLine[] = [
  { kind: "command", text: "npx shadcn@latest add https://example.com/r/hero.json" },
  { kind: "output", text: "✔ Checking registry." },
  { kind: "output", text: "✔ Created 1 file:" },
  { kind: "output", text: "  - components/custom/hero/hero.tsx" },
  { kind: "command", text: "pnpm dev" },
  { kind: "output", text: "▲ Ready on http://localhost:3000 (sample output)" },
];

export const sampleFlow = [
  { icon: <MousePointerClick />, label: "Visitor signs up", description: "From the form in your hero." },
  { icon: <Database />, label: "Email is stored", description: "In your own database." },
  { icon: <Send />, label: "Welcome goes out", description: "Through your mail provider." },
  { icon: <Rocket />, label: "You launch", description: "To a list that asked for it." },
];

function Wireframe() {
  return (
    <div role="img" aria-label="Sample page as a grey wireframe" className="flex h-72 flex-col items-center justify-center gap-4 bg-muted/40 px-8 pt-8">
      <span className="h-3 w-24 rounded-full bg-muted-foreground/25" />
      <span className="h-7 w-4/5 max-w-sm rounded-md bg-muted-foreground/25" />
      <span className="h-3 w-2/3 rounded-full bg-muted-foreground/15" />
      <span className="h-10 w-32 rounded-md border-2 border-dashed border-muted-foreground/30" />
    </div>
  );
}
function Finished() {
  return (
    <div role="img" aria-label="The same sample page, styled" className="flex h-72 flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%)] px-8 pt-8 text-center">
      <span className="text-xs font-medium text-primary">Sample product</span>
      <span className="text-xl leading-tight font-bold tracking-tight text-balance sm:text-2xl">Know what your users love</span>
      <span className="text-sm text-muted-foreground">Sample copy for a made-up product.</span>
      <span className="mt-1 inline-flex h-10 w-32 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground">Start free</span>
    </div>
  );
}

const frame = "mx-auto max-w-3xl px-4 py-16";

export const STORY_DOCS: Record<string, SectionDoc> = {
  "sticky-showcase": {
    preview: <StickyShowcase title="From signup to launch" description="Sample story for a made-up product." steps={sampleShowcase} />,
    importLine: `import { StickyShowcase } from "@/components/custom/sticky-showcase";`,
    usage: `<StickyShowcase
  title="From signup to launch"
  steps={[
    { label: "Collect", title: "A form that stores every email", description: "…", media: <Screenshot /> },
    { label: "Review", title: "See who joined", description: "…", media: <Screenshot /> },
  ]}
/>`,
    props: [
      { name: "steps", type: "{ title; description; media; label? }[]", required: true, description: "In order. media is any node: an image, a video or a component." },
      { name: "title / description", type: "string", description: "Optional heading (h2) above the steps." },
      ROOT("section"),
    ],
    a11y: [
      "Each step is announced as “Step N of M” with an h3; its media follows it in reading order at every width.",
      "Give each media its own text alternative (alt text or an aria-label).",
    ],
    motion: {
      summary:
        "From the lg breakpoint the media pins to the middle of the screen while the steps scroll past; the step crossing the middle becomes active and the media slides and cross-fades to it. Phones keep each media under its step. Pinning uses position: sticky, so no ancestor may set overflow: hidden (use overflow: clip).",
      preview: <StickyShowcaseMotion title="From signup to launch" description="Sample story for a made-up product." steps={sampleShowcase} />,
      importLine: `import { StickyShowcaseMotion } from "@/components/custom/sticky-showcase/sticky-showcase-motion";`,
      usage: `<StickyShowcaseMotion steps={steps} />`,
    },
  },
  "terminal-demo": {
    preview: (
      <div className={frame}>
        <TerminalDemo label="zsh (sample session)" lines={sampleTerminal} />
      </div>
    ),
    importLine: `import { TerminalDemo } from "@/components/custom/terminal-demo";`,
    usage: `<TerminalDemo
  label="zsh"
  lines={[
    { kind: "command", text: "npx shadcn@latest add https://example.com/r/hero.json" },
    { kind: "output", text: "✔ Created 1 file." },
  ]}
/>`,
    props: [
      { name: "lines", type: `{ kind: "command" | "output"; text: string }[]`, required: true, description: "The transcript, in order." },
      { name: "label", type: "string", default: `"Terminal"`, description: "Window title; also the terminal's accessible name." },
      { name: "prompt", type: "string", default: `"$"`, description: "Shown before each command. Not read aloud and not included when copying." },
      ROOT("div"),
    ],
    a11y: [
      "The transcript is real text in a pre element: selectable, copyable and read in order.",
      "The prompt and window dots are decorative and hidden from screen readers.",
    ],
    motion: {
      summary:
        "Commands are typed and output prints line by line once the window scrolls into view. Pause and replay buttons sit in the title bar. The whole transcript is in the page from the start, so screen readers and copy get all of it and the window never changes height.",
      preview: (
        <div className={frame}>
          <TerminalDemoMotion label="zsh (sample session)" lines={sampleTerminal} />
        </div>
      ),
      importLine: `import { TerminalDemoMotion } from "@/components/custom/terminal-demo/terminal-demo-motion";`,
      usage: `<TerminalDemoMotion lines={lines} />`,
    },
  },
  "device-frame": {
    preview: (
      <div className="grid items-center gap-12 px-4 py-16 sm:px-10 md:grid-cols-[1fr_auto]">
        <DeviceFrame url="example.com/stats">
          <div className="p-4">
            <DemoScreen />
          </div>
        </DeviceFrame>
        <DeviceFrame device="phone">
          <SampleList />
        </DeviceFrame>
      </div>
    ),
    importLine: `import { DeviceFrame } from "@/components/custom/device-frame";`,
    usage: `<DeviceFrame device="browser" url="yourproduct.com">
  <img src={screenshotUrl} alt="The dashboard" />
</DeviceFrame>

<DeviceFrame device="phone">
  <img src={mobileUrl} alt="The mobile app" />
</DeviceFrame>`,
    props: [
      { name: "device", type: `"browser" | "phone"`, default: `"browser"`, description: "Which frame to draw." },
      { name: "url", type: "string", description: "Text in the browser's address bar. Ignored for the phone." },
      { name: "children", type: "ReactNode", required: true, description: "What the device shows: an image, a video or a live component." },
      ROOT("div"),
    ],
    a11y: ["The frame is decoration; give the content its own text alternative.", "Content inside stays interactive: links and buttons in a live component still work."],
    motion: {
      summary:
        "The frame tilts in 3D toward a mouse pointer, a soft highlight follows the pointer and the glow behind shifts the other way; on leave it springs back flat with a little overshoot. There is no tilt on touch screens or for keyboard users, who lose nothing.",
      preview: (
        <div className="grid items-center gap-12 px-4 py-16 sm:px-10 md:grid-cols-[1fr_auto]">
          <DeviceFrameMotion url="example.com/stats">
            <div className="p-4">
              <DemoScreen />
            </div>
          </DeviceFrameMotion>
          <DeviceFrameMotion device="phone">
            <SampleList />
          </DeviceFrameMotion>
        </div>
      ),
      importLine: `import { DeviceFrameMotion } from "@/components/custom/device-frame/device-frame-motion";`,
      usage: `<DeviceFrameMotion device="phone">{children}</DeviceFrameMotion>`,
    },
  },
  "compare-slider": {
    preview: (
      <div className={frame}>
        <CompareSlider beforeLabel="Wireframe" afterLabel="With your theme" before={<Wireframe />} after={<Finished />} />
      </div>
    ),
    importLine: `import { CompareSlider } from "@/components/custom/compare-slider";`,
    usage: `<CompareSlider
  beforeLabel="Before"
  afterLabel="After"
  before={<img src={beforeUrl} alt="The old dashboard" />}
  after={<img src={afterUrl} alt="The new dashboard" />}
/>`,
    props: [
      { name: "before", type: "ReactNode", required: true, description: "Left panel." },
      { name: "after", type: "ReactNode", required: true, description: "Right panel. Give both the same size." },
      { name: "beforeLabel", type: "string", default: `"Before"`, description: "Chip on the before panel; also used in the accessible names." },
      { name: "afterLabel", type: "string", default: `"After"`, description: "Chip on the after panel." },
      ROOT("div"),
    ],
    a11y: [
      "Plain shows both panels side by side as labelled figures, so nothing depends on JavaScript or dragging.",
      "In the motion version the divider is a native range input: arrow keys, Page Up/Down, Home and End move it, and its value is announced as a share of each panel.",
    ],
    motion: {
      summary:
        "The panels overlap and a divider reveals one or the other. Drag anywhere or use the keyboard. A flick carries on a little and settles with a spring, and the divider nudges once when it scrolls into view. Dragging takes the pointer, so keep links out of the panels.",
      extraProps: [{ name: "defaultPosition", type: "number", default: "50", description: "Where the divider starts, 0 to 100 from the left." }],
      preview: (
        <div className={frame}>
          <CompareSliderMotion beforeLabel="Wireframe" afterLabel="With your theme" before={<Wireframe />} after={<Finished />} />
        </div>
      ),
      importLine: `import { CompareSliderMotion } from "@/components/custom/compare-slider/compare-slider-motion";`,
      usage: `<CompareSliderMotion before={before} after={after} defaultPosition={40} />`,
    },
  },
  "flow-beams": {
    preview: <FlowBeams title="How a signup reaches you" description="Sample flow for a made-up product." nodes={sampleFlow} />,
    importLine: `import { FlowBeams } from "@/components/custom/flow-beams";`,
    usage: `<FlowBeams
  title="How it works"
  nodes={[
    { icon: <MousePointerClick />, label: "Visitor signs up", description: "…" },
    { icon: <Database />, label: "Email is stored" },
    { icon: <Rocket />, label: "You launch" },
  ]}
/>`,
    props: [
      { name: "nodes", type: "{ icon: ReactNode; label: string; description? }[]", required: true, description: "3 to 5 read best. Pass icons as rendered elements (<Zap />), not components." },
      { name: "title / description", type: "string", description: "Optional heading (h2) and line under it." },
      ROOT("section"),
    ],
    a11y: ["An ordered list; each node is announced as “Step N” with an h3.", "Icons, connectors and beams are decorative and hidden from screen readers."],
    motion: {
      summary:
        "A beam of light travels from node to node along the connectors and each node glows as it arrives, in a loop. The loop stops when the diagram is off screen and has a pause button.",
      preview: <FlowBeamsMotion title="How a signup reaches you" description="Sample flow for a made-up product." nodes={sampleFlow} />,
      importLine: `import { FlowBeamsMotion } from "@/components/custom/flow-beams/flow-beams-motion";`,
      usage: `<FlowBeamsMotion nodes={nodes} />`,
    },
  },
};
