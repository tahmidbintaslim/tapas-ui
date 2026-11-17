import type { Meta, StoryObj } from "@storybook/nextjs";
import { sampleSpotlightCards } from "@/app/docs/_content-fx";
import { SpotlightCards } from "./spotlight-cards";
import { SpotlightCardsMotion } from "./spotlight-cards-motion";

const meta = {
  title: "Effects/Spotlight cards",
  component: SpotlightCards,
  args: { title: "Built for launch day", description: "Sample features.", items: sampleSpotlightCards },
} satisfies Meta<typeof SpotlightCards>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Motion: Story = { render: (args) => <SpotlightCardsMotion {...args} /> };
