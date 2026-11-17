import type { Meta, StoryObj } from "@storybook/nextjs";
import { sampleTerminal } from "@/app/docs/_content-story";
import { TerminalDemo } from "./terminal-demo";
import { TerminalDemoMotion } from "./terminal-demo-motion";

const meta = {
  title: "Product story/Terminal demo",
  component: TerminalDemo,
  args: { label: "zsh (sample session)", lines: sampleTerminal, className: "mx-auto my-10 max-w-2xl" },
} satisfies Meta<typeof TerminalDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <TerminalDemoMotion {...args} /> };
