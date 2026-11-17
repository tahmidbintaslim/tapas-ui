import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { animatedElements, mockReducedMotion } from "@/test/motion";
import { TextReveal } from "./text-reveal";
import { TextRevealMotion } from "./text-reveal-motion";

const text = "Built to be read, one word at a time.";
afterEach(() => mockReducedMotion(false));

describe("TextReveal", () => {
  it("renders the statement as one paragraph, with an optional label", () => {
    const { container } = render(<TextReveal eyebrow="Why" text={text} />);
    expect(screen.getByText(text).tagName).toBe("P");
    expect(screen.getByText("Why")).toBeTruthy();
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });
});

describe("TextRevealMotion", () => {
  it("gives screen readers the sentence once and hides the per-word copy", () => {
    const { container } = render(<TextRevealMotion text={text} />);
    expect(container.querySelector(".sr-only")?.textContent).toBe(text);
    const words = container.querySelector('[aria-hidden="true"]')!;
    expect(words.querySelectorAll("span")).toHaveLength(9);
    expect(words.textContent?.trim()).toBe(text);
  });
  it("reduced motion is static: every word at full strength", () => {
    mockReducedMotion(true);
    const { container } = render(<TextRevealMotion text={text} />);
    expect(animatedElements(container)).toHaveLength(0);
  });
  it("SSR output is at full strength", () => {
    const html = renderToString(<TextRevealMotion text={text} />);
    expect(html).toContain(text);
    expect(html).not.toContain("opacity");
  });
});
