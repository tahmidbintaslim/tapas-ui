import { cn } from "@/lib/utils";
import React from "react";

export interface TextRevealProps extends React.ComponentProps<"section"> {
  /** Small label above the statement */
  eyebrow?: string;
  /** The statement. One or two sentences read best. */
  text: string;
}

export const revealText = "text-3xl leading-[1.2] font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.15]";

/** The small label with a dot in your primary color. Shared by the plain and motion versions. */
export function TextRevealEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
      {children}
    </p>
  );
}

/** A large statement paragraph. The motion version lights it up word by word as the reader scrolls. */
export function TextReveal({ eyebrow, text, className, ...props }: TextRevealProps) {
  return (
    <section className={cn("mx-auto max-w-4xl px-4 py-24", className)} {...props}>
      {eyebrow && <TextRevealEyebrow>{eyebrow}</TextRevealEyebrow>}
      <p className={revealText}>{text}</p>
    </section>
  );
}
