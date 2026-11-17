import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { mockReducedMotion, textOf } from "@/test/motion";
import { BeamBorder } from "./beam-border";
import { BeamBorderMotion } from "./beam-border-motion";

const props = { eyebrow: "Offer", title: "Ship this weekend", description: "Keep the code.", primaryAction: { label: "Start", href: "/start" }, secondaryAction: { label: "Docs", href: "/docs" } };
afterEach(() => mockReducedMotion(false));

describe("BeamBorder", () => {
  it("renders an h2, the text and both links", () => {
    render(<BeamBorder {...props} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(props.title);
    expect(screen.getByText("Keep the code.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Start" }).getAttribute("href")).toBe("/start");
    expect(screen.getByRole("link", { name: "Docs" })).toBeTruthy();
  });
  it("passes root props to the section", () => {
    const { container } = render(<BeamBorder title="T" id="cta" />);
    expect(container.querySelector("section")?.id).toBe("cta");
  });
});

describe("BeamBorderMotion", () => {
  it("server output has the text, and no beam or button", () => {
    const html = renderToString(<BeamBorderMotion {...props} />);
    expect(textOf(html)).toContain(props.title);
    expect(html).not.toContain("data-slot=\"beam");
    expect(html).not.toContain("<button");
  });
  it("reduced motion keeps the static border: no beam, no pause button", () => {
    mockReducedMotion(true);
    const { container } = render(<BeamBorderMotion {...props} />);
    expect(container.querySelector("[data-slot^=beam]")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("draws a hidden beam and has a pause button that toggles", () => {
    const { container } = render(<BeamBorderMotion {...props} />);
    expect(container.querySelector('[data-slot="beam"][aria-hidden="true"]')).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Pause border" }));
    expect(screen.getByRole("button", { name: "Play border" }).getAttribute("aria-pressed")).toBe("true");
  });
});
