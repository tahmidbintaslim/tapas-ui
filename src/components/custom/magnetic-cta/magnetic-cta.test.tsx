import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { MagneticCta } from "./magnetic-cta";
import { MagneticCtaMotion, magneticPull } from "./magnetic-cta-motion";

const props = { title: "Ready when you are", description: "One button.", primaryAction: { label: "Start building", href: "/start" }, secondaryAction: { label: "Read the docs", href: "/docs" } };
afterEach(() => mockReducedMotion(false));

describe("MagneticCta", () => {
  it("renders an h2, the text and both links", () => {
    render(<MagneticCta {...props} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(props.title);
    expect(screen.getByRole("link", { name: "Start building" }).getAttribute("href")).toBe("/start");
    expect(screen.getByRole("link", { name: "Read the docs" }).getAttribute("href")).toBe("/docs");
  });
});

describe("MagneticCtaMotion", () => {
  it("keeps the button a plain link with the same name", () => {
    render(<MagneticCtaMotion {...props} />);
    expect(screen.getByRole("link", { name: "Start building" }).getAttribute("href")).toBe("/start");
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("reduced motion is static: no halo, no inline transforms", () => {
    mockReducedMotion(true);
    const { container } = render(<MagneticCtaMotion {...props} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(container.querySelector(".pointer-events-none")).toBeNull();
  });
  it("SSR output is visible", () => {
    const html = renderToString(<MagneticCtaMotion {...props} />);
    expect(textOf(html)).toContain("Start building");
    expect(html).not.toMatch(/opacity:\s*0[;"]/);
  });
});

describe("magneticPull", () => {
  it("pulls toward the pointer inside the field and lets go outside it", () => {
    expect(magneticPull(200, 0, 150)).toEqual([0, 0, 0]);
    const [x, y, near] = magneticPull(60, -30, 150);
    expect(x).toBeGreaterThan(0);
    expect(x).toBeLessThan(60);
    expect(y).toBeLessThan(0);
    expect(near).toBeGreaterThan(0);
    expect(magneticPull(0, 0, 150)).toEqual([0, 0, 1]);
  });
});
