import { SiteFooter } from "../_site/site-footer";
import { SiteHeader } from "../_site/site-header";
import { DocsNav } from "./_nav";
import { DOC_NAV, DOC_PAGES } from "./_pages";
import { DocsPager } from "./_pager";
import { DocsSearch } from "./_search";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader showThemeToggle search={<DocsSearch pages={DOC_PAGES} />} />
      <div className="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6 lg:px-8">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r py-8 pr-4 lg:block">
          <DocsNav nav={DOC_NAV} />
        </aside>
        <main className="min-w-0 flex-1 py-10">
          {/* Phones and tablets get the sidebar as a disclosure above the content. */}
          <details data-menu className="group mb-8 rounded-xl border bg-card lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
              Browse the docs
              <span aria-hidden="true" className="text-muted-foreground group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="border-t px-2 py-4">
              <DocsNav nav={DOC_NAV} />
            </div>
          </details>
          {children}
          <DocsPager pages={DOC_PAGES} />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
