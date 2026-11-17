import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { TestimonialStack } from "./testimonial-stack";
import { TestimonialStackMotion, isSwipe } from "./testimonial-stack-motion";

const items = ["One", "Two", "Three", "Four"].map((n) => ({ quote: `Quote ${n}`, author: `Author ${n}`, role: "Fictional" }));
afterEach(() => mockReducedMotion(false));
const places = (c: HTMLElement) => [...c.querySelectorAll("li[data-place]")].map((li) => li.getAttribute("data-place")).join("");

describe("TestimonialStack", () => {
  it("lists every quote as a figure with its author", () => {
    render(<TestimonialStack title="Said about it" items={items} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Said about it");
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getAllByRole("figure")).toHaveLength(4);
    expect(screen.getByText("Quote Two").tagName).toBe("BLOCKQUOTE");
  });
  it("renders no list when empty", () => {
    const { container } = render(<TestimonialStack items={[]} />);
    expect(container.querySelector("ul")).toBeNull();
  });
});

describe("TestimonialStackMotion", () => {
  it("keeps every quote in the list, in order", () => {
    render(<TestimonialStackMotion items={items} />);
    expect(screen.getAllByRole("figure").map((f) => f.querySelector("blockquote")!.textContent)).toEqual(items.map((i) => i.quote));
  });
  it("Next and Previous buttons move the top card and the counter", () => {
    const { container } = render(<TestimonialStackMotion items={items} />);
    expect(places(container)).toBe("0123");
    fireEvent.click(screen.getByRole("button", { name: "Next quote" }));
    expect(places(container)).toBe("3012");
    expect(screen.getByText(/of/).parentElement!.textContent).toContain("2");
    fireEvent.click(screen.getByRole("button", { name: "Previous quote" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous quote" }));
    expect(places(container)).toBe("1230");
  });
  it("arrow keys move the deck", () => {
    const { container } = render(<TestimonialStackMotion items={items} />);
    fireEvent.keyDown(screen.getByRole("button", { name: "Next quote" }), { key: "ArrowRight" });
    expect(places(container)).toBe("3012");
    fireEvent.keyDown(screen.getByRole("group"), { key: "ArrowLeft" });
    expect(places(container)).toBe("0123");
  });
  it("reduced motion is the plain grid without controls", () => {
    mockReducedMotion(true);
    const { container } = render(<TestimonialStackMotion items={items} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector("ul")!.className).toContain("grid-cols");
  });
  it("SSR output shows every quote", () => {
    const html = renderToString(<TestimonialStackMotion items={items} />);
    for (const i of items) expect(textOf(html)).toContain(i.quote);
    expect(html).not.toMatch(/opacity:\s*0[;".]/);
  });
});

describe("isSwipe", () => {
  it("needs distance or speed", () => {
    expect(isSwipe(40, 100)).toBe(false);
    expect(isSwipe(-130, 0)).toBe(true);
    expect(isSwipe(30, -800)).toBe(true);
  });
});
