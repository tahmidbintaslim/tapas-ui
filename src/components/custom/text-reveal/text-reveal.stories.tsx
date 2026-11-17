import type { Meta, StoryObj } from "@storybook/nextjs";
import { TextReveal } from "./text-reveal";
import { TextRevealMotion } from "./text-reveal-motion";

const meta = {
  title: "Effects/Text reveal",
  component: TextReveal,
  args: { eyebrow: "Sample statement", text: "Most launch pages are written in a weekend and never touched again. Ours is built so the form stores the email, the button takes the payment, and the page still reads well a year later." },
} satisfies Meta<typeof TextReveal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <TextRevealMotion {...args} /> };
/** Space above and below, so there is a page to scroll through. */
export const MotionInAPage: Story = {
  render: (args) => (
    <div className="py-[80vh]">
      <TextRevealMotion {...args} />
    </div>
  ),
};
