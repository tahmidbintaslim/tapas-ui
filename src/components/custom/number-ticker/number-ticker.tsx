import { cn } from "@/lib/utils";
import React from "react";

export interface TickerStat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  /** Digits after the decimal point */
  decimals?: number;
}

export interface NumberTickerProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: string;
  description?: string;
  stats: TickerStat[];
}

/** Formats a stat the same way on the server and in the browser. */
export function formatTicker(stat: TickerStat) {
  const d = stat.decimals ?? 0;
  return `${stat.prefix ?? ""}${stat.value.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}${stat.suffix ?? ""}`;
}

const cols: Record<number, string> = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

/** Heading, panel and one cell per stat. `renderValue` lets the motion version swap the number. */
export function TickerFrame({
  title,
  description,
  stats,
  className,
  renderValue = formatTicker,
  ...props
}: NumberTickerProps & { renderValue?: (stat: TickerStat, index: number) => React.ReactNode }) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-16", className)} {...props}>
      {title && <h2 className="text-center text-3xl font-bold tracking-tight text-balance">{title}</h2>}
      {description && <p className="mx-auto mt-3 max-w-2xl text-center text-pretty text-muted-foreground">{description}</p>}
      {stats.length > 0 && (
        <div className="relative mt-10 overflow-hidden rounded-2xl border bg-border shadow-sm">
          {/* 1px gaps over the border color draw the dividers at every breakpoint. */}
          <dl className={cn("grid gap-px", cols[stats.length])}>
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex flex-col-reverse gap-2 bg-card px-6 py-9 text-center">
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="text-4xl leading-[1.1] font-semibold tracking-tight tabular-nums sm:text-5xl">{renderValue(stat, i)}</dd>
              </div>
            ))}
          </dl>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_90%_at_50%_0%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent)]"
          />
        </div>
      )}
    </section>
  );
}

/** A row of 2–4 big numbers in one panel. Static; the motion version rolls each digit. */
export function NumberTicker(props: NumberTickerProps) {
  return <TickerFrame {...props} />;
}
