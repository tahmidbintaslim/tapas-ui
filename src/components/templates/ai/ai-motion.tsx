import { AnnouncementBar } from "@/components/custom/announcement-bar/announcement-bar";
import { ComparisonTable } from "@/components/custom/comparison-table/comparison-table";
import { CtaSplitMotion } from "@/components/custom/cta-split/cta-split-motion";
import { FlowBeamsMotion } from "@/components/custom/flow-beams/flow-beams-motion";
import { FeatureGridMotion } from "@/components/custom/feature-grid/feature-grid-motion";
import { Footer } from "@/components/custom/footer/footer";
import { HeroSpotlightMotion } from "@/components/custom/hero-spotlight/hero-spotlight-motion";
import { IntegrationsGridMotion } from "@/components/custom/integrations-grid/integrations-grid-motion";
import { Navbar } from "@/components/custom/navbar/navbar";
import { PricingTableMotion } from "@/components/custom/pricing-table/pricing-table-motion";
import { mergeContent, type ContentOverrides } from "../merge";
import { AiLayout } from "./ai-layout";
import { aiContent, type AiContent } from "./content";

/** The steps as a flow diagram: a beam travels from step to step. Icons are decorative. */
function StepsFlow({ steps, ...props }: AiContent["steps"] & { id?: string }) {
  return <FlowBeamsMotion {...props} nodes={steps.map(({ title, description, icon }) => ({ label: title, description, icon }))} />;
}

/** The AI product template with motion sections where they exist. */
export function AiTemplateMotion({ content }: { content?: ContentOverrides<AiContent> }) {
  return (
    <AiLayout
      c={mergeContent(aiContent, content)}
      ui={{
        AnnouncementBar,
        Navbar,
        Hero: HeroSpotlightMotion,
        FeatureGrid: FeatureGridMotion,
        Steps: StepsFlow,
        IntegrationsGrid: IntegrationsGridMotion,
        ComparisonTable,
        PricingTable: PricingTableMotion,
        CtaSplit: CtaSplitMotion,
        Footer,
      }}
    />
  );
}
