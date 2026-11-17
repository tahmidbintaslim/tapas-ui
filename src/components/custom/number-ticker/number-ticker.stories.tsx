import type { Meta, StoryObj } from "@storybook/nextjs";

import { NumberTicker } from "./number-ticker";
import { NumberTickerMotion } from "./number-ticker-motion";

const meta = {
  title: "Proof and conversion/Number ticker",
  component: NumberTicker,
  args: { title: "Launch week, in numbers", description: "Sample data.", stats: [{ value: 1280, label: "Waitlist signups (sample)" }, { value: 38.5, label: "Visitor to signup (sample)", suffix: "%", decimals: 1 }, { value: 412, label: "Checkouts (sample)" }] },
} satisfies Meta<typeof NumberTicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <NumberTickerMotion {...args} /> };
