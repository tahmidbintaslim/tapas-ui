import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { SpotlightCards } from "./spotlight-cards";
import { SpotlightCardsMotion } from "./spotlight-cards-motion";

const items = [
  { title: "Fast", description: "No runtime.", icon: <svg data-testid="icon" /> },
  { title: "Themed", description: "Uses your tokens." },
];
afterEach(() => mockReducedMotion(false));

describe("SpotlightCards", () => {
  it("renders an h2, and one h3 per card in a list, with decorative icons", () => {
    render(<SpotlightCards title="Why it works" items={items} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Why it works");
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Fast", "Themed"]);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByTestId("icon").parentElement?.getAttribute("aria-hidden")).toBe("true");
  });
  it("renders no list for no items", () => {
    const { container } = render(<SpotlightCards title="x" items={[]} />);
    expect(container.querySelector("ul")).toBeNull();
  });
});

describe("SpotlightCardsMotion", () => {
  it("adds only hidden decoration on top of the plain cards", () => {
    const { container } = render(<SpotlightCardsMotion title="T" items={items} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    const extras = container.querySelectorAll(".pointer-events-none");
    expect(extras.length).toBe(1 + items.length * 2);
    extras.forEach((el) => expect(el.getAttribute("aria-hidden")).toBe("true"));
  });
  it("reduced motion is static: no glow layers, no tilt, no inline animation", () => {
    mockReducedMotion(true);
    const { container } = render(<SpotlightCardsMotion items={items} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(container.querySelector(".pointer-events-none")).toBeNull();
    expect(container.querySelector("[data-slot=spotlight-card]")?.className).not.toContain("perspective");
  });
  it("SSR output is visible", () => {
    const html = renderToString(<SpotlightCardsMotion items={items} />);
    expect(textOf(html)).toContain("Uses your tokens.");
    expect(html).not.toMatch(/opacity:\s*0[;"]/);
  });
});
