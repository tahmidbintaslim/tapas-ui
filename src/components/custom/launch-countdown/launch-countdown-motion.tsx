"use client";

import { PartyPopper, Pause, Play } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import React from "react";
import { CountdownFrame, launchTime, type LaunchCountdownProps } from "./launch-countdown";

const noop = () => () => {};
const everyTick = (cb: () => void) => {
  // Faster than a second so a late timer never skips a visible second.
  const id = setInterval(cb, 250);
  return () => clearInterval(id);
};
const seconds = () => Math.floor(Date.now() / 1000);

/** Days, hours, minutes and seconds left, each as the text shown in its tile. */
export function timeLeft(targetMs: number, nowSeconds: number) {
  const left = Math.max(0, Math.floor(targetMs / 1000) - nowSeconds);
  const two = (n: number) => String(n).padStart(2, "0");
  return [
    { unit: "Days", text: two(Math.floor(left / 86400)) },
    { unit: "Hours", text: two(Math.floor(left / 3600) % 24) },
    { unit: "Minutes", text: two(Math.floor(left / 60) % 60) },
    { unit: "Seconds", text: two(left % 60) },
  ];
}

/** One tile of the clock. With motion on, a changed digit drops in from above as the old one falls away. */
function Tile({ unit, text, on }: { unit: string; text: string; on: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="relative flex h-16 min-w-16 items-center justify-center overflow-hidden rounded-xl border bg-[linear-gradient(to_bottom,var(--card)_50%,color-mix(in_oklch,var(--muted)_70%,var(--card))_50%)] px-2 text-3xl font-semibold tabular-nums shadow-sm sm:h-24 sm:min-w-24 sm:px-3 sm:text-5xl">
        {on ? (
          <AnimatePresence mode="popLayout" initial={false}>
            {[...text].map((ch, i) => (
              <motion.span
                key={`${text.length - i}${ch}`}
                className="inline-block"
                initial={{ y: "-85%", opacity: 0.001, filter: "blur(3px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "85%", opacity: 0.001, filter: "blur(3px)" }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              >
                {ch}
              </motion.span>
            ))}
          </AnimatePresence>
        ) : (
          text
        )}
      </span>
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{unit}</span>
    </div>
  );
}

/**
 * LaunchCountdown with motion: a live clock counts down to the launch, digit by digit.
 * The server renders the date as text and empty tiles; the clock starts after mount, so
 * there is no hydration mismatch. It ticks until launch, so it has a visible pause button.
 * Once the date has passed, the clock gives way to a "launched" line.
 */
export function LaunchCountdownMotion(props: LaunchCountdownProps) {
  const { launchDate, badge = "Coming soon", launchedBadge = "Live now", launchedMessage = "We have launched. Come and have a look." } = props;
  const reduced = useReducedMotion();
  const [paused, setPaused] = React.useState(false);
  const frozen = React.useRef(0);
  // null on the server and while hydrating; the current second once mounted.
  const now = React.useSyncExternalStore<number | null>(
    paused ? noop : everyTick,
    () => (paused ? frozen.current : seconds()),
    () => null,
  );
  const on = now !== null && !reduced;
  const target = launchTime(launchDate);
  const launched = now !== null && now * 1000 >= target;
  const tiles = timeLeft(target, now ?? 0);

  const clock = Number.isNaN(target) ? null : launched ? (
    <motion.p
      data-slot="launched"
      className="mt-10 inline-flex items-center justify-center gap-2 text-xl font-semibold"
      animate={on ? { scale: [0.9, 1], y: [8, 0] } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 16 }}
    >
      <PartyPopper aria-hidden="true" className="size-5 text-primary" />
      {launchedMessage}
    </motion.p>
  ) : (
    <div className="mt-10 flex flex-col items-center gap-4">
      <div role="timer" aria-label="Time until launch">
        {now !== null && <span className="sr-only">{tiles.map((t) => `${+t.text} ${t.unit.toLowerCase()}`).join(", ")}</span>}
        <div aria-hidden="true" className="flex justify-center gap-2 sm:gap-4">
          {tiles.map((t) => (
            <Tile key={t.unit} unit={t.unit} text={now === null ? "––" : t.text} on={on} />
          ))}
        </div>
      </div>
      {now !== null && (
        <button
          type="button"
          aria-pressed={paused}
          aria-label="Pause countdown"
          onClick={() => {
            frozen.current = seconds();
            setPaused((p) => !p);
          }}
          className="inline-grid size-11 place-items-center rounded-full border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring sm:size-9"
        >
          {paused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
        </button>
      )}
    </div>
  );
  return <CountdownFrame {...props} badge={launched ? launchedBadge : badge} dateLabel={launched ? "Launched" : "Launching"} clock={clock} />;
}
