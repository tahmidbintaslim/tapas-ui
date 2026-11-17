"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import React from "react";
import { MagneticCtaBackdrop, magneticBand, magneticButton, magneticLink, type MagneticCtaProps } from "./magnetic-cta";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

// Loose enough to wobble once when the pointer lets go.
const SPRING = { stiffness: 190, damping: 13, mass: 0.6 };
/** How far past the button's edge the pull reaches, in CSS pixels. */
const FIELD = 110;

/**
 * Where the button should sit for a pointer at (dx, dy) from its resting center: pulled toward
 * the pointer, strongest part-way in and zero at the edge of the field. Returns [x, y, nearness 0-1].
 */
export function magneticPull(dx: number, dy: number, radius: number): [number, number, number] {
  const d = Math.hypot(dx, dy);
  if (d >= radius) return [0, 0, 0];
  const near = 1 - (d / radius) ** 2;
  return [dx * 0.42 * near, dy * 0.42 * near, near];
}

/**
 * MagneticCta with motion: inside a radius around it, the button is pulled toward the pointer on a
 * spring, its label a little further, and it squashes when pressed. Mouse and pen only; with
 * touch, keyboard or reduced motion it is a normal button.
 */
export function MagneticCtaMotion({ title, description, primaryAction, secondaryAction, className, ...props }: MagneticCtaProps) {
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  const button = React.useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);
  const near = useSpring(useMotionValue(0), { stiffness: 220, damping: 26 });
  // The label rides a third further than the button, which reads as depth.
  const labelX = useTransform(x, (v) => v * 0.32);
  const labelY = useTransform(y, (v) => v * 0.32);
  const haloScale = useTransform(near, [0, 1], [0.6, 1]);

  const release = () => {
    x.set(0);
    y.set(0);
    near.set(0);
  };
  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (!on || e.pointerType === "touch" || !button.current) return;
    const r = button.current.getBoundingClientRect();
    // Measure from the resting center: the rect already includes the current pull.
    const dx = e.clientX - (r.left + r.width / 2 - x.get());
    const dy = e.clientY - (r.top + r.height / 2 - y.get());
    const [tx, ty, n] = magneticPull(dx, dy, Math.max(r.width, r.height) / 2 + FIELD);
    x.set(tx);
    y.set(ty);
    near.set(n);
  };

  return (
    <section className={cn("px-4 py-16", className)} onPointerMove={move} onPointerLeave={release} {...props}>
      <div className={magneticBand}>
        <MagneticCtaBackdrop />
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h2>
        {description && <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-muted-foreground">{description}</p>}
        <div className="mt-10 flex flex-col items-center gap-3">
          <span className="relative inline-flex">
            {on && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-10 -inset-y-12 -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_32%,transparent),transparent)] blur-md"
                style={{ opacity: near, scale: haloScale, x: labelX, y: labelY }}
              />
            )}
            <Button asChild size="lg" className={magneticButton}>
              <motion.a
                ref={button}
                href={primaryAction.href}
                style={on ? { x, y } : undefined}
                whileTap={on ? { scaleX: 1.05, scaleY: 0.9 } : undefined}
                transition={{ type: "spring", stiffness: 500, damping: 16 }}
              >
                <motion.span className="inline-block" style={on ? { x: labelX, y: labelY } : undefined}>
                  {primaryAction.label}
                </motion.span>
              </motion.a>
            </Button>
          </span>
          {secondaryAction && (
            <a href={secondaryAction.href} className={magneticLink}>
              {secondaryAction.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
