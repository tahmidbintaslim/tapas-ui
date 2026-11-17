import { cn } from "@/lib/utils";
import React from "react";

export interface FlowNode {
  /** A rendered icon, such as <Zap />. Decorative. */
  icon: React.ReactNode;
  label: string;
  description?: string;
}

export interface FlowBeamsProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: string;
  description?: string;
  /** 3 to 5 nodes read best. */
  nodes: FlowNode[];
}

/** One connector drawing: an arch between nodes on wide screens, a straight drop on phones. */
function ConnectorPath({ up, className }: { up: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" className={cn("absolute inset-0 size-full overflow-visible", className)}>
      <path d="M50 0V100" vectorEffect="non-scaling-stroke" className="md:hidden" />
      <path d={up ? "M0 50C30 50 30 14 50 14S70 50 100 50" : "M0 50C30 50 30 86 50 86S70 50 100 50"} vectorEffect="non-scaling-stroke" className="max-md:hidden" />
    </svg>
  );
}

// The beam is the same path in the primary color, seen through a window that travels with --h (0 to 1 along the connector).
const beam =
  "stroke-primary [clip-path:inset(calc((var(--h,-1)_-_var(--l))*100%)_-8px_calc((1_-_var(--h,-1))*100%)_-8px)] md:[clip-path:inset(-8px_calc((1_-_var(--h,-1))*100%)_-8px_calc((var(--h,-1)_-_var(--l))*100%))]";

/** The line from one node to the next; `beams` adds the light that travels along it. Shared by the plain and motion versions. */
export function FlowConnector({ index, beams }: { index: number; beams?: boolean }) {
  const up = index % 2 === 0;
  return (
    <span
      aria-hidden="true"
      data-slot="flow-connector"
      className="relative my-2 block h-10 w-6 md:absolute md:top-0 md:left-[calc(50%+2.25rem)] md:my-0 md:h-14 md:w-[calc(100%-4.5rem)]"
    >
      <ConnectorPath up={up} className="stroke-[color-mix(in_oklch,var(--foreground)_22%,transparent)] [stroke-dasharray:2_6] [stroke-linecap:round] [stroke-width:1.75]" />
      {beams && (
        <>
          <ConnectorPath up={up} className={cn(beam, "opacity-40 [--l:0.5] [stroke-width:1.5]")} />
          <ConnectorPath up={up} className={cn(beam, "[--l:0.16] [stroke-width:2.5] [filter:drop-shadow(0_0_5px_var(--primary))]")} />
        </>
      )}
    </span>
  );
}

/** A node's icon tile, label and description. `--lit` (0 to 1) makes the tile glow. Shared by the plain and motion versions. */
export function FlowNodeItem({ node, index }: { node: FlowNode; index: number }) {
  return (
    <div data-slot="flow-node" className="flex max-w-52 flex-col items-center px-2 text-center">
      <span
        aria-hidden="true"
        className="grid size-14 scale-[calc(1+var(--lit,0)*0.07)] place-items-center rounded-2xl border border-[color-mix(in_oklch,var(--primary)_calc(var(--lit,0)*100%),var(--border))] bg-card text-primary shadow-[0_1px_2px_color-mix(in_oklch,var(--foreground)_8%,transparent),0_0_0_calc(var(--lit,0)*5px)_color-mix(in_oklch,var(--primary)_16%,transparent),0_0_calc(var(--lit,0)*30px)_color-mix(in_oklch,var(--primary)_50%,transparent)] [&_svg]:size-6"
      >
        {node.icon}
      </span>
      <span className="sr-only">Step {index + 1}: </span>
      <h3 className="mt-3 text-sm font-semibold">{node.label}</h3>
      {node.description && <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">{node.description}</p>}
    </div>
  );
}

export const flowList = "flex flex-col items-center md:flex-row md:items-start";
/** Equal columns on wide screens; each connector reaches from its node's icon to the next one's. */
export const flowItem = () => "relative flex flex-col items-center md:flex-1";

/** A how-it-works diagram: nodes joined by drawn connectors, in a row on wide screens and a column on phones. */
export function FlowBeams({ title, description, nodes, className, ...props }: FlowBeamsProps) {
  return (
    <section className={cn("mx-auto max-w-5xl px-4 py-16", className)} {...props}>
      {title && <h2 className="text-center text-3xl font-bold tracking-tight text-balance">{title}</h2>}
      {description && <p className="mx-auto mt-3 max-w-2xl text-center text-pretty text-muted-foreground">{description}</p>}
      {nodes.length > 0 && (
        <ol className={cn(flowList, (title || description) && "mt-12")}>
          {nodes.map((node, i) => (
            <li key={node.label} className={flowItem()}>
              <FlowNodeItem node={node} index={i} />
              {i < nodes.length - 1 && <FlowConnector index={i} />}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
