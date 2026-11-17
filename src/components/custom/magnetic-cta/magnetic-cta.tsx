import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

export interface MagneticCtaAction {
  label: string;
  href: string;
}

export interface MagneticCtaProps extends Omit<React.ComponentProps<"section">, "title"> {
  title: string;
  description?: string;
  primaryAction: MagneticCtaAction;
  /** A quieter text link beside the button */
  secondaryAction?: MagneticCtaAction;
}

export const magneticBand = "relative isolate mx-auto max-w-5xl overflow-hidden rounded-[28px] border bg-card px-6 py-16 text-center text-card-foreground sm:py-20";
export const magneticButton = "h-14 rounded-full px-9 text-base shadow-lg shadow-primary/25";
export const magneticLink =
  "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/** A glow in your primary color rising from the band's lower edge, under faint rings spreading from that edge. Decorative. */
export function MagneticCtaBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_115%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent),repeating-radial-gradient(circle_at_50%_100%,transparent_0_47px,color-mix(in_oklch,var(--foreground)_6%,transparent)_47px_48px)] [mask-image:linear-gradient(to_top,black,transparent_85%)]"
    />
  );
}

/** A call-to-action band with one large pill button. The motion version makes the button magnetic. */
export function MagneticCta({ title, description, primaryAction, secondaryAction, className, ...props }: MagneticCtaProps) {
  return (
    <section className={cn("px-4 py-16", className)} {...props}>
      <div className={magneticBand}>
        <MagneticCtaBackdrop />
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h2>
        {description && <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-muted-foreground">{description}</p>}
        <div className="mt-10 flex flex-col items-center gap-3">
          <Button asChild size="lg" className={magneticButton}>
            <a href={primaryAction.href}>{primaryAction.label}</a>
          </Button>
          {secondaryAction && (
            <a href={secondaryAction.href} className={magneticLink}>
              {secondaryAction.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
