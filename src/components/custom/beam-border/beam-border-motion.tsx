"use client";

import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";
import { motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import React from "react";
import { BeamBorderBody, beamFrame, beamStatic, type BeamBorderProps } from "./beam-border";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

/** Degrees per millisecond: one lap every 7 seconds. */
const SPEED = 360 / 7000;
// A comet: a long tail that brightens into a hard head, plus a dimmer echo on the opposite side.
const BEAM =
  "conic-gradient(from 0deg, transparent 0deg 95deg, color-mix(in oklch, var(--primary) 50%, transparent) 172deg, transparent 180deg 245deg, color-mix(in oklch, var(--primary) 55%, transparent) 320deg, var(--primary) 352deg, transparent 360deg)";
// The glow outside only takes the head, so it never reads as a grey shadow.
const HALO = "conic-gradient(from 0deg, transparent 0deg 300deg, var(--primary) 352deg, transparent 360deg)";
// The gradient spins on a square big enough to cover the panel's diagonal.
const SPINNER = "absolute top-1/2 left-1/2 aspect-square w-[220%]";

/**
 * BeamBorder with motion: a beam of light travels around the panel's border and throws a soft
 * glow outside it. It loops, so it has a pause button, stops while off screen, and follows
 * reduced motion (the static gradient border stays).
 */
export function BeamBorderMotion({ eyebrow, title, description, primaryAction, secondaryAction, className, ...props }: BeamBorderProps) {
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  const [paused, setPaused] = React.useState(false);
  const frame = React.useRef<HTMLDivElement>(null);
  const visible = useInView(frame);
  const angle = useMotionValue(0);
  const running = on && visible && !paused;

  // One angle drives both layers, and pausing keeps the beam where it is.
  React.useEffect(() => {
    if (!running) return;
    let id = 0;
    let last = performance.now();
    const tick = (now: number) => {
      angle.set((angle.get() + (now - last) * SPEED) % 360);
      last = now;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [running, angle]);

  const spin = { rotate: angle, x: "-50%", y: "-50%", background: BEAM };
  const halo = { ...spin, background: HALO };
  return (
    <section className={cn("px-4 py-16", className)} {...props}>
      <div ref={frame} className={cn(beamFrame, on ? "bg-border" : beamStatic)}>
        {on && (
          <>
            <span aria-hidden="true" data-slot="beam-glow" className="pointer-events-none absolute -inset-1 -z-20 overflow-hidden rounded-[28px] opacity-40 blur-lg">
              <motion.span className={SPINNER} style={halo} />
            </span>
            <span aria-hidden="true" data-slot="beam" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
              <motion.span className={SPINNER} style={spin} />
            </span>
          </>
        )}
        <BeamBorderBody {...{ eyebrow, title, description, primaryAction, secondaryAction }} />
        {on && (
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [@media(pointer:coarse)]:min-h-11"
          >
            {paused ? <Play aria-hidden className="size-3" /> : <Pause aria-hidden className="size-3" />}
            {paused ? "Play border" : "Pause border"}
          </button>
        )}
      </div>
    </section>
  );
}
