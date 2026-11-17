import { CtaBannerMotion } from "@/components/custom/cta-banner/cta-banner-motion";
import { FaqMotion } from "@/components/custom/faq/faq-motion";
import { Footer } from "@/components/custom/footer/footer";
import { HeroSplitMotion } from "@/components/custom/hero-split/hero-split-motion";
import { LogoVelocityMotion } from "@/components/custom/logo-velocity/logo-velocity-motion";
import { Navbar } from "@/components/custom/navbar/navbar";
import { PricingTableMotion } from "@/components/custom/pricing-table/pricing-table-motion";
import { NumberTickerMotion } from "@/components/custom/number-ticker/number-ticker-motion";
import { SpotlightCardsMotion } from "@/components/custom/spotlight-cards/spotlight-cards-motion";
import { TestimonialsWallMotion } from "@/components/custom/testimonials-wall/testimonials-wall-motion";
import { mergeContent, type ContentOverrides } from "../merge";
import { saasContent, type SaasContent } from "./content";
import { SaasLayout } from "./saas-layout";

/** The SaaS template with motion sections where they exist; the rest stay plain. */
export function SaasTemplateMotion({ content }: { content?: ContentOverrides<SaasContent> }) {
  return (
    <SaasLayout
      c={mergeContent(saasContent, content)}
      ui={{
        Navbar,
        Hero: HeroSplitMotion,
        LogoCloud: LogoVelocityMotion,
        FeatureGrid: SpotlightCardsMotion,
        StatsBand: NumberTickerMotion,
        TestimonialsWall: TestimonialsWallMotion,
        PricingTable: PricingTableMotion,
        Faq: FaqMotion,
        CtaBanner: CtaBannerMotion,
        Footer,
      }}
    />
  );
}
