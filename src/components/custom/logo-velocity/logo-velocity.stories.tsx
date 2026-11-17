import type { Meta, StoryObj } from "@storybook/nextjs";

import { LogoVelocity } from "./logo-velocity";
import { LogoVelocityMotion } from "./logo-velocity-motion";

const meta = {
  title: "Proof and conversion/Logo velocity",
  component: LogoVelocity,
  args: { title: "Works with your stack", logos: ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "TypeScript", "Vercel"].map((name) => ({ name })) },
} satisfies Meta<typeof LogoVelocity>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <LogoVelocityMotion {...args} /> };
