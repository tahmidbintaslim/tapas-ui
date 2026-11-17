import { act, render, screen } from "@testing-library/react";
import { Zap } from "lucide-react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { FlowBeams } from "./flow-beams";
import { FlowBeamsMotion, flowFrame } from "./flow-beams-motion";

const nodes = [
  { icon: <Zap data-testid="icon" />, label: "Sign up", description: "From the form." },
  { icon: <Zap />, label: "Store" },
  { icon: <Zap />, label: "Launch" },
];

describe("FlowBeams", () => {
  it("renders an ordered list of h3 nodes with decorative icons and connectors", () => {
    const { container } = render(<FlowBeams title="How it works" nodes={nodes} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("How it works");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Sign up", "Store", "Launch"]);
    expect(screen.getByTestId("icon").closest('[aria-hidden="true"]')).not.toBeNull();
    const connectors = container.querySelectorAll('[data-slot="flow-connector"]');
    expect(connectors).toHaveLength(2);
    connectors.forEach((c) => expect(c.getAttribute("aria-hidden")).toBe("true"));
    expect(container.querySelector(".stroke-primary")).toBeNull();
  });
});
describe("flowFrame", () => {
  it("sends the beam down one connector at a time and lights the node it reaches", () => {
    const mid = flowFrame(0.5, 3, 3);
    expect(mid.heads[0]).toBeGreaterThan(0);
    expect(mid.heads[1]).toBe(0);
    const end = flowFrame(1.6, 3, 3);
    expect(end.heads[0]).toBe(1.5);
    expect(end.lit[2]).toBe(1);
    expect(end.lit[0]).toBe(0);
  });
  it("lights the first node on both sides of the loop's seam", () => {
    expect(flowFrame(0, 3, 3).lit[0]).toBe(1);
    expect(flowFrame(2.9, 3, 3).lit[0]).toBeGreaterThan(0.5);
  });
});
describe("FlowBeamsMotion", () => {
  it("reduced motion is static: no beams and no pause button", () => {
    mockReducedMotion(true);
    const { container } = render(<FlowBeamsMotion nodes={nodes} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(container.querySelector(".stroke-primary")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("has a pause control for the looping beams", () => {
    const { container } = render(<FlowBeamsMotion nodes={nodes} />);
    expect(container.querySelectorAll(".stroke-primary").length).toBe(4);
    const pause = screen.getByRole("button", { name: "Pause beams" });
    expect(pause.getAttribute("aria-pressed")).toBe("false");
    act(() => pause.click());
    expect(screen.getByRole("button", { name: "Pause beams" }).getAttribute("aria-pressed")).toBe("true");
  });
  it("SSR output is visible", () => {
    const html = renderToString(<FlowBeamsMotion nodes={nodes} />);
    expect(textOf(html)).toContain("From the form.");
    expect(html).not.toMatch(/opacity:\s*0[;"]|stroke-primary/);
  });
});
