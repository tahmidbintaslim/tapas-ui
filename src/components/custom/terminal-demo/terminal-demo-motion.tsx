"use client";

import { cn } from "@/lib/utils";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import React from "react";
import { TerminalRow, TerminalWindow, type TerminalDemoProps, type TerminalLine } from "./terminal-demo";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

/** How far the playback has got: lines before `line` are printed, `char` characters of it are typed. */
export interface TerminalPos {
  line: number;
  char: number;
}

/** The next playback position and how long to wait before moving to it, in ms. */
export function nextStep(lines: TerminalLine[], pos: TerminalPos): { next: TerminalPos; delay: number } {
  const cur = lines[pos.line];
  // Uneven key timing reads as a person typing; derived from the index so replays match.
  if (cur.kind === "command" && pos.char < cur.text.length) return { next: { line: pos.line, char: pos.char + 1 }, delay: 24 + ((pos.char * 7) % 5) * 9 };
  const next = { line: pos.line + 1, char: 0 };
  if (cur.kind === "command") return { next, delay: 420 };
  return { next, delay: lines[next.line]?.kind === "command" ? 700 : 110 };
}

const control =
  "inline-grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring pointer-coarse:size-11";

/**
 * TerminalDemo with motion: commands are typed and output prints line by line once the
 * window scrolls into view, with pause and replay buttons. The whole transcript is in the
 * page from the start (untyped text is only transparent), so screen readers and copy get
 * all of it and the window never changes height. Reduced motion gets the static transcript.
 */
export function TerminalDemoMotion({ lines, label, prompt = "$", ...props }: TerminalDemoProps) {
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [paused, setPaused] = React.useState(false);
  const [pos, setPos] = React.useState<TerminalPos>({ line: 0, char: 0 });
  const done = pos.line >= lines.length;

  React.useEffect(() => {
    if (!on || !inView || paused || done) return;
    const { next, delay } = nextStep(lines, pos);
    const id = setTimeout(() => setPos(next), delay);
    return () => clearTimeout(id);
  }, [on, inView, paused, done, lines, pos]);

  return (
    <TerminalWindow
      ref={ref}
      label={label}
      controls={
        on && (
          <>
            <button type="button" aria-pressed={paused} aria-label="Pause typing" disabled={done} onClick={() => setPaused((p) => !p)} className={cn(control, "disabled:opacity-40")}>
              {paused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
            </button>
            <button
              type="button"
              aria-label="Replay"
              onClick={() => {
                setPos({ line: 0, char: 0 });
                setPaused(false);
              }}
              className={control}
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
            </button>
          </>
        )
      }
      {...props}
    >
      {lines.map((line, i) => {
        const printed = !on || i < pos.line;
        const typing = on && i === pos.line && line.kind === "command";
        return (
          <TerminalRow
            key={i}
            line={line}
            prompt={prompt}
            className={cn(on && "transition-[opacity,translate] duration-300 ease-out", !printed && !typing && "translate-y-1 opacity-0")}
          >
            {typing ? (
              <>
                {line.text.slice(0, pos.char)}
                <span aria-hidden="true" className="relative inline-block w-0 align-baseline">
                  <span className="absolute bottom-[-0.2em] left-px h-[1.2em] w-[0.55em] rounded-[1px] bg-primary" />
                </span>
                <span className="opacity-0">{line.text.slice(pos.char)}</span>
              </>
            ) : undefined}
          </TerminalRow>
        );
      })}
    </TerminalWindow>
  );
}
