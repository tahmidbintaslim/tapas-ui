import { cn } from "@/lib/utils";
import React from "react";

export interface SpotlightCard {
  title: string;
  description: string;
  /** A rendered icon such as `<Zap />`. Decorative: it is hidden from screen readers. */
  icon?: React.ReactNode;
}

export interface SpotlightCardsProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: string;
  description?: string;
  items: SpotlightCard[];
  /** Columns from the lg breakpoint */
  columns?: 2 | 3;
}

export const spotlightCols = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3" } as const;

/** The card's 1px frame: a gradient that catches your primary color at two corners. */
export const spotlightFrame =
  "relative h-full rounded-[16px] p-px bg-[linear-gradient(145deg,color-mix(in_oklch,var(--primary)_55%,var(--border)),var(--border)_35%,var(--border)_70%,color-mix(in_oklch,var(--primary)_28%,var(--border)))]";

/** Icon, title and text on the card surface. Shared by the plain and motion versions. */
export function SpotlightCardBody({ item }: { item: SpotlightCard }) {
  return (
    <div className="relative h-full rounded-[15px] bg-card bg-[radial-gradient(120%_90%_at_0%_0%,color-mix(in_oklch,var(--primary)_7%,transparent),transparent_60%)] p-6 text-card-foreground">
      {item.icon && (
        <span
          aria-hidden="true"
          className="mb-5 grid size-10 place-items-center rounded-xl border bg-background text-primary shadow-sm [&_svg]:size-5"
        >
          {item.icon}
        </span>
      )}
      <h3 className="font-semibold tracking-tight">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
    </div>
  );
}

/** A grid of feature cards with a gradient hairline border. The motion version adds a glow that follows the pointer. */
export function SpotlightCards({ title, description, items, columns = 3, className, ...props }: SpotlightCardsProps) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-16", className)} {...props}>
      {title && <h2 className="text-center text-3xl font-bold tracking-tight text-balance">{title}</h2>}
      {description && <p className="mx-auto mt-3 max-w-2xl text-center text-pretty text-muted-foreground">{description}</p>}
      {items.length > 0 && (
        <ul className={cn("mt-12 grid gap-4 sm:grid-cols-2", spotlightCols[columns])}>
          {items.map((item) => (
            <li key={item.title}>
              <div className={spotlightFrame}>
                <SpotlightCardBody item={item} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
