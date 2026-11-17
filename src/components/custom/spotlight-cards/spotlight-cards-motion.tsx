"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";
import React from "react";
import { SpotlightCardBody, spotlightCols, spotlightFrame, type SpotlightCardsProps } from "./spotlight-cards";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

// The glow trails the pointer a little, so it reads as light rather than a cursor.
const SPRING = { stiffness: 260, damping: 30, mass: 0.6 };
const GRID_GLOW = "radial-gradient(420px circle at calc(var(--x, 50%) + 2rem) calc(var(--y, 50%) + 2rem), color-mix(in oklch, var(--primary) 24%, transparent), transparent 70%)";
const BORDER_GLOW = "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), var(--primary), transparent 72%)";
const FACE_GLOW = "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--primary) 9%, transparent), transparent 70%)";
const FADE = "pointer-events-none absolute opacity-0 transition-opacity duration-500 group-data-[active]/grid:opacity-100";

/**
 * SpotlightCards with motion: a soft glow in your primary color follows the pointer across
 * the grid, each card's border lights up where the pointer is nearest, and cards lean a
 * degree or two toward it. Mouse and pen only; nothing depends on it.
 */
export function SpotlightCardsMotion(props: SpotlightCardsProps) {
  const { title, description, items, columns = 3, className, ...rest } = props;
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  const grid = React.useRef<HTMLDivElement>(null);
  const active = React.useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  // Writes the smoothed pointer position as CSS variables: once for the grid, once per card in the card's own coordinates.
  const paint = () => {
    const g = grid.current;
    if (!g) return;
    const px = sx.get();
    const py = sy.get();
    g.style.setProperty("--x", `${px}px`);
    g.style.setProperty("--y", `${py}px`);
    for (const card of g.querySelectorAll<HTMLElement>("[data-slot=spotlight-card]")) {
      const li = card.parentElement!;
      const cx = (px - li.offsetLeft) / li.offsetWidth - 0.5;
      const cy = (py - li.offsetTop) / li.offsetHeight - 0.5;
      card.style.setProperty("--mx", `${px - li.offsetLeft}px`);
      card.style.setProperty("--my", `${py - li.offsetTop}px`);
      // Tilt fades with distance, so only the cards around the pointer lean.
      const near = active.current ? Math.max(0, 1 - Math.hypot(cx, cy) / 1.2) : 0;
      card.style.setProperty("--ry", `${(Math.max(-1, Math.min(1, cx)) * 5 * near).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(Math.max(-1, Math.min(1, cy)) * -5 * near).toFixed(2)}deg`);
    }
  };
  useMotionValueEvent(sx, "change", paint);
  useMotionValueEvent(sy, "change", paint);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!on || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = e.clientX - r.left;
    const ny = e.clientY - r.top;
    if (!active.current) {
      // Start where the pointer came in instead of sweeping over from the last exit.
      active.current = true;
      e.currentTarget.dataset.active = "";
      sx.jump(nx);
      sy.jump(ny);
    }
    x.set(nx);
    y.set(ny);
    paint();
  };
  const leave = (e: React.PointerEvent<HTMLDivElement>) => {
    active.current = false;
    delete e.currentTarget.dataset.active;
    paint();
  };

  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-16", className)} {...rest}>
      {title && <h2 className="text-center text-3xl font-bold tracking-tight text-balance">{title}</h2>}
      {description && <p className="mx-auto mt-3 max-w-2xl text-center text-pretty text-muted-foreground">{description}</p>}
      {items.length > 0 && (
        <div ref={grid} className="group/grid relative isolate mt-12" onPointerMove={move} onPointerLeave={leave}>
          {on && <div aria-hidden="true" className={cn(FADE, "-inset-8 -z-10 blur-2xl")} style={{ background: GRID_GLOW }} />}
          <ul className={cn("grid gap-4 sm:grid-cols-2", spotlightCols[columns])}>
            {items.map((item, i) => (
              <motion.li
                key={item.title}
                whileInView={on ? { opacity: [0.001, 1], y: [18, 0] } : undefined}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              >
                <div
                  data-slot="spotlight-card"
                  className={cn(
                    spotlightFrame,
                    on && "transition-transform duration-200 ease-out will-change-transform [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
                  )}
                >
                  {on && <span aria-hidden="true" className={cn(FADE, "inset-0 rounded-[inherit]")} style={{ background: BORDER_GLOW }} />}
                  <SpotlightCardBody item={item} />
                  {on && <span aria-hidden="true" className={cn(FADE, "inset-px rounded-[15px]")} style={{ background: FACE_GLOW }} />}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
