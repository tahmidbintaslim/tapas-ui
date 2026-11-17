import type { Meta, StoryObj } from "@storybook/nextjs";
import { MagneticCta } from "./magnetic-cta";
import { MagneticCtaMotion } from "./magnetic-cta-motion";

const meta = {
  title: "Effects/Magnetic CTA",
  component: MagneticCta,
  args: { title: "Ready when you are", description: "One button, hard to miss. Sample copy.", primaryAction: { label: "Start building", href: "#start" }, secondaryAction: { label: "or read the docs first", href: "#docs" } },
} satisfies Meta<typeof MagneticCta>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <MagneticCtaMotion {...args} /> };
