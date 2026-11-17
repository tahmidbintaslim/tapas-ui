"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeftRight } from "lucide-react";
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import React from "react";
import { compareChip, type CompareSliderProps } from "./compare-slider";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

const clamp = (v: number) => Math.min(100, Math.max(0, v));
const SPRING = { type: "spring", stiffness: 260, damping: 22 } as const;

export interface CompareSliderMotionProps extends CompareSliderProps {
  /** Where the divider starts, 0 to 100 from the left. */
  defaultPosition?: number;
}

/**
 * CompareSlider with motion: the two panels overlap and a divider reveals one or the other.
 * Drag anywhere, or use the keyboard: the divider is a real range input. A flick carries on
 * a little and settles with a spring, and the divider nudges once when it scrolls into view.
 * One tree from server to client; reduced motion gets the side-by-side layout.
 */
export function CompareSliderMotion({ before, after, beforeLabel = "Before", afterLabel = "After", defaultPosition = 50, className, ...props }: CompareSliderMotionProps) {
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  const stage = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = React.useState(defaultPosition);
  const pos = useMotionValue(defaultPosition);
  const clipPath = useMotionTemplate`inset(0 0 0 ${pos}%)`;
  const x = useMotionTemplate`${pos}%`;
  const run = React.useRef<ReturnType<typeof animate>>(null);
  const dragging = React.useRef(false);
  const touched = React.useRef(false);
  const inView = useInView(stage, { once: true, amount: 0.6 });

  // One nudge to show the divider moves; skipped once the visitor has used it.
  React.useEffect(() => {
    if (!on || !inView || touched.current) return;
    const d = pos.get();
    run.current = animate(pos, [d, clamp(d + 9), clamp(d - 6), d], { duration: 1.3, ease: "easeInOut", delay: 0.35 });
    return () => run.current?.stop();
  }, [on, inView, pos]);

  const settle = (to: number, velocity = 0) => {
    run.current?.stop();
    setValue(to);
    run.current = animate(pos, to, { ...SPRING, velocity });
  };
  const follow = (e: React.PointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    pos.set(clamp(((e.clientX - r.left) / r.width) * 100));
  };
  const release = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const v = pos.getVelocity();
    // A flick carries the divider a little further before it settles.
    settle(clamp(pos.get() + v * 0.08), v);
  };

  return (
    <div
      ref={stage}
      role="group"
      aria-label={`${beforeLabel} and ${afterLabel}`}
      onPointerDown={(e) => {
        if (!on || e.button !== 0) return;
        run.current?.stop();
        touched.current = true;
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        follow(e);
      }}
      onPointerMove={(e) => dragging.current && follow(e)}
      onPointerUp={release}
      onPointerCancel={release}
      className={cn(
        on ? "relative grid cursor-ew-resize touch-pan-y overflow-hidden rounded-xl border select-none" : "grid gap-4 sm:grid-cols-2",
        className,
      )}
      {...props}
    >
      <figure className={cn("relative min-w-0 bg-card", on ? "[grid-area:1/1]" : "overflow-hidden rounded-xl border")}>
        <figcaption className={cn(compareChip, "left-3")}>{beforeLabel}</figcaption>
        {before}
      </figure>
      <motion.figure style={on ? { clipPath } : undefined} className={cn("relative min-w-0 bg-card", on ? "[grid-area:1/1]" : "overflow-hidden rounded-xl border")}>
        <figcaption className={cn(compareChip, on ? "right-3" : "left-3")}>{afterLabel}</figcaption>
        {after}
      </motion.figure>
      {on && (
        <>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(value)}
            aria-label={`Divider between ${beforeLabel} and ${afterLabel}`}
            aria-valuetext={`${Math.round(value)}% ${beforeLabel}, ${100 - Math.round(value)}% ${afterLabel}`}
            onChange={(e) => {
              touched.current = true;
              settle(Number(e.target.value));
            }}
            className="peer sr-only top-1/2 left-1/2"
          />
          <motion.div aria-hidden="true" style={{ x }} className="group/handle pointer-events-none absolute inset-0 z-20 peer-focus-visible:[--knob-ring:3px]">
            <span className="absolute inset-y-0 left-0 -ml-px w-0.5 bg-primary shadow-[0_0_12px_color-mix(in_oklch,var(--primary)_60%,transparent)]" />
            <span className="absolute top-1/2 left-0 grid size-11 -translate-1/2 place-items-center rounded-full border bg-background text-foreground shadow-[0_0_0_var(--knob-ring,0px)_var(--ring),0_6px_16px_-4px_color-mix(in_oklch,var(--foreground)_30%,transparent)] transition-shadow">
              <ChevronsLeftRight className="size-4" />
            </span>
          </motion.div>
        </>
      )}
    </div>
  );
}
