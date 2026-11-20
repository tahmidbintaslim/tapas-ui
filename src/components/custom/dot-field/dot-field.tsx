import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import type { HeroBaseProps } from "@/components/custom/hero/hero";

export type DotFieldCopyProps = Omit<HeroBaseProps, "title"> & {
  /** Text, or rich content such as a logo or an accented word. */
  title: React.ReactNode;
};

export interface DotFieldProps extends DotFieldCopyProps, Omit<React.ComponentProps<"section">, "title"> {
  /** Extra content under the copy, such as a signup form or an install command. */
  children?: React.ReactNode;
}

/** Fades the dots out toward the edges. Used by the CSS grid and by the motion version's canvas. */
export const dotFieldMask = "[mask-image:radial-gradient(ellipse_75%_70%_at_center,black_35%,transparent_100%)]";

/** A dot grid drawn with one CSS gradient. The plain hero's background, and the motion hero's fallback. Decorative. */
export function DotFieldBackdrop({ className }: { className?: string }) {
  return (
    <div
      data-slot="dot-backdrop"
      aria-hidden="true"
      className={cn(
        "absolute inset-0 -z-20 bg-[radial-gradient(circle,color-mix(in_oklch,var(--foreground)_30%,transparent)_1.1px,transparent_1.6px)] bg-[size:22px_22px] bg-center",
        dotFieldMask,
        className,
      )}
    />
  );
}

/** Badge, heading, description and links, on a soft patch of the page background so the dots never fight the text. */
export function DotFieldCopy({ titleAs: TitleTag = "h1", eyebrow, title, description, primaryAction, secondaryAction }: DotFieldCopyProps) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div aria-hidden="true" className="absolute -inset-x-10 -inset-y-8 -z-10 bg-[radial-gradient(closest-side,var(--background)_45%,transparent)]" />
      {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}
      <TitleTag className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-6xl">{title}</TitleTag>
      {description && <p className="mt-5 text-lg text-pretty text-muted-foreground">{description}</p>}
      {(primaryAction || secondaryAction) && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryAction && (
            <Button asChild size="lg">
              <a href={primaryAction.href}>{primaryAction.label}</a>
            </Button>
          )}
          {secondaryAction && (
            <Button asChild size="lg" variant="outline">
              <a href={secondaryAction.href}>{secondaryAction.label}</a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/** Hero on a dot grid. The motion version makes the dots swell and brighten around the pointer. */
export function DotField({ titleAs, eyebrow, title, description, primaryAction, secondaryAction, className, children, ...props }: DotFieldProps) {
  return (
    <section className={cn("relative isolate overflow-hidden px-4 py-28 text-center", className)} {...props}>
      <DotFieldBackdrop />
      <DotFieldCopy {...{ titleAs, eyebrow, title, description, primaryAction, secondaryAction }} />
      {children}
    </section>
  );
}
