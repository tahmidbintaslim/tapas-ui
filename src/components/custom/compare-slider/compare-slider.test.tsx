import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { CompareSlider } from "./compare-slider";
import { CompareSliderMotion } from "./compare-slider-motion";

const props = { before: <p>Old page</p>, after: <p>New page</p>, beforeLabel: "Old", afterLabel: "New" };

describe("CompareSlider", () => {
  it("shows both panels as labelled figures in a named group, with no input needed", () => {
    render(<CompareSlider {...props} />);
    expect(screen.getByRole("group", { name: "Old and New" })).toBeTruthy();
    expect(screen.getAllByRole("figure").map((f) => f.querySelector("figcaption")!.textContent)).toEqual(["Old", "New"]);
    expect(screen.queryByRole("slider")).toBeNull();
  });
});
describe("CompareSliderMotion", () => {
  it("reduced motion is the static side-by-side layout", () => {
    mockReducedMotion(true);
    const { container } = render(<CompareSliderMotion {...props} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(screen.queryByRole("slider")).toBeNull();
    expect(screen.getByText("Old page")).toBeTruthy();
  });
  it("SSR output is visible", () => {
    const html = renderToString(<CompareSliderMotion {...props} />);
    expect(textOf(html)).toContain("Old page");
    expect(textOf(html)).toContain("New page");
    expect(html).not.toMatch(/opacity:\s*0[;"]|clip-path/);
  });
  it("is a labelled range input that the keyboard moves", () => {
    render(<CompareSliderMotion {...props} defaultPosition={40} />);
    const slider = screen.getByRole("slider", { name: "Divider between Old and New" }) as HTMLInputElement;
    expect(slider.type).toBe("range");
    expect(slider.value).toBe("40");
    expect(slider.getAttribute("aria-valuetext")).toBe("40% Old, 60% New");
    fireEvent.change(slider, { target: { value: "41" } });
    expect(slider.getAttribute("aria-valuetext")).toBe("41% Old, 59% New");
    // Both panels stay in the page whatever the divider shows.
    expect(screen.getByText("Old page")).toBeTruthy();
    expect(screen.getByText("New page")).toBeTruthy();
  });
});
