import type { Meta, StoryObj } from "@storybook/nextjs";
import { CompareSlider } from "./compare-slider";
import { CompareSliderMotion } from "./compare-slider-motion";

const panel = "grid h-64 place-items-center text-sm font-medium";
const meta = {
  title: "Product story/Compare slider",
  component: CompareSlider,
  args: {
    className: "mx-auto my-10 max-w-2xl",
    before: <div className={`${panel} bg-muted text-muted-foreground`}>Sample before</div>,
    after: <div className={`${panel} bg-primary text-primary-foreground`}>Sample after</div>,
  },
} satisfies Meta<typeof CompareSlider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <CompareSliderMotion {...args} /> };
