import { cn } from "@/lib/utils";
import React from "react";

export interface TerminalLine {
  /** A command is shown after the prompt; output is printed as is. */
  kind: "command" | "output";
  text: string;
}

export interface TerminalDemoProps extends React.ComponentProps<"div"> {
  lines: TerminalLine[];
  /** Window title; also names the terminal for screen readers. */
  label?: string;
  /** Prompt shown before each command. Decorative: not read aloud and not copied. */
  prompt?: string;
}

/** The window: title bar, optional controls and the transcript. Shared by the plain and motion versions. */
export function TerminalWindow({
  label = "Terminal",
  controls,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { label?: string; controls?: React.ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-[0_1px_2px_color-mix(in_oklch,var(--foreground)_6%,transparent),0_12px_28px_-10px_color-mix(in_oklch,var(--foreground)_14%,transparent),0_36px_72px_-28px_color-mix(in_oklch,var(--primary)_26%,transparent)]",
        className,
      )}
      {...props}
    >
      <div className="relative flex h-11 items-center gap-1.5 border-b bg-muted/50 px-4">
        {[0, 1, 2].map((d) => (
          <span key={d} aria-hidden="true" className="size-2.5 rounded-full bg-muted-foreground/30" />
        ))}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-24 truncate text-center font-mono text-xs text-muted-foreground">
          {label}
        </span>
        {controls && <div className="ml-auto flex items-center gap-1">{controls}</div>}
      </div>
      <pre className="p-5 font-mono text-[0.8125rem] leading-7 break-words whitespace-pre-wrap sm:text-sm sm:leading-7">
        <code>{children}</code>
      </pre>
    </div>
  );
}

/** One transcript row. Shared by the plain and motion versions. */
export function TerminalRow({
  line,
  prompt,
  className,
  children,
}: {
  line: TerminalLine;
  prompt: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span data-kind={line.kind} className={cn("block min-h-7", line.kind === "output" && "text-muted-foreground", className)}>
      {line.kind === "command" && (
        <span aria-hidden="true" className="mr-2 font-semibold text-primary select-none">
          {prompt}
        </span>
      )}
      {children ?? line.text}
      {"\n"}
    </span>
  );
}

/** A terminal window with the full transcript of commands and their output. */
export function TerminalDemo({ lines, label, prompt = "$", ...props }: TerminalDemoProps) {
  return (
    <TerminalWindow label={label} {...props}>
      {lines.map((line, i) => (
        <TerminalRow key={i} line={line} prompt={prompt} />
      ))}
    </TerminalWindow>
  );
}
