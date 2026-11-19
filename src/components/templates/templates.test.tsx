import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiTemplate } from "./ai/ai";
import { AiTemplateMotion } from "./ai/ai-motion";
import { ChangelogTemplate } from "./changelog/changelog";
import { ChangelogTemplateMotion } from "./changelog/changelog-motion";
import { MobileAppTemplate } from "./mobile-app/mobile-app";
import { MobileAppTemplateMotion } from "./mobile-app/mobile-app-motion";
import { PricingTemplate } from "./pricing/pricing";
import { PricingTemplateMotion } from "./pricing/pricing-motion";
import { SaasTemplate } from "./saas/saas";
import { SaasTemplateMotion } from "./saas/saas-motion";
import { WaitlistTemplate } from "./waitlist/waitlist";
import { WaitlistTemplateMotion } from "./waitlist/waitlist-motion";

const cases = [
  ["saas", SaasTemplate, SaasTemplateMotion],
  ["waitlist", WaitlistTemplate, WaitlistTemplateMotion],
  ["ai", AiTemplate, AiTemplateMotion],
  ["pricing", PricingTemplate, PricingTemplateMotion],
  ["changelog", ChangelogTemplate, ChangelogTemplateMotion],
  ["mobile-app", MobileAppTemplate, MobileAppTemplateMotion],
] as const;

describe.each(cases)("%s template", (_, Plain, Motion) => {
  it("renders exactly one h1", () => {
    render(<Plain />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
  it("motion version also renders exactly one h1", () => {
    render(<Motion />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
  it("content prop overrides copy", () => {
    render(<Plain content={{ hero: { title: "My own headline" } }} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("My own headline");
  });
  it("motion version takes content overrides too", () => {
    render(<Motion content={{ hero: { title: "My own headline" } }} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("My own headline");
  });
  it("has a main landmark", () => {
    render(<Plain />);
    expect(screen.getByRole("main")).toBeTruthy();
  });
});

describe("motion flag swaps in motion sections", () => {
  it("saas motion's drifting testimonials wall and logo row each have a pause control", () => {
    render(<SaasTemplateMotion />);
    expect(screen.getAllByRole("button", { name: "Pause scrolling" })).toHaveLength(2);
  });
  it("saas plain has no motion-only controls", () => {
    render(<SaasTemplate />);
    expect(screen.queryByRole("button", { name: "Pause scrolling" })).toBeNull();
  });
  it("mobile-app motion frames the hero shot in a phone and keeps every quote", () => {
    const { container, unmount } = render(<MobileAppTemplateMotion />);
    expect(container.querySelector('[data-device="phone"]')).toBeTruthy();
    expect(screen.getByRole("img", { name: "Sample app screen: today's habits" })).toBeTruthy();
    expect(screen.getByText(/only reason I still drink water/)).toBeTruthy();
    unmount();
    const plain = render(<MobileAppTemplate />);
    expect(plain.container.querySelector("[data-device]")).toBeNull();
  });
  it("pricing motion uses price-morph with the same plans and checkout links", () => {
    render(<PricingTemplateMotion />);
    expect(screen.getByRole("group", { name: "Billing period" })).toBeTruthy();
    for (const name of ["Free", "Pro", "Business"]) expect(screen.getByRole("listitem", { name })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Contact sales" }).getAttribute("href")).toBe("#contact");
  });
  it("waitlist motion adds a labelled sample countdown and keeps the form", () => {
    const { unmount } = render(<WaitlistTemplateMotion />);
    expect(screen.getByText("Sample launch date")).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Email address" }).closest("form")?.getAttribute("action")).toBe("#join");
    unmount();
    render(<WaitlistTemplate />);
    expect(screen.queryByText("Sample launch date")).toBeNull();
  });
  it("saas motion uses spotlight cards and the velocity logo row", () => {
    render(<SaasTemplateMotion />);
    expect(screen.getByRole("heading", { level: 3, name: "One script" })).toBeTruthy();
    expect(screen.getAllByText("Northwind").length).toBeGreaterThan(0);
  });
  it("ai motion draws the steps as a flow", () => {
    const { container } = render(<AiTemplateMotion />);
    expect(container.querySelectorAll('[data-slot="flow-node"]')).toHaveLength(3);
    expect(screen.getByText("Connect your docs")).toBeTruthy();
  });
  it("pricing and changelog render their key sections", () => {
    render(<PricingTemplate />);
    expect(screen.getByRole("table", { name: /plans compared/ })).toBeTruthy();
    render(<ChangelogTemplate />);
    expect(screen.getByRole("heading", { level: 2, name: "Recent releases" })).toBeTruthy();
  });
});

describe("template sample content", () => {
  it("labels made-up logo and customer names as samples", async () => {
    const { saasContent } = await import("./saas/content");
    expect(saasContent.logos.title.toLowerCase()).toContain("sample");
  });
  it("labels new templates' quotes, posts and prices as samples", async () => {
    const { mobileAppContent } = await import("./mobile-app/content");
    const { changelogContent } = await import("./changelog/content");
    const { pricingContent } = await import("./pricing/content");
    expect(mobileAppContent.testimonials.description.toLowerCase()).toContain("sample");
    expect(changelogContent.blog.description.toLowerCase()).toContain("sample");
    expect(pricingContent.pricing.description.toLowerCase()).toContain("sample");
  });
});
