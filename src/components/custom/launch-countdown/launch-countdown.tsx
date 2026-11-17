import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import React from "react";

export interface LaunchCountdownProps extends Omit<React.ComponentProps<"section">, "title"> {
  /** Heading element for the title. Use "h1" when this is the page's main heading. */
  titleAs?: "h1" | "h2";
  title: string;
  description?: string;
  /** ISO date or date-time of the launch, such as "2027-03-01" or "2027-03-01T15:00:00Z". A bare date means midnight UTC. */
  launchDate: string;
  badge?: string;
  /** Motion version: badge text once the date has passed */
  launchedBadge?: string;
  /** Motion version: line shown instead of the clock once the date has passed */
  launchedMessage?: string;
  /** The waitlist form (or any content) under the date */
  children?: React.ReactNode;
}

/** Milliseconds since the epoch for the launch, or NaN when the date can't be read. */
export const launchTime = (iso: string) => new Date(iso).getTime();

/** The launch day as text, the same on the server and in the browser (UTC, fixed locale). */
export function formatLaunch(iso: string) {
  const t = launchTime(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** Badge, heading, the slot for the clock, the date as text, and the form. Shared by both versions. */
export function CountdownFrame({
  titleAs: TitleTag = "h2",
  title,
  description,
  launchDate,
  badge = "Coming soon",
  launchedBadge: _b,
  launchedMessage: _m,
  children,
  className,
  clock,
  dateLabel = "Launching",
  ...props
}: LaunchCountdownProps & { clock?: React.ReactNode; dateLabel?: string }) {
  void _b;
  void _m;
  return (
    <section className={cn("relative isolate mx-auto max-w-3xl overflow-hidden px-4 py-20 text-center", className)} {...props}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(50%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
      />
      <Badge variant="secondary">{badge}</Badge>
      <TitleTag className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{title}</TitleTag>
      {description && <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-muted-foreground">{description}</p>}
      {clock}
      <p className="mt-8 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-xs">
        <CalendarDays aria-hidden="true" className="size-4 text-primary" />
        <span>
          {dateLabel} <time dateTime={launchDate}>{formatLaunch(launchDate)}</time>
        </span>
      </p>
      {children && <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-center">{children}</div>}
    </section>
  );
}

/** Pre-launch section: the launch date as text and a slot for your waitlist form. The motion version adds a live countdown. */
export function LaunchCountdown(props: LaunchCountdownProps) {
  return <CountdownFrame {...props} />;
}
