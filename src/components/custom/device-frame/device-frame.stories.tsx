import type { Meta, StoryObj } from "@storybook/nextjs";
import { DemoScreen } from "@/app/docs/_content-heroes";
import { DeviceFrame } from "./device-frame";
import { DeviceFrameMotion } from "./device-frame-motion";

const meta = {
  title: "Product story/Device frame",
  component: DeviceFrame,
  args: { url: "example.com", className: "my-16", children: <div className="p-4"><DemoScreen /></div> },
} satisfies Meta<typeof DeviceFrame>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Phone: Story = { args: { device: "phone" } };
export const Motion: Story = { render: (args) => <DeviceFrameMotion {...args} /> };
