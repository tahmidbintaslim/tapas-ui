import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { animatedElements, mockReducedMotion, textOf } from "@/test/motion";
import { LaunchCountdown, formatLaunch } from "./launch-countdown";
import { LaunchCountdownMotion, timeLeft } from "./launch-countdown-motion";

const props = { title: "Sample launch", launchDate: "2027-03-01" };
const form = (
  <form action="#w">
    <button>Join</button>
  </form>
);
beforeEach(() => {
  vi.useFakeTimers();
  // 1 day, 2 hours, 3 minutes and 4 seconds before the launch.
  vi.setSystemTime(new Date("2027-02-27T21:56:56Z"));
});
afterEach(() => {
  vi.useRealTimers();
  mockReducedMotion(false);
});
const timerText = () => screen.getByRole("timer").querySelector(".sr-only")!.textContent;

describe("LaunchCountdown", () => {
  it("shows the date as text in a time element, and the form", () => {
    render(<LaunchCountdown {...props}>{form}</LaunchCountdown>);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Sample launch");
    const time = screen.getByText("March 1, 2027");
    expect(time.tagName).toBe("TIME");
    expect(time.getAttribute("datetime")).toBe("2027-03-01");
    expect(screen.getByRole("button", { name: "Join" })).toBeTruthy();
    expect(screen.queryByRole("timer")).toBeNull();
  });
  it("formats in UTC, and passes an unreadable date through", () => {
    expect(formatLaunch("2027-03-01T23:30:00-05:00")).toBe("March 2, 2027");
    expect(formatLaunch("soon")).toBe("soon");
  });
});

describe("timeLeft", () => {
  it("splits the remaining time and stops at zero", () => {
    expect(timeLeft(90061000, 0).map((t) => t.text)).toEqual(["01", "01", "01", "01"]);
    expect(timeLeft(0, 50).map((t) => t.text)).toEqual(["00", "00", "00", "00"]);
  });
});

describe("LaunchCountdownMotion", () => {
  it("server renders the date and empty tiles, never a time of day", () => {
    const html = renderToString(<LaunchCountdownMotion {...props}>{form}</LaunchCountdownMotion>);
    expect(textOf(html)).toContain("Launching March 1, 2027");
    expect(textOf(html)).not.toMatch(/\d\dHours/);
    expect(html).not.toMatch(/opacity:\s*0[;".]/);
  });
  it("ticks after mount and reads the time left to screen readers", () => {
    render(<LaunchCountdownMotion {...props}>{form}</LaunchCountdownMotion>);
    expect(timerText()).toBe("1 days, 2 hours, 3 minutes, 4 seconds");
    act(() => void vi.advanceTimersByTime(2000));
    expect(timerText()).toBe("1 days, 2 hours, 3 minutes, 2 seconds");
  });
  it("pause button stops the clock and resume catches up", () => {
    render(<LaunchCountdownMotion {...props} />);
    const btn = screen.getByRole("button", { name: "Pause countdown" });
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
    act(() => void vi.advanceTimersByTime(3000));
    expect(timerText()).toContain("4 seconds");
    fireEvent.click(btn);
    expect(timerText()).toContain("1 seconds");
  });
  it("shows the launched state once the date has passed", () => {
    vi.setSystemTime(new Date("2027-03-02T00:00:00Z"));
    render(<LaunchCountdownMotion {...props}>{form}</LaunchCountdownMotion>);
    expect(screen.queryByRole("timer")).toBeNull();
    expect(screen.queryByRole("button", { name: "Pause countdown" })).toBeNull();
    expect(screen.getByText("Live now")).toBeTruthy();
    expect(screen.getByText(/We have launched/)).toBeTruthy();
    expect(screen.getByText("March 1, 2027").parentElement!.textContent).toContain("Launched");
  });
  it("reduced motion ticks as plain text", () => {
    mockReducedMotion(true);
    const { container } = render(<LaunchCountdownMotion {...props} />);
    expect(animatedElements(container)).toHaveLength(0);
    expect(timerText()).toContain("4 seconds");
  });
});
