"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import React from "react";
import { TickerFrame, formatTicker, type NumberTickerProps, type TickerStat } from "./number-ticker";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

const DIGITS = [...Array(20).keys()].map((n) => n % 10);

/** One odometer wheel: two turns of 0–9 that slide until the digit sits in the window. */
function Wheel({ digit, index, run }: { digit: number; index: number; run: number }) {
  // The wheel stops on its second turn, so a roll always passes a full set of digits.
  const y = `-${(10 + digit) * 5}%`;
  return (
    <span className="inline-block h-[1.1em] overflow-hidden align-bottom [mask-image:linear-gradient(transparent,black_14%,black_86%,transparent)]">
      <motion.span
        key={run}
        data-slot="ticker-wheel"
        className="flex flex-col"
        initial={run ? { y: "0%" } : false}
        animate={{ y }}
        transition={{ type: "spring", stiffness: 42 - Math.min(index, 6) * 3, damping: 13, mass: 1, delay: index * 0.07 }}
      >
        {DIGITS.map((n, i) => (
          <span key={i} className="block h-[1.1em]">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * The real value stays in the DOM for screen readers; the wheels are decorative.
 * A band the visitor could already read at page load keeps its numbers still.
 */
function Rolling({ stat, on, hydrated }: { stat: TickerStat; on: boolean; hydrated: boolean }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [run, setRun] = React.useState(0);
  const onScreenAtLoad = React.useRef(false);
  React.useEffect(() => {
    const r = ref.current?.getBoundingClientRect();
    onScreenAtLoad.current = hydrated && !!r && r.top < window.innerHeight && r.bottom > 0;
  }, [hydrated]);
  React.useEffect(() => {
    if (on && inView && !onScreenAtLoad.current) setRun(1);
  }, [on, inView]);
  const text = formatTicker(stat);
  let wheel = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className="inline-flex">
        {on ? [...text].map((ch, i) => (/\d/.test(ch) ? <Wheel key={i} digit={+ch} index={wheel++} run={run} /> : <span key={i}>{ch}</span>)) : text}
      </span>
    </>
  );
}

/** NumberTicker with motion: each digit rolls into place like an odometer when the row scrolls into view. */
export function NumberTickerMotion(props: NumberTickerProps) {
  const reduced = useReducedMotion();
  const mounted = useMounted();
  // True when this instance came from server HTML (first render was the hydration pass).
  const [hydrated] = React.useState(!mounted);
  const on = mounted && !reduced;
  return <TickerFrame {...props} renderValue={(stat) => <Rolling stat={stat} on={on} hydrated={hydrated} />} />;
}
