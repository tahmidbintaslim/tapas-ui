import type { Meta, StoryObj } from "@storybook/nextjs";

import { PriceMorph } from "./price-morph";
import { PriceMorphMotion } from "./price-morph-motion";

const meta = {
  title: "Proof and conversion/Price morph",
  component: PriceMorph,
  args: { title: "Simple pricing", description: "Sample plans.", plans: [{ name: "Solo", description: "For one product", monthly: 9, yearly: 84, features: ["1 site", "Email support"], cta: { label: "Choose Solo", href: "#solo" } }, { name: "Studio", description: "For several launches", monthly: 29, yearly: 276, featured: true, features: ["10 sites", "Priority support"], cta: { label: "Choose Studio", href: "#studio" } }] },
} satisfies Meta<typeof PriceMorph>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <PriceMorphMotion {...args} /> };
