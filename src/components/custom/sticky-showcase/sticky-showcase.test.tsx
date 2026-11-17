/* eslint-disable @next/next/no-img-element -- plain img elements stand in for media in tests */
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { StickyShowcase } from "./sticky-showcase";
import { StickyShowcaseMotion } from "./sticky-showcase-motion";

const steps = [
  { title: "Collect", description: "Store every email.", media: <img src="/a.png" alt="The form" /> },
  { title: "Review", description: "See who joined.", media: <img src="/b.png" alt="The list" /> },
];

describe("StickyShowcase", () => {
  it("renders an h2, one h3 per step, and each media after its step", () => {
    const { container } = render(<StickyShowcase title="The story" steps={steps} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("The story");
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Collect", "Review"]);
    expect(container.textContent).toContain("Step 1 of 2");
    const order = [...container.querySelectorAll("h3, img")].map((el) => el.tagName);
    expect(order).toEqual(["H3", "IMG", "H3", "IMG"]);
  });
});
describe("StickyShowcaseMotion", () => {
  it("reduced motion is static", () => {
    mockReducedMotion(true);
    const { container } = render(<StickyShowcaseMotion steps={steps} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });
  it("keeps every media visible below the lg breakpoint", () => {
    const { container } = render(<StickyShowcaseMotion steps={steps} />);
    expect(container.querySelector(".pointer-events-none")).toBeNull();
    for (const el of animatedElements(container)) expect(el.style.opacity).not.toBe("0");
  });
  it("SSR output is visible", () => {
    const html = renderToString(<StickyShowcaseMotion steps={steps} />);
    expect(textOf(html)).toContain("See who joined.");
    expect(html).not.toMatch(/opacity:\s*0[;"]/);
  });
});
