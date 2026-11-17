import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

export interface BeamBorderAction {
  label: string;
  href: string;
}

export interface BeamBorderProps extends Omit<React.ComponentProps<"section">, "title"> {
  /** Small label above the title */
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction?: BeamBorderAction;
  secondaryAction?: BeamBorderAction;
}

/** The panel's 1px frame. Its background is the border. */
export const beamFrame = "relative isolate mx-auto max-w-4xl rounded-[24px] p-[1.5px]";
/** Static border: your primary color at two opposite corners, fading into the border color. */
export const beamStatic =
  "bg-[linear-gradient(115deg,var(--primary),var(--border)_30%,var(--border)_70%,color-mix(in_oklch,var(--primary)_60%,var(--border)))]";

/** Badge, heading, text and links on the panel surface. Shared by the plain and motion versions. */
export function BeamBorderBody({ eyebrow, title, description, primaryAction, secondaryAction }: BeamBorderProps) {
  return (
    <div className="relative overflow-hidden rounded-[22.5px] bg-card bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent)] px-6 py-14 text-center text-card-foreground sm:px-12 sm:py-16">
      {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}
      <h2 className={cn("mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl", eyebrow && "mt-4")}>{title}</h2>
      {description && <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">{description}</p>}
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

/** A call-to-action panel with a gradient hairline border. The motion version sends a beam of light around it. */
export function BeamBorder({ eyebrow, title, description, primaryAction, secondaryAction, className, ...props }: BeamBorderProps) {
  return (
    <section className={cn("px-4 py-16", className)} {...props}>
      <div className={cn(beamFrame, beamStatic)}>
        <BeamBorderBody {...{ eyebrow, title, description, primaryAction, secondaryAction }} />
      </div>
    </section>
  );
}
