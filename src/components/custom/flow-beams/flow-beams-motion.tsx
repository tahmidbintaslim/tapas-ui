"use client";

import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";
import { useAnimationFrame, useReducedMotion } from "motion/react";
import React from "react";
import { FlowConnector, FlowNodeItem, flowItem, flowList, type FlowBeamsProps } from "./flow-beams";

const noop = () => () => {};
/** False on the server and during hydration, true once mounted in the browser. */
const useMounted = () => React.useSyncExternalStore(noop, () => true, () => false);

/** Time for a beam to cross one connector, and the rest before the loop starts again, in ms. */
const HOP = 1150;
const REST = 1000;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Where everything is at `t` hops into a loop over `count` nodes: `heads[i]` is the beam's
 * head along connector i (0 to 1, past 1 once its tail has left), `lit[i]` is node i's glow.
 */
export function flowFrame(t: number, count: number, loop: number) {
  const heads = Array.from({ length: count - 1 }, (_, i) => ease(Math.min(1, Math.max(0, t - i))) * 1.5);
  // A node peaks as the beam's head reaches it, a little before the hop ends. Node 0 glows
  // as the loop starts, so measure its distance around the loop's seam too.
  const lit = Array.from({ length: count }, (_, i) => Math.max(0, 1 - (i === 0 ? Math.min(t, loop - t) : Math.abs(t - (i - 0.4))) / 0.45));
  return { heads, lit };
}

/**
 * FlowBeams with motion: a beam of light travels from node to node along the connectors and
 * each node glows as it arrives, in a loop. The loop stops off screen and has a pause
 * button. One tree from server to client; reduced motion gets the static diagram.
 */
export function FlowBeamsMotion({ title, description, nodes, className, ...props }: FlowBeamsProps) {
  const reduced = useReducedMotion();
  const on = useMounted() && !reduced;
  const [paused, setPaused] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const list = React.useRef<HTMLOListElement>(null);
  const clock = React.useRef(0);

  React.useEffect(() => {
    if (!on || !list.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(list.current);
    return () => io.disconnect();
  }, [on]);

  useAnimationFrame((_, delta) => {
    if (!on || paused || !visible || !list.current || nodes.length < 2) return;
    const total = (nodes.length - 1) * HOP + REST;
    // Clamp the step so a background tab doesn't jump the loop forward on return.
    clock.current = (clock.current + Math.min(delta, 64)) % total;
    const { heads, lit } = flowFrame(clock.current / HOP, nodes.length, total / HOP);
    [...list.current.children].forEach((li, i) => {
      const el = li as HTMLElement;
      el.style.setProperty("--lit", lit[i].toFixed(3));
      if (i < heads.length) el.style.setProperty("--h", heads[i].toFixed(3));
    });
  });

  return (
    <section className={cn("mx-auto max-w-5xl px-4 py-16", className)} {...props}>
      {title && <h2 className="text-center text-3xl font-bold tracking-tight text-balance">{title}</h2>}
      {description && <p className="mx-auto mt-3 max-w-2xl text-center text-pretty text-muted-foreground">{description}</p>}
      {nodes.length > 0 && (
        <ol ref={list} className={cn(flowList, (title || description) && "mt-12")}>
          {nodes.map((node, i) => (
            <li key={node.label} className={flowItem()}>
              <FlowNodeItem node={node} index={i} />
              {i < nodes.length - 1 && <FlowConnector index={i} beams={on} />}
            </li>
          ))}
        </ol>
      )}
      {on && nodes.length > 1 && (
        <div className="mt-8 text-center">
          <button
            type="button"
            aria-pressed={paused}
            aria-label="Pause beams"
            onClick={() => setPaused((p) => !p)}
            className="inline-grid size-8 place-items-center rounded-full border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring pointer-coarse:size-11"
          >
            {paused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
          </button>
        </div>
      )}
    </section>
  );
}
