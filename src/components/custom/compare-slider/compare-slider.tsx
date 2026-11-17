import { cn } from "@/lib/utils";
import React from "react";

export interface CompareSliderProps extends React.ComponentProps<"div"> {
  /** Shown on the left. */
  before: React.ReactNode;
  /** Shown on the right. */
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
}

/** The label chip on a panel. Shared by the plain and motion versions. */
export const compareChip = "absolute top-3 z-10 rounded-full border bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur";

/** Before and after, side by side and labelled. Works without JavaScript; phones stack the two. */
export function CompareSlider({ before, after, beforeLabel = "Before", afterLabel = "After", className, ...props }: CompareSliderProps) {
  return (
    <div role="group" aria-label={`${beforeLabel} and ${afterLabel}`} className={cn("grid gap-4 sm:grid-cols-2", className)} {...props}>
      <figure className="relative min-w-0 overflow-hidden rounded-xl border bg-card">
        <figcaption className={cn(compareChip, "left-3")}>{beforeLabel}</figcaption>
        {before}
      </figure>
      <figure className="relative min-w-0 overflow-hidden rounded-xl border bg-card">
        <figcaption className={cn(compareChip, "left-3")}>{afterLabel}</figcaption>
        {after}
      </figure>
    </div>
  );
}
