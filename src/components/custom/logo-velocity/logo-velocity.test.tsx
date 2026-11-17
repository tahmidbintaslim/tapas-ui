import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { LogoVelocity } from "./logo-velocity";
import { LogoVelocityMotion, copiesFor, rowVelocity } from "./logo-velocity-motion";

const props = { title: "Built with", logos: [{ name: "Northwind" }, { name: "Globex", logo: <svg data-testid="mark" /> }, { name: "Initech" }] };
afterEach(() => mockReducedMotion(false));

describe("LogoVelocity", () => {
  it("lists each logo once, with the name readable when a mark is given", () => {
    render(<LogoVelocity {...props} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Built with");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Globex").className).toContain("sr-only");
    expect(screen.getByTestId("mark").parentElement?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("LogoVelocityMotion", () => {
  it("loop copy is aria-hidden and inert", () => {
    const { container } = render(<LogoVelocityMotion {...props} />);
    const clone = container.querySelector('[data-slot="velocity-clone"]');
    expect(clone?.getAttribute("aria-hidden")).toBe("true");
    expect(clone?.hasAttribute("inert")).toBe(true);
    expect(screen.getAllByText("Northwind")).toHaveLength(2);
  });
  it("pause button toggles aria-pressed", () => {
    render(<LogoVelocityMotion {...props} />);
    const btn = screen.getByRole("button", { name: "Pause scrolling" });
    expect(btn.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });
  it("reduced motion is the static row, with no clone or pause button", () => {
    mockReducedMotion(true);
    const { container } = render(<LogoVelocityMotion {...props} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(screen.getAllByText("Northwind")).toHaveLength(1);
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("SSR output is the visible static row", () => {
    const html = renderToString(<LogoVelocityMotion {...props} />);
    expect(textOf(html)).toContain("Northwind");
    expect(html).not.toMatch(/opacity:\s*0[;"]/);
    expect(html).not.toContain("velocity-clone");
  });
});

describe("row speed", () => {
  it("drifts at the base speed in the last scroll direction when the page is still", () => {
    expect(rowVelocity(36, -1, 0)).toBe(-36);
    expect(rowVelocity(36, 1, 0)).toBe(36);
  });
  it("adds scroll velocity and caps a hard flick", () => {
    expect(rowVelocity(36, -1, -1000)).toBe(-486);
    expect(rowVelocity(36, 1, 99999)).toBe(1436);
  });
  it("repeats the logos until the frame is covered", () => {
    expect(copiesFor(990, 700)).toBe(3);
    expect(copiesFor(990, 0)).toBe(2);
  });
});
