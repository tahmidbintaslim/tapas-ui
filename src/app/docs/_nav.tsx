"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocGroup } from "./_pages";

/** Docs sidebar; client-side only to highlight the current page. */
export function DocsNav({ nav }: { nav: DocGroup[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Docs" className="space-y-6 text-sm">
      {nav.map((group) => (
        <div key={group.title} className="space-y-1">
          <h2 className="flex items-center gap-2 px-2.5 text-xs font-semibold text-muted-foreground">
            {/* Same slot as the links' active dot, so titles and links line up. */}
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full" style={{ background: group.color }} />
            {group.title}
          </h2>
          <ul className="space-y-px">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2.5 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-brand lg:py-1.5",
                      active
                        ? "bg-brand/10 font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn("size-1.5 shrink-0 rounded-full transition-colors", active ? "bg-brand" : "bg-transparent")}
                    />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
