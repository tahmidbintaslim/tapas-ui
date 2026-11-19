import { CtaSplitMotion } from "@/components/custom/cta-split/cta-split-motion";
import { DeviceFrameMotion } from "@/components/custom/device-frame/device-frame-motion";
import { FeatureRowsMotion } from "@/components/custom/feature-rows/feature-rows-motion";
import { Footer } from "@/components/custom/footer/footer";
import { HeroSplitMotion } from "@/components/custom/hero-split/hero-split-motion";
import { NavbarFloatingMotion } from "@/components/custom/navbar-floating/navbar-floating-motion";
import { TestimonialStackMotion } from "@/components/custom/testimonial-stack/testimonial-stack-motion";
import { mergeContent, type ContentOverrides } from "../merge";
import { mobileAppContent, type MobileAppContent } from "./content";
import { MobileAppLayout } from "./mobile-app-layout";

/** The mobile app template with motion sections where they exist; the rest stay plain. */
export function MobileAppTemplateMotion({ content }: { content?: ContentOverrides<MobileAppContent> }) {
  return (
    <MobileAppLayout
      c={mergeContent(mobileAppContent, content)}
      ui={{
        Navbar: NavbarFloatingMotion,
        Hero: HeroSplitMotion,
        FeatureRows: FeatureRowsMotion,
        TestimonialsWall: TestimonialStackMotion,
        PhoneFrame: DeviceFrameMotion,
        CtaSplit: CtaSplitMotion,
        Footer,
      }}
    />
  );
}
