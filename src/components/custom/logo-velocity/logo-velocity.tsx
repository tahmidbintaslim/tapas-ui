import { cn } from "@/lib/utils";
import React from "react";

export interface VelocityLogo {
  /** Name; read by screen readers even when `logo` is an image or icon */
  name: string;
  /** Optional logo; the name is shown as text when omitted */
  logo?: React.ReactNode;
}

export interface LogoVelocityProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: string;
  logos: VelocityLogo[];
  /** Resting drift in pixels per second (motion version) */
  speed?: number;
}

/** One logo: the mark when given, with the name for screen readers; otherwise the name as text. */
export function VelocityEntry({ item }: { item: VelocityLogo }) {
  return (
    <li className="flex h-12 shrink-0 items-center gap-2 rounded-full border bg-card px-5 text-base font-semibold whitespace-nowrap text-muted-foreground shadow-xs [&_svg]:size-5">
      {item.logo ? (
        <>
          <span aria-hidden="true" className="flex items-center gap-2">
            {item.logo}
          </span>
          <span className="sr-only">{item.name}</span>
        </>
      ) : (
        item.name
      )}
    </li>
  );
}

/** A wrapped row of logos or names. Static; the motion version scrolls it with the page. */
export function LogoVelocity({ title, logos, speed: _speed, className, ...props }: LogoVelocityProps) {
  void _speed;
  return (
    <section className={cn("mx-auto max-w-5xl px-4 py-12 text-center", className)} {...props}>
      {title && <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{title}</h2>}
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {logos.map((item) => (
          <VelocityEntry key={item.name} item={item} />
        ))}
      </ul>
    </section>
  );
}
