import type { Meta, StoryObj } from "@storybook/nextjs";

import { TestimonialStack } from "./testimonial-stack";
import { TestimonialStackMotion } from "./testimonial-stack-motion";

const meta = {
  title: "Proof and conversion/Testimonial stack",
  component: TestimonialStack,
  args: { title: "What founders say", description: "Sample quotes from fictional people.", items: [{ quote: "We swapped our hero the night before launch and it just worked.", author: "Ana Diaz", role: "Founder (fictional)" }, { quote: "The pricing section took a checkout link and that was that.", author: "Ben Okafor", role: "Indie hacker (fictional)" }, { quote: "It picked up our theme without a single override.", author: "Cy Tanaka", role: "Designer (fictional)" }] },
} satisfies Meta<typeof TestimonialStack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <TestimonialStackMotion {...args} /> };
