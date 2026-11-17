"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import React from "react";
import { TextRevealEyebrow, revealText, type TextRevealProps } from "./text-reveal";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

// The word being read takes a tint of the primary color, then settles to the text color.
const TINT = "color-mix(in oklch, var(--primary) calc(var(--k) * 100%), currentColor)";

function Word({ children, i, n, progress, on }: { children: string; i: number; n: number; progress: MotionValue<number>; on: boolean }) {
  // Each word brightens over one and a half slots, so neighbours overlap; the last tint ends exactly at 1.
  const start = i / (n + 3);
  const lit = (i + 1.5) / (n + 3);
  const opacity = useTransform(progress, [start, lit], [0.22, 1]);
  const k = useTransform(progress, [start, lit, (i + 4) / (n + 3)], [0, 1, 0]);
  return <motion.span style={on ? ({ opacity, "--k": k, color: TINT } as MotionStyle) : undefined}>{children}</motion.span>;
}

/**
 * TextReveal with motion: words go from dim to full strength as the reader scrolls through the
 * paragraph, with a tint of the primary color on the word being read. Screen readers get the
 * plain sentence once; with reduced motion, or before JavaScript runs, the text is at full strength.
 */
export function TextRevealMotion({ eyebrow, text, className, ...props }: TextRevealProps) {
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  const ref = React.useRef<HTMLParagraphElement>(null);
  // Starts as the paragraph enters the lower part of the screen, done before it passes the middle.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <section className={cn("mx-auto max-w-4xl px-4 py-24", className)} {...props}>
      {eyebrow && <TextRevealEyebrow>{eyebrow}</TextRevealEyebrow>}
      <p ref={ref} className={revealText}>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {words.map((word, i) => (
            <React.Fragment key={i}>
              <Word i={i} n={words.length} progress={progress} on={on}>
                {word}
              </Word>{" "}
            </React.Fragment>
          ))}
        </span>
      </p>
    </section>
  );
}
