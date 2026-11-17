import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { TerminalDemo, type TerminalLine } from "./terminal-demo";
import { TerminalDemoMotion, nextStep } from "./terminal-demo-motion";

const lines: TerminalLine[] = [
  { kind: "command", text: "ls" },
  { kind: "output", text: "a.txt" },
  { kind: "command", text: "pwd" },
];

/** An IntersectionObserver that reports everything as on screen straight away. */
function seeEverything() {
  const Real = window.IntersectionObserver;
  class IO {
    constructor(private cb: IntersectionObserverCallback) {}
    observe(el: Element) {
      this.cb([{ isIntersecting: true, target: el, intersectionRatio: 1 } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }
    unobserve() {}
    disconnect() {}
  }
  window.IntersectionObserver = globalThis.IntersectionObserver = IO as unknown as typeof IntersectionObserver;
  return () => {
    window.IntersectionObserver = globalThis.IntersectionObserver = Real;
  };
}

afterEach(() => vi.useRealTimers());

/** Runs fake time in small steps so each typing step's effect schedules the next. */
const run = (ms: number) => {
  for (let t = 0; t < ms; t += 50) act(() => void vi.advanceTimersByTime(50));
};

describe("TerminalDemo", () => {
  it("is a named group with the whole transcript and a decorative prompt", () => {
    const { container } = render(<TerminalDemo label="zsh" lines={lines} />);
    expect(screen.getByRole("group", { name: "zsh" })).toBeTruthy();
    expect(container.querySelector("pre")!.textContent).toContain("a.txt");
    const prompts = container.querySelectorAll('[data-kind="command"] > [aria-hidden="true"]');
    expect(prompts).toHaveLength(2);
    expect(prompts[0].className).toContain("select-none");
  });
});

describe("nextStep", () => {
  it("types a command a character at a time, then moves to the next line", () => {
    expect(nextStep(lines, { line: 0, char: 0 }).next).toEqual({ line: 0, char: 1 });
    expect(nextStep(lines, { line: 0, char: 2 }).next).toEqual({ line: 1, char: 0 });
  });
  it("prints an output line in one step and waits longer before the next command", () => {
    const { next, delay } = nextStep(lines, { line: 1, char: 0 });
    expect(next).toEqual({ line: 2, char: 0 });
    expect(delay).toBeGreaterThan(nextStep([lines[1], lines[1]], { line: 0, char: 0 }).delay);
  });
});

describe("TerminalDemoMotion", () => {
  it("reduced motion shows the static transcript with no controls", () => {
    mockReducedMotion(true);
    const { container } = render(<TerminalDemoMotion lines={lines} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(container.querySelector(".opacity-0")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("SSR output is visible", () => {
    const html = renderToString(<TerminalDemoMotion lines={lines} />);
    expect(textOf(html)).toContain("a.txt");
    expect(html).not.toMatch(/opacity-0|opacity:\s*0[;"]/);
  });
  it("keeps the whole transcript in the page while typing, pauses and replays", () => {
    const restore = seeEverything();
    vi.useFakeTimers();
    const { container } = render(<TerminalDemoMotion lines={lines} />);
    const pre = container.querySelector("pre")!;
    const hidden = () => container.querySelectorAll('[data-kind].opacity-0').length;
    expect(pre.textContent).toContain("a.txt");
    expect(hidden()).toBe(2);

    const pause = screen.getByRole("button", { name: "Pause typing" });
    act(() => pause.click());
    expect(pause.getAttribute("aria-pressed")).toBe("true");
    run(5000);
    expect(hidden()).toBe(2);

    act(() => pause.click());
    run(5000);
    expect(hidden()).toBe(0);
    expect(pre.textContent).toContain("pwd");

    act(() => screen.getByRole("button", { name: "Replay" }).click());
    expect(hidden()).toBe(2);
    restore();
  });
});
