"use client";

import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import React from "react";
import { VelocityEntry, type LogoVelocityProps } from "./logo-velocity";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

/** How many copies of the logos fill the container plus the copy sliding in. */
export function copiesFor(containerWidth: number, copyWidth: number) {
  if (copyWidth <= 0) return 2;
  return Math.max(2, Math.ceil(containerWidth / copyWidth) + 1);
}

/**
 * Pixels per second for the row: the resting drift in the last scroll direction,
 * plus a share of the (smoothed) scroll velocity, capped so a flick stays readable.
 */
export function rowVelocity(base: number, direction: 1 | -1, scrollVelocity: number) {
  const boost = Math.max(-1400, Math.min(1400, scrollVelocity * 0.45));
  return base * direction + boost;
}

/**
 * LogoVelocity with motion: the row drifts slowly, speeds up with the page scroll,
 * turns around when the visitor scrolls back up, and eases to a drift again.
 * It pauses on hover, on keyboard focus and with the visible pause button.
 * One tree from server to client: the wrapped row becomes the track after mount.
 */
export function LogoVelocityMotion(props: LogoVelocityProps) {
  const { title, logos, speed = 36, className, ...rest } = props;
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  const [paused, setPaused] = React.useState(false);
  const [held, setHeld] = React.useState(false);
  const [copies, setCopies] = React.useState(2);
  const frame = React.useRef<HTMLDivElement>(null);
  const first = React.useRef<HTMLUListElement>(null);
  const direction = React.useRef<1 | -1>(-1);

  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  // The spring is what makes the row ease back to a drift instead of stopping dead.
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 40, mass: 1.2 });
  const skewX = useTransform(velocity, [-2400, 2400], [7, -7], { clamp: true });

  React.useEffect(() => {
    if (!on || !frame.current || !first.current) return;
    const measure = () => setCopies(copiesFor(frame.current!.clientWidth, first.current!.scrollWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame.current);
    return () => ro.disconnect();
  }, [on, logos]);

  useAnimationFrame((_, delta) => {
    if (!on || paused || held) return;
    const loop = first.current?.scrollWidth ?? 0;
    if (!loop) return;
    const v = velocity.get();
    // Scrolling down sends the row left, scrolling up sends it right.
    if (Math.abs(v) > 40) direction.current = v > 0 ? -1 : 1;
    const next = x.get() + rowVelocity(speed, direction.current, -v) * (Math.min(delta, 64) / 1000);
    // Keep x inside (-loop, 0] so the copies always cover the frame.
    x.set(((next % loop) - loop) % loop);
  });

  const row = "flex shrink-0 items-center gap-3 pr-3";
  return (
    <section className={cn("mx-auto max-w-5xl px-4 py-12 text-center", className)} {...rest}>
      {title && <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{title}</h2>}
      <div
        ref={frame}
        className={cn("mt-6", on && "overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]")}
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        <motion.div className={cn(on && "flex w-max will-change-transform")} style={on ? { x, skewX } : undefined}>
          <ul ref={first} className={on ? row : "flex flex-wrap items-center justify-center gap-3"}>
            {logos.map((item) => (
              <VelocityEntry key={item.name} item={item} />
            ))}
          </ul>
          {on &&
            Array.from({ length: copies - 1 }, (_, c) => (
              <ul key={c} data-slot="velocity-clone" aria-hidden="true" inert className={row}>
                {logos.map((item) => (
                  <VelocityEntry key={item.name} item={item} />
                ))}
              </ul>
            ))}
        </motion.div>
      </div>
      {on && (
        <button
          type="button"
          aria-pressed={paused}
          aria-label="Pause scrolling"
          onClick={() => setPaused((p) => !p)}
          className="mt-4 inline-grid size-11 place-items-center rounded-full border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring sm:size-9"
        >
          {paused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
        </button>
      )}
    </section>
  );
}
