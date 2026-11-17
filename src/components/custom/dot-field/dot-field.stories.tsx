import type { Meta, StoryObj } from "@storybook/nextjs";
import { DotField } from "./dot-field";
import { DotFieldMotion } from "./dot-field-motion";

const meta = {
  title: "Effects/Dot field",
  component: DotField,
  args: { eyebrow: "Beta", title: "A quiet grid that notices you", description: "Dots swell and brighten around the pointer. Sample copy.", primaryAction: { label: "Get started", href: "#start" } },
} satisfies Meta<typeof DotField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <DotFieldMotion {...args} /> };
