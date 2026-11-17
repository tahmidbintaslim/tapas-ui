"use client";

import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import React from "react";
import { cn } from "@/lib/utils";
import { DotFieldBackdrop, DotFieldCopy, dotFieldMask, type DotFieldProps } from "./dot-field";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

const GAP = 22;
const BASE = 1.1;
/** How far the pointer's pull reaches, in CSS pixels. */
const REACH = 130;
const TAU = Math.PI * 2;

/**
 * One step of a dot's spring toward `target`: returns the new [size, velocity].
 * Underdamped on purpose, so dots overshoot a little and settle.
 */
export function stepDot(size: number, velocity: number, target: number, dt: number): [number, number] {
  const v = velocity + ((target - size) * 150 - velocity * 13) * dt;
  return [size + v * dt, v];
}

interface Pointer {
  x: number;
  y: number;
  active: boolean;
}

/** Starts drawing the field into `canvas`; returns a stop function, or null without a 2D context. */
function startField(canvas: HTMLCanvasElement, section: HTMLElement, pointer: Pointer): (() => void) | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  let w = 0;
  let h = 0;
  let xs = new Float32Array(0);
  let ys = new Float32Array(0);
  let size = new Float32Array(0);
  let vel = new Float32Array(0);

  const fit = () => {
    // Capped pixel ratio: dots this small look the same at 2x and 3x.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Centered like the CSS grid, so the two line up when one replaces the other.
    const cols = Math.ceil(w / GAP) + 1;
    const rows = Math.ceil(h / GAP) + 1;
    const ox = (w % GAP) / 2 - GAP / 2;
    const oy = (h % GAP) / 2 - GAP / 2;
    xs = new Float32Array(cols * rows);
    ys = new Float32Array(cols * rows);
    size = new Float32Array(cols * rows);
    vel = new Float32Array(cols * rows);
    for (let i = 0; i < xs.length; i++) {
      xs[i] = ox + (i % cols) * GAP + GAP / 2;
      ys[i] = oy + Math.floor(i / cols) * GAP + GAP / 2;
    }
  };
  const resize = new ResizeObserver(fit);
  resize.observe(canvas);
  fit();

  let fg = "";
  let primary = "";
  let frame = 0;
  let n = 0;
  let idle = 1;
  const t0 = performance.now();
  let last = t0;
  const draw = (now: number) => {
    // Re-read the theme about once a second, so a light/dark switch shows without a restart.
    if (n++ % 60 === 0) {
      const style = getComputedStyle(section);
      fg = style.getPropertyValue("--foreground") || "#888";
      primary = style.getPropertyValue("--primary") || fg;
    }
    const dt = Math.min((now - last) / 1000, 1 / 30);
    const t = (now - t0) / 1000;
    last = now;
    // The idle wave fades out while the pointer is in charge and back in after it leaves.
    idle += ((pointer.active ? 0 : 1) - idle) * Math.min(1, dt * 2.5);

    ctx.clearRect(0, 0, w, h);
    const lit: number[] = [];
    ctx.fillStyle = fg;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    for (let i = 0; i < xs.length; i++) {
      const x = xs[i];
      const y = ys[i];
      let target = 0;
      if (pointer.active) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        target = Math.exp(-(dx * dx + dy * dy) / (REACH * REACH));
      }
      // A slow diagonal crest; cubing the sine keeps most of the field at rest between crests.
      if (idle > 0.01) target += idle * 0.55 * (0.5 + 0.5 * Math.sin(x * 0.011 + y * 0.019 - t * 0.9)) ** 3;
      const [s, v] = stepDot(size[i], vel[i], target, dt);
      size[i] = s;
      vel[i] = v;
      if (s < 0.03) {
        ctx.moveTo(x + BASE, y);
        ctx.arc(x, y, BASE, 0, TAU);
      } else lit.push(i);
    }
    ctx.fill();
    ctx.fillStyle = primary;
    for (const i of lit) {
      const s = size[i];
      ctx.globalAlpha = Math.min(1, 0.3 + s * 0.7);
      ctx.beginPath();
      ctx.arc(xs[i], ys[i], BASE + s * 2.6, 0, TAU);
      ctx.fill();
    }
    frame = requestAnimationFrame(draw);
  };
  frame = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(frame);
    resize.disconnect();
  };
}

/**
 * DotField with motion: dots near the pointer swell and brighten with a springy falloff, and a
 * slow wave crosses the field when no pointer is around. Drawn on one canvas. Pauses off screen,
 * follows reduced motion, and has a pause button.
 */
export function DotFieldMotion({ titleAs, eyebrow, title, description, primaryAction, secondaryAction, className, ...props }: DotFieldProps) {
  const reduced = useReducedMotion();
  const mounted = useMounted();
  const [paused, setPaused] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const section = React.useRef<HTMLElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const pointer = React.useRef<Pointer>({ x: 0, y: 0, active: false });
  const live = mounted && !reduced && !failed;

  React.useEffect(() => {
    if (!live || !section.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(section.current);
    return () => io.disconnect();
  }, [live]);

  React.useEffect(() => {
    if (!live || paused || !visible || !canvas.current || !section.current) return;
    const stop = startField(canvas.current, section.current, pointer.current);
    if (!stop) setFailed(true);
    return stop ?? undefined;
  }, [live, paused, visible]);

  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current.x = e.clientX - r.left;
    pointer.current.y = e.clientY - r.top;
    pointer.current.active = true;
  };

  return (
    <section
      ref={section}
      className={cn("relative isolate overflow-hidden px-4 py-28 text-center", className)}
      onPointerMove={move}
      onPointerLeave={() => (pointer.current.active = false)}
      {...props}
    >
      {/* The canvas replaces the CSS dots once it is drawing; they stay as the fallback. */}
      <DotFieldBackdrop className={live ? "opacity-0" : undefined} />
      {live && (
        <>
          <canvas ref={canvas} aria-hidden="true" data-slot="dot-canvas" className={cn("absolute inset-0 -z-10 size-full", dotFieldMask)} />
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [@media(pointer:coarse)]:min-h-11"
          >
            {paused ? <Play aria-hidden className="size-3" /> : <Pause aria-hidden className="size-3" />}
            {paused ? "Play background" : "Pause background"}
          </button>
        </>
      )}
      <DotFieldCopy {...{ titleAs, eyebrow, title, description, primaryAction, secondaryAction }} />
    </section>
  );
}
