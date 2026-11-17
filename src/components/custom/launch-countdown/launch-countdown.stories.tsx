import type { Meta, StoryObj } from "@storybook/nextjs";

import { LaunchCountdown } from "./launch-countdown";
import { LaunchCountdownMotion } from "./launch-countdown-motion";

const meta = {
  title: "Proof and conversion/Launch countdown",
  component: LaunchCountdown,
  args: { title: "Something new is on the way", description: "Sample copy.", launchDate: "2027-06-01", children: <p className="text-sm text-muted-foreground">Your waitlist form goes here.</p> },
} satisfies Meta<typeof LaunchCountdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <LaunchCountdownMotion {...args} /> };
