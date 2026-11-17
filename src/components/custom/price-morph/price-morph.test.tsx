import { act, fireEvent, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { PriceMorph, yearlySaving } from "./price-morph";
import { PriceMorphMotion } from "./price-morph-motion";

const plans = [
  { name: "Solo", monthly: 0, yearly: 0, features: ["1 page"], cta: { label: "Start free", href: "/start" } },
  { name: "Pro", monthly: 20, yearly: 192, featured: true, features: ["10 pages"], cta: { label: "Buy Pro", href: "https://pay.example/m", yearlyHref: "https://pay.example/y" } },
];
afterEach(() => mockReducedMotion(false));
const yearly = () => screen.getByRole("radio", { name: /Yearly/ }) as HTMLInputElement;

describe("yearlySaving", () => {
  it("is the whole percent saved against twelve monthly payments", () => {
    expect(yearlySaving({ monthly: 20, yearly: 192 })).toBe(20);
    expect(yearlySaving({ monthly: 0, yearly: 0 })).toBe(0);
    expect(yearlySaving({ monthly: 10, yearly: 130 })).toBe(0);
  });
});

describe("PriceMorph", () => {
  it("is a radio switch with both prices in the DOM and no handlers", () => {
    const { container } = render(<PriceMorph plans={plans} />);
    expect(screen.getByRole("group", { name: "Billing period" })).toBeTruthy();
    expect((screen.getByRole("radio", { name: "Monthly" }) as HTMLInputElement).checked).toBe(true);
    expect(container.querySelectorAll("[data-price]")).toHaveLength(4);
    expect(container.querySelector('li[aria-label="Pro"] [data-period="yearly"]')!.textContent).toContain("Save 20%");
    expect(container.querySelector('li[aria-label="Solo"]')!.textContent).not.toContain("Save");
  });
  it("buttons are links to any href, one per period when a yearly link is given", () => {
    render(<PriceMorph plans={plans} />);
    expect(screen.getAllByRole("link", { name: "Buy Pro" }).map((a) => a.getAttribute("href"))).toEqual(["https://pay.example/m", "https://pay.example/y"]);
    expect(screen.getByRole("link", { name: "Start free" }).getAttribute("href")).toBe("/start");
  });
});

describe("PriceMorphMotion", () => {
  it("switching to yearly shows the yearly price and the save badge", async () => {
    const { container } = render(<PriceMorphMotion plans={plans} />);
    const pro = container.querySelector('li[aria-label="Pro"]')!;
    expect(pro.querySelector(".sr-only")!.textContent).toBe("$20 per month");
    await act(async () => fireEvent.click(yearly()));
    expect(yearly().checked).toBe(true);
    expect(pro.querySelector(".sr-only")!.textContent).toBe("$192 per year, save 20%");
    expect(pro.querySelector('[data-slot="morph-price"]')!.textContent).toContain("Save 20%");
  });
  it("reduced motion keeps the CSS switch and animates nothing", () => {
    mockReducedMotion(true);
    const { container } = render(<PriceMorphMotion plans={plans} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(container.querySelectorAll("[data-price]")).toHaveLength(4);
    fireEvent.click(yearly());
    expect(yearly().checked).toBe(true);
  });
  it("SSR output shows prices", () => {
    const html = renderToString(<PriceMorphMotion plans={plans} />);
    expect(textOf(html)).toContain("$20");
    expect(html).not.toMatch(/opacity:\s*0[;".]/);
  });
  it("keeps a period chosen before hydration", async () => {
    const el = <PriceMorphMotion plans={plans} />;
    const host = document.createElement("div");
    host.innerHTML = renderToString(el);
    document.body.append(host);
    host.querySelector<HTMLInputElement>('input[data-period-input="yearly"]')!.checked = true;
    await act(async () => {
      hydrateRoot(host, el);
    });
    expect(host.querySelector<HTMLInputElement>('input[data-period-input="yearly"]')!.checked).toBe(true);
    expect(host.querySelector('li[aria-label="Pro"] .sr-only')!.textContent).toContain("$192");
    host.remove();
  });
});
