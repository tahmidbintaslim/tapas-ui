import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { NumberTicker } from "./number-ticker";

// The row is "in view" as soon as it mounts.
vi.mock("motion/react", async (orig) => ({ ...(await orig<typeof import("motion/react")>()), useInView: () => true }));
const { NumberTickerMotion } = await import("./number-ticker-motion");

const stats = [
  { value: 1280, label: "Sample signups" },
  { value: 99.9, label: "Sample uptime", suffix: "%", decimals: 1 },
];
afterEach(() => mockReducedMotion(false));

describe("NumberTicker", () => {
  it("is a description list with formatted values", () => {
    render(<NumberTicker title="Numbers" stats={stats} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Numbers");
    expect(screen.getByText("Sample signups").tagName).toBe("DT");
    expect(screen.getByText("1,280").tagName).toBe("DD");
    expect(screen.getByText("99.9%")).toBeTruthy();
  });
  it("renders no list for no stats", () => {
    const { container } = render(<NumberTicker stats={[]} />);
    expect(container.querySelector("dl")).toBeNull();
  });
});

describe("NumberTickerMotion", () => {
  it("keeps the real value for screen readers and hides the wheels", () => {
    const { container } = render(<NumberTickerMotion stats={stats} />);
    expect(container.querySelector("dd .sr-only")?.textContent).toBe("1,280");
    const wheels = container.querySelectorAll('[data-slot="ticker-wheel"]');
    // 1,280 has four digits and 99.9 three; separators are not wheels.
    expect(wheels).toHaveLength(7);
    expect(wheels[0].closest("[aria-hidden=true]")).not.toBeNull();
  });
  it("rolls from zero when mounted fresh in view", () => {
    const { container } = render(<NumberTickerMotion stats={stats} />);
    expect(container.querySelector<HTMLElement>('[data-slot="ticker-wheel"]')!.style.transform).not.toContain("-55%");
  });
  it("reduced motion is static text", () => {
    mockReducedMotion(true);
    const { container } = render(<NumberTickerMotion stats={stats} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(container.querySelector('[data-slot="ticker-wheel"]')).toBeNull();
    expect(container.querySelector("dd [aria-hidden=true]")?.textContent).toBe("1,280");
  });
  it("SSR output shows the final numbers", () => {
    const html = renderToString(<NumberTickerMotion stats={stats} />);
    expect(textOf(html)).toContain("1,280");
    expect(html).not.toMatch(/opacity:\s*0[;"]/);
    expect(html).not.toContain("ticker-wheel");
  });
});
