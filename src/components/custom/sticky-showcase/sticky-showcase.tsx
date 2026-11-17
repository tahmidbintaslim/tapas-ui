import { cn } from "@/lib/utils";
import React from "react";

export interface ShowcaseStep {
  title: string;
  description: string;
  /** Image or component shown for this step */
  media: React.ReactNode;
  /** Small label above the title */
  label?: string;
}

export interface StickyShowcaseProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: string;
  description?: string;
  steps: ShowcaseStep[];
}

/** Section heading. Shared by the plain and motion versions. */
export function ShowcaseHeading({ title, description }: Pick<StickyShowcaseProps, "title" | "description">) {
  return (
    <>
      {title && <h2 className="text-center text-3xl font-bold tracking-tight text-balance">{title}</h2>}
      {description && <p className="mx-auto mt-3 max-w-2xl text-center text-pretty text-muted-foreground">{description}</p>}
    </>
  );
}

/** One step's number and copy. Shared by the plain and motion versions. */
export function ShowcaseCopy({ step, index, count, active }: { step: ShowcaseStep; index: number; count: number; active?: boolean }) {
  return (
    <div className="relative pl-14">
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0 left-0 grid size-9 place-items-center rounded-full border bg-background font-mono text-xs font-semibold tabular-nums transition-[background-color,border-color,color,box-shadow] duration-500",
          active && "border-primary bg-primary text-primary-foreground shadow-[0_0_0_6px_color-mix(in_oklch,var(--primary)_14%,transparent)]",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="sr-only">
        Step {index + 1} of {count}:{" "}
      </span>
      {step.label && <p className="text-sm font-medium text-primary">{step.label}</p>}
      <h3 className={cn("text-2xl font-bold tracking-tight text-balance", step.label && "mt-1")}>{step.title}</h3>
      <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{step.description}</p>
    </div>
  );
}

/** A product story in steps, each with its media beside it. Phones stack the media under each step. */
export function StickyShowcase({ title, description, steps, className, ...props }: StickyShowcaseProps) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-16", className)} {...props}>
      <ShowcaseHeading title={title} description={description} />
      <div className={cn("relative grid items-center gap-x-12 gap-y-8 lg:grid-cols-2 lg:gap-y-20", (title || description) && "mt-12")}>
        <span aria-hidden="true" className="absolute inset-y-0 left-[17px] hidden w-px bg-border lg:block" />
        {steps.map((step, i) => (
          <React.Fragment key={step.title}>
            <ShowcaseCopy step={step} index={i} count={steps.length} />
            <div data-slot="showcase-media" className="min-w-0 not-last:mb-8 lg:not-last:mb-0">
              {step.media}
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
