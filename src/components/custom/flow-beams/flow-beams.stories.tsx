import type { Meta, StoryObj } from "@storybook/nextjs";
import { sampleFlow } from "@/app/docs/_content-story";
import { FlowBeams } from "./flow-beams";
import { FlowBeamsMotion } from "./flow-beams-motion";

const meta = {
  title: "Product story/Flow beams",
  component: FlowBeams,
  args: { title: "How a signup reaches you", nodes: sampleFlow },
} satisfies Meta<typeof FlowBeams>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <FlowBeamsMotion {...args} /> };
