"use client";

import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { editUrl, type DocLink } from "./_pages";

/** Bottom of every docs page: edit link, then previous and next pages in sidebar order. */
export function DocsPager({ pages }: { pages: DocLink[] }) {
  const pathname = usePathname();
  const i = pages.findIndex((p) => p.href === pathname);
  if (i === -1) return null;
  const prev = pages[i - 1];
  const next = pages[i + 1];
  const card =
    "group flex min-h-11 flex-1 flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:border-brand/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
  return (
    <div className="mt-16 max-w-3xl space-y-6 border-t pt-6">
      <a
        href={editUrl(pathname)}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-brand lg:min-h-0"
      >
        <Pencil aria-hidden="true" className="size-3.5" />
        Edit this page on GitHub
      </a>
      <nav aria-label="Previous and next page" className="flex flex-col gap-3 sm:flex-row">
        {prev ? (
          <Link href={prev.href} className={card}>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              Previous
            </span>
            <span className="font-medium">{prev.label}</span>
          </Link>
        ) : (
          <span className="hidden flex-1 sm:block" />
        )}
        {next && (
          <Link href={next.href} className={`${card} sm:items-end sm:text-right`}>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              Next
              <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="font-medium">{next.label}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
