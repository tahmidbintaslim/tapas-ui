import type { Meta, StoryObj } from "@storybook/nextjs";
import { BeamBorder } from "./beam-border";
import { BeamBorderMotion } from "./beam-border-motion";

const meta = {
  title: "Effects/Beam border",
  component: BeamBorder,
  args: { eyebrow: "Sample offer", title: "Ship the landing page this weekend", description: "Copy the sections, keep the code. Sample copy.", primaryAction: { label: "Get started", href: "#start" }, secondaryAction: { label: "Read the docs", href: "#docs" } },
} satisfies Meta<typeof BeamBorder>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <BeamBorderMotion {...args} /> };
