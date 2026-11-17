"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import React from "react";
import { ShowcaseCopy, ShowcaseHeading, type StickyShowcaseProps } from "./sticky-showcase";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

const WIDE = "(min-width: 1024px)";
const subscribeWide = (fn: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", fn);
  return () => mq.removeEventListener("change", fn);
};
/** True from the lg breakpoint, where the media pins beside the steps. */
const useWide = () => React.useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);

const SHOWN = { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };

/**
 * StickyShowcase with motion: from the lg breakpoint the media pins to the middle of the
 * screen while the steps scroll past; the step crossing the middle becomes active and the
 * media slides and cross-fades to it. Phones keep each media under its step. One tree from
 * server to client, and reduced motion gets the plain layout.
 */
export function StickyShowcaseMotion({ title, description, steps, className, ...props }: StickyShowcaseProps) {
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  const pin = useWide() && on;
  const [active, setActive] = React.useState(0);
  const grid = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: grid, offset: ["start center", "end center"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  // The step whose copy crosses the middle of the viewport is the active one.
  React.useEffect(() => {
    if (!on || !grid.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    grid.current.querySelectorAll("[data-step]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [on, steps.length]);

  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-16", className)} {...props}>
      <ShowcaseHeading title={title} description={description} />
      <div
        ref={grid}
        style={{ "--n": steps.length } as React.CSSProperties}
        className={cn(
          "relative grid items-center gap-x-12 gap-y-8 lg:grid-cols-2",
          pin ? "lg:grid-rows-[repeat(var(--n),auto)] lg:gap-y-0" : "lg:gap-y-20",
          (title || description) && "mt-12",
        )}
      >
        <span aria-hidden="true" className="absolute inset-y-0 left-[17px] hidden w-px bg-border lg:block" />
        {on && (
          <motion.span aria-hidden="true" style={{ scaleY }} className="absolute inset-y-0 left-[17px] hidden w-px origin-top bg-primary lg:block" />
        )}
        {steps.map((step, i) => (
          <React.Fragment key={step.title}>
            <div
              data-step={i}
              style={{ "--row": i + 1 } as React.CSSProperties}
              className={cn(pin && "lg:col-start-1 lg:row-[var(--row)] lg:flex lg:min-h-[70svh] lg:flex-col lg:justify-center")}
            >
              <ShowcaseCopy step={step} index={i} count={steps.length} active={on && i === active} />
            </div>
            <div
              data-slot="showcase-media"
              // Keyboard focus inside a faded-out media brings it forward.
              onFocusCapture={() => setActive(i)}
              className={cn(
                "min-w-0 not-last:mb-8 lg:not-last:mb-0",
                pin && "lg:sticky lg:top-0 lg:col-start-2 lg:row-[1/-1] lg:flex lg:h-svh lg:items-center lg:self-start",
                pin && (i === active ? "z-10" : "pointer-events-none"),
              )}
            >
              <motion.div
                className="w-full"
                initial={false}
                animate={
                  !on
                    ? undefined
                    : pin && i !== active
                      ? { opacity: 0, y: i > active ? 36 : -36, scale: 0.96, filter: "blur(6px)" }
                      : SHOWN
                }
                transition={{ type: "spring", stiffness: 170, damping: 24, mass: 0.9 }}
              >
                {step.media}
              </motion.div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
