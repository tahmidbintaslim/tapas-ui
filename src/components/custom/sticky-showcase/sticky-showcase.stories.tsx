import type { Meta, StoryObj } from "@storybook/nextjs";
import { sampleShowcase } from "@/app/docs/_content-story";
import { StickyShowcase } from "./sticky-showcase";
import { StickyShowcaseMotion } from "./sticky-showcase-motion";

const meta = {
  title: "Product story/Sticky showcase",
  component: StickyShowcase,
  args: { title: "From signup to launch", steps: sampleShowcase },
} satisfies Meta<typeof StickyShowcase>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <StickyShowcaseMotion {...args} /> };
