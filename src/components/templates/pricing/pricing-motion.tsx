import { ComparisonTableMotion } from "@/components/custom/comparison-table/comparison-table-motion";
import { CtaBannerMotion } from "@/components/custom/cta-banner/cta-banner-motion";
import { FaqMotion } from "@/components/custom/faq/faq-motion";
import { Footer } from "@/components/custom/footer/footer";
import { HeroMotion } from "@/components/custom/hero/hero-motion";
import { Navbar } from "@/components/custom/navbar/navbar";
import { PriceMorphMotion } from "@/components/custom/price-morph/price-morph-motion";
import { mergeContent, type ContentOverrides } from "../merge";
import { pricingContent, type PricingContent } from "./content";
import { PricingLayout } from "./pricing-layout";

/** The plans as price-morph: digits roll when the period switches; it shows its own "Save N%" so `yearlyNote` is not used. */
function PlansMorph({ plans, yearlyNote: _note, ...props }: PricingContent["pricing"] & { id?: string }) {
  void _note;
  return <PriceMorphMotion {...props} plans={plans.map(({ popular, ...plan }) => ({ ...plan, featured: popular }))} />;
}

/** The pricing template with motion sections; the navbar and footer stay plain. */
export function PricingTemplateMotion({ content }: { content?: ContentOverrides<PricingContent> }) {
  return (
    <PricingLayout
      c={mergeContent(pricingContent, content)}
      ui={{
        Navbar,
        Hero: HeroMotion,
        PricingTable: PlansMorph,
        ComparisonTable: ComparisonTableMotion,
        Faq: FaqMotion,
        CtaBanner: CtaBannerMotion,
        Footer,
      }}
    />
  );
}
