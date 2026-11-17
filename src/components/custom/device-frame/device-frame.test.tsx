/* eslint-disable @next/next/no-img-element -- plain img elements stand in for media in tests */
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { DeviceFrame } from "./device-frame";
import { DeviceFrameMotion } from "./device-frame-motion";

describe("DeviceFrame", () => {
  it("draws a browser with its address and forwards root props", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <DeviceFrame ref={ref} id="shot" url="example.com">
        <img src="/a.png" alt="The dashboard" />
      </DeviceFrame>,
    );
    expect(ref.current?.id).toBe("shot");
    expect(container.querySelector('[data-device="browser"]')).not.toBeNull();
    expect(screen.getByText("example.com")).toBeTruthy();
    expect(screen.getByRole("img", { name: "The dashboard" })).toBeTruthy();
  });
  it("draws a phone without an address bar", () => {
    const { container } = render(<DeviceFrame device="phone" url="example.com">x</DeviceFrame>);
    expect(container.querySelector('[data-device="phone"]')).not.toBeNull();
    expect(screen.queryByText("example.com")).toBeNull();
  });
});
describe("DeviceFrameMotion", () => {
  it("reduced motion is static, with no glare layer", () => {
    mockReducedMotion(true);
    const { container } = render(<DeviceFrameMotion>content</DeviceFrameMotion>);
    expect(animatedElements(container)).toHaveLength(0);
    expect(container.querySelector(".blur-3xl")).toBeNull();
  });
  it("keeps content usable: decorative layers never take the pointer", () => {
    const { container } = render(<DeviceFrameMotion><a href="#x">Open</a></DeviceFrameMotion>);
    expect(screen.getByRole("link", { name: "Open" })).toBeTruthy();
    const layers = container.querySelectorAll('[aria-hidden="true"].absolute.inset-0, .blur-3xl');
    expect(layers.length).toBe(2);
    layers.forEach((l) => expect(l.className).toContain("pointer-events-none"));
  });
  it("SSR output is visible", () => {
    const html = renderToString(<DeviceFrameMotion url="example.com">Server content</DeviceFrameMotion>);
    expect(textOf(html)).toContain("Server content");
    expect(html).not.toMatch(/opacity:\s*0[;"]/);
  });
});
