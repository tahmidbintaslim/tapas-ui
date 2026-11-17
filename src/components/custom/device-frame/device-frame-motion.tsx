"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import React from "react";
import { DeviceShell, type DeviceFrameProps } from "./device-frame";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

// Low damping on purpose: the frame overshoots a little as it settles flat.
const TILT = { stiffness: 190, damping: 14, mass: 0.7 };
const FOLLOW = { stiffness: 320, damping: 30 };

/**
 * DeviceFrame with motion: the frame tilts in 3D toward a mouse pointer, a soft highlight
 * follows the pointer across it and the glow behind shifts the other way; on leave it
 * springs back flat. Touch and keyboard users get the static frame and lose nothing.
 */
export function DeviceFrameMotion({ device = "browser", url, children, className, ...props }: DeviceFrameProps) {
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  // Pointer position over the frame, -0.5 to 0.5 from the center.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const near = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, (v) => v * 16), TILT);
  const rotateX = useSpring(useTransform(py, (v) => v * -12), TILT);
  const glowX = useSpring(useTransform(px, (v) => v * -36), TILT);
  const glowY = useSpring(useTransform(py, (v) => v * -28), TILT);
  const glareX = useSpring(gx, FOLLOW);
  const glareY = useSpring(gy, FOLLOW);
  const glare = useSpring(near, { stiffness: 160, damping: 26 });

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!on || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    gx.set(e.clientX - r.left);
    gy.set(e.clientY - r.top);
    near.set(1);
  };
  const leave = () => {
    px.set(0);
    py.set(0);
    near.set(0);
  };

  return (
    <div
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn("relative mx-auto w-full [perspective:1100px]", device === "phone" ? "max-w-[17rem]" : "max-w-3xl", className)}
      {...props}
    >
      {on && (
        <motion.span
          aria-hidden="true"
          style={{ x: glowX, y: glowY, opacity: glare }}
          className="pointer-events-none absolute inset-8 rounded-[3rem] bg-[color-mix(in_oklch,var(--primary)_38%,transparent)] blur-3xl"
        />
      )}
      <motion.div style={on ? { rotateX, rotateY } : undefined} className="relative will-change-transform">
        <DeviceShell
          device={device}
          url={url}
          overlay={
            on && (
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]">
                <motion.span
                  style={{ x: glareX, y: glareY, opacity: glare }}
                  className="absolute top-0 left-0 -mt-[40%] -ml-[40%] block aspect-square w-[80%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_26%,transparent),color-mix(in_oklch,var(--primary)_8%,transparent)_55%,transparent)]"
                />
              </span>
            )
          }
        >
          {children}
        </DeviceShell>
      </motion.div>
    </div>
  );
}
