import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { mockReducedMotion, textOf } from "@/test/motion";
import { DotField } from "./dot-field";
import { DotFieldMotion, stepDot } from "./dot-field-motion";

const props = { title: "A quiet grid", description: "Dots that notice.", primaryAction: { label: "Start", href: "/start" } };
afterEach(() => mockReducedMotion(false));

describe("DotField", () => {
  it("renders heading, description and actions over a decorative backdrop", () => {
    const { container } = render(<DotField {...props} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(props.title);
    expect(screen.getByRole("link", { name: "Start" })).toBeTruthy();
    expect(container.querySelector('[data-slot="dot-backdrop"]')?.getAttribute("aria-hidden")).toBe("true");
  });
  it("titleAs h2 keeps the page's single h1 elsewhere", () => {
    render(<DotField {...props} titleAs="h2" />);
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });
});

describe("DotFieldMotion", () => {
  it("server output has the text, the CSS dots and no canvas", () => {
    const html = renderToString(<DotFieldMotion {...props} />);
    expect(textOf(html)).toContain(props.title);
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("opacity-0");
  });
  it("reduced motion keeps the CSS dots: no canvas, no pause button", () => {
    mockReducedMotion(true);
    const { container } = render(<DotFieldMotion {...props} />);
    expect(container.querySelector("canvas")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector('[data-slot="dot-backdrop"]')?.className).not.toContain("opacity-0");
  });
  it("has a hidden canvas and a pause button that toggles", () => {
    const { container } = render(<DotFieldMotion {...props} />);
    expect(container.querySelector('canvas[aria-hidden="true"]')).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Pause background" }));
    expect(screen.getByRole("button", { name: "Play background" }).getAttribute("aria-pressed")).toBe("true");
  });
});

describe("stepDot", () => {
  it("springs to the target, overshooting once on the way", () => {
    let s = 0;
    let v = 0;
    let peak = 0;
    for (let i = 0; i < 240; i++) {
      [s, v] = stepDot(s, v, 1, 1 / 60);
      peak = Math.max(peak, s);
    }
    expect(peak).toBeGreaterThan(1.02);
    expect(peak).toBeLessThan(1.4);
    expect(s).toBeCloseTo(1, 2);
  });
});
