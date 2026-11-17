"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import React from "react";
import { MorphFrame, PeriodUnit, saveBadge, yearlySaving, type BillingPeriod, type MorphPlan, type PriceMorphProps } from "./price-morph";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

const ease = [0.16, 1, 0.3, 1] as const;
// `dir` is 1 when the price goes up (to yearly): new digits rise from below, old ones leave upward.
const digit = {
  enter: (dir: number) => ({ y: `${dir * 70}%`, opacity: 0.001, filter: "blur(6px)" }),
  rest: { y: "0%", opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ y: `${dir * -70}%`, opacity: 0.001, filter: "blur(6px)" }),
};

/** The amount, one slot per character: only the characters that change move, each a beat after the last. */
function MorphPrice({ plan, period, currency }: { plan: MorphPlan; period: BillingPeriod; currency: string }) {
  const amount = period === "monthly" ? plan.monthly : plan.yearly;
  const text = `${currency}${amount}`;
  const dir = period === "yearly" ? 1 : -1;
  const saving = yearlySaving(plan);
  return (
    <>
      <span className="sr-only">
        {text} per {period === "monthly" ? "month" : "year"}
        {period === "yearly" && saving > 0 && `, save ${saving}%`}
      </span>
      <span aria-hidden="true" data-slot="morph-price" className="inline-flex flex-wrap items-baseline gap-x-1 gap-y-2">
        <span className="relative inline-flex shrink-0 overflow-hidden py-1 text-5xl font-semibold tracking-tight tabular-nums">
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            {[...text].map((ch, i) => (
              <motion.span
                key={`${i}${ch}`}
                layout="position"
                custom={dir}
                variants={digit}
                initial="enter"
                animate="rest"
                exit="exit"
                transition={{ duration: 0.45, ease, delay: i * 0.045 }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
          </AnimatePresence>
        </span>
        <motion.span layout="position" transition={{ duration: 0.45, ease }}>
          <PeriodUnit period={period} />
        </motion.span>
        <AnimatePresence initial={false}>
          {period === "yearly" && saving > 0 && (
            <motion.span
              key="save"
              className={`ml-1 inline-flex origin-left self-center ${saveBadge}`}
              initial={{ scale: 0.4, opacity: 0.001, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0.001, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 520, damping: 17, delay: 0.18 }}
            >
              Save {saving}%
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </>
  );
}

/**
 * PriceMorph with motion: switching the period morphs each price digit by digit, the
 * "Save N%" badge pops in on yearly, and a soft light sweeps the featured plan once per switch.
 * One tree from server to client; before JavaScript and with reduced motion the CSS switch does the work.
 */
export function PriceMorphMotion(props: PriceMorphProps) {
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  const [period, setPeriod] = React.useState<BillingPeriod>("monthly");
  const root = React.useRef<HTMLDivElement>(null);
  // The radios work before JavaScript loads: keep whichever period the visitor already picked.
  React.useEffect(() => {
    const picked = root.current?.querySelector<HTMLInputElement>("input[data-period-input]:checked")?.value;
    if (picked === "yearly") setPeriod("yearly");
  }, []);
  return (
    <div ref={root} className="contents">
      <MorphFrame
        {...props}
        period={period}
        onPeriodChange={setPeriod}
        renderPrice={on ? (plan) => <MorphPrice plan={plan} period={period} currency={props.currency ?? "$"} /> : undefined}
        renderGlow={
          on
            ? () => (
                <motion.div
                  key={period}
                  aria-hidden="true"
                  data-slot="morph-sheen"
                  className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-2/3 bg-[linear-gradient(105deg,transparent,color-mix(in_oklch,var(--primary)_22%,transparent),transparent)] blur-xl"
                  initial={{ x: "-110%" }}
                  whileInView={{ x: "170%" }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
                />
              )
            : undefined
        }
      />
    </div>
  );
}
