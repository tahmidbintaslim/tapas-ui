import { cn } from "@/lib/utils";
import React from "react";

export interface DeviceFrameProps extends React.ComponentProps<"div"> {
  /** A browser window or a phone. */
  device?: "browser" | "phone";
  /** Text in the browser's address bar. Ignored for the phone. */
  url?: string;
}

/** Layered shadow: a tight contact shadow, two soft ones and a wide tint of the primary color. */
const shadow =
  "shadow-[0_1px_1px_color-mix(in_oklch,var(--foreground)_6%,transparent),0_6px_12px_-4px_color-mix(in_oklch,var(--foreground)_8%,transparent),0_22px_44px_-14px_color-mix(in_oklch,var(--foreground)_14%,transparent),0_56px_96px_-36px_color-mix(in_oklch,var(--primary)_32%,transparent)]";

/** The frame itself. `overlay` sits above the content, clipped to the frame. Shared by the plain and motion versions. */
export function DeviceShell({ device = "browser", url, overlay, children }: Pick<DeviceFrameProps, "device" | "url" | "children"> & { overlay?: React.ReactNode }) {
  if (device === "phone") {
    return (
      <div data-slot="device" data-device="phone" className={cn("relative rounded-[2.75rem] border bg-card p-2.5", shadow)}>
        <span aria-hidden="true" className="absolute top-28 -right-[3px] h-14 w-[3px] rounded-r-sm bg-border" />
        <span aria-hidden="true" className="absolute top-24 -left-[3px] h-8 w-[3px] rounded-l-sm bg-border" />
        <span aria-hidden="true" className="absolute top-36 -left-[3px] h-8 w-[3px] rounded-l-sm bg-border" />
        <div className="relative aspect-[9/19] overflow-hidden rounded-[2.1rem] border bg-background">
          <span aria-hidden="true" className="absolute top-2.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-foreground" />
          <div className="h-full overflow-hidden pt-10">{children}</div>
          {overlay}
        </div>
      </div>
    );
  }
  return (
    <div data-slot="device" data-device="browser" className={cn("relative overflow-hidden rounded-xl border bg-card", shadow)}>
      <div className="flex h-10 items-center gap-1.5 border-b bg-muted/50 px-4">
        {[0, 1, 2].map((d) => (
          <span key={d} aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-muted-foreground/30" />
        ))}
        {url && <span className="mx-auto max-w-[60%] truncate rounded-md border bg-background px-3 py-0.5 text-xs text-muted-foreground">{url}</span>}
      </div>
      <div className="bg-background">{children}</div>
      {overlay}
    </div>
  );
}

/** A browser window or phone frame around any content, with a soft layered shadow. */
export function DeviceFrame({ device = "browser", url, children, className, ...props }: DeviceFrameProps) {
  return (
    <div className={cn("relative mx-auto w-full", device === "phone" ? "max-w-[17rem]" : "max-w-3xl", className)} {...props}>
      <DeviceShell device={device} url={url}>
        {children}
      </DeviceShell>
    </div>
  );
}
