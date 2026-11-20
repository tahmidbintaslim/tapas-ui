"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import type { DocLink } from "./_pages";

/**
 * Pages whose label, group or description contain every word of the query. Exact titles first, then title
 * matches, then the rest; on a tie, written docs come before section pages (so "faq" finds the FAQ page).
 */
export function searchDocs(pages: DocLink[], query: string, limit = 12) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return pages.slice(0, limit);
  const text = (p: DocLink) => `${p.label} ${p.group ?? ""} ${p.description ?? ""}`.toLowerCase();
  return pages
    .filter((p) => words.every((w) => text(p).includes(w)))
    .map((p) => {
      const label = p.label.toLowerCase();
      const rank = label === words.join(" ") ? 0 : words.every((w) => label.includes(w)) ? 1 : 2;
      return { p, score: rank + (p.href.startsWith("/docs/sections/") ? 0.5 : 0) };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((r) => r.p);
}

/** Docs search: a button in the header, ⌘K / Ctrl+K, and a native modal dialog with a combobox list. */
export function DocsSearch({ pages }: { pages: DocLink[] }) {
  const dialog = React.useRef<HTMLDialogElement>(null);
  const input = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const results = searchDocs(pages, query);
  const listId = React.useId();

  const open = React.useCallback(() => {
    setQuery("");
    setActive(0);
    dialog.current?.showModal();
    input.current?.focus();
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  React.useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView?.({ block: "nearest" });
  }, [active, listId]);

  const go = (href: string) => {
    dialog.current?.close();
    router.push(href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (results.length ? (i + step + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex h-11 items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:h-9"
      >
        <Search aria-hidden="true" className="size-4" />
        <span className="sr-only sm:not-sr-only">Search docs</span>
        <kbd aria-hidden="true" className="hidden rounded border bg-muted px-1.5 font-sans text-[11px] lg:inline">
          Ctrl K
        </kbd>
      </button>
      <dialog
        ref={dialog}
        aria-label="Search docs"
        // Clicks on the backdrop land on the dialog element itself.
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-xl rounded-xl border bg-popover p-0 text-popover-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 border-b px-4">
          <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={input}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            aria-label="Search docs and sections"
            placeholder="Search docs and sections"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            className="h-12 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border bg-muted px-1.5 text-[11px] text-muted-foreground">Esc</kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
          {results.map((r, i) => (
            <li
              key={r.href}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => go(r.href)}
              className={cn("cursor-pointer rounded-md px-3 py-2", i === active && "bg-brand/10")}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{r.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{r.group}</span>
              </span>
              {r.description && <span className="mt-0.5 block truncate text-sm text-muted-foreground">{r.description}</span>}
            </li>
          ))}
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No pages match “{query}”.</li>}
        </ul>
      </dialog>
    </>
  );
}
