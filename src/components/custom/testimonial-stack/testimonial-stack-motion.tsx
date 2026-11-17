"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from "motion/react";
import React from "react";
import { StackCard, StackHeading, stackGrid, type StackTestimonial, type TestimonialStackProps } from "./testimonial-stack";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

/** Cards visible in the deck; the rest wait, faded out, behind them. */
const DEPTH = 3;
const spring = { type: "spring", stiffness: 260, damping: 26 } as const;

/** True when a release should send the top card away: far enough, or flicked fast enough. */
export function isSwipe(offset: number, velocity: number) {
  return Math.abs(offset) > 110 || Math.abs(velocity) > 550;
}

function DeckCard({
  item,
  place,
  count,
  on,
  side,
  onSwipe,
}: {
  item: StackTestimonial;
  /** 0 is the top card, 1 the one behind it, and so on. */
  place: number;
  count: number;
  on: boolean;
  /** Which side the last card left from (1 right, -1 left). */
  side: 1 | -1;
  onSwipe: (side: 1 | -1) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-320, 320], [-9, 9]);
  const was = React.useRef(place);
  React.useEffect(() => {
    const from = was.current;
    was.current = place;
    if (!on || from === place || count < 2) return;
    // Top card going to the back, or the back card returning to the top: swing out to the side and tuck in.
    const wrapped = (from === 0 && place === count - 1) || (from === count - 1 && place === 0);
    const controls = wrapped
      ? animate(x, [x.get(), side * 340, 0], { duration: 0.62, times: [0, 0.42, 1], ease: [[0.3, 0, 0.6, 1], [0.16, 1, 0.3, 1]] })
      : animate(x, 0, spring);
    return () => controls.stop();
  }, [place, on, count, side, x]);

  const top = place === 0;
  const shown = Math.min(place, DEPTH - 1);
  return (
    <motion.li
      data-place={place}
      className={cn(on && "col-start-1 row-start-1 origin-top", on && top && "cursor-grab touch-pan-y active:cursor-grabbing")}
      style={on ? { x, rotate, zIndex: count - place } : undefined}
      animate={on ? { scale: 1 - shown * 0.055, y: shown * -16, opacity: place < DEPTH ? 1 : 0.001 } : undefined}
      transition={spring}
      drag={on && top && count > 1 ? "x" : false}
      dragMomentum={false}
      onDragEnd={(_: unknown, info: PanInfo) => {
        if (isSwipe(info.offset.x, info.velocity.x)) onSwipe(info.offset.x > 0 ? 1 : -1);
        else animate(x, 0, spring);
      }}
    >
      <StackCard item={item} className={cn(on && "shadow-lg select-none", on && !top && "shadow-md")} />
    </motion.li>
  );
}

/**
 * TestimonialStack with motion: quotes sit in a deck. Drag or swipe the top card away,
 * or use the Previous/Next buttons or the arrow keys; the cards behind spring forward.
 * Every quote stays in the list for screen readers. One tree from server to client:
 * the grid becomes the deck after mount.
 */
export function TestimonialStackMotion(props: TestimonialStackProps) {
  const { title, description, items, className, ...rest } = props;
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced && items.length > 1;
  const [index, setIndex] = React.useState(0);
  const [side, setSide] = React.useState<1 | -1>(1);
  const count = items.length;
  const go = (step: 1 | -1, to: 1 | -1 = step) => {
    setSide(to);
    setIndex((i) => (i + step + count) % count);
  };
  const control =
    "inline-grid size-11 place-items-center rounded-full border bg-background text-foreground shadow-xs transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-16", on && "overflow-x-clip", className)} {...rest}>
      <StackHeading title={title} description={description} />
      {count > 0 && (
        <div
          role="group"
          aria-label={title ?? "Testimonials"}
          onKeyDown={(e) => {
            if (!on) return;
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
        >
          <ul className={on ? "mx-auto mt-14 grid max-w-xl" : stackGrid}>
            {items.map((item, i) => (
              <DeckCard
                key={item.author + item.quote}
                item={item}
                place={(i - index + count) % count}
                count={count}
                on={on}
                side={side}
                onSwipe={(to) => go(1, to)}
              />
            ))}
          </ul>
          {on && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button type="button" aria-label="Previous quote" onClick={() => go(-1)} className={control}>
                <ChevronLeft aria-hidden="true" className="size-4" />
              </button>
              <p aria-live="polite" className="min-w-14 text-center text-sm text-muted-foreground tabular-nums">
                {index + 1} <span aria-hidden="true">/</span>
                <span className="sr-only">of</span> {count}
              </p>
              <button type="button" aria-label="Next quote" onClick={() => go(1)} className={control}>
                <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
